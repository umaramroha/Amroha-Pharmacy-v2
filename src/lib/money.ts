// Shows rupee amounts the same way everywhere: whole rupees without decimals (₹800),
// amounts with paise always with two decimals (₹799.10).
export function formatINR(value: string | number | null | undefined): string {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  const safe = Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
  return (
    "₹" +
    safe.toLocaleString("en-IN", {
      minimumFractionDigits: Number.isInteger(safe) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}
