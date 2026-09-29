import nodemailer from "nodemailer";

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn(
    "⚠️ GMAIL_USER or GMAIL_APP_PASSWORD not set. Emails will not be sent."
  );
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const FROM_EMAIL = `"Amroha Pharmacy" <${process.env.GMAIL_USER}>`;
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || process.env.GMAIL_USER || "";
