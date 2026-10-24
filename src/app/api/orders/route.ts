import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";
import {
  getOrderConfirmationHTML,
  getAdminOrderNotificationHTML,
} from "@/lib/email/templates";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { rateLimit } from "@/lib/rateLimit";
import { deliveryConfig } from "@/lib/config";

// ==============================
// CONSTANTS
// ==============================
const MAX_QTY_PER_PRODUCT = 10;
const MAX_TOTAL_ITEMS = 30;
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
      cookies(),
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
      cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: "Please login to place an order" },
        { status: 401 }
      );
    }
    const userId = session.userId;

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
    const qtyByProduct = new Map<string, number>();
    for (const item of input.items) {
      qtyByProduct.set(
        item.id,
        (qtyByProduct.get(item.id) ?? 0) + item.quantity
      );
    }

    let totalItemsCount = 0;
    for (const qty of Array.from(qtyByProduct.values())) {
      if (qty > MAX_QTY_PER_PRODUCT) {
        return NextResponse.json(
          {
            error: `Maximum ${MAX_QTY_PER_PRODUCT} units allowed per product. Please reduce the quantity.`,
          },
          { status: 400 }
        );
      }
      totalItemsCount += qty;
    }

    if (totalItemsCount > MAX_TOTAL_ITEMS) {
      return NextResponse.json(
        {
          error: `Maximum ${MAX_TOTAL_ITEMS} items allowed per order. For bulk orders, please contact us on WhatsApp.`,
        },
        { status: 400 }
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
    // 5. LOAD REAL PRODUCTS + PRICES FROM THE DATABASE
    // ==============================
    const productIds = Array.from(qtyByProduct.keys());
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
      },
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    const lines: {
      productId: string;
      name: string;
      quantity: number;
      unitPrice: Prisma.Decimal;
    }[] = [];

    for (const [productId, quantity] of Array.from(qtyByProduct.entries())) {
      const product = productById.get(productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${productId}` },
          { status: 400 }
        );
      }
      if (!product.isActive) {
        return NextResponse.json(
          { error: `${product.name} abhi available nahi hai.` },
          { status: 400 }
        );
      }
      if (product.stock < quantity) {
        return NextResponse.json(
          {
            error: `Only ${product.stock} units available for "${product.name}". Please reduce the quantity.`,
          },
          { status: 400 }
        );
      }
      if (product.price.lte(0)) {
        return NextResponse.json(
          {
            error: `${product.name} is not available for online order right now. Please contact us on WhatsApp.`,
          },
          { status: 400 }
        );
      }

      lines.push({
        productId,
        name: product.name,
        quantity,
        unitPrice: product.price,
      });
    }

    // ==============================
    // 6. CALCULATE MONEY ON THE SERVER (Decimal = no floating point errors)
    //    delivery: subtotal >= 500 ? 0 : 50   (values come from lib/config.ts)
    // ==============================
    const subtotal = lines.reduce(
      (sum, l) => sum.plus(l.unitPrice.mul(l.quantity)),
      new Prisma.Decimal(0)
    );
    const deliveryFee = subtotal.gte(deliveryConfig.freeAbove)
      ? new Prisma.Decimal(0)
      : new Prisma.Decimal(deliveryConfig.fee);
    const total = subtotal.plus(deliveryFee);

    // ==============================
    // 7. CREATE ORDER + ATOMIC STOCK DECREMENT
    // ==============================
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
