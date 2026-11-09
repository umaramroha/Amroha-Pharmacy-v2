import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";
import { REVENUE_WHERE } from "@/lib/revenue";

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

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Total stats
    const [
      totalRevenue,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      avgOrderValue,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: REVENUE_WHERE,
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({
        _avg: { total: true },
        where: REVENUE_WHERE,
      }),
    ]);

    // Order status breakdown
    const statusBreakdown = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Top selling products — revenue = SUM(price × quantity), excluding cancelled orders
    type TopProductRow = {
      id: string;
      name: string;
      image: string | null;
      totalSold: bigint;
      revenue: string;
      orderCount: bigint;
    };
    const topProductRows = await prisma.$queryRaw<TopProductRow[]>`
      SELECT
        oi."productId" AS id,
        p.name,
        p.image,
        SUM(oi.quantity)::bigint AS "totalSold",
        SUM(oi.price * oi.quantity)::text AS revenue,
        COUNT(DISTINCT o.id)::bigint AS "orderCount"
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      JOIN "Product" p ON p.id = oi."productId"
      WHERE o.status != 'CANCELLED'
      GROUP BY oi."productId", p.name, p.image
      ORDER BY SUM(oi.quantity) DESC
      LIMIT 5
    `;
    const topProductsWithDetails = topProductRows.map((r) => ({
      id: r.id,
      name: r.name,
      image: r.image,
      totalSold: Number(r.totalSold),
      orderCount: Number(r.orderCount),
      revenue: Number(r.revenue),
    }));

    // Recent 7 days revenue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        ...REVENUE_WHERE,
      },
      select: { total: true, createdAt: true },
    });

    // Group by date
    const dailyRevenue: { [key: string]: number } = {};
    recentOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      dailyRevenue[date] =
        (dailyRevenue[date] || 0) + Number(order.total);
    });

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      avgOrderValue: avgOrderValue._avg.total || 0,
      statusBreakdown,
      topProducts: topProductsWithDetails,
      dailyRevenue,
    });
  } catch (error: any) {
    console.error("Admin reports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
