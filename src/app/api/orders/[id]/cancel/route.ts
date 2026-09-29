import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";

// Statuses that CAN be cancelled by customer
const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch order with items
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security: ensure user owns this order
    if (order.customerId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if order can be cancelled
    if (order.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Ye order already cancel ho chuka hai." },
        { status: 400 }
      );
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        {
          error: `Order is currently "${order.status}" and cannot be cancelled. Shipped orders cannot be cancelled — please contact us on WhatsApp.`,
        },
        { status: 400 }
      );
    }

    // Cancel order + restore stock (atomic transaction)
    await prisma.$transaction(async (tx) => {
      // 1. Update order status
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          paymentStatus:
            order.paymentStatus === "PAID" ? "REFUND_PENDING" : "CANCELLED",
        },
      });

      // 2. Restore stock for each item
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }
    });

    // Send cancellation email (non-blocking)
    try {
      if (order.customerEmail) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: order.customerEmail,
          subject: `❌ Order Cancelled - #${order.id
            .slice(-8)
            .toUpperCase()} - Amroha Pharmacy`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 25px; border-radius: 12px;">
                <h2 style="color: #dc2626; margin-top: 0;">Order Cancelled</h2>
                <p>Namaste <strong>${order.customerName}</strong>,</p>
                <p>Aapka order <strong>#${order.id
                  .slice(-8)
                  .toUpperCase()}</strong> successfully cancel kar diya gaya hai.</p>
                <p><strong>Refund:</strong> ${
                  order.paymentStatus === "PAID"
                    ? "Your payment will be refunded within 5-7 business days. For any questions, please contact us on WhatsApp."
                    : "Koi payment nahi hui thi is order ke liye, isliye koi refund ki zaroorat nahi."
                }</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 14px; color: #6b7280;">
                  Any questions? WhatsApp us:
                  <a href="https://wa.me/918077988509" style="color: #0F766E;">
                    +91 80779 88509
                  </a>
                </p>
              </div>
            </div>
          `,
        });
      }

      if (ADMIN_EMAIL) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `❌ Order Cancelled #${order.id
            .slice(-8)
            .toUpperCase()} - ${order.customerName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #dc2626;">Order Cancelled by Customer</h2>
              <p><strong>Order ID:</strong> #${order.id
                .slice(-8)
                .toUpperCase()}</p>
              <p><strong>Customer:</strong> ${order.customerName}</p>
              <p><strong>Mobile:</strong> ${order.customerMobile}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
              <p><strong>Stock restored:</strong> Yes</p>
              <p>Review in admin panel: <a href="https://amrohapharmacy.vercel.app/kggg0b/orders">View Order</a></p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Cancellation email error:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully. Refund will be processed within 5-7 business days.",
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: "Failed to cancel the order. Please try again later." },
      { status: 500 }
    );
  }
}
