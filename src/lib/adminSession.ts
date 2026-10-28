import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

export const defaultAdminSession: AdminSessionData = {
  isAdminLoggedIn: false,
};

export const adminSessionOptions: SessionOptions = {
  // Note: .env mein ADMIN_SESSION_PASSWORD use karna best practice hai
  password: process.env.ADMIN_SESSION_PASSWORD as string, 
  cookieName: "a2z-admin-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/"
  },
};

export async function getAdminSession() {
  const session = await getIronSession<AdminSessionData>(
    await cookies(),
    adminSessionOptions
  );
  return session;
}
