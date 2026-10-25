import { z } from "zod";

/**
 * Validation for the admin "create / edit product" payload.
 *
 * The admin form sends numbers as strings ("299", "0") and an empty string
 * for "no MRP", so numeric fields accept both numbers and numeric strings.
 * Everything else is rejected with a clear message.
 */

const MAX_PRICE = 1_000_000; // ₹10 lakh — guards against typos like 29900000
const MAX_STOCK = 1_000_000;

// ---------------------------------------------------------------
// numeric helpers
// ---------------------------------------------------------------

/** Rupee amount: > 0, at most 2 decimals. Accepts 299, "299" or "299.50". */
function money(label: string) {
  return z
    .union([z.number(), z.string()], {
      errorMap: (_issue, ctx) => ({
        message:
          ctx.data === undefined || ctx.data === null
            ? `${label} is required`
            : `${label} must be a number`,
      }),
    })
    .transform((value, ctx) => {
      if (typeof value === "string") {
        const text = value.trim();
        if (text === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${label} is required`,
          });
          return z.NEVER;
        }
        if (!/^-?\d+(\.\d{1,2})?$/.test(text)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${label} must be a number with at most 2 decimal places`,
          });
          return z.NEVER;
        }
        return Number(text);
      }
      return value;
    })
    .pipe(
      z
        .number()
        .finite(`${label} must be a valid number`)
        .gt(0, `${label} must be greater than 0`)
        .max(MAX_PRICE, `${label} cannot be more than ${MAX_PRICE}`)
        .refine(
          (n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6,
          `${label} can have at most 2 decimal places`
        )
    );
}

/** Same as money(), but null / "" / missing means "none". */
function optionalMoney(label: string) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    money(label).nullable()
  );
}

/** Whole number >= 0 (0 is allowed: it means "out of stock"). */
function stock() {
  return z
    .union([z.number(), z.string()], {
      errorMap: (_issue, ctx) => ({
        message:
          ctx.data === undefined || ctx.data === null
            ? "Stock is required"
            : "Stock must be a whole number",
      }),
    })
    .transform((value, ctx) => {
      if (typeof value === "string") {
        const text = value.trim();
        if (!/^-?\d+$/.test(text)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              text === ""
                ? "Stock is required"
                : "Stock must be a whole number (0 or more)",
          });
          return z.NEVER;
        }
        return Number(text);
      }
      return value;
    })
    .pipe(
      z
        .number()
        .int("Stock must be a whole number")
        .min(0, "Stock cannot be negative")
        .max(MAX_STOCK, `Stock cannot be more than ${MAX_STOCK}`)
    );
}

// ---------------------------------------------------------------
// text / url helpers
// ---------------------------------------------------------------

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const name = z
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be text",
  })
  .trim()
  .min(1, "Name is required")
  .max(200, "Name is too long (max 200 characters)");

const slug = z
  .string({
    required_error: "Slug is required",
    invalid_type_error: "Slug must be text",
  })
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(100, "Slug is too long (max 100 characters)")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only have lowercase letters, numbers and hyphens (example: majoon-special)"
  );

const description = z
  .string({ invalid_type_error: "Description must be text" })
  .trim()
  .max(5000, "Description is too long (max 5000 characters)")
  .nullable()
  .optional();

const category = z
  .string({ invalid_type_error: "Category must be text" })
  .trim()
  .max(80, "Category is too long (max 80 characters)")
  .nullable()
  .optional();

const image = z
  .string({ invalid_type_error: "Image must be a URL" })
  .trim()
  .max(2000, "Image URL is too long")
  .refine(
    (v) => v === "" || isHttpUrl(v),
    "Image must be a valid http(s) URL"
  )
  .nullable()
  .optional();

// Blank entries are dropped (the admin form can send empty rows); the rest must be URLs.
const images = z
  .array(z.string({ invalid_type_error: "Each image must be a URL" }), {
    invalid_type_error: "Images must be a list of URLs",
  })
  .transform((list) => list.map((u) => u.trim()).filter((u) => u.length > 0))
  .pipe(
    z
      .array(
        z
          .string()
          .max(2000, "Image URL is too long")
          .refine(isHttpUrl, "Each image must be a valid http(s) URL")
      )
      .max(10, "You can add at most 10 images")
  )
  .optional();

const isActive = z.boolean({
  invalid_type_error: "isActive must be true or false",
});

// ---------------------------------------------------------------
// cross-field rule: MRP (if given) must be >= selling price
// ---------------------------------------------------------------
const MRP_MESSAGE = "MRP must be greater than or equal to the selling price";

function checkMrpAgainstPrice(
  data: { price?: unknown; mrp?: unknown },
  ctx: z.RefinementCtx
) {
  if (
    typeof data.price === "number" &&
    typeof data.mrp === "number" &&
    data.mrp < data.price
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["mrp"],
      message: MRP_MESSAGE,
    });
  }
}

// ---------------------------------------------------------------
// schemas
// ---------------------------------------------------------------
const objectError = { invalid_type_error: "Request body must be a JSON object" };

/** POST /api/admin/products */
export const createProductSchema = z
  .object(
    {
      name,
      slug,
      description,
      price: money("Price"),
      mrp: optionalMoney("MRP").optional(),
      image,
      images,
      category,
      stock: stock().optional(), // missing = 0
      isActive: isActive.optional(), // missing = true
    },
    objectError
  )
  .superRefine(checkMrpAgainstPrice);

/**
 * PATCH /api/admin/products/[id]  — every field optional (partial update).
 * `slug` is intentionally not editable here (the admin form sends it, it is ignored).
 * If only one of price / mrp is sent, the route compares it with the saved one.
 */
export const updateProductSchema = z
  .object(
    {
      name: name.optional(),
      description,
      price: money("Price").optional(),
      mrp: optionalMoney("MRP").optional(),
      image,
      images,
      category,
      stock: stock().optional(),
      isActive: isActive.optional(),
    },
    objectError
  )
  .superRefine(checkMrpAgainstPrice);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const MRP_BELOW_PRICE_MESSAGE = MRP_MESSAGE;

/**
 * Body for the HTTP 400 response:
 *   { error: "<first problem, readable>", issues: [{ field, message }, ...] }
 * The admin page already shows `error`, so no UI change is needed.
 */
export function validationErrorBody(error: z.ZodError) {
  const issues = error.issues.map((i) => ({
    field: i.path.length ? i.path.join(".") : "body",
    message: i.message,
  }));
  return { error: issues[0]?.message ?? "Invalid product data", issues };
}
