import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";
import { escapeHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "Subject is too short")
    .max(150, "Subject is too long")
    .refine((s) => !/[\r\n]/.test(s), "Subject cannot contain line breaks"),
  message: z
    .string()
    .trim()
    .min(5, "Message is too short")
    .max(3000, "Message is too long"),
});

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getIronSession<AdminSessionData>(await cookies(), adminSessionOptions);
    if (!session.isAdminLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { subject, message } = parsed.data;

    // 30 emails per hour per admin (protects the Gmail account from being blocked)
    const rate = await rateLimit("admin-customer-mail:" + session.adminId, 30, 60 * 60 * 1000, { failOpen: false });
    if (!rate.allowed) {
      const minutes = Math.ceil(rate.resetIn / 60000);
      return NextResponse.json(
        { error: "Email limit reached. Try again in " + minutes + " minute" + (minutes > 1 ? "s" : "") + "." },
        { status: 429 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { name: true, email: true },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const html =
      '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;color:#1f2937;font-size:15px;line-height:1.6">' +
      "<p>Hello " + escapeHtml(customer.name) + ",</p>" +
      "<div>" + escapeHtml(message).replace(/\n/g, "<br>") + "</div>" +
      '<p style="margin-top:24px">Regards,<br><strong>Amroha Pharmacy</strong><br>' +
      '<a href="https://amrohapharmacy.vercel.app">amrohapharmacy.vercel.app</a></p></div>';

    const text = "Hello " + customer.name + ",\n\n" + message + "\n\nRegards,\nAmroha Pharmacy";

    try {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: customer.email,
        replyTo: ADMIN_EMAIL || undefined,
        subject,
        text,
        html,
      });
    } catch (mailErr) {
      console.error("Admin customer email failed:", mailErr);
      return NextResponse.json({ error: "Could not send email. Please try again later." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin customer email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
