import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/kggg0b");
  const isLoginPage = pathname === "/kggg0b/login";

  if (!isAdminRoute || isLoginPage) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store, must-revalidate");
    return res;
  }

  const adminCookie = request.cookies.get("a2z-admin-session");

  if (!adminCookie) {
    const res = NextResponse.redirect(new URL("/kggg0b/login", request.url));
    res.headers.set("Cache-Control", "no-store, must-revalidate");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, must-revalidate");
  return res;
}

export const config = {
  matcher: ["/kggg0b/:path*"],
};
