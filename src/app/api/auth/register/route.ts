import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    // Rate limit based on IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateKey = `register:${ip}`;
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

    const { name, email, mobile, password } = await request.json();

    // Validation
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email exists
    const existing = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        mobile: mobile.trim(),
        password: hashedPassword,
      },
    });

    // Create session
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    session.userId = customer.id;
    session.email = customer.email;
    session.name = customer.name;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        createdAt: customer.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
