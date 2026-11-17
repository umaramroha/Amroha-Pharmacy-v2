"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Stats = { recipients: number; sentLast24h: number; dailyLimit: number; remainingToday: number };

// Same text always gives the same campaign id, so nobody can receive the same email twice by accident.
async function makeCampaignId(text: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
  } catch {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return "c" + h.toString(16).padStart(8, "0") + text.length.toString(16).padStart(4, "0");
  }
}

export default function PromoPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [subject, setSubject] = useState("");
  const [heading, setHeading] = useState("");
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/promo");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch {
      // the numbers are optional; the form still works
    }
  }, [router]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const payload = (action: string, campaignId?: string) => ({ action, campaignId, subject, heading, message, buttonText, buttonUrl });

  const sendTest = async () => {
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch("/api/admin/promo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload("test")) });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed");
      else setNotice("Test email sent to " + data.to + ". Please check your inbox (and spam).");
    } catch {
      setError("Network problem. Please try again.");
    }
    setBusy(false);
  };

  const sendAll = async () => {
    if (!stats) return;
    if (!window.confirm("Send this email to " + stats.recipients + " opted-in people? This cannot be undone.")) return;
    setBusy(true);
    setNotice("");
    setError("");
    const campaignId = await makeCampaignId([subject, heading, message, buttonText, buttonUrl].join("\u0001"));
    let sent = 0;
    let failed = 0;
    try {
      for (let guard = 0; guard < 50; guard++) {
        const res = await fetch("/api/admin/promo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload("send", campaignId)) });
        const data = await res.json();
        if (!res.ok) {
          setError((data.error || "Failed") + " Sent so far: " + sent + ", failed: " + failed + ".");
          break;
        }
        sent += data.sent;
        failed += data.failed;
        setNotice("Sending... sent " + sent + (failed ? ", failed " + failed : "") + ", waiting " + data.pending);
        if (data.pending === 0) {
          setNotice("Done. Sent " + sent + (failed ? ", failed " + failed + " (see Email Log)" : "") + ".");
          break;
        }
        if (data.limitReached || (data.sent === 0 && data.failed === 0)) {
          setNotice("Daily limit reached. Sent " + sent + ", " + data.pending + " people are still waiting. Open this page tomorrow and press Send again with the same text to continue.");
          break;
        }
      }
    } catch {
      setError("Network problem. Sent so far: " + sent + ". Press Send again with the same text to continue; nobody gets it twice.");
    }
    setBusy(false);
    loadStats();
  };

  const filled = subject.trim().length >= 3 && message.trim().length >= 10;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Promo Email</h1>
          <p className="text-sm text-gray-600 mt-1">Send offers only to people who opted in.</p>
        </div>
        <Link href="/kggg0b/dashboard" className="text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        <div className="bg-white border rounded-lg p-3">
          <p className="text-2xl font-bold text-primary">{stats ? stats.recipients : "-"}</p>
          <p className="text-xs text-gray-500">Opted in</p>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <p className="text-2xl font-bold text-primary">{stats ? stats.sentLast24h : "-"}</p>
          <p className="text-xs text-gray-500">Sent in last 24h</p>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <p className="text-2xl font-bold text-primary">{stats ? stats.remainingToday : "-"}</p>
          <p className="text-xs text-gray-500">Left today (max {stats ? stats.dailyLimit : "-"})</p>
        </div>
      </div>

      {notice && <div className="mb-4 text-sm bg-blue-50 border border-blue-200 text-blue-800 rounded p-3">{notice}</div>}
      {error && <div className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</div>}

      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. Winter wellness offers at Amroha Pharmacy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heading (optional)</label>
          <input value={heading} onChange={(e) => setHeading(e.target.value)} maxLength={120} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={3000} rows={8} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Write in simple, professional English. Leave a blank line between paragraphs." />
          <p className="text-xs text-gray-500 mt-1">Please avoid claims like cure, guaranteed, permanent or 100% result. Name and unsubscribe link are added automatically.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button text (optional)</label>
            <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} maxLength={40} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Shop now" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button link (https://)</label>
            <input value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} maxLength={500} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="https://amrohapharmacy.vercel.app/products" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={sendTest} disabled={busy || !filled} className="px-5 py-2 border border-primary text-primary rounded-full text-sm font-semibold disabled:opacity-50">
            Send test to myself
          </button>
          <button onClick={sendAll} disabled={busy || !filled || !stats || stats.recipients === 0} className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold disabled:opacity-50">
            {busy ? "Please wait..." : "Send to " + (stats ? stats.recipients : "...") + " people"}
          </button>
        </div>
        <p className="text-xs text-gray-500">Always send a test first. The same text is never sent twice to the same person; change the subject or message for a new campaign.</p>
      </div>
    </div>
  );
}
