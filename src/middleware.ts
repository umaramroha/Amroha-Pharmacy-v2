import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/kggg0b/login") return NextResponse.next();
  
  const res = NextResponse.next();
  const session = await getIronSession<AdminSessionData>(req, res, adminSessionOptions);
  
  if (!session.isAdminLoggedIn) {
    return NextResponse.redirect(new URL("/kggg0b/login", req.url));
  }
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/kggg0b/:path*"],
};