import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Promotional email helpers: signed unsubscribe links and opt-out.
// Promo mail goes only to people who clearly opted in (signup checkbox, My Account switch,
// or a confirmed footer sign-up). Order and account emails are not affected by any of this.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amrohapharmacy.vercel.app";

// "c" = Customer row, "s" = EmailSubscriber row
export type RecipientKind = "c" | "s";

function secret(): string {
  const s = process.env.SESSION_PASSWORD;
  if (!s) throw new Error("SESSION_PASSWORD is not set");
  return s;
}

// The signature covers a fixed label, so a token made here cannot be used for anything else.
function sign(kind: RecipientKind, id: string): string {
  return crypto.createHmac("sha256", secret()).update("unsubscribe|" + kind + "|" + id).digest("base64url");
}

export function makeUnsubscribeToken(kind: RecipientKind, id: string): string {
  return kind + "." + id + "." + sign(kind, id);
}

export function parseUnsubscribeToken(token: string): { kind: RecipientKind; id: string } | null {
  if (typeof token !== "string" || token.length > 200) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [kind, id, sig] = parts;
  if ((kind !== "c" && kind !== "s") || !/^[A-Za-z0-9_-]{5,64}$/.test(id)) return null;

  let expected: string;
  try {
    expected = sign(kind, id);
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return { kind, id };
}

// Link shown in the email footer (opens the unsubscribe page).
export function unsubscribePageUrl(kind: RecipientKind, id: string): string {
  return SITE_URL + "/unsubscribe?t=" + makeUnsubscribeToken(kind, id);
}

// Link for the mail app's own "Unsubscribe" button (List-Unsubscribe header, one click).
export function unsubscribeOneClickUrl(kind: RecipientKind, id: string): string {
  return SITE_URL + "/api/unsubscribe?t=" + makeUnsubscribeToken(kind, id);
}

// Turns promo mail OFF for this email address everywhere (customer account and footer sign-up).
export async function optOutEmail(email: string): Promise<void> {
  const clean = email.toLowerCase().trim();
  const now = new Date();
  await prisma.customer.updateMany({
    where: { email: clean, marketingOptIn: true },
    data: { marketingOptIn: false, marketingOptOutAt: now },
  });
  await prisma.emailSubscriber.updateMany({
    where: { email: clean, optedOutAt: null },
    data: { optedOutAt: now },
  });
}

// Returns true when the token is valid and the person exists (and is now opted out).
export async function unsubscribeByToken(token: string): Promise<boolean> {
  const parsed = parseUnsubscribeToken(token);
  if (!parsed) return false;

  let email: string | null = null;
  if (parsed.kind === "c") {
    const row = await prisma.customer.findUnique({ where: { id: parsed.id }, select: { email: true } });
    email = row ? row.email : null;
  } else {
    const row = await prisma.emailSubscriber.findUnique({ where: { id: parsed.id }, select: { email: true } });
    email = row ? row.email : null;
  }
  if (!email) return false;

  await optOutEmail(email);
  return true;
}
