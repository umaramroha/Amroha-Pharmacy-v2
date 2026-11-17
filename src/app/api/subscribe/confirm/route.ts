import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const rate = await rateLimit("subscribe-confirm:" + ip, 30, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token : "";
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json({ error: "This confirmation link is not valid." }, { status: 400 });
    }

    const row = await prisma.emailSubscriber.findFirst({ where: { confirmToken: token }, select: { id: true } });
    if (!row) {
      return NextResponse.json({ error: "This confirmation link is not valid or was already used." }, { status: 400 });
    }

    await prisma.emailSubscriber.update({
      where: { id: row.id },
      data: { confirmedAt: new Date(), confirmToken: null, optedOutAt: null },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe confirm error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
