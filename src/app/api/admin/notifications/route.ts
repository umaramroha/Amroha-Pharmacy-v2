import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  try {
    const session = await getIronSession<AdminSessionData>(await cookies(), adminSessionOptions);
    if (!session.isAdminLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const failedOnly = searchParams.get("status") === "FAILED";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const where = failedOnly ? { status: "FAILED" } : {};

    const [total, failedCount, rows] = await Promise.all([
      prisma.notificationLog.count({ where }),
      prisma.notificationLog.count({ where: { status: "FAILED" } }),
      prisma.notificationLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          createdAt: true,
          event: true,
          audience: true,
          toEmail: true,
          subject: true,
          status: true,
          error: true,
          orderId: true,
          html: true,
        },
      }),
    ]);

    const logs = rows.map(({ html, ...rest }) => ({ ...rest, canResend: rest.status === "FAILED" && !!html }));

    return NextResponse.json({
      logs,
      total,
      failedCount,
      page,
      pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    });
  } catch (error) {
    console.error("Admin notifications error:", error);
    return NextResponse.json({ error: "Failed to load email log" }, { status: 500 });
  }
}
