"use client";
import { useState, useEffect } from "react";
import { Users, Phone, MessageCircle, Mail, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Customer = {
  id: string; name: string; email: string; mobile: string | null; createdAt: string;
  _count: { orders: number; };
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    { label: "Follow-up", subject: "How are you feeling? - Amroha Pharmacy", body: "We hope you are doing well. We wanted to check how you are feeling after using your last order. If you have any questions or need a refill, just reply to this email or message us on WhatsApp." },
    { label: "Offer", subject: "A special offer for you - Amroha Pharmacy", body: "We have a special offer for you. Use code ______ at checkout to get a discount on your next order. Valid till ______." },
    { label: "Thank you", subject: "Thank you for your order - Amroha Pharmacy", body: "Thank you for ordering from Amroha Pharmacy. We hope you are happy with your products. Your feedback means a lot to us." },
  ];

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
                  <a href={"https://wa.me/" + waNumber(customer.mobile) + "?text=" + encodeURIComponent("Hello " + customer.name + ", this is Amroha Pharmacy. ")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                )}
                <button type="button" onClick={() => openMail(customer)} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 transition">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
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
