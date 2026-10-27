import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { escapeHtml } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Atomic Transaction: Status update + Stock restore
    const cancellation = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id: params.id },
        include: { items: true },
      });

      if (!currentOrder || currentOrder.customerId !== session.userId) {
        return { error: "NOT_FOUND" as const };
      }

      if (!CANCELLABLE_STATUSES.includes(currentOrder.status)) {
        return {
          error: currentOrder.status === "CANCELLED" ? "ALREADY_CANCELLED" : "NOT_CANCELLABLE" as const,
        };
      }

      // updateMany ensures only ONE request succeeds if double-clicked
      const updated = await tx.order.updateMany({
        where: { id: currentOrder.id, status: { in: CANCELLABLE_STATUSES } },
        data: {
          status: "CANCELLED",
          paymentStatus: currentOrder.paymentStatus === "PAID" ? "REFUND_PENDING" : "CANCELLED",
        },
      });

      if (updated.count !== 1) {
        return { error: "ALREADY_CANCELLED" as const };
      }

      for (const item of currentOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return { error: null, order: currentOrder };
    });

    if (cancellation.error === "NOT_FOUND") return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (cancellation.error === "ALREADY_CANCELLED") return NextResponse.json({ error: "Ye order already cancel ho chuka hai." }, { status: 400 });
    if (cancellation.error === "NOT_CANCELLABLE") return NextResponse.json({ error: `Order is currently "${cancellation.error}" and cannot be cancelled.` }, { status: 400 });

    const order = cancellation.order!;
    const shortId = order.id.slice(-8).toUpperCase();

    try {
      if (session.email) {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: session.email,
          subject: `❌ Order Cancelled - #${shortId} - Amroha Pharmacy`,
          html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2 style="color: #dc2626;">Order Cancelled</h2><p>Namaste <strong>${escapeHtml(order.customerName)}</strong>,</p><p>Aapka order <strong>#${shortId}</strong> cancel kar diya gaya hai.</p></div>`,
        });
      }
    } catch (e) {}

    return NextResponse.json({ success: true, message: "Order cancelled successfully" });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}