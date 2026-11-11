import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";
import { escapeHtml } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amrohapharmacy.vercel.app";
const LOW_STOCK_LIMIT = 5;

type LogEntry = {
  event: string;
  audience: "CUSTOMER" | "ADMIN";
  toEmail: string;
  subject: string;
  status: "SENT" | "FAILED";
  error?: string;
  html?: string;
  orderId?: string;
};

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

// Saves one row in NotificationLog. The HTML is kept only for FAILED emails (so they can be re-sent).
async function logEmail(entry: LogEntry): Promise<void> {
  try {
    await prisma.notificationLog.create({
      data: {
        event: entry.event,
        audience: entry.audience,
        toEmail: entry.toEmail,
        subject: entry.subject,
        status: entry.status,
        error: entry.error ? entry.error.slice(0, 500) : null,
        html: entry.status === "FAILED" ? entry.html ?? null : null,
        orderId: entry.orderId ?? null,
      },
    });
  } catch (err) {
    console.error("[notify] could not write log entry", err);
  }
}

// Every function here NEVER throws: a failed email must not break an order.
// Failures are written to the server log (Vercel Logs) as "[notify] <event>: ... FAILED".

export async function sendCustomerEmail(opts: {
  event: string;
  to: string;
  subject: string;
  html: string;
  orderId?: string;
}): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: opts.to,
      replyTo: ADMIN_EMAIL || undefined,
      subject: opts.subject,
      html: opts.html,
    });
    console.log("[notify] " + opts.event + ": customer email sent");
    await logEmail({ event: opts.event, audience: "CUSTOMER", toEmail: opts.to, subject: opts.subject, status: "SENT", orderId: opts.orderId });
    return true;
  } catch (err) {
    console.error("[notify] " + opts.event + ": customer email FAILED", err);
    await logEmail({ event: opts.event, audience: "CUSTOMER", toEmail: opts.to, subject: opts.subject, status: "FAILED", error: errMsg(err), html: opts.html, orderId: opts.orderId });
    return false;
  }
}

export async function sendAdminEmail(opts: {
  event: string;
  subject: string;
  html: string;
  orderId?: string;
}): Promise<boolean> {
  if (!ADMIN_EMAIL) {
    console.error("[notify] " + opts.event + ": ADMIN_EMAIL is not set, admin email skipped");
    await logEmail({ event: opts.event, audience: "ADMIN", toEmail: "(ADMIN_EMAIL not set)", subject: opts.subject, status: "FAILED", error: "ADMIN_EMAIL is not set", orderId: opts.orderId });
    return false;
  }
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: opts.subject,
      html: opts.html,
    });
    console.log("[notify] " + opts.event + ": admin email sent");
    await logEmail({ event: opts.event, audience: "ADMIN", toEmail: ADMIN_EMAIL, subject: opts.subject, status: "SENT", orderId: opts.orderId });
    return true;
  } catch (err) {
    console.error("[notify] " + opts.event + ": admin email FAILED", err);
    await logEmail({ event: opts.event, audience: "ADMIN", toEmail: ADMIN_EMAIL, subject: opts.subject, status: "FAILED", error: errMsg(err), html: opts.html, orderId: opts.orderId });
    return false;
  }
}

export type AlertOrder = {
  id: string;
  customerName: string;
  customerMobile?: string | null;
  total: { toString(): string } | number | string;
  paymentMethod: string;
  paymentStatus?: string;
  status?: string;
};

function line(label: string, value: string): string {
  return (
    '<p style="margin:6px 0;font-size:14px;color:#374151"><strong>' +
    escapeHtml(label) +
    ":</strong> " +
    escapeHtml(value) +
    "</p>"
  );
}

// Simple alert email for the admin: a title, a few lines and (optionally) the order details.
export async function sendAdminAlert(opts: {
  event: string;
  subject: string;
  title: string;
  color?: string;
  order?: AlertOrder;
  lines?: string[];
}): Promise<boolean> {
  const color = opts.color || "#0F766E";
  let body = "";

  for (const l of opts.lines || []) {
    body += '<p style="margin:8px 0;font-size:15px;color:#1f2937">' + escapeHtml(l) + "</p>";
  }

  if (opts.order) {
    const o = opts.order;
    body += '<hr style="border:none;border-top:1px solid #e5e7eb;margin:15px 0" />';
    body += line("Order ID", "#" + o.id.slice(-8).toUpperCase());
    body += line("Customer", o.customerName);
    if (o.customerMobile) body += line("Mobile", o.customerMobile);
    body += line("Total", "₹" + Number(o.total.toString()).toLocaleString("en-IN"));
    body += line("Payment", o.paymentMethod.toUpperCase() + (o.paymentStatus ? " (" + o.paymentStatus + ")" : ""));
    if (o.status) body += line("Order status", o.status);
    body +=
      '<a href="' +
      SITE_URL +
      '/kggg0b/orders" style="display:inline-block;margin-top:12px;background-color:#0F766E;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold">View in Admin Panel →</a>';
  }

  const html =
    '<div style="font-family:Arial,sans-serif;padding:20px;background-color:#f8fafc">' +
    '<div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:25px;border-radius:12px">' +
    '<h2 style="color:' +
    color +
    ';margin-top:0">' +
    escapeHtml(opts.title) +
    "</h2>" +
    body +
    "</div></div>";

  return sendAdminEmail({ event: opts.event, subject: opts.subject, html, orderId: opts.order?.id });
}

// After an order: email the admin if any ordered product is now low or out of stock.
export async function alertLowStock(productIds: string[]): Promise<void> {
  try {
    if (productIds.length === 0) return;
    const low = await prisma.product.findMany({
      where: { id: { in: productIds }, stock: { lte: LOW_STOCK_LIMIT } },
      select: { name: true, stock: true },
    });
    if (low.length === 0) return;
    await sendAdminAlert({
      event: "low-stock",
      subject: "⚠️ Low stock: " + low.map((p) => p.name).join(", "),
      title: "Low stock warning",
      color: "#d97706",
      lines: low.map((p) => p.name + ": " + (p.stock === 0 ? "OUT OF STOCK" : p.stock + " left")),
    });
  } catch (err) {
    console.error("[notify] low-stock: check FAILED", err);
  }
}
