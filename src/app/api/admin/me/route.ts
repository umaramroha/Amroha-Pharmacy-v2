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

export async function GET() {
  try {
    const session = await getIronSession<AdminSessionData>(
      cookies(),
      adminSessionOptions
    );

    if (!session.isAdminLoggedIn || !session.adminId) {
      return NextResponse.json({ admin: null });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.adminId },
      select: { id: true, email: true, role: true },
    });

    if (!admin) {
      session.destroy();
      return NextResponse.json({ admin: null });
    }

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error("Admin me error:", error);
    return NextResponse.json({ admin: null }, { status: 500 });
  }
}
