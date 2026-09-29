"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
          Kuch galat ho gaya
        </h1>
        <p className="text-gray-600 mb-8">
          Page load karne me problem aayi. Thoda wait karke dobara try karo.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Go Home
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-400 mt-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
