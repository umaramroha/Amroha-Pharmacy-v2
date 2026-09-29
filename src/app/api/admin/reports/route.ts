import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

async function isAdmin() {
  const session = await getIronSession<AdminSessionData>(
    cookies(),
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
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({
        _avg: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

    // Order status breakdown
    const statusBreakdown = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      _count: { productId: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const productIds = topProducts.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, image: true },
    });

    const topProductsWithDetails = topProducts.map((tp) => {
      const product = products.find((p) => p.id === tp.productId);
      return {
        id: tp.productId,
        name: product?.name || "Unknown",
        image: product?.image || null,
        totalSold: tp._sum.quantity || 0,
        orderCount: tp._count.productId,
        revenue:
          Number(product?.price || 0) * (tp._sum.quantity || 0),
      };
    });

    // Recent 7 days revenue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { not: "CANCELLED" },
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
