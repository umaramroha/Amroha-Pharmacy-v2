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

    // End of today in IST (UTC+5:30): follow-ups due today or overdue
    const IST_MS = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(Date.now() + IST_MS);
    const endOfToday = new Date(
      Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() + 1) - IST_MS - 1
    );

    const [customers, totalCount, dueToday] = await Promise.all([
      prisma.customer.findMany({
        take: limit,
        skip,
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, mobile: true, createdAt: true,
          followUpAt: true, followUpNote: true, followUpStatus: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where: { followUpStatus: "PENDING", followUpAt: { lte: endOfToday } },
        orderBy: { followUpAt: "asc" },
        take: 30,
        select: { id: true, name: true, email: true, mobile: true, followUpAt: true, followUpNote: true },
      }),
    ]);

    return NextResponse.json({ 
      customers, 
      totalPages: Math.ceil(totalCount / limit),
      dueToday 
    });
  } catch (error: any) {
    console.error("Admin customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
