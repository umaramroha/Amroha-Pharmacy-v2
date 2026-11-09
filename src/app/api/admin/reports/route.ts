import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";
import { REVENUE_WHERE, isRevenueOrder } from "@/lib/revenue";

export const dynamic = "force-dynamic";

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

const IST_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const PERIODS = ["7", "30", "90", "all"];
const STATUS_ORDER = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

// Start of the IST (UTC+5:30) calendar day that contains `date`
function istDayStart(date: Date): Date {
  const t = new Date(date.getTime() + IST_MS);
  return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) - IST_MS);
}

function istLabel(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

const num = (v: unknown) => Number(v ?? 0);

type TopRow = {
  id: string;
  name: string;
  image: string | null;
  units: bigint;
  orders: bigint;
  amount: string;
};

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const rawPeriod = searchParams.get("period") || "30";
    const period = PERIODS.includes(rawPeriod) ? rawPeriod : "30";

    const todayStart = istDayStart(new Date());
    const from: Date | null =
      period === "all" ? null : new Date(todayStart.getTime() - (Number(period) - 1) * DAY_MS);

    const inPeriod: Prisma.OrderWhereInput = from ? { createdAt: { gte: from } } : {};
    const notCancelled: Prisma.OrderWhereInput = { status: { not: "CANCELLED" } };

    // Daily chart: last 7 days for the 7-day view, otherwise the last 30 days
    const chartDays = period === "7" ? 7 : 30;
    const chartFrom = new Date(todayStart.getTime() - (chartDays - 1) * DAY_MS);

    const fromSql = from ? Prisma.sql`AND o."createdAt" >= ${from}` : Prisma.empty;

    const [
      placed,
      received,
      statusGroups,
      methodGroups,
      codPending,
      newCustomers,
      couponAgg,
      seriesOrders,
      topRows,
    ] = await Promise.all([
      prisma.order.aggregate({
        _count: { _all: true },
        _sum: { total: true },
        where: { ...inPeriod, ...notCancelled },
      }),
      prisma.order.aggregate({
        _count: { _all: true },
        _sum: { total: true },
        where: { ...inPeriod, ...REVENUE_WHERE },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: inPeriod,
      }),
      prisma.order.groupBy({
        by: ["paymentMethod"],
        _count: { _all: true },
        _sum: { total: true },
        where: { ...inPeriod, ...notCancelled },
      }),
      prisma.order.aggregate({
        _count: { _all: true },
        _sum: { total: true },
        where: { paymentMethod: "cod", paymentStatus: "PENDING", ...notCancelled },
      }),
      prisma.customer.count({ where: from ? { createdAt: { gte: from } } : {} }),
      prisma.order.aggregate({
        _count: { _all: true },
        _sum: { couponDiscount: true },
        where: { ...inPeriod, ...notCancelled, couponCode: { not: null } },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: chartFrom } },
        select: {
          total: true,
          createdAt: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
        },
      }),
      prisma.$queryRaw<TopRow[]>`
        SELECT
          oi."productId" AS id,
          p.name,
          p.image,
          SUM(oi.quantity)::bigint AS units,
          COUNT(DISTINCT o.id)::bigint AS orders,
          SUM(oi.price * oi.quantity)::text AS amount
        FROM "OrderItem" oi
        JOIN "Order" o ON o.id = oi."orderId"
        JOIN "Product" p ON p.id = oi."productId"
        WHERE o.status != 'CANCELLED' ${fromSql}
        GROUP BY oi."productId", p.name, p.image
        ORDER BY SUM(oi.quantity) DESC
        LIMIT 5
      `,
    ]);

    // Daily series (IST days, zero-filled, latest day first)
    const dayMap = new Map<number, { booked: number; received: number }>();
    for (let i = 0; i < chartDays; i++) {
      dayMap.set(chartFrom.getTime() + i * DAY_MS, { booked: 0, received: 0 });
    }
    for (const o of seriesOrders) {
      if (o.status === "CANCELLED") continue;
      const bucket = dayMap.get(istDayStart(o.createdAt).getTime());
      if (!bucket) continue;
      bucket.booked += num(o.total);
      if (isRevenueOrder(o)) bucket.received += num(o.total);
    }
    const daily = Array.from(dayMap.entries())
      .map(([t, v]) => ({ label: istLabel(new Date(t)), booked: v.booked, received: v.received }))
      .reverse();

    const statusBreakdown = statusGroups
      .map((g) => ({ status: g.status, count: g._count._all }))
      .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
    const totalInPeriod = statusBreakdown.reduce((s, g) => s + g.count, 0);
    const countOf = (st: string) => statusBreakdown.find((g) => g.status === st)?.count ?? 0;
    const cancelled = countOf("CANCELLED");

    const ordersPlaced = placed._count._all;
    const bookedSales = num(placed._sum.total);

    return NextResponse.json({
      period,
      summary: {
        ordersPlaced,
        bookedSales,
        revenueReceived: num(received._sum.total),
        receivedOrders: received._count._all,
        avgOrderValue: ordersPlaced > 0 ? bookedSales / ordersPlaced : 0,
        delivered: countOf("DELIVERED"),
        cancelled,
        cancellationRate: totalInPeriod > 0 ? Math.round((cancelled / totalInPeriod) * 100) : 0,
        newCustomers,
      },
      codToCollect: { amount: num(codPending._sum.total), count: codPending._count._all },
      paymentSplit: methodGroups.map((g) => ({
        method: g.paymentMethod,
        count: g._count._all,
        amount: num(g._sum.total),
      })),
      coupons: { orders: couponAgg._count._all, discount: num(couponAgg._sum.couponDiscount) },
      statusBreakdown,
      daily,
      topProducts: topRows.map((r) => ({
        id: r.id,
        name: r.name,
        image: r.image,
        units: Number(r.units),
        orders: Number(r.orders),
        amount: Number(r.amount),
      })),
    });
  } catch (error: any) {
    console.error("Admin reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
