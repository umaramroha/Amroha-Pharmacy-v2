import { z } from "zod";
import { COUPON_CODE_REGEX } from "@/lib/coupons";

const MAX_AMOUNT = 1000000;

const baseFields = z.object({
  type: z.enum(["FLAT", "PERCENT"], {
    errorMap: () => ({ message: "Choose a coupon type" }),
  }),
  value: z
    .number({ required_error: "Enter the discount value", invalid_type_error: "Enter the discount value" })
    .positive("Discount value must be more than 0")
    .max(MAX_AMOUNT, "Discount value is too large"),
  minCartValue: z
    .number({ invalid_type_error: "Enter a valid minimum cart value" })
    .min(0, "Minimum cart value cannot be negative")
    .max(MAX_AMOUNT, "Minimum cart value is too large")
    .default(0),
  maxDiscount: z
    .number({ invalid_type_error: "Enter a valid max discount" })
    .positive("Max discount must be more than 0")
    .max(MAX_AMOUNT, "Max discount is too large")
    .nullable()
    .optional(),
  usageLimit: z
    .number({ invalid_type_error: "Enter a valid usage limit" })
    .int("Usage limit must be a whole number")
    .positive("Usage limit must be at least 1")
    .max(MAX_AMOUNT, "Usage limit is too large")
    .nullable()
    .optional(),
  perUserLimit: z
    .number({ invalid_type_error: "Enter a valid per-customer limit" })
    .int("Per-customer limit must be a whole number")
    .positive("Per-customer limit must be at least 1")
    .max(1000, "Per-customer limit is too large")
    .nullable()
    .optional(),
  startsAt: z.string().datetime("Invalid start date").nullable().optional(),
  expiresAt: z.string().datetime("Invalid expiry date").nullable().optional(),
  isActive: z.boolean().default(true),
  firstOrderOnly: z.boolean().default(false),
});

function checkCoupon(
  v: {
    type: string;
    value: number;
    startsAt?: string | null;
    expiresAt?: string | null;
  },
  ctx: z.RefinementCtx
) {
  if (v.type === "PERCENT" && v.value > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Percentage cannot be more than 100",
      path: ["value"],
    });
  }
  if (v.startsAt && v.expiresAt && new Date(v.startsAt) >= new Date(v.expiresAt)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Expiry date must be after the start date",
      path: ["expiresAt"],
    });
  }
}

// Edit: every field except the code (the code never changes once created,
// because past orders refer to it).
export const couponFieldsSchema = baseFields.superRefine(checkCoupon);

export const createCouponSchema = baseFields
  .extend({
    code: z
      .string()
      .transform((s) => s.trim().toUpperCase())
      .refine(
        (s) => COUPON_CODE_REGEX.test(s),
        "Code must be 3-20 characters: letters, numbers, - or _"
      ),
  })
  .superRefine(checkCoupon);

export type CouponFields = z.infer<typeof couponFieldsSchema>;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function toCouponData(v: CouponFields) {
  return {
    type: v.type,
    value: round2(v.value),
    minCartValue: round2(v.minCartValue),
    // Max discount only makes sense for percentage coupons
    maxDiscount: v.type === "PERCENT" && v.maxDiscount ? round2(v.maxDiscount) : null,
    usageLimit: v.usageLimit ?? null,
    perUserLimit: v.perUserLimit ?? null,
    startsAt: v.startsAt ? new Date(v.startsAt) : null,
    expiresAt: v.expiresAt ? new Date(v.expiresAt) : null,
    isActive: v.isActive,
    firstOrderOnly: v.firstOrderOnly,
  };
}
