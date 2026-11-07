import { Prisma, Coupon } from "@prisma/client";

// Works with both the normal prisma client and a transaction client (tx).
export type CouponDb = Prisma.TransactionClient;

export const COUPON_CODE_REGEX = /^[A-Z0-9_-]{3,20}$/;

export function normalizeCouponCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toUpperCase();
  return COUPON_CODE_REGEX.test(code) ? code : null;
}

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: Prisma.Decimal }
  | { ok: false; error: string };

const fail = (error: string): CouponResult => ({ ok: false, error });

// FLAT = fixed rupees off. PERCENT = percentage of the product subtotal,
// optionally limited by maxDiscount. The result is also limited by `cap`
// so discounts can never push the order total below zero.
export function computeCouponDiscount(
  coupon: Pick<Coupon, "type" | "value" | "maxDiscount">,
  subtotal: Prisma.Decimal,
  cap: Prisma.Decimal
): Prisma.Decimal {
  let discount: Prisma.Decimal;
  if (coupon.type === "PERCENT") {
    discount = subtotal.mul(coupon.value).div(100).toDecimalPlaces(2);
    if (coupon.maxDiscount && discount.gt(coupon.maxDiscount)) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }
  if (discount.gt(cap)) discount = cap;
  if (discount.lt(0)) discount = new Prisma.Decimal(0);
  return discount.toDecimalPlaces(2);
}

export async function validateCoupon(opts: {
  db: CouponDb;
  code: string;
  subtotal: Prisma.Decimal;
  cap: Prisma.Decimal;
  userId: string;
}): Promise<CouponResult> {
  const { db, subtotal, cap, userId } = opts;

  const code = normalizeCouponCode(opts.code);
  if (!code) return fail("Invalid coupon code");

  const coupon = await db.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive) return fail("Invalid or expired coupon code");

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return fail("This coupon is not active yet");
  }
  if (coupon.expiresAt && coupon.expiresAt <= now) {
    return fail("This coupon has expired");
  }
  if (subtotal.lt(coupon.minCartValue)) {
    return fail("This coupon needs a minimum order of ₹" + coupon.minCartValue.toString());
  }

  // Usage is counted from real orders. Cancelled orders do not count,
  // so a cancelled order frees the coupon again automatically.
  if (coupon.usageLimit !== null) {
    const used = await db.order.count({
      where: { couponCode: code, status: { not: "CANCELLED" } },
    });
    if (used >= coupon.usageLimit) {
      return fail("This coupon has been fully redeemed");
    }
  }
  if (coupon.perUserLimit !== null) {
    const usedByUser = await db.order.count({
      where: { couponCode: code, customerId: userId, status: { not: "CANCELLED" } },
    });
    if (usedByUser >= coupon.perUserLimit) {
      return fail("You have already used this coupon");
    }
  }

  const discount = computeCouponDiscount(coupon, subtotal, cap);
  if (discount.lte(0)) return fail("This coupon cannot be applied to this order");

  return { ok: true, coupon, discount };
}
