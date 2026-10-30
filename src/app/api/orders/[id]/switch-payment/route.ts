import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { mergeCartItems, priceCart } from "@/lib/pricing";
import { isCodAvailable } from "@/data/delivery";

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newMethod } = await request.json();
    if (newMethod !== "cod" && newMethod !== "upi") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order || order.customerId !== session.userId) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow switching if order hasn't been shipped/delivered/cancelled
    const allowedStatuses = ["PENDING", "CONFIRMED", "PROCESSING"];
    if (!allowedStatuses.includes(order.status)) {
      return NextResponse.json({ error: "Cannot change payment method after shipping." }, { status: 400 });
    }

    if (newMethod === "cod" && !isCodAvailable(order.pincode)) {
      return NextResponse.json({ error: "COD is not available for your pincode." }, { status: 400 });
    }

    // Recalculate price to apply/remove 5% prepaid discount
    const cartItems = order.items.map(item => ({ id: item.productId, quantity: item.quantity }));
    const qtyByProduct = mergeCartItems(cartItems);
    
    const priced = await priceCart(qtyByProduct, order.pincode, newMethod);
    if (!priced.ok) {
      return NextResponse.json({ error: priced.error }, { status: priced.status });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        paymentMethod: newMethod,
        subtotal: priced.subtotal,
        deliveryFee: priced.deliveryFee,
        total: priced.total,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Switch payment error:", error);
    return NextResponse.json({ error: "Failed to change payment method" }, { status: 500 });
  }
}
