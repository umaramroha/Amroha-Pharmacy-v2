import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ user: null });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        createdAt: true,
      },
    });

    if (!customer) {
      // User deleted from DB but session exists — destroy session
      session.destroy();
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: customer });
  } catch (error: any) {
    console.error("Me API error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

