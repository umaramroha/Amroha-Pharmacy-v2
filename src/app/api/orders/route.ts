import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";
import {
  getOrderConfirmationHTML,
  getAdminOrderNotificationHTML,
} from "@/lib/email/templates";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

// ==============================
// CONSTANTS
// ==============================
const MAX_QTY_PER_PRODUCT = 10;
const MAX_TOTAL_ITEMS = 30;
const MAX_ORDERS_PER_DAY = 10;

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

    // ==============================
    // RATE LIMITING (10 orders/day)
    // ==============================
    const rateKey = `orders:${session.userId}`;
    const rateCheck = await checkRateLimit(rateKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error:
            "Aapne aaj ke liye order limit reach kar li hai. Kripya kal try karein ya humse WhatsApp pe contact karein.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      customerMobile,
      customerEmail,
      address,
      city,
      state,
      pincode,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    } = body;

    // ==============================
    // VALIDATION
    // ==============================
    if (
      !customerName ||
      !customerMobile ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    if (!["cod", "upi"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // ==============================
    // MAX QUANTITY CHECK
    // ==============================
    let totalItemsCount = 0;
    for (const item of items) {
      if (!item.id || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: "Invalid item data" },
          { status: 400 }
        );
      }
      if (item.quantity > MAX_QTY_PER_PRODUCT) {
        return NextResponse.json(
          {
            error: `Ek product ka maximum ${MAX_QTY_PER_PRODUCT} units order kar sakte hain. Kripya quantity kam karein.`,
          },
          { status: 400 }
        );
      }
      totalItemsCount += item.quantity;
    }

    if (totalItemsCount > MAX_TOTAL_ITEMS) {
      return NextResponse.json(
        {
          error: `Ek order me maximum ${MAX_TOTAL_ITEMS} items ho sakte hain. Bulk order ke liye WhatsApp pe contact karein.`,
        },
        { status: 400 }
      );
    }

    // ==============================
    // STOCK CHECK (before transaction)
    // ==============================
    const productIds = items.map((i: any) => i.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        stock: true,
        isActive: true,
      },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 400 }
        );
      }
      if (!product.isActive) {
        return NextResponse.json(
          { error: `${product.name} abhi available nahi hai.` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Sirf ${product.stock} units available hain "${product.name}" ke liye. Kripya quantity kam karein.`,
          },
          { status: 400 }
        );
      }
    }

    // ==============================
    // CREATE ORDER + ATOMIC STOCK DECREMENT
    // ==============================
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: session.userId as string,
          customerName: customerName.trim(),
          customerMobile: customerMobile.trim(),
          customerEmail: customerEmail?.trim() || null,
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          total: total,
          status: "PENDING",
          paymentMethod: paymentMethod,
          paymentStatus: "PENDING",
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Atomic stock decrement — only if stock >= quantity
      for (const item of items) {
        const result = await tx.product.updateMany({
          where: {
            id: item.id,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (result.count === 0) {
          throw new Error(
            "STOCK_CHANGED: Stock abhi available nahi hai. Kripya cart refresh karein."
          );
        }
      }

      return newOrder;
    });

    // ==============================
    // SEND EMAILS
    // ==============================
    try {
      const productList = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      });

      const orderItems = items.map((i: any) => {
        const product = productList.find((p) => p.id === i.id);
        return {
          name: product?.name || "Product",
          quantity: i.quantity,
          price: Number(i.price),
        };
      });

      if (customerEmail) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: `✅ Order Confirmed - #${order.id
            .slice(-8)
            .toUpperCase()} - Amroha Pharmacy`,
          html: getOrderConfirmationHTML({
            customerName,
            orderId: order.id,
            items: orderItems,
            subtotal: Number(subtotal),
            deliveryFee: Number(deliveryFee),
            total: Number(total),
            address: `${address}, ${city}, ${state} - ${pincode}`,
            paymentMethod,
          }),
        });
      }

      if (ADMIN_EMAIL) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `🔔 New Order #${order.id
            .slice(-8)
            .toUpperCase()} - ₹${total}`,
          html: getAdminOrderNotificationHTML({
            customerName,
            customerMobile,
            total: Number(total),
            paymentMethod,
            address: `${address}, ${city}, ${state} - ${pincode}`,
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

    // Handle stock-changed error from transaction
    if (error.message?.includes("STOCK_CHANGED")) {
      return NextResponse.json(
        {
          error:
            "Stock abhi available nahi hai. Kripya cart refresh karein aur dobara try karein.",
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
