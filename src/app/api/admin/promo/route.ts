import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";
import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";
import { SITE_URL } from "@/lib/marketing";
import {
  PROMO_BATCH_SIZE,
  PROMO_DAILY_LIMIT,
  buildPromoHtml,
  countPromoSentLast24h,
  getPromoRecipients,
  sendPromoTo,
  validatePromoInput,
} from "@/lib/promo";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getIronSession<AdminSessionData>(await cookies(), adminSessionOptions);
  return !!(session.isAdminLoggedIn && session.adminId);
}

// Numbers for the admin page.
export async function GET() {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [recipients, sentLast24h] = await Promise.all([getPromoRecipients(), countPromoSentLast24h()]);
    return NextResponse.json({
      recipients: recipients.length,
      sentLast24h,
      dailyLimit: PROMO_DAILY_LIMIT,
      remainingToday: Math.max(0, PROMO_DAILY_LIMIT - sentLast24h),
    });
  } catch (error) {
    console.error("Promo stats error:", error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

// action "test": one test mail to the admin address. action "send": the next batch of a campaign.
export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const checked = validatePromoInput(body);
    if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });
    const content = checked.content;

    if (body.action === "test") {
      if (!ADMIN_EMAIL) return NextResponse.json({ error: "Admin email is not set." }, { status: 400 });
      const subject = "[TEST] " + content.subject;
      try {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject,
          html: buildPromoHtml(content, "Test", SITE_URL + "/unsubscribe"),
        });
        await prisma.notificationLog.create({
          data: { event: "PROMO_TEST", audience: "ADMIN", toEmail: ADMIN_EMAIL, subject, status: "SENT" },
        });
      } catch (err) {
        console.error("Promo test failed:", err);
        return NextResponse.json({ error: "Could not send the test email." }, { status: 500 });
      }
      return NextResponse.json({ success: true, to: ADMIN_EMAIL });
    }

    if (body.action === "send") {
      const campaignId = typeof body.campaignId === "string" ? body.campaignId : "";
      if (!/^[a-zA-Z0-9-]{8,64}$/.test(campaignId)) {
        return NextResponse.json({ error: "Invalid campaign." }, { status: 400 });
      }

      const [recipients, done, sentLast24h] = await Promise.all([
        getPromoRecipients(),
        prisma.notificationLog.findMany({ where: { campaignId }, select: { toEmail: true } }),
        countPromoSentLast24h(),
      ]);
      const already = new Set(done.map((d: { toEmail: string }) => d.toEmail.toLowerCase()));
      const pending = recipients.filter((r) => !already.has(r.email));
      const remainingToday = Math.max(0, PROMO_DAILY_LIMIT - sentLast24h);
      const batch = pending.slice(0, Math.min(PROMO_BATCH_SIZE, remainingToday));

      let sent = 0;
      let failed = 0;
      for (const r of batch) {
        if (await sendPromoTo(r, content, campaignId)) sent++;
        else failed++;
      }

      const pendingAfter = pending.length - batch.length;
      const remainingAfter = Math.max(0, remainingToday - sent);
      return NextResponse.json({
        success: true,
        sent,
        failed,
        pending: pendingAfter,
        remainingToday: remainingAfter,
        limitReached: pendingAfter > 0 && remainingAfter === 0,
      });
    }

    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  } catch (error) {
    console.error("Promo send error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
