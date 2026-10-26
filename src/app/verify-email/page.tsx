"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) { setStatus("No verification token provided."); return; }
    fetch("/api/auth/verify", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok) { 
        setStatus("Email Verified Successfully! Redirecting to login..."); 
        setTimeout(() => router.push("/login"), 2000); 
      } else { 
        setStatus(data.error || "Verification failed"); 
      }
    }).catch(() => setStatus("Network error. Please try again."));
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}

export default function VerifyPage() { 
  return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><VerifyContent /></Suspense>; 
}