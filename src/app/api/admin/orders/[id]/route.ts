import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendCustomerEmail, sendAdminAlert } from "@/lib/notify";
import { getOrderStatusUpdateHTML, getOrderStatusLabel, getTrackingUpdateHTML } from "@/lib/email/templates";
import { parseCourier, parseTracking } from "@/lib/courier";
import { adminSessionOptions, getAdminSession } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import { revalidateTag } from "next/cache"; // CACHE_V1
import { PRODUCTS_CACHE_TAG } from "@/lib/products";

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
const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "REFUND_PENDING", "REFUNDED", "CANCELLED"];

// ORDER_RULES_V1
// Payment status the admin may set by hand (from -> allowed next values).
// REFUND_PENDING and CANCELLED are set automatically when an order is cancelled.
const MANUAL_PAYMENT_MOVES: Record<string, string[]> = {
  PENDING: ["PAID"],
  PAID: ["PENDING"],
  REFUND_PENDING: ["REFUNDED"],
};

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
    const session = await getAdminSession();
    const rateCheck = await rateLimit(`admin-mutation:${session.adminId}`, 50, 60 * 60 * 1000, { failOpen: false });
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Admin rate limit exceeded" }, { status: 429 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
    }
    
    const { status, paymentStatus } = body;
    const updateData: Prisma.OrderUpdateInput = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      // FIX 1: Strict validation for payment status
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      }
      updateData.paymentStatus = paymentStatus;
    }

    const hasCourier = body.courierName !== undefined;
    const hasTracking = body.trackingNumber !== undefined;
    if (hasCourier) {
      const c = parseCourier(body.courierName);
      if (!c.ok) return NextResponse.json({ error: "Invalid courier" }, { status: 400 });
      updateData.courierName = c.value;
    }
    if (hasTracking) {
      const t = parseTracking(body.trackingNumber);
      if (!t.ok) return NextResponse.json({ error: "Invalid tracking number (letters, numbers, - and / only, max 40)" }, { status: 400 });
      updateData.trackingNumber = t.value;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    // FIX 2: Transaction to update order, handle refund status, and stock safely
    let updated, oldStatus, oldPaymentStatus, oldCourier, oldTracking;
    try {
      const result = await prisma.$transaction(async (tx) => {
        const currentOrder = await tx.order.findUnique({
          where: { id: params.id },
          include: { items: true },
        });

        if (!currentOrder) {
          throw new Error("Order not found");
        }

        if ((hasCourier || hasTracking) && !["SHIPPED", "DELIVERED"].includes(status || currentOrder.status)) {
          throw new Error("Add courier and tracking details after the order is shipped.");
        }

        // Guard: a cancelled order cannot be marked as paid. Re-activate it first.
        if (currentOrder.status === "CANCELLED" && paymentStatus === "PAID") {
          throw new Error("This order is cancelled. Re-activate it before marking it as paid.");
        }

        // Guard: a delivered order cannot be cancelled (the parcel is with the customer).
        if (status === "CANCELLED" && currentOrder.status === "DELIVERED") {
          throw new Error("A delivered order cannot be cancelled.");
        }

        // Guard: manual payment status changes must follow the allowed moves.
        // (Cancel / re-activate set the payment status themselves, so they are skipped here.)
        const isCancelOrReactivate =
          (status === "CANCELLED" && currentOrder.status !== "CANCELLED") ||
          (currentOrder.status === "CANCELLED" && status && status !== "CANCELLED");
        if (paymentStatus && !isCancelOrReactivate && paymentStatus !== currentOrder.paymentStatus) {
          const allowedNext = MANUAL_PAYMENT_MOVES[currentOrder.paymentStatus] || [];
          if (!allowedNext.includes(paymentStatus)) {
            throw new Error("Payment status cannot be changed from " + currentOrder.paymentStatus + " to " + paymentStatus + ".");
          }
          if (currentOrder.status === "CANCELLED" && paymentStatus !== "REFUNDED") {
            throw new Error("This order is cancelled. Re-activate it first.");
          }
          if (currentOrder.status !== "CANCELLED" && paymentStatus === "REFUNDED") {
            throw new Error("Only a cancelled order can be marked as refunded.");
          }
        }

        // Case 1: Cancelling the order
        if (status === "CANCELLED" && currentOrder.status !== "CANCELLED") {
          const updatedRes = await tx.order.updateMany({
            where: { id: params.id, status: currentOrder.status }, // Guard: Only update if status hasn't changed concurrently
            data: {
              status: "CANCELLED",
              paymentStatus: currentOrder.paymentStatus === "PAID" ? "REFUND_PENDING" : "CANCELLED",
            },
          });

          if (updatedRes.count === 0) {
            throw new Error("Order was updated by someone else. Please refresh.");
          }

          // Restore stock safely
          for (const item of currentOrder.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        } 
        // Case 2: Re-activating a cancelled order
        else if (currentOrder.status === "CANCELLED" && status && status !== "CANCELLED") {
          const updatedRes = await tx.order.updateMany({
            where: { id: params.id, status: "CANCELLED" },
            // Money still with us (refund not done yet) stays PAID; a completed refund or unpaid order starts again as PENDING.
            data: { status, paymentStatus: currentOrder.paymentStatus === "REFUND_PENDING" ? "PAID" : "PENDING" },
          });

          if (updatedRes.count === 0) {
            throw new Error("Order was updated by someone else. Please refresh.");
          }

          // Deduct stock safely
          for (const item of currentOrder.items) {
            const res = await tx.product.updateMany({
              where: { id: item.productId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
            if (res.count === 0) {
              throw new Error(`Not enough stock to re-activate order. Product ID: ${item.productId}`);
            }
          }
        } 
        // Case 3: Normal status update (e.g. PENDING -> SHIPPED)
        else {
          await tx.order.update({
            where: { id: params.id },
            data: {
              ...updateData,
              ...(status === "SHIPPED" && currentOrder.status !== "SHIPPED" ? { shippedAt: new Date() } : {}),
            },
          });
        }

        // Fetch the fully updated order for the response
        const finalOrder = await tx.order.findUnique({
          where: { id: params.id },
          include: {
            items: {
              include: {
                product: { select: { id: true, name: true, image: true, slug: true } },
              },
            },
          },
        });

        return { order: finalOrder!, oldStatus: currentOrder.status, oldPaymentStatus: currentOrder.paymentStatus, oldCourier: currentOrder.courierName, oldTracking: currentOrder.trackingNumber };
      });
      
      updated = result.order;
      oldStatus = result.oldStatus;
      oldPaymentStatus = result.oldPaymentStatus;
      oldCourier = result.oldCourier;
      oldTracking = result.oldTracking;
    } catch (err: any) {
      console.error("Admin transaction error:", err);
      return NextResponse.json({ error: err.message || "Failed to update order" }, { status: 400 });
    }

    // Cancelling or re-activating an order changes stock: refresh the product cache
    if (status === "CANCELLED" || oldStatus === "CANCELLED") {
      try { revalidateTag(PRODUCTS_CACHE_TAG); } catch {}
    }

    const shortId = updated.id.slice(-8).toUpperCase();
    const refundPending = updated.paymentStatus === "REFUND_PENDING" && oldPaymentStatus !== "REFUND_PENDING";

    // Email to the customer when the order status changes
    if (status && status !== oldStatus && updated.customerEmail) {
      await sendCustomerEmail({
        event: "order-status-" + status,
        to: updated.customerEmail,
        orderId: updated.id,
        subject: `Order #${shortId} ${getOrderStatusLabel(status)} - Amroha Pharmacy`,
        html: getOrderStatusUpdateHTML({
          customerName: updated.customerName,
          orderId: updated.id,
          status: status,
          total: updated.total.toString(),
          refundPending,
          courierName: updated.courierName,
          trackingNumber: updated.trackingNumber,
        }),
      });
    }

    // Tracking details added or changed after the order was already shipped
    const statusEmailSent = !!(status && status !== oldStatus);
    if (
      !statusEmailSent &&
      updated.customerEmail &&
      updated.trackingNumber &&
      (updated.trackingNumber !== oldTracking || updated.courierName !== oldCourier)
    ) {
      await sendCustomerEmail({
        event: "tracking-update",
        to: updated.customerEmail,
        orderId: updated.id,
        subject: "Tracking details for Order #" + shortId + " - Amroha Pharmacy",
        html: getTrackingUpdateHTML({
          customerName: updated.customerName,
          orderId: updated.id,
          courierName: updated.courierName,
          trackingNumber: updated.trackingNumber,
        }),
      });
    }

    // Emails to the admin (record of money events)
    if (updated.paymentStatus === "PAID" && oldPaymentStatus !== "PAID") {
      await sendAdminAlert({
        event: "payment-received",
        subject: `💰 Payment received - Order #${shortId} - ₹${updated.total.toString()}`,
        title: "Payment received",
        order: updated,
        lines: ["Order marked as PAID from the admin panel."],
      });
    }
    if (refundPending) {
      await sendAdminAlert({
        event: "refund-pending",
        subject: `↩️ Refund pending - Order #${shortId} - ₹${updated.total.toString()}`,
        title: "Refund pending",
        color: "#dc2626",
        order: updated,
        lines: ["A paid order was cancelled. Please refund the customer."],
      });
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
