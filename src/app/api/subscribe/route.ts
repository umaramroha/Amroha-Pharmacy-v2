import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { transporter, FROM_EMAIL } from "@/lib/email/mailer";
import { SITE_URL } from "@/lib/marketing";

export const dynamic = "force-dynamic";

const EmailSchema = z.string().trim().email("Please enter a valid email address").max(120);
const OK_MESSAGE = "Almost done. Please check your email and click the link to confirm your subscription.";

// Footer "Get offers" box. Nobody receives promo mail until they click the confirmation link (double opt-in).
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const ipRate = await rateLimit("subscribe:" + ip, 5, 60 * 60 * 1000, { failOpen: false });
    if (!ipRate.allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = EmailSchema.safeParse(body?.email);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const email = parsed.data.toLowerCase();

    const emailRate = await rateLimit("subscribe-email:" + email, 3, 24 * 60 * 60 * 1000, { failOpen: false });
    if (!emailRate.allowed) {
      return NextResponse.json({ error: "Too many attempts for this email. Please try again tomorrow." }, { status: 429 });
    }

    const existing = await prisma.emailSubscriber.findUnique({ where: { email } });
    // Already subscribed: say the same thing, send nothing (does not reveal who is on the list).
    if (existing && existing.confirmedAt && !existing.optedOutAt) {
      return NextResponse.json({ success: true, message: OK_MESSAGE });
    }

    const token = crypto.randomBytes(32).toString("hex");
    let createdId: string | null = null;
    if (existing) {
      await prisma.emailSubscriber.update({
        where: { email },
        data: { confirmToken: token, confirmedAt: null, optedOutAt: null },
      });
    } else {
      const row = await prisma.emailSubscriber.create({ data: { email, confirmToken: token } });
      createdId = row.id;
    }

    try {
      const confirmUrl = SITE_URL + "/confirm-subscription?token=" + token;
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: "Please confirm your subscription to Amroha Pharmacy offers",
        html:
          '<div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; text-align: center;">' +
          '<h2 style="color: #0F766E;">Amroha Pharmacy</h2>' +
          "<p>Hello,</p>" +
          "<p>Someone asked to receive offers and health tips from Amroha Pharmacy at this email address. Please confirm by clicking the button below.</p>" +
          '<p><a href="' + confirmUrl + '" style="display: inline-block; background: #0F766E; color: #ffffff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold;">Confirm subscription</a></p>' +
          '<p style="font-size: 12px; color: #6b7280;">If this was not you, simply ignore this email and you will not receive any offers.</p>' +
          "</div>",
      });
    } catch (mailError) {
      console.error("Subscription confirmation email failed:", mailError);
      if (createdId) await prisma.emailSubscriber.delete({ where: { id: createdId } }).catch(() => undefined);
      return NextResponse.json({ error: "Could not send the confirmation email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: OK_MESSAGE });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
