import crypto from "crypto";
import { transporter, FROM_EMAIL } from "@/lib/email/mailer";
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
    const verificationToken = crypto.randomUUID();

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        mobile: mobile.trim(),
        password: hashedPassword,
        verificationToken: verificationToken,
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

    // Send verification email
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amrohapharmacy.vercel.app";
      const verifyUrl = `${siteUrl}/verify-email?token=${verificationToken}`;
      
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: cleanEmail,
        subject: "Verify your Amroha Pharmacy Account",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>Welcome ${name}!</h2>
            <p>Please click the button below to verify your email address and activate your account.</p>
            <a href="${verifyUrl}" style="display:inline-block; padding:10px 20px; background-color:#087F73; color:white; text-decoration:none; border-radius:5px; margin-top:10px;">Verify Email</a>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Verification email failed:", emailError);
    }

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
