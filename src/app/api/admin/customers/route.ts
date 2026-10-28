import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";
import { Prisma } from "@prisma/client";

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
    const search = searchParams.get("search") || "";
    const limit = 20;
    const skip = (page - 1) * limit;

    // TypeScript fix: Explicitly type the where object
    const where: Prisma.CustomerWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
      ]
    } : {};

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        take: limit,
        skip,
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, mobile: true, createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.customer.count({ where })
    ]);

    return NextResponse.json({ 
      customers, 
      totalPages: Math.ceil(totalCount / limit) 
    });
  } catch (error: any) {
    console.error("Admin customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
