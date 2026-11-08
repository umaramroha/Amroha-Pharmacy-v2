"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Coupon = {
  id: string;
  code: string;
  type: "FLAT" | "PERCENT";
  value: number;
  minCartValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  firstOrderOnly: boolean;
  used: number;
  totalDiscount: number;
};

const EMPTY_FORM = {
  code: "",
  type: "FLAT",
  value: "",
  minCartValue: "0",
  maxDiscount: "",
  usageLimit: "",
  perUserLimit: "1",
  firstOrderOnly: false,
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

// ---- helpers ----
const IST = "Asia/Kolkata";

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: IST });
}

// Start date = beginning of that day (IST), expiry date = end of that day (IST)
function fromDateInput(d: string, endOfDay: boolean): string | null {
  if (!d) return null;
  const dt = new Date(d + (endOfDay ? "T23:59:59+05:30" : "T00:00:00+05:30"));
  return isNaN(dt.getTime()) ? null : dt.toISOString();
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: IST,
  });
}

function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function describe(c: Coupon): string {
  if (c.type === "PERCENT") {
    return c.value + "% off" + (c.maxDiscount ? " (max " + inr(c.maxDiscount) + ")" : "");
  }
  return inr(c.value) + " off";
}

function statusOf(c: Coupon, now: number): { label: string; cls: string } {
  if (!c.isActive) return { label: "Inactive", cls: "bg-gray-100 text-gray-600" };
  if (c.expiresAt && new Date(c.expiresAt).getTime() <= now) {
    return { label: "Expired", cls: "bg-red-100 text-red-700" };
  }
  if (c.startsAt && new Date(c.startsAt).getTime() > now) {
    return { label: "Scheduled", cls: "bg-blue-100 text-blue-700" };
  }
  if (c.usageLimit !== null && c.used >= c.usageLimit) {
    return { label: "Fully used", cls: "bg-amber-100 text-amber-700" };
  }
  return { label: "Active", cls: "bg-green-100 text-green-700" };
}

function validityText(c: Coupon): string {
  if (c.startsAt && c.expiresAt) return "Valid " + fmtDate(c.startsAt) + " to " + fmtDate(c.expiresAt);
  if (c.expiresAt) return "Expires " + fmtDate(c.expiresAt);
  if (c.startsAt) return "Starts " + fmtDate(c.startsAt);
  return "No expiry date";
}

