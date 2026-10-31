"use client";
import { useState, useEffect, Suspense } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type OrderItem = {
  id: string; quantity: number; price: string;
  product: { id: string; name: string; image: string | null; slug: string; };
};
type Order = {
  id: string; customerName: string; customerMobile: string; customerEmail: string | null;
  address: string; city: string; state: string; pincode: string; total: string;
  status: string; paymentMethod: string; paymentStatus: string; createdAt: string;
  items: OrderItem[]; customer: { id: string; name: string; email: string; mobile: string | null; } | null;
};

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function AdminOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("status") || "ALL";
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [printOrder, setPrintOrder] = useState<any>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, filter]);

  useEffect(() => {
    fetchOrders();
  }, [filter, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${currentPage}&status=${filter}`);
      if (res.status === 401) { router.push("/kggg0b/login"); return; }
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch (err) { console.error("Update error:", err); } finally { setUpdating(null); }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o)));
      }
    } catch (err) { console.error(err); }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800", CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800", SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800",
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-32 bg-gray-200 rounded-lg"></div></div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <Link href="/kggg0b/dashboard" className="text-sm text-primary hover:underline">← Dashboard</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2">Orders</h1>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUS_OPTIONS.map((status) => (
          <button key={status} onClick={() => { setFilter(status); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${filter === status ? "bg-primary text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
            {status}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">No orders found</h2>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 flex flex-wrap justify-between items-center gap-3 border-b">
                <div className="flex items-center gap-4">
                  <div><p className="text-xs text-gray-500">Order ID</p><p className="font-mono text-sm font-semibold">#{order.id.slice(-8).toUpperCase()}</p></div>
                  <div><p className="text-xs text-gray-500">Customer</p><p className="text-sm font-medium">{order.customerName}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>{order.status}</span>
                  <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} className="text-xs text-primary hover:underline font-medium px-2">{expandedId === order.id ? "Hide" : "Details"}</button>
                  {order.paymentStatus === "PENDING" && (
                    <button onClick={() => updatePaymentStatus(order.id, "PAID")} className="text-xs bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-full transition ml-2">
                      Mark as PAID
                    </button>
                  )}
                  <button onClick={() => setPrintOrder(order)} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full transition ml-2">🖨️ Print</button>
                </div>
              </div>
              
              {expandedId === order.id && (
                <div className="border-t bg-gray-50 px-5 py-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Items ({order.items.length})</h3>
                    <div className="space-y-2 bg-white rounded-md p-3 border">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="flex-1"><p className="font-medium">{item.product.name}</p><p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p></div>
                          <span className="font-semibold">₹{parseFloat(item.price) * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.slice(1).map((status) => (
                        <button key={status} onClick={() => updateStatus(order.id, status)} disabled={updating === order.id || order.status === status}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${order.status === status ? "bg-primary text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-primary hover:text-white"} disabled:opacity-50`}>
                          {updating === order.id && order.status !== status ? "..." : status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
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

      {printOrder && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="font-bold text-lg text-gray-800">Invoice Preview</h3>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Print / Save PDF</button>
                <button onClick={() => setPrintOrder(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition">Close</button>
              </div>
            </div>
            <div className="p-6 sm:p-8 print-area text-gray-800">
              <div className="text-center mb-8 border-b pb-6">
                <h1 className="text-3xl font-black text-primary tracking-tight">AMROHA PHARMACY</h1>
                <p className="text-sm text-gray-500 mt-1">Authentic Ayurvedic & Unani Medicines</p>
              </div>
              <div className="flex flex-wrap justify-between mb-8 text-sm gap-4">
                <div>
                  <p className="font-bold text-gray-500 uppercase tracking-wide text-xs mb-1">Billed To:</p>
                  <p className="font-semibold text-base">{printOrder.customerName}</p>
                  <p>{printOrder.customerMobile}</p>
                  <p className="max-w-[200px]">{printOrder.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-500 uppercase tracking-wide text-xs mb-1">Invoice Details:</p>
                  <p><strong>Invoice No:</strong> #{printOrder.id.slice(-8).toUpperCase()}</p>
                  <p><strong>Date:</strong> {new Date(printOrder.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
              <table className="w-full text-sm mb-8 border-collapse">
                <thead><tr className="border-b-2 border-gray-300 text-gray-600"><th className="text-left py-3 px-2">Item</th><th className="text-center py-3 px-2">Qty</th><th className="text-right py-3 px-2">Price</th><th className="text-right py-3 px-2">Total</th></tr></thead>
                <tbody>
                  {printOrder.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-3 px-2 font-medium">{item.product?.name || "Product"}</td>
                      <td className="text-center py-3 px-2">{item.quantity}</td>
                      <td className="text-right py-3 px-2">₹{item.price}</td>
                      <td className="text-right py-3 px-2 font-medium">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end text-sm"><div className="w-full sm:w-1/2">
                <div className="flex justify-between py-3 border-b-2 border-gray-800 font-bold text-lg text-gray-900"><span>Grand Total:</span><span>₹{printOrder.total}</span></div>
              </div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
