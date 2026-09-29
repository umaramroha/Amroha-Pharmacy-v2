import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Rate limit: 5 attempts per 15 min
    const rateKey = `admin-login:${cleanEmail}`;
    const rateCheck = await checkRateLimit(rateKey);

    if (!rateCheck.allowed) {
      const minutes = Math.ceil(rateCheck.resetIn / 60000);
      return NextResponse.json(
        {
          error: `Too many attempts. Please try again in ${minutes} minute${
            minutes > 1 ? "s" : ""
          }.`,
        },
        { status: 429 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await resetRateLimit(rateKey);

    const session = await getIronSession<AdminSessionData>(
      cookies(),
      adminSessionOptions
    );
    session.adminId = admin.id;
    session.email = admin.email;
    session.role = admin.role;
    session.isAdminLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
