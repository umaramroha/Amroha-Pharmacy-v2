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

    const [totalOrders, pendingOrders, totalProducts, totalCustomers, revenueResult] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.product.count({ where: { isActive: true } }),
        prisma.customer.count(),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: { not: "CANCELLED" } },
        }),
      ]);

    // Start of today in IST (UTC+5:30)
    const IST_MS = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(Date.now() + IST_MS);
    const todayStart = new Date(
      Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()) - IST_MS
    );

    const [todayAgg, pendingPayments, lowStock, recentOrders] = await Promise.all([
      prisma.order.aggregate({
        _count: { _all: true },
        _sum: { total: true },
        where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
      }),
      prisma.order.count({
        where: { paymentStatus: "PENDING", status: { not: "CANCELLED" } },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lte: 5 } },
        orderBy: { stock: "asc" },
        take: 10,
        select: { id: true, name: true, stock: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          customerName: true,
          total: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers,
      revenue: revenueResult._sum.total || 0,
      todayOrders: todayAgg._count._all,
      todaySales: todayAgg._sum.total || 0,
      pendingPayments,
      lowStock,
      recentOrders,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
