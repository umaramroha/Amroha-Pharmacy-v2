import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, getAdminSession } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import { createCouponSchema, toCouponData } from "@/lib/couponSchema";

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

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    // How many times each coupon was used (cancelled orders do not count)
    const usage = await prisma.order.groupBy({
      by: ["couponCode"],
      where: { couponCode: { not: null }, status: { not: "CANCELLED" } },
      _count: { _all: true },
      _sum: { couponDiscount: true },
    });
    const usageByCode = new Map(usage.map((u) => [u.couponCode, u]));

    return NextResponse.json({
      coupons: coupons.map((c) => {
        const u = usageByCode.get(c.code);
        return {
          id: c.id,
          code: c.code,
          type: c.type,
          value: Number(c.value),
          minCartValue: Number(c.minCartValue),
          maxDiscount: c.maxDiscount === null ? null : Number(c.maxDiscount),
          usageLimit: c.usageLimit,
          perUserLimit: c.perUserLimit,
          startsAt: c.startsAt,
          expiresAt: c.expiresAt,
          isActive: c.isActive,
          used: u ? u._count._all : 0,
          totalDiscount: u && u._sum.couponDiscount ? Number(u._sum.couponDiscount) : 0,
        };
      }),
    });
  } catch (error: any) {
    console.error("Admin get coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await getAdminSession();
    const rateCheck = await rateLimit(
      "admin-mutation:" + session.adminId,
      50,
      60 * 60 * 1000,
      { failOpen: false }
    );
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Admin rate limit exceeded" }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = createCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { code, ...fields } = parsed.data;
    const coupon = await prisma.coupon.create({
      data: { code, ...toCouponData(fields) },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A coupon with this code already exists" },
        { status: 409 }
      );
    }
    console.error("Admin create coupon error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
