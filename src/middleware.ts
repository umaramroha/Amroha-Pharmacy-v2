import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/kggg0b/login") return NextResponse.next();
  
  const res = NextResponse.next();
  let session;
  try {
    session = await getIronSession<AdminSessionData>(req, res, adminSessionOptions);
  } catch (err) {
    console.error("Admin session middleware error:", err);
    return NextResponse.redirect(new URL("/kggg0b/login", req.url));
  }
  
  if (!session.isAdminLoggedIn || !session.adminId) {
    return NextResponse.redirect(new URL("/kggg0b/login", req.url));
  }
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/kggg0b/:path*"],
};