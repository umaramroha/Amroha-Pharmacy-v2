import { z } from "zod";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { getPrepaidDiscount } from "@/lib/pricing";
import { isCodAvailable, getDeliveryZone } from "@/data/delivery";

/**
 * POST /api/orders/[id]/switch-payment   body: { newMethod: "cod" | "upi" }
 *
 * Lets a customer change an unpaid order between COD and UPI (prepaid).
 *  - COD -> UPI : 5% prepaid discount is applied
 *  - UPI -> COD : the 5% is added back
 *
 * The new total is calculated from the amounts saved on the ORDER (subtotal at
 * the time of ordering + delivery fee). It deliberately does not re-price the
 * cart from the products table: stock for this order was already deducted when
 * it was placed, and the price may have changed since.
 */
const SWITCHABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const parsed = z.object({ newMethod: z.enum(["cod", "upi"]) }).strict().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }
    const newMethod = parsed.data.newMethod;

    const order = await prisma.order.findUnique({ where: { id: params.id } });

    if (!order || order.customerId !== session.userId) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!SWITCHABLE_STATUSES.includes(order.status)) {
      return NextResponse.json({ error: "Cannot change payment method after shipping." }, { status: 400 });
    }

    // Once money has been received (or a refund is in progress) the method is locked.
    if (order.paymentStatus !== "PENDING") {
      return NextResponse.json(
        { error: "Payment method cannot be changed because this order is already paid. Please contact us on WhatsApp." },
        { status: 400 }
      );
    }

    if (order.paymentMethod === newMethod) {
      return NextResponse.json({ success: true, order });
    }

    if (newMethod === "cod" && !isCodAvailable(order.pincode)) {
      return NextResponse.json({ error: "Cash on Delivery is not available for this pincode." }, { status: 400 });
    }

    // Recalculate discounts based on original pincode
    const zone = getDeliveryZone(order.pincode);
    const zoneDiscount = zone?.discount ? order.subtotal.mul(zone.discount).div(100).toDecimalPlaces(2) : new Prisma.Decimal(0);
    
    const prepaidDiscount = getPrepaidDiscount(order.subtotal, newMethod);
    const total = order.subtotal.plus(order.deliveryFee).minus(zoneDiscount).minus(prepaidDiscount);

    // Guarded write: only if nothing changed (status / payment) since we read it.
    const updated = await prisma.order.updateMany({
      where: {
        id: order.id,
        status: { in: SWITCHABLE_STATUSES },
        paymentStatus: "PENDING",
        paymentMethod: order.paymentMethod,
      },
      data: { paymentMethod: newMethod, total },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "This order was just updated. Please refresh the page and try again." },
        { status: 409 }
      );
    }

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Switch payment error:", error);
    return NextResponse.json({ error: "Failed to change payment method" }, { status: 500 });
  }
}
