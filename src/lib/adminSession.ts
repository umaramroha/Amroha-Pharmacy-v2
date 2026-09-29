import { SessionOptions } from "iron-session";

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
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "a2z-admin-session", // <-- Alag cookie name
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/"
  },
};
