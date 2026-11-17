import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { unsubscribeByToken } from "@/lib/marketing";

export const dynamic = "force-dynamic";

// POST: used by our unsubscribe page (JSON body) and by mail apps' one-click button (token in the URL).
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const rate = await rateLimit("unsubscribe:" + ip, 30, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    let token = new URL(request.url).searchParams.get("t") || "";
    if (!token) {
      try {
        const body = await request.json();
        if (typeof body?.token === "string") token = body.token;
      } catch {
        // one-click mail apps send a form body, not JSON; the token is then in the URL
      }
    }
    if (!token) {
      return NextResponse.json({ error: "This unsubscribe link is not valid." }, { status: 400 });
    }

    const ok = await unsubscribeByToken(token);
    if (!ok) {
      return NextResponse.json({ error: "This unsubscribe link is not valid." }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// GET: if a mail app opens the link directly, show the normal page (nothing is changed by GET).
export async function GET(request: Request) {
  const t = new URL(request.url).searchParams.get("t") || "";
  return NextResponse.redirect(new URL("/unsubscribe?t=" + encodeURIComponent(t), request.url));
}
