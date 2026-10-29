import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";
import {
  getOrderConfirmationHTML,
  getAdminOrderNotificationHTML,
} from "@/lib/email/templates";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  mergeCartItems,
  checkCartLimits,
  priceCart,
} from "@/lib/pricing";
import { sessionOptions, SessionData } from "@/lib/session";
import { rateLimit } from "@/lib/rateLimit";
import { isCodAvailable } from "@/data/delivery";

// ==============================
// CONSTANTS
// ==============================
const MAX_ORDERS_PER_DAY = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

// Same cleaning the checkout page uses, so anything the form accepts is accepted here.
const cleanMobile = (m: string) => m.replace(/[\s\-()]/g, "").replace(/^\+?91/, "");

// ==============================
// INPUT VALIDATION
// ------------------------------
// NOTE: there is intentionally NO price / subtotal / deliveryFee / total here.
// zod drops unknown keys, so even if a client sends them they are ignored.
// All money values are calculated on the server from the database.
// ==============================
const OrderInput = z.object({
  customerName: z.string().trim().min(1, "Please enter your name").max(80),
  customerMobile: z
    .string()
    .trim()
    .refine(
      (m) => /^[6-9]\d{9}$/.test(cleanMobile(m)),
      "Please enter a valid 10-digit mobile number"
    ),
  customerEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(120)
    .or(z.literal(""))
    .nullish(),
  address: z.string().trim().min(3, "Please enter your address").max(300),
  city: z.string().trim().min(1, "Please enter your city").max(80),
  state: z.string().trim().min(1, "Please enter your state").max(80),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9]\d{5}$/, "Please enter a valid 6-digit pincode"),
  paymentMethod: z.enum(["cod", "upi"], {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        quantity: z.number().int().min(1, "Invalid item data"),
      })
    )
    .min(1, "Your cart is empty")
    .max(100, "Too many items in the order"),
});

class StockChangedError extends Error {}

// GET — fetch logged-in user's orders
export async function GET() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: session.userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, image: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST — create new order
export async function POST(request: Request) {
  try {
    // ==============================
    // 1. AUTH
    // ==============================
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: "Please login to place an order" },
        { status: 401 }
      );
    }
    const userId = session.userId;

    // Verify user account
    const customer = await prisma.customer.findUnique({ where: { id: userId }, select: { isVerified: true } });
    if (!customer?.isVerified) {
      return NextResponse.json({ error: "Please verify your email address before placing an order." }, { status: 403 });
    }

    // Check pending order limit (Max 3)
    const pendingCount = await prisma.order.count({ where: { customerId: userId, status: "PENDING" } });
    if (pendingCount >= 3) {
      return NextResponse.json({ error: "You have 3 pending orders. Please wait for them to be confirmed." }, { status: 400 });
    }
  

    // ==============================
    // 2. VALIDATE INPUT SHAPE
    // ==============================
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const parsed = OrderInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid order data" },
        { status: 400 }
      );
    }
    const input = parsed.data;

    // ==============================
    // 3. MERGE DUPLICATE PRODUCT IDS, THEN CHECK LIMITS
    //    (two lines of the same product must not bypass the per-product cap)
    // ==============================
    const qtyByProduct = mergeCartItems(input.items);

    const limitError = checkCartLimits(qtyByProduct);
    if (limitError) {
      return NextResponse.json(
        { error: limitError.error },
        { status: limitError.status }
      );
    }

    // ==============================
    // 4. RATE LIMIT — only after validation passed,
    //    so typos / bad requests don't use up the customer's daily quota
    // ==============================
    const rate = await rateLimit(
      `orders:${userId}`,
      MAX_ORDERS_PER_DAY,
      DAY_MS
    );
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error:
            "You have reached your daily order limit. Please try again tomorrow or contact us on WhatsApp.",
        },
        { status: 429 }
      );
    }

    // ==============================
    // 5. PRICE THE CART ON THE SERVER
    //    Real products + prices from the database, stock/active checks, and
    //    subtotal / delivery fee / total. Shared with POST /api/orders/quote
    //    (the amount shown for UPI), so both always agree. See lib/pricing.ts
    // ==============================
    const priced = await priceCart(qtyByProduct);
    if (!priced.ok) {
      return NextResponse.json(
        { error: priced.error },
        { status: priced.status }
      );
    }
    const { lines, subtotal, deliveryFee, total } = priced;

    // ==============================
    // 7. CREATE ORDER + ATOMIC STOCK DECREMENT
    // ==============================
    
    // Enforce COD Blacklist
    if (input.paymentMethod === "cod" && !isCodAvailable(input.pincode)) {
      return NextResponse.json({ error: "Cash on Delivery is not available for this PIN code. Please choose UPI." }, { status: 400 });
    }

    const customerEmail = input.customerEmail?.trim() || null;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: userId,
          customerName: input.customerName,
          customerMobile: input.customerMobile,
          customerEmail,
          address: input.address,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          subtotal,
          deliveryFee,
          total,
          status: "PENDING",
          paymentMethod: input.paymentMethod,
          paymentStatus: "PENDING",
          items: {
            create: lines.map((l) => ({
              productId: l.productId,
              quantity: l.quantity,
              price: l.unitPrice, // price at the time of order, from the DB
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Atomic stock decrement — only if the product is still active and in stock
      for (const l of lines) {
        const result = await tx.product.updateMany({
          where: {
            id: l.productId,
            isActive: true,
            stock: { gte: l.quantity },
          },
          data: {
            stock: { decrement: l.quantity },
          },
        });

        if (result.count === 0) {
          throw new StockChangedError(
            "Stock is no longer available. Please refresh your cart."
          );
        }
      }

      return newOrder;
    });

    // ==============================
    // 8. SEND EMAILS (unchanged behaviour; values now come from the server)
    // ==============================
    try {
      const shortId = order.id.slice(-8).toUpperCase();
      const fullAddress = `${input.address}, ${input.city}, ${input.state} - ${input.pincode}`;

      const orderItems = lines.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        price: Number(l.unitPrice),
      }));

      if (customerEmail) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: `✅ Order Confirmed - #${shortId} - Amroha Pharmacy`,
          html: getOrderConfirmationHTML({
            customerName: input.customerName,
            orderId: order.id,
            items: orderItems,
            subtotal: Number(subtotal),
            deliveryFee: Number(deliveryFee),
            total: Number(total),
            address: fullAddress,
            paymentMethod: input.paymentMethod,
          }),
        });
      }

      if (ADMIN_EMAIL) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `🔔 New Order #${shortId} - ₹${total.toString()}`,
          html: getAdminOrderNotificationHTML({
            customerName: input.customerName,
            customerMobile: input.customerMobile,
            total: Number(total),
            paymentMethod: input.paymentMethod,
            address: fullAddress,
            orderId: order.id,
          }),
        });
      }
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Create order error:", error);

    if (error instanceof StockChangedError) {
      return NextResponse.json(
        {
          error:
            "Stock is no longer available. Please refresh your cart and try again.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
