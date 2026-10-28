import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

async function isAdmin() {
  const session = await getIronSession<AdminSessionData>(await cookies(), adminSessionOptions);
  return session.isAdminLoggedIn && session.adminId;
}

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status");
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = status && status !== "ALL" ? { status } : {};

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        take: limit,
        skip,
        where,
        orderBy: { createdAt: "desc" },
        include: { 
          items: { include: { product: { select: { id: true, name: true, image: true, slug: true } } } }, 
          customer: { select: { id: true, name: true, email: true, mobile: true } } 
        },
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({ 
      orders, 
      totalPages: Math.ceil(totalCount / limit) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
