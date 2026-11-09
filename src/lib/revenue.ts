import type { Prisma } from "@prisma/client";

// Revenue counts only money that is actually earned:
//  - COD orders: once the admin marks the payment as received (PAID)
//  - UPI (prepaid) orders: once the order is DELIVERED
// Cancelled orders never count.
export const REVENUE_WHERE: Prisma.OrderWhereInput = {
  status: { not: "CANCELLED" },
  OR: [
    { paymentMethod: "cod", paymentStatus: "PAID" },
    { paymentMethod: "upi", status: "DELIVERED" },
  ],
};

// Same rule as REVENUE_WHERE, for orders that are already loaded in memory.
export function isRevenueOrder(o: {
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}): boolean {
  if (o.status === "CANCELLED") return false;
  return (
    (o.paymentMethod === "cod" && o.paymentStatus === "PAID") ||
    (o.paymentMethod === "upi" && o.status === "DELIVERED")
  );
}