const toNumOrNull = (s: string): number | null => (s.trim() === "" ? null : Number(s));
// ---- end helpers ----

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (c: Coupon) => {
    setEditingId(c.id);
    setFormData({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minCartValue: String(c.minCartValue),
      maxDiscount: c.maxDiscount === null ? "" : String(c.maxDiscount),
      usageLimit: c.usageLimit === null ? "" : String(c.usageLimit),
      perUserLimit: c.perUserLimit === null ? "" : String(c.perUserLimit),
      startsAt: toDateInput(c.startsAt),
      expiresAt: toDateInput(c.expiresAt),
      isActive: c.isActive,
      firstOrderOnly: c.firstOrderOnly,
    });
    setShowForm(true);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const value = Number(formData.value);
    if (!formData.value.trim() || !Number.isFinite(value)) {
      setError("Enter a valid discount value");
      return;
    }
    const minCartValue = formData.minCartValue.trim() === "" ? 0 : Number(formData.minCartValue);
    const maxDiscount = formData.type === "PERCENT" ? toNumOrNull(formData.maxDiscount) : null;
    const usageLimit = toNumOrNull(formData.usageLimit);
    const perUserLimit = toNumOrNull(formData.perUserLimit);
    const numbers = [minCartValue, maxDiscount, usageLimit, perUserLimit];
    if (numbers.some((n) => n !== null && !Number.isFinite(n))) {
      setError("Please enter valid numbers in all fields");
      return;
    }

    const payload: Record<string, unknown> = {
      type: formData.type,
      value,
      minCartValue,
      maxDiscount,
      usageLimit,
      perUserLimit,
      startsAt: fromDateInput(formData.startsAt, false),
      expiresAt: fromDateInput(formData.expiresAt, true),
      isActive: formData.isActive,
      firstOrderOnly: formData.firstOrderOnly,
    };
    if (!editingId) payload.code = formData.code.trim().toUpperCase();

    setSaving(true);
    try {
      const res = await fetch(
        editingId ? "/api/admin/coupons/" + editingId : "/api/admin/coupons",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to save coupon");
        return;
      }
      setMessage(editingId ? "Coupon updated" : "Coupon created");
      setShowForm(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      await fetchCoupons();
    } catch (err) {
      console.error("Save coupon error", err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (c: Coupon) => {
    try {
      const res = await fetch("/api/admin/coupons/" + c.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update coupon");
        return;
      }
      await fetchCoupons();
    } catch (err) {
      console.error("Toggle coupon error", err);
      alert("Network error. Please try again.");
    }
  };

  const handleDelete = async (c: Coupon) => {
    if (!confirm("Delete coupon " + c.code + "? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/coupons/" + c.id, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to delete coupon");
        return;
      }
      setMessage("Coupon deleted");
      await fetchCoupons();
    } catch (err) {
      console.error("Delete coupon error", err);
      alert("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const now = Date.now();
  const inputCls =
    "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <Link href="/kggg0b/dashboard" className="text-sm text-primary hover:underline">
            ← Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2">Coupons</h1>
          <p className="text-gray-600 text-sm mt-1">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleNew}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition"
          >
            + Add Coupon
          </button>
        )}
      </div>

      {message && !showForm && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-primary">
            {editingId ? "Edit Coupon" : "Add New Coupon"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  disabled={!!editingId}
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                    })
                  }
                  className={inputCls + " font-mono uppercase disabled:bg-gray-100"}
                  placeholder="FLAT50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-20 characters: letters, numbers, - or _. Cannot be changed later.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={inputCls}
                >
                  <option value="FLAT">Flat amount off (Rs)</option>
                  <option value="PERCENT">Percentage off (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === "PERCENT" ? "Discount Percent (%) *" : "Discount Amount (₹) *"}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className={inputCls}
                  placeholder={formData.type === "PERCENT" ? "10" : "50"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Cart Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.minCartValue}
                  onChange={(e) => setFormData({ ...formData, minCartValue: e.target.value })}
                  className={inputCls}
                  placeholder="0"
                />
              </div>

              {formData.type === "PERCENT" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className={inputCls}
                    placeholder="No limit"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upper limit for percentage coupons. Leave empty for no limit.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className={inputCls}
                  placeholder="Unlimited"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many orders can use this coupon in total. Cancelled orders do not count.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Uses Per Customer
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.perUserLimit}
                  onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                  className={inputCls}
                  placeholder="Unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className={inputCls}
                />
                <p className="text-xs text-gray-500 mt-1">
                  The coupon works until the end of this day (IST). Leave empty for no expiry.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.firstOrderOnly}
                onChange={(e) => setFormData({ ...formData, firstOrderOnly: e.target.checked })}
                className="w-4 h-4"
              />
              First order only (works only for customers with no earlier order)
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              Active (customers can use it)
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-lg border p-10 text-center text-gray-500">
          No coupons yet. Click + Add Coupon to create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => {
            const st = statusOf(c, now);
            return (
              <div
                key={c.id}
                className="bg-white rounded-lg shadow-sm border p-4 flex flex-col md:flex-row md:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-lg text-primary tracking-wide">
                      {c.code}
                    </span>
                    <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + st.cls}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mt-1">
                    {describe(c)}
                    {c.minCartValue > 0 ? " on orders above " + inr(c.minCartValue) : ""}
                    {c.firstOrderOnly ? " · First order only" : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Used {c.used}
                    {c.usageLimit !== null ? " of " + c.usageLimit : ""} times
                    {c.perUserLimit !== null ? " · " + c.perUserLimit + " per customer" : ""}
                    {c.totalDiscount > 0 ? " · " + inr(c.totalDiscount) + " given" : ""}
                  </p>
                  <p className="text-xs text-gray-500">{validityText(c)}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggle(c)}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition"
                  >
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="px-3 py-1.5 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
