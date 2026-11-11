"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type LogRow = {
  id: string;
  createdAt: string;
  event: string;
  audience: string;
  toEmail: string;
  subject: string;
  status: string;
  error: string | null;
  orderId: string | null;
  canResend: boolean;
};

function formatIST(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function EmailLogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("status") === "FAILED" ? "FAILED" : "all";
  const [tab, setTab] = useState<"all" | "FAILED">(initialTab);
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [pages, setPages] = useState(1);
  const [failedCount, setFailedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resending, setResending] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/notifications?status=" + tab + "&page=" + page);
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setLogs(data.logs);
      setPages(data.pages);
      setFailedCount(data.failedCount);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [tab, page, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function resend(id: string) {
    setResending(id);
    setNotice("");
    try {
      const res = await fetch("/api/admin/notifications/" + id + "/resend", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setNotice(res.ok ? "Email re-sent successfully." : data.error || "Re-send failed.");
      await load();
    } finally {
      setResending(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Email Log</h1>
          <p className="text-sm text-gray-600 mt-1">Every email sent by the store, with its result.</p>
        </div>
        <Link href="/kggg0b/dashboard" className="text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
          Back to Dashboard
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTab("all"); setPage(1); }}
          className={"px-4 py-1.5 rounded-full text-sm border " + (tab === "all" ? "bg-primary text-white border-primary" : "bg-white text-gray-700")}
        >
          All
        </button>
        <button
          onClick={() => { setTab("FAILED"); setPage(1); }}
          className={"px-4 py-1.5 rounded-full text-sm border " + (tab === "FAILED" ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700")}
        >
          Failed ({failedCount})
        </button>
      </div>

      {notice && <div className="mb-4 text-sm bg-blue-50 border border-blue-200 text-blue-800 rounded p-3">{notice}</div>}
      {error && <div className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-500">No emails to show.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((l) => (
            <div key={l.id} className="bg-white border rounded-lg p-4 text-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={"px-2 py-0.5 rounded-full text-xs font-semibold " + (l.status === "SENT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                    {l.status}
                  </span>
                  <span className={"px-2 py-0.5 rounded-full text-xs " + (l.audience === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700")}>
                    {l.audience === "ADMIN" ? "Admin" : "Customer"}
                  </span>
                  <span className="text-xs text-gray-500">{l.event}</span>
                </div>
                <span className="text-xs text-gray-500">{formatIST(l.createdAt)}</span>
              </div>
              <p className="font-medium text-gray-900 break-words">{l.subject}</p>
              <p className="text-xs text-gray-600 break-all">To: {l.toEmail}</p>
              {l.orderId && <p className="text-xs text-gray-500">Order #{l.orderId.slice(-8).toUpperCase()}</p>}
              {l.error && <p className="text-xs text-red-600 mt-1 break-words">Error: {l.error}</p>}
              {l.canResend && (
                <button
                  onClick={() => resend(l.id)}
                  disabled={resending === l.id}
                  className="mt-3 px-4 py-1.5 bg-primary text-white rounded-full text-xs disabled:opacity-60"
                >
                  {resending === l.id ? "Sending..." : "Re-send"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Previous</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

export default function EmailLogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-sm text-gray-500">Loading...</div>}>
      <EmailLogContent />
    </Suspense>
  );
}
