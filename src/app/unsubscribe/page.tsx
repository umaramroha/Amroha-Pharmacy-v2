"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function UnsubscribeContent() {
  const token = useSearchParams().get("t") || "";
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    setState("working");
    setMessage("");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }
      setState("done");
    } catch {
      setState("error");
      setMessage("Network problem. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
        {!token ? (
          <>
            <h1 className="text-2xl font-bold text-primary mb-2">Link not valid</h1>
            <p className="text-sm text-gray-600 mb-6">
              This unsubscribe link is incomplete. Please use the link in the email you received, or contact us and we will help.
            </p>
            <Link href="/contact" className="text-primary font-semibold hover:underline">
              Contact us
            </Link>
          </>
        ) : state === "done" ? (
          <>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You have been unsubscribed</h1>
            <p className="text-sm text-gray-600 mb-6">
              You will no longer receive promotional emails from Amroha Pharmacy. Emails about your orders and account will continue.
            </p>
            <Link href="/" className="text-primary font-semibold hover:underline">
              Back to home
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary mb-2">Unsubscribe from offers</h1>
            <p className="text-sm text-gray-600 mb-6">
              Click the button below to stop receiving promotional emails from Amroha Pharmacy. Emails about your orders and account will continue.
            </p>
            {state === "error" && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{message}</div>
            )}
            <button
              onClick={handleUnsubscribe}
              disabled={state === "working"}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
            >
              {state === "working" ? "Please wait..." : "Unsubscribe"}
            </button>
            <p className="mt-4 text-xs text-gray-500">
              Changed your mind? Simply close this page and nothing will change.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeContent />
    </Suspense>
  );
}
