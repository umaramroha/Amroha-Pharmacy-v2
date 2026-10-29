import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deliveryConfig } from "@/lib/config";

/**
 * Single source of truth for "how much does this cart cost?".
 *
 * Used by BOTH:
 *   - POST /api/orders/quote  (the total shown to the customer / put in the UPI link)
 *   - POST /api/orders        (the total saved on the order)
 * so the amount a customer is asked to pay can never differ from the amount
 * the order is saved with.
 */

export const MAX_QTY_PER_PRODUCT = 10;
export const MAX_TOTAL_ITEMS = 30;

export type CartLineInput = { id: string; quantity: number };

export type PricedLine = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
};

export type PricingFailure = { ok: false; status: number; error: string };

export type PricingSuccess = {
  ok: true;
  lines: PricedLine[];
  subtotal: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  total: Prisma.Decimal;
};

const fail = (status: number, error: string): PricingFailure => ({
  ok: false,
  status,
  error,
});

/** Merge duplicate product ids so two lines of the same product can't bypass the limits. */
export function mergeCartItems(items: CartLineInput[]): Map<string, number> {
  const qtyByProduct = new Map<string, number>();
  for (const item of items) {
    qtyByProduct.set(item.id, (qtyByProduct.get(item.id) ?? 0) + item.quantity);
  }
  return qtyByProduct;
}

/** Per-product and per-order quantity caps. Returns null when everything is fine. */
export function checkCartLimits(
  qtyByProduct: Map<string, number>
): PricingFailure | null {
  let totalItemsCount = 0;
  for (const qty of Array.from(qtyByProduct.values())) {
    if (qty > MAX_QTY_PER_PRODUCT) {
      return fail(
        400,
        `Maximum ${MAX_QTY_PER_PRODUCT} units allowed per product. Please reduce the quantity.`
      );
    }
    totalItemsCount += qty;
  }

  if (totalItemsCount > MAX_TOTAL_ITEMS) {
    return fail(
      400,
      `Maximum ${MAX_TOTAL_ITEMS} items allowed per order. For bulk orders, please contact us on WhatsApp.`
    );
  }
  return null;
}

/**
 * subtotal, delivery fee and total (Decimal = no floating point errors).
 * Delivery: subtotal >= freeAbove (500) ? 0 : fee (50)  — values from lib/config.ts
 */
export function calculateTotals(
  lines: { unitPrice: Prisma.Decimal; quantity: number }[]
) {
  const subtotal = lines.reduce(
    (sum, l) => sum.plus(l.unitPrice.mul(l.quantity)),
    new Prisma.Decimal(0)
  );
  const deliveryFee = subtotal.gte(deliveryConfig.freeAbove)
    ? new Prisma.Decimal(0)
    : new Prisma.Decimal(deliveryConfig.fee);
  const total = subtotal.plus(deliveryFee);
  return { subtotal, deliveryFee, total };
}

/**
 * Loads the real products from the database, checks they can be bought
 * (exists, active, in stock, has a price) and calculates the totals.
 * The client never supplies a price.
 */
export async function priceCart(
  qtyByProduct: Map<string, number>
): Promise<PricingFailure | PricingSuccess> {
  const productIds = Array.from(qtyByProduct.keys());
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      isActive: true,
    },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  const lines: PricedLine[] = [];

  for (const [productId, quantity] of Array.from(qtyByProduct.entries())) {
    const product = productById.get(productId);

    if (!product) {
      return fail(400, `Product not found: ${productId}`);
    }
    if (!product.isActive) {
      return fail(400, `${product.name} is currently unavailable.`);
    }
    if (product.stock < quantity) {
      return fail(
        400,
        `Only ${product.stock} units available for "${product.name}". Please reduce the quantity.`
      );
    }
    if (product.price.lte(0)) {
      return fail(
        400,
        `${product.name} is not available for online order right now. Please contact us on WhatsApp.`
      );
    }

    lines.push({
      productId,
      name: product.name,
      quantity,
      unitPrice: product.price,
    });
  }

  return { ok: true, lines, ...calculateTotals(lines) };
}
