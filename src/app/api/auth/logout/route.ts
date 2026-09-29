import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST() {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    session.destroy();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
