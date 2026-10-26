import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "Token is required" }, { status: 400 });

    const customer = await prisma.customer.findFirst({ where: { verificationToken: token } });
    if (!customer) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    await prisma.customer.update({
      where: { id: customer.id },
      data: { isVerified: true, verificationToken: null },
    });
    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}