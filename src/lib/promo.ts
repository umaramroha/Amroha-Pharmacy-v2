import { prisma } from "@/lib/prisma";
import { transporter, FROM_EMAIL } from "@/lib/email/mailer";
import { escapeHtml } from "@/lib/utils";
import { RecipientKind, unsubscribePageUrl, unsubscribeOneClickUrl } from "@/lib/marketing";

// Gmail allows roughly 500 mails a day in total. Promo stays well below that so order mails are never blocked.
export const PROMO_DAILY_LIMIT = 100;
// Mails sent per request (keeps each request short; the admin page repeats it automatically).
export const PROMO_BATCH_SIZE = 10;

export type PromoRecipient = { email: string; name: string | null; kind: RecipientKind; id: string };

export type PromoContent = {
  subject: string;
  heading: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
};

// Only people who opted in: verified customers with the switch/checkbox ON, and confirmed footer subscribers.
export async function getPromoRecipients(): Promise<PromoRecipient[]> {
  const [customers, subscribers] = await Promise.all([
    prisma.customer.findMany({
      where: { marketingOptIn: true, isVerified: true },
      select: { id: true, email: true, name: true },
    }),
    prisma.emailSubscriber.findMany({
      where: { confirmedAt: { not: null }, optedOutAt: null },
      select: { id: true, email: true },
    }),
  ]);

  const map = new Map<string, PromoRecipient>();
  for (const c of customers) {
    map.set(c.email.toLowerCase(), { email: c.email.toLowerCase(), name: c.name, kind: "c", id: c.id });
  }
  for (const s of subscribers) {
    const key = s.email.toLowerCase();
    if (!map.has(key)) map.set(key, { email: key, name: null, kind: "s", id: s.id });
  }
  return Array.from(map.values());
}

export async function countPromoSentLast24h(): Promise<number> {
  return prisma.notificationLog.count({
    where: { event: "PROMO", status: "SENT", createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
}

export function validatePromoInput(body: unknown): { ok: true; content: PromoContent } | { ok: false; error: string } {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const content: PromoContent = {
    subject: str(b.subject),
    heading: str(b.heading),
    message: str(b.message),
    buttonText: str(b.buttonText),
    buttonUrl: str(b.buttonUrl),
  };
  if (content.subject.length < 3 || content.subject.length > 120) return { ok: false, error: "Subject must be 3 to 120 characters." };
  if (content.heading.length > 120) return { ok: false, error: "Heading is too long (max 120 characters)." };
  if (content.message.length < 10 || content.message.length > 3000) return { ok: false, error: "Message must be 10 to 3000 characters." };
  if (!!content.buttonText !== !!content.buttonUrl) return { ok: false, error: "Fill both button text and button link, or leave both empty." };
  if (content.buttonText) {
    if (content.buttonText.length > 40) return { ok: false, error: "Button text is too long (max 40 characters)." };
    let u: URL;
    try {
      u = new URL(content.buttonUrl);
    } catch {
      return { ok: false, error: "Button link must be a full web address starting with https://" };
    }
    if (u.protocol !== "https:" || content.buttonUrl.length > 500) return { ok: false, error: "Button link must start with https://" };
  }
  return { ok: true, content };
}

function paragraphs(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => '<p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0 0 14px;">' + escapeHtml(p).replace(/\n/g, "<br>") + "</p>")
    .join("");
}

export function buildPromoHtml(content: PromoContent, name: string | null, unsubscribeUrl: string): string {
  const greeting = name ? "Dear <strong>" + escapeHtml(name) + "</strong>," : "Hello,";
  const heading = content.heading
    ? '<h2 style="font-size: 20px; color: #0F766E; margin: 0 0 14px;">' + escapeHtml(content.heading) + "</h2>"
    : "";
  const button = content.buttonText
    ? '<p style="text-align: center; margin: 22px 0;"><a href="' + escapeHtml(content.buttonUrl) + '" style="display: inline-block; background-color: #0F766E; color: #ffffff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 14px;">' + escapeHtml(content.buttonText) + "</a></p>"
    : "";

  return (
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: Arial, sans-serif;">' +
    '<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">' +
    '<div style="background-color: #0F766E; padding: 22px 20px; text-align: center;"><h1 style="color: #ffffff; margin: 0; font-size: 22px;">Amroha Pharmacy</h1></div>' +
    '<div style="padding: 28px 25px;">' +
    '<p style="font-size: 15px; color: #1f2937; margin: 0 0 14px;">' + greeting + "</p>" +
    heading +
    paragraphs(content.message) +
    button +
    "</div>" +
    '<div style="padding: 18px 25px; background-color: #f1f5f9; text-align: center;">' +
    '<p style="font-size: 11px; color: #6b7280; line-height: 1.6; margin: 0 0 8px;">This email is for general information and is not medical advice. Please consult a doctor for any health problem.</p>' +
    '<p style="font-size: 11px; color: #6b7280; line-height: 1.6; margin: 0;">You are receiving this because you chose to receive offers from Amroha Pharmacy, Amroha, Uttar Pradesh, India.<br><a href="' + escapeHtml(unsubscribeUrl) + '" style="color: #0F766E;">Unsubscribe</a></p>' +
    "</div></div></body></html>"
  );
}

// Sends one promo mail and writes one row in the Email Log. Never throws.
export async function sendPromoTo(r: PromoRecipient, content: PromoContent, campaignId: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: r.email,
      subject: content.subject,
      html: buildPromoHtml(content, r.name, unsubscribePageUrl(r.kind, r.id)),
      headers: {
        "List-Unsubscribe": "<" + unsubscribeOneClickUrl(r.kind, r.id) + ">",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    await logPromo(r.email, content.subject, "SENT", campaignId);
    return true;
  } catch (err) {
    console.error("[promo] send failed", err);
    await logPromo(r.email, content.subject, "FAILED", campaignId, err instanceof Error ? err.message : String(err));
    return false;
  }
}

async function logPromo(toEmail: string, subject: string, status: "SENT" | "FAILED", campaignId: string, error?: string) {
  try {
    // No html is stored, so a failed promo can never be re-sent later to someone who has since unsubscribed.
    await prisma.notificationLog.create({
      data: { event: "PROMO", audience: "CUSTOMER", toEmail, subject, status, error: error ? error.slice(0, 500) : null, html: null, campaignId },
    });
  } catch (err) {
    console.error("[promo] could not write log entry", err);
  }
}
