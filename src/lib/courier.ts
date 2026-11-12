// Courier choices shown in the admin panel, and validation for courier / tracking input.
export const COURIERS = [
  "Blue Dart",
  "Delhivery",
  "DTDC",
  "India Post (Speed Post)",
  "Ecom Express",
  "Xpressbees",
  "Shiprocket",
  "Other",
] as const;

type Parsed = { ok: true; value: string | null } | { ok: false };

export function parseCourier(v: unknown): Parsed {
  if (v === null || v === undefined || v === "") return { ok: true, value: null };
  if (typeof v !== "string" || !(COURIERS as readonly string[]).includes(v)) return { ok: false };
  return { ok: true, value: v };
}

export function parseTracking(v: unknown): Parsed {
  if (v === null || v === undefined) return { ok: true, value: null };
  if (typeof v !== "string") return { ok: false };
  const t = v.trim();
  if (!t) return { ok: true, value: null };
  if (t.length > 40 || !/^[A-Za-z0-9\-\/ ]+$/.test(t)) return { ok: false };
  return { ok: true, value: t };
}
