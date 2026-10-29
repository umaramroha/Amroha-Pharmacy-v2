import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ResetPasswordSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { token, password } = parsed.data;

    // 1. Find user by valid token
    const customer = await prisma.customer.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // Check if token is not expired
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link. Please request a new one." },
        { status: 400 }
      );
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update password and clear the reset token
    const updated = await prisma.customer.updateMany({
      where: { id: customer.id, resetToken: token },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null, lastPasswordChange: new Date() },
    });
    if (updated.count !== 1) {
      return NextResponse.json({ error: "Token already used or invalid." }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successfully. You can now log in." 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
