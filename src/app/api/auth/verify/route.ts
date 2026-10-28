import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    // 1. Strict type check to prevent Prisma object injection
    if (typeof token !== "string" || token.trim() === "") {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
    }

    // 2. Find customer with matching token AND check if it's not expired
    const customer = await prisma.customer.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { gt: new Date() }, // Token must be greater than current time
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 });
    }

    // 3. Mark as verified and clear the token so it can't be reused
    await prisma.customer.update({
      where: { id: customer.id },
      data: { 
        isVerified: true, 
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
