"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing reset token.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (!token) {
    return <div className="text-center p-8 text-red-600">Invalid reset link. Please request a new one.</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Set New Password</h1>
      
      {status === "success" ? (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm mb-4 border border-emerald-100">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "error" && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{message}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-primary hover:underline font-medium">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}