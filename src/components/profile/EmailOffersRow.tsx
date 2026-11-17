"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function EmailOffersRow() {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const on = user?.marketingOptIn === true;

  const toggle = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/auth/marketing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optIn: !on }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save your choice. Please try again.");
      } else {
        await refreshUser();
      }
    } catch {
      setError("Network problem. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Email Offers</p>
          <p className="text-xs font-medium text-gray-800 mt-0.5">
            {on ? "You receive offers and health tips" : "Not subscribed to offers"}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Receive offers and health tips by email"
          onClick={toggle}
          disabled={saving}
          className={
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 " +
            (on ? "bg-primary" : "bg-gray-300")
          }
        >
          <span
            className={
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition " +
              (on ? "translate-x-5" : "translate-x-0.5")
            }
          />
        </button>
      </div>
      {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
