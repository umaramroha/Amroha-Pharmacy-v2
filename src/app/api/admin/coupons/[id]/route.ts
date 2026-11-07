import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, getAdminSession } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import { couponFieldsSchema, toCouponData } from "@/lib/couponSchema";

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

async function checkMutationLimit() {
  const session = await getAdminSession();
  const rateCheck = await rateLimit(
    "admin-mutation:" + session.adminId,
    50,
    60 * 60 * 1000,
    { failOpen: false }
  );
  return rateCheck.allowed;
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await checkMutationLimit())) {
      return NextResponse.json({ error: "Admin rate limit exceeded" }, { status: 429 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Quick on/off switch from the list: { isActive: true | false }
    const keys = Object.keys(body);
    if (keys.length === 1 && keys[0] === "isActive" && typeof body.isActive === "boolean") {
      const coupon = await prisma.coupon.update({
        where: { id: params.id },
        data: { isActive: body.isActive },
      });
      return NextResponse.json({ success: true, coupon });
    }

    // Full edit (the code itself can never be changed)
    const parsed = couponFieldsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: toCouponData(parsed.data),
    });
    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    console.error("Admin update coupon error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await checkMutationLimit())) {
      return NextResponse.json({ error: "Admin rate limit exceeded" }, { status: 429 });
    }

    const existing = await prisma.coupon.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // A coupon that was used on orders is kept (order history refers to its code).
    const usedCount = await prisma.order.count({ where: { couponCode: existing.code } });
    if (usedCount > 0) {
      return NextResponse.json(
        {
          error:
            "This coupon was used on " + usedCount + " order(s), so it cannot be deleted. Deactivate it instead.",
        },
        { status: 409 }
      );
    }

    await prisma.coupon.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete coupon error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
