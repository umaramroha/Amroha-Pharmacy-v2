import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { rateLimit } from "@/lib/rateLimit"; // RATELIMIT_V1

export async function PATCH(request: Request) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbCustomer = await prisma.customer.findUnique({ where: { id: session.userId }, select: { lastPasswordChange: true } });
    if (!dbCustomer || (session.lastPasswordChange && new Date(session.lastPasswordChange) < dbCustomer.lastPasswordChange)) {
      session.destroy();
      return NextResponse.json({ error: "Session expired. Please login again." }, { status: 401 });
    }

    const rate = await rateLimit("update-profile:" + session.userId, 20, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const rawMobile = typeof body?.mobile === "string" ? body.mobile : "";
    const cleanMobile = rawMobile.replace(/[\s\-()]/g, "").replace(/^\+?91/, "");

    if (!name) {
      return NextResponse.json(
        { error: "Please enter your name" },
        { status: 400 }
      );
    }
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }
    const mobile = cleanMobile;

    const updated = await prisma.customer.update({
      where: { id: session.userId },
      data: {
        name: name.trim(),
        mobile: mobile.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        createdAt: true,
      },
    });

    // Update session
    session.name = updated.name;
    await session.save();

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
