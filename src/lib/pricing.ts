import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deliveryConfig } from "@/lib/config";
import { getDeliveryZone, isCodAvailable } from "@/data/delivery";
import { PREPAID_DISCOUNT_PERCENT } from "@/lib/offers";

export const MAX_QTY_PER_PRODUCT = 10;
export const MAX_TOTAL_ITEMS = 30;

export const PREPAID_DISCOUNT_RATE = new Prisma.Decimal(PREPAID_DISCOUNT_PERCENT).div(100);

// 5% off the product subtotal for prepaid (UPI) orders, rounded to paise.
// Used by checkout/quote, order creation and the COD <-> UPI switch so all
// three always agree on the amount.
export function getPrepaidDiscount(
  subtotal: Prisma.Decimal,
  paymentMethod?: string
): Prisma.Decimal {
  if (paymentMethod !== "upi") return new Prisma.Decimal(0);
  return subtotal.mul(PREPAID_DISCOUNT_RATE).toDecimalPlaces(2);
}

export type CartLineInput = { id: string; quantity: number };

export type PricedLine = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  mrp: Prisma.Decimal;
};

export type PricingFailure = { ok: false; status: number; error: string };

export type PricingSuccess = {
  ok: true;
  lines: PricedLine[];
  subtotal: Prisma.Decimal;
  mrpTotal: Prisma.Decimal;
  productDiscount: Prisma.Decimal;
  prepaidDiscount: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  codAvailable: boolean;
  total: Prisma.Decimal;
};

const fail = (status: number, error: string): PricingFailure => ({
  ok: false,
  status,
  error,
});

export function mergeCartItems(items: CartLineInput[]): Map<string, number> {
  const qtyByProduct = new Map<string, number>();
  for (const item of items) {
    qtyByProduct.set(item.id, (qtyByProduct.get(item.id) ?? 0) + item.quantity);
  }
  return qtyByProduct;
}

export function checkCartLimits(
  qtyByProduct: Map<string, number>
): PricingFailure | null {
  let totalItemsCount = 0;
  for (const qty of Array.from(qtyByProduct.values())) {
    if (qty > MAX_QTY_PER_PRODUCT) {
      return fail(400, `Maximum ${MAX_QTY_PER_PRODUCT} units allowed per product. Please reduce the quantity.`);
    }
    totalItemsCount += qty;
  }
  if (totalItemsCount > MAX_TOTAL_ITEMS) {
    return fail(400, `Maximum ${MAX_TOTAL_ITEMS} items allowed per order. For bulk orders, please contact us on WhatsApp.`);
  }
  return null;
}

export async function priceCart(
  qtyByProduct: Map<string, number>,
  pincode?: string,
  paymentMethod?: string
): Promise<PricingFailure | PricingSuccess> {
  const productIds = Array.from(qtyByProduct.keys());
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      mrp: true,
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
      return fail(400, `Only ${product.stock} units available for "${product.name}". Please reduce the quantity.`);
    }
    if (product.price.lte(0)) {
      return fail(400, `${product.name} is not available for online order right now. Please contact us on WhatsApp.`);
    }

    lines.push({
      productId,
      name: product.name,
      quantity,
      unitPrice: product.price,
      mrp: product.mrp && product.mrp.gt(product.price) ? product.mrp : product.price,
    });
  }

  // Calculate base totals
  const subtotal = lines.reduce((sum, l) => sum.plus(l.unitPrice.mul(l.quantity)), new Prisma.Decimal(0));
  const mrpTotal = lines.reduce((sum, l) => sum.plus(l.mrp.mul(l.quantity)), new Prisma.Decimal(0));
  const productDiscount = mrpTotal.minus(subtotal);

  // Dynamic Delivery & COD Logic
  let deliveryFee = new Prisma.Decimal(50); // Fallback
  let codAvailable = true;

  if (pincode) {
    const zone = getDeliveryZone(pincode);
    if (zone) {
      deliveryFee = subtotal.gte(zone.freeAbove) ? new Prisma.Decimal(0) : new Prisma.Decimal(zone.deliveryFee);
      codAvailable = isCodAvailable(pincode);
    } else {
      deliveryFee = subtotal.gte(800) ? new Prisma.Decimal(0) : new Prisma.Decimal(80);
    }
  }

  // Note: COD unavailability is handled on the frontend via the codAvailable flag

  // 5% Prepaid Discount
  const prepaidDiscount = getPrepaidDiscount(subtotal, paymentMethod);

  const total = subtotal.plus(deliveryFee).minus(prepaidDiscount);

  return { ok: true, lines, subtotal, mrpTotal, productDiscount, prepaidDiscount, deliveryFee, codAvailable, total };
}
