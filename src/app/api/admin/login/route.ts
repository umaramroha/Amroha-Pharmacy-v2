import { rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";
import { resetRateLimit } from "@/lib/rateLimit";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
  lastPasswordChange?: string;
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

    // Rate limits (all fail-closed):
    //  - 5 attempts per 15 min for this email from this IP (a stranger cannot lock the admin out of their own IP)
    //  - 20 attempts per 15 min from one IP in total
    //  - 40 attempts per hour on this email from anywhere (ceiling against slow, spread-out guessing)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateKey = `admin-login:${cleanEmail}:${ip}`;
    const rateCheck = await rateLimit(rateKey, 5, 15 * 60 * 1000, { failOpen: false });
    const ipCheck = await rateLimit(`admin-login-ip:${ip}`, 20, 15 * 60 * 1000, { failOpen: false });
    const emailCheck = await rateLimit(`admin-login-email:${cleanEmail}`, 40, 60 * 60 * 1000, { failOpen: false });
    const blocked = [rateCheck, ipCheck, emailCheck].filter((r) => !r.allowed);

    if (blocked.length > 0) {
      const minutes = Math.ceil(Math.max(...blocked.map((r) => r.resetIn)) / 60000);
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
      await cookies(),
      adminSessionOptions
    );
    session.adminId = admin.id;
    session.email = admin.email;
    session.role = admin.role;
    session.isAdminLoggedIn = true;
    session.lastPasswordChange = admin.lastPasswordChange.toISOString();
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
