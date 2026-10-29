import { escapeHtml } from "@/lib/utils";
import crypto from "crypto";
import { transporter, FROM_EMAIL } from "@/lib/email/mailer";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  // Zod's .email() is strict and handles the mkk.@gmail.com edge case properly
  email: z.string().trim().email("Please enter a valid email address"), 
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const rateCheck = await rateLimit(`register:${ip}`, 5, 15 * 60 * 1000, { failOpen: false });
    if (!rateCheck.allowed) return NextResponse.json({ error: "Too many attempts. Please try later." }, { status: 429 });

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const { name, email, mobile, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.customer.findUnique({ where: { email: cleanEmail } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    // Create unverified customer
    const customer = await prisma.customer.create({
      data: {
        name: name.trim(), email: cleanEmail, mobile: mobile.trim(),
        password: hashedPassword, isVerified: false, verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Send verification email
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amrohapharmacy.vercel.app";
      const verifyUrl = `${siteUrl}/verify-email?token=${verificationToken}`;
      
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: cleanEmail,
        subject: "Verify your Amroha Pharmacy Account",
        html: `<div style="text-align: center;"><h2>Welcome ${escapeHtml(name)}!</h2><p>Click below to verify your account:</p><a href="${verifyUrl}">Verify Email</a></div>`,
      });
    } catch (emailError) {
      // If email fails, delete the user so they can try again without email conflict
      await prisma.customer.delete({ where: { id: customer.id } });
      console.error("Verification email failed:", emailError);
      return NextResponse.json({ error: "Failed to send verification email. Please check your email address or try again later." }, { status: 500 });
    }

    // DO NOT auto-login. User must verify first.
    return NextResponse.json({ success: true, message: "Registration successful. Please check your email to verify." });

  } catch (error: any) {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
