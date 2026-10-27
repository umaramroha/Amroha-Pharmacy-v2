import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { transporter, FROM_EMAIL } from "@/lib/email/mailer";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const ForgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting (Prevent spam)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const rateCheck = await rateLimit(`forgot-password:${ip}`, 3, 15 * 60 * 1000, { failOpen: false });
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    // 2. Validate Input
    const body = await request.json();
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const cleanEmail = parsed.data.email.toLowerCase().trim();
    const customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });

    // 3. If user exists, generate token and send email
    if (customer) {
      const resetToken = crypto.randomUUID();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // Valid for 1 hour

      await prisma.customer.update({
        where: { id: customer.id },
        data: { resetToken, resetTokenExpiry },
      });

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amrohapharmacy.vercel.app";
      const resetUrl = `${siteUrl}/reset-password?token=${resetToken}`;

      try {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: cleanEmail,
          subject: "Reset your Amroha Pharmacy Password",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
              <h2>Password Reset Request</h2>
              <p>Hello ${customer.name},</p>
              <p>We received a request to reset your password. Click the button below to set a new password.</p>
              <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; background-color:#087F73; color:white; text-decoration:none; border-radius:5px; margin-top:10px;">Reset Password</a>
              <p style="margin-top:20px; font-size:12px; color:#666;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Password reset email failed:", emailError);
        // Hum user ko error nahi dikhayenge agar email fail ho jaye, security reasons ki wajah se.
      }
    }

    // 4. Always return success (Security: Taaki hacker pata na laga sake ki email exist karti hai ya nahi)
    return NextResponse.json({ 
      success: true, 
      message: "If an account with that email exists, a reset link has been sent." 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
