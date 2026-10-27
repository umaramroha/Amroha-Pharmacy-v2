"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Check your email for a reset link.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Enter your email and we'll send you a link to reset your password.</p>
        
        {status === "success" ? (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm mb-4 border border-emerald-100">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{message}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-primary hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}