import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { adminSessionOptions } from "@/lib/adminSession";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

export async function POST() {
  try {
    const session = await getIronSession<AdminSessionData>(
      cookies(),
      adminSessionOptions
    );
    session.destroy();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
