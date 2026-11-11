import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import { transporter, FROM_EMAIL } from "@/lib/email/mailer";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getIronSession<AdminSessionData>(await cookies(), adminSessionOptions);
    if (!session.isAdminLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rate = await rateLimit("admin-resend:" + session.adminId, 30, 60 * 60 * 1000, { failOpen: false });
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many re-send attempts. Please try again later." }, { status: 429 });
    }

    const { id } = await props.params;
    const log = await prisma.notificationLog.findUnique({ where: { id } });
    if (!log) return NextResponse.json({ error: "Log entry not found" }, { status: 404 });
    if (log.status !== "FAILED" || !log.html) {
      return NextResponse.json({ error: "This email cannot be re-sent." }, { status: 400 });
    }

    try {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: log.toEmail,
        subject: log.subject,
        html: log.html,
      });
    } catch (err) {
      const message = (err instanceof Error ? err.message : String(err)).slice(0, 500);
      await prisma.notificationLog.update({ where: { id }, data: { error: message } });
      return NextResponse.json({ error: "Sending failed again: " + message }, { status: 502 });
    }

    await prisma.notificationLog.update({
      where: { id },
      data: { status: "SENT", error: null, html: null },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin resend error:", error);
    return NextResponse.json({ error: "Failed to re-send email" }, { status: 500 });
  }
}
