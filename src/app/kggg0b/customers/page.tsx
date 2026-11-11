"use client";
import { useState, useEffect } from "react";
import { Users, Phone, MessageCircle, Mail, X, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Customer = {
  id: string; name: string; email: string; mobile: string | null; createdAt: string;
  followUpAt: string | null; followUpNote: string | null; followUpStatus: string | null;
  _count: { orders: number; };
};

type DueCustomer = {
  id: string; name: string; email: string; mobile: string | null;
  followUpAt: string | null; followUpNote: string | null;
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dueToday, setDueToday] = useState<DueCustomer[]>([]);
  const [fuFor, setFuFor] = useState<{ id: string; name: string } | null>(null);
  const [fuDate, setFuDate] = useState("");
  const [fuNote, setFuNote] = useState("");
  const [fuStatus, setFuStatus] = useState("PENDING");
  const [fuSaving, setFuSaving] = useState(false);
  const [fuError, setFuError] = useState("");
  const [mailTo, setMailTo] = useState<Customer | null>(null);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [mailSending, setMailSending] = useState(false);
  const [mailStatus, setMailStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const waNumber = (m: string | null) => {
    if (!m) return null;
    const last10 = m.replace(/\D/g, "").slice(-10);
    return last10.length === 10 ? "91" + last10 : null;
  };

  const MAIL_TEMPLATES = [
    { label: "Follow-up", subject: "Follow-up on your recent order - Amroha Pharmacy", body: "We hope you are doing well. We are following up on your recent order to check whether you need any assistance. If you have any questions about your medicines or would like to reorder, please reply to this email or contact us on WhatsApp at +91 80779 88509." },
    { label: "Offer", subject: "A special offer from Amroha Pharmacy", body: "We are pleased to offer you a special discount on your next order. Please use coupon code ______ at checkout. This offer is valid until ______." },
    { label: "Thank you", subject: "Thank you for your order - Amroha Pharmacy", body: "Thank you for choosing Amroha Pharmacy. We hope you are satisfied with your order. Your feedback is valuable to us, and we are always happy to assist you." },
  ];

  const istDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const todayIst = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const fuLabel = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
  const FU_STATUS_LABEL: Record<string, string> = { PENDING: "Follow-up", DONE: "Done", NOT_INTERESTED: "Not interested" };

  const openFollowUp = (c: { id: string; name: string; followUpAt: string | null; followUpNote: string | null; followUpStatus?: string | null }) => {
    setFuFor({ id: c.id, name: c.name });
    setFuDate(c.followUpAt ? istDate(c.followUpAt) : "");
    setFuNote(c.followUpNote || "");
    setFuStatus(c.followUpStatus || "PENDING");
    setFuError("");
  };

  const saveFollowUp = async (clear: boolean) => {
    if (!fuFor) return;
    setFuSaving(true);
    setFuError("");
    try {
      const body = clear
        ? { followUpStatus: null, followUpAt: null, followUpNote: null }
        : { followUpStatus: fuStatus, followUpAt: fuDate || null, followUpNote: fuNote.trim() || null };
      const res = await fetch("/api/admin/customers/" + fuFor.id + "/followup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401) { router.push("/kggg0b/login"); return; }
      const data = await res.json();
      if (!res.ok) { setFuError(data.error || "Could not save"); return; }
      setFuFor(null);
      fetchCustomers();
    } catch {
      setFuError("Network error. Please try again.");
    } finally {
      setFuSaving(false);
    }
  };

  const openMail = (c: Customer) => {
    setMailTo(c);
    setMailSubject("");
    setMailBody("");
    setMailStatus(null);
  };

  const sendMail = async () => {
    if (!mailTo) return;
    setMailSending(true);
    setMailStatus(null);
    try {
      const res = await fetch("/api/admin/customers/" + mailTo.id + "/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: mailSubject, message: mailBody }),
      });
      if (res.status === 401) { router.push("/kggg0b/login"); return; }
      const data = await res.json();
      if (res.ok) {
        setMailStatus({ ok: true, text: "Email sent to " + mailTo.email });
        setMailSubject("");
        setMailBody("");
      } else {
        setMailStatus({ ok: false, text: data.error || "Could not send email" });
      }
    } catch {
      setMailStatus({ ok: false, text: "Network error. Please try again." });
    } finally {
      setMailSending(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(), 500);
    return () => clearTimeout(timer);
  }, [search, currentPage]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: currentPage.toString() });
      if (search.trim()) query.append("search", search.trim());
      
      const res = await fetch(`/api/admin/customers?${query.toString()}`);
      if (res.status === 401) { router.push("/kggg0b/login"); return; }
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotalPages(data.totalPages || 1);
      setDueToday(data.dueToday || []);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-64 bg-gray-200 rounded-lg"></div></div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <Link href="/kggg0b/dashboard" className="text-sm text-primary hover:underline">← Dashboard</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2">Customers</h1>
          <p className="text-gray-600 text-sm mt-1">Page {currentPage} of {totalPages}</p>
        </div>
      </div>

      {dueToday.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
            <CalendarClock className="w-5 h-5" /> Follow-ups due ({dueToday.length})
          </h2>
          <ul className="space-y-2">
            {dueToday.map((d) => (
              <li key={d.id} className="bg-white rounded-md border p-3 flex flex-wrap items-center gap-2 justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{d.name}</p>
                  <p className={"text-xs " + (d.followUpAt && istDate(d.followUpAt) < todayIst ? "text-red-600 font-semibold" : "text-gray-500")}>
                    {d.followUpAt ? fuLabel(d.followUpAt) + (istDate(d.followUpAt) < todayIst ? " (overdue)" : " (today)") : ""}
                    {d.followUpNote ? " — " + d.followUpNote : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  {d.mobile && <a href={"tel:" + d.mobile} className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">Call</a>}
                  <button type="button" onClick={() => openFollowUp({ ...d, followUpStatus: "PENDING" })} className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-100 text-purple-800">Update</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, email, or mobile..."
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">No customers found</h2>
          <p className="text-gray-500">{search ? "No customers match your search." : "No customers have registered yet."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg border shadow-sm p-4 flex items-center gap-4 flex-wrap">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                <p className="text-sm text-gray-600 truncate"> {customer.email}</p>
                {customer.mobile && <p className="text-sm text-gray-600"> {customer.mobile}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-medium">{new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="text-right px-4 border-l">
                <p className="text-xs text-gray-500">Orders</p>
                <p className="text-lg font-bold text-primary">{customer._count.orders}</p>
              </div>
              <div className="w-full flex flex-wrap gap-2 pt-3 border-t">
                {customer.mobile && (
                  <a href={"tel:" + customer.mobile} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                )}
                {waNumber(customer.mobile) && (
                  <a href={"https://wa.me/" + waNumber(customer.mobile) + "?text=" + encodeURIComponent("Dear " + customer.name + ",\n\nThis is Amroha Pharmacy. ")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                )}
                <button type="button" onClick={() => openMail(customer)} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 transition">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button type="button" onClick={() => openFollowUp(customer)} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition">
                  <CalendarClock className="w-3.5 h-3.5" /> {customer.followUpStatus ? "Edit follow-up" : "Follow-up"}
                </button>
                {customer.followUpStatus && (
                  <p className="w-full text-xs text-gray-600">
                    <span className={"font-bold " + (customer.followUpStatus === "PENDING" && customer.followUpAt && istDate(customer.followUpAt) < todayIst ? "text-red-600" : "text-purple-700")}>
                      {FU_STATUS_LABEL[customer.followUpStatus] || customer.followUpStatus}
                      {customer.followUpAt ? " · " + fuLabel(customer.followUpAt) : ""}
                      {customer.followUpStatus === "PENDING" && customer.followUpAt && istDate(customer.followUpAt) < todayIst ? " (overdue)" : ""}
                    </span>
                    {customer.followUpNote ? " — " + customer.followUpNote : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {mailTo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={() => setMailTo(null)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-primary">Send email</h2>
                <p className="text-sm text-gray-600 truncate">To: {mailTo.name} ({mailTo.email})</p>
              </div>
              <button type="button" onClick={() => setMailTo(null)} className="p-1 text-gray-500 hover:text-gray-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {MAIL_TEMPLATES.map((t) => (
                <button key={t.label} type="button" onClick={() => { setMailSubject(t.subject); setMailBody(t.body); setMailStatus(null); }}
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50">{t.label}</button>
              ))}
            </div>
            <input type="text" value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} maxLength={150} placeholder="Subject"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary" />
            <textarea value={mailBody} onChange={(e) => setMailBody(e.target.value)} maxLength={3000} rows={7} placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary" />
            {mailStatus && (
              <p className={"text-sm mb-3 font-medium " + (mailStatus.ok ? "text-green-700" : "text-red-600")}>{mailStatus.text}</p>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setMailTo(null)} className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
              <button type="button" onClick={sendMail} disabled={mailSending || mailSubject.trim().length < 3 || mailBody.trim().length < 5}
                className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg disabled:opacity-50">{mailSending ? "Sending..." : "Send"}</button>
            </div>
          </div>
        </div>
      )}

      {fuFor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={() => setFuFor(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-primary">Follow-up</h2>
                <p className="text-sm text-gray-600 truncate">{fuFor.name}</p>
              </div>
              <button type="button" onClick={() => setFuFor(null)} className="p-1 text-gray-500 hover:text-gray-800"><X className="w-5 h-5" /></button>
            </div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select value={fuStatus} onChange={(e) => setFuStatus(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 bg-white">
              <option value="PENDING">Pending (follow up on the date)</option>
              <option value="DONE">Done</option>
              <option value="NOT_INTERESTED">Not interested</option>
            </select>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Follow-up date</label>
            <input type="date" value={fuDate} onChange={(e) => setFuDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3" />
            <label className="block text-xs font-semibold text-gray-600 mb-1">Note</label>
            <textarea value={fuNote} onChange={(e) => setFuNote(e.target.value)} maxLength={500} rows={4} placeholder="e.g. Asked about refill, call again after 10 days"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary" />
            {fuError && <p className="text-sm text-red-600 font-medium mb-3">{fuError}</p>}
            <div className="flex justify-between gap-2">
              <button type="button" onClick={() => saveFollowUp(true)} disabled={fuSaving} className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50">Clear</button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setFuFor(null)} className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
                <button type="button" onClick={() => saveFollowUp(false)} disabled={fuSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg disabled:opacity-50">{fuSaving ? "Saving..." : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pb-8">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-50">Previous</button>
          <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-primary-dark">Next</button>
        </div>
      )}
    </div>
  );
}
