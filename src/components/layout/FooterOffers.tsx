"use client";

import { useState } from "react";

export default function FooterOffers() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "working") return;
    setState("working");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }
      setState("done");
      setMessage(data.message || "Please check your email to confirm.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network problem. Please try again.");
    }
  };

  return (
    <div className="mb-6 max-w-md rounded-xl bg-white/10 p-4">
      <h3 className="text-sm font-bold mb-1">Get offers and health tips by email</h3>
      <p className="text-xs opacity-80 mb-3">
        We will send you a link to confirm your email. You can unsubscribe at any time.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          aria-label="Email address"
          className="flex-1 min-w-0 rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "working"}
          className="shrink-0 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-gray-900 transition hover:opacity-90 disabled:opacity-50"
        >
          {state === "working" ? "..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p className={"mt-2 text-xs " + (state === "error" ? "text-red-200" : "text-emerald-200")}>{message}</p>
      )}
    </div>
  );
}
