import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";
import { sessionOptions, SessionData } from "@/lib/session";
import { mergeCartItems, checkCartLimits, priceCart } from "@/lib/pricing";
import { rateLimit } from "@/lib/rateLimit";

/**
 * POST /api/orders/quote
 *
 * Returns the authoritative subtotal / delivery fee / total for a cart,
 * calculated on the server from the database prices. The checkout page uses
 * this BEFORE showing the UPI amount, so a customer never pays an amount
 * based on prices that were saved in their browser.
 *
 * Nothing is created or changed in the database.
 */
const QuoteInput = z.object({
  pincode: z.string().length(6).optional(),
  paymentMethod: z.enum(["cod", "upi"]).optional(),
  couponCode: z.string().trim().max(30).optional(),
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

export async function POST(request: Request) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: "Please login to continue" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const parsed = QuoteInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid cart data" },
        { status: 400 }
      );
    }

    // Same merge + limits + pricing as the real order (see lib/pricing.ts)
    const qtyByProduct = mergeCartItems(parsed.data.items);

    const limitError = checkCartLimits(qtyByProduct);
    if (limitError) {
      return NextResponse.json(
        { error: limitError.error },
        { status: limitError.status }
      );
    }

    // Coupon (optional). Every coupon check counts toward a small rate limit so
    // codes cannot be guessed. If the limit is hit, the cart is still priced
    // normally, just without the coupon.
    let couponInput: { code: string; userId: string } | null = null;
    let couponLimitError: string | null = null;
    const rawCoupon = parsed.data.couponCode;
    if (rawCoupon) {
      const rate = await rateLimit(`coupon:${session.userId}`, 30, 10 * 60 * 1000);
      if (rate.allowed) {
        couponInput = { code: rawCoupon, userId: session.userId };
      } else {
        couponLimitError = "Too many coupon attempts. Please try again in a few minutes.";
      }
    }

    const priced = await priceCart(
      qtyByProduct,
      parsed.data.pincode,
      parsed.data.paymentMethod,
      couponInput
    );
    if (!priced.ok) {
      return NextResponse.json(
        { error: priced.error },
        { status: priced.status }
      );
    }

    return NextResponse.json({
      success: true,
      quote: {
        subtotal: Number(priced.subtotal),
        mrpTotal: Number(priced.mrpTotal),
        productDiscount: Number(priced.productDiscount),
        prepaidDiscount: Number(priced.prepaidDiscount),
        zoneDiscount: Number(priced.zoneDiscount),
        originalDeliveryFee: Number(priced.originalDeliveryFee),
        deliveryFee: Number(priced.deliveryFee),
        codAvailable: priced.codAvailable,
        total: Number(priced.total),
        couponCode: priced.couponCode,
        couponDiscount: Number(priced.couponDiscount),
        couponError: couponLimitError ?? priced.couponError,
        items: priced.lines.map((l) => ({
          id: l.productId,
          name: l.name,
          quantity: l.quantity,
          unitPrice: Number(l.unitPrice),
          lineTotal: Number(l.unitPrice.mul(l.quantity)),
        })),
      },
    });
  } catch (error: any) {
    console.error("Order quote error:", error);
    return NextResponse.json(
      { error: "Could not calculate the order total. Please try again." },
      { status: 500 }
    );
  }
}
