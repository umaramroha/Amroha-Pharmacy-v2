import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export async function PATCH(request: Request) {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, mobile } = await request.json();

    if (!name || !mobile) {
      return NextResponse.json(
        { error: "Name and mobile are required" },
        { status: 400 }
      );
    }

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
