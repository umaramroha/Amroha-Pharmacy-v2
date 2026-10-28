import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { transporter, FROM_EMAIL } from "@/lib/email/mailer";
import { getOrderStatusUpdateHTML } from "@/lib/email/templates";
import { adminSessionOptions } from "@/lib/adminSession";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

async function isAdmin() {
  const session = await getIronSession<AdminSessionData>(
    await cookies(),
    adminSessionOptions
  );
  return session.isAdminLoggedIn && session.adminId;
}

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "REFUND_PENDING", "CANCELLED"];

// GET single order
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          select: { id: true, name: true, email: true, mobile: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Admin get order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH — update order status
export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, paymentStatus } = await request.json();

    const updateData: Prisma.OrderUpdateInput = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const currentOrder = await prisma.order.findUnique({ where: { id: params.id } });

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, image: true, slug: true },
            },
          },
        },
      },
    });

    
    
    // Send status update email to customer
    if (status && status !== currentOrder?.status && updated.customerEmail) {
      try {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: updated.customerEmail,
          subject: `Order Update: #${updated.id.slice(-8).toUpperCase()} is now ${status}`,
          html: getOrderStatusUpdateHTML({
            customerName: updated.customerName,
            orderId: updated.id,
            status: status,
            total: updated.total.toString(),
          }),
        });
        console.log(`Status update email sent to ${updated.customerEmail}`);
      } catch (err) {
        console.error("Failed to send status update email:", err);
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Admin update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
