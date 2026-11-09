"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Period = "7" | "30" | "90" | "all";

type ReportData = {
  period: string;
  summary: {
    ordersPlaced: number;
    bookedSales: number;
    revenueReceived: number;
    receivedOrders: number;
    avgOrderValue: number;
    delivered: number;
    cancelled: number;
    cancellationRate: number;
    newCustomers: number;
  };
  codToCollect: { amount: number; count: number };
  paymentSplit: { method: string; count: number; amount: number }[];
  coupons: { orders: number; discount: number };
  statusBreakdown: { status: string; count: number }[];
  daily: { label: string; booked: number; received: number }[];
  topProducts: { id: string; name: string; image: string | null; units: number; orders: number; amount: number }[];
};

const PERIOD_TABS: { key: Period; label: string }[] = [
  { key: "7", label: "7 days" },
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
  { key: "all", label: "All time" },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function AdminReportsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("30");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    fetch("/api/admin/reports?period=" + period)
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/kggg0b/login");
          return;
        }
        if (!res.ok) throw new Error("Request failed");
        const result = await res.json();
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period, router]);

  const header = (
    <div className="mb-6">
      <Link href="/kggg0b/dashboard" className="text-sm text-primary hover:underline">
        ← Dashboard
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2">Reports & Analytics</h1>
      <p className="text-gray-600 text-sm mt-1">Sales performance and business insights</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {PERIOD_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setPeriod(t.key)}
            className={
              "px-4 py-1.5 rounded-full text-sm font-semibold border transition " +
              (period === t.key
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (!data && loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        {header}
        <div className="p-8 text-center text-red-500 font-bold">
          {failed ? "Failed to load reports. Please refresh." : "No data."}
        </div>
      </div>
    );
  }

  const s = data.summary;
  const cards = [
    { label: "Revenue (received)", value: inr(s.revenueReceived), note: s.receivedOrders + " paid/delivered orders", color: "text-green-600" },
    { label: "Orders placed", value: String(s.ordersPlaced), note: "not cancelled", color: "text-blue-600" },
    { label: "Order value", value: inr(s.bookedSales), note: "all orders not cancelled", color: "text-purple-600" },
    { label: "Avg order value", value: inr(s.avgOrderValue), note: "per order", color: "text-primary" },
    { label: "COD to collect", value: inr(data.codToCollect.amount), note: data.codToCollect.count + " orders (all time)", color: "text-orange-600" },
    { label: "Delivered", value: String(s.delivered), note: "orders", color: "text-green-700" },
    { label: "Cancelled", value: String(s.cancelled), note: s.cancellationRate + "% of orders", color: "text-red-600" },
    { label: "New customers", value: String(s.newCustomers), note: "registered", color: "text-indigo-600" },
  ];

  const maxDaily = Math.max(...data.daily.map((d) => d.booked), 1);

  return (
    <div className={"container mx-auto px-4 py-8 transition-opacity " + (loading ? "opacity-60" : "")}>
      {header}

      <p className="text-xs text-gray-500 mb-4">
        Revenue (received) = COD orders marked as paid + UPI orders that are delivered. Order value counts every order
        that is not cancelled.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-xs md:text-sm text-gray-600 mb-1">{c.label}</p>
            <p className={"text-2xl md:text-3xl font-bold " + c.color}>{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary mb-1">
            Daily sales ({period === "7" ? "last 7 days" : "last 30 days"})
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            <span className="inline-block w-3 h-2 bg-primary/30 rounded-sm mr-1"></span>Order value
            <span className="inline-block w-3 h-2 bg-primary rounded-sm mx-1 ml-3"></span>Received
          </p>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {data.daily.map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{d.label}</span>
                  <span className="font-semibold">
                    {inr(d.received)} <span className="text-gray-400 font-normal">/ {inr(d.booked)}</span>
                  </span>
                </div>
                <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-primary/30 rounded-full" style={{ width: (d.booked / maxDaily) * 100 + "%" }}></div>
                  <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: (d.received / maxDaily) * 100 + "%" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Order status</h2>
            {data.statusBreakdown.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders in this period.</p>
            ) : (
              <div className="space-y-3">
                {data.statusBreakdown.map((item) => (
                  <div key={item.status} className="flex justify-between items-center">
                    <span className={"px-3 py-1 rounded-full text-xs font-bold " + (statusColors[item.status] || "bg-gray-100 text-gray-800")}>
                      {item.status}
                    </span>
                    <span className="font-bold text-gray-800">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Payment method</h2>
            {data.paymentSplit.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders in this period.</p>
            ) : (
              <div className="space-y-3">
                {data.paymentSplit.map((m) => (
                  <div key={m.method} className="flex justify-between items-center text-sm">
                    <span className="font-semibold uppercase">{m.method}</span>
                    <span className="text-gray-700">
                      {m.count} order{m.count !== 1 ? "s" : ""} · {inr(m.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary mb-2">Coupons</h2>
            <p className="text-sm text-gray-700">
              {data.coupons.orders} order{data.coupons.orders !== 1 ? "s" : ""} used a coupon · {inr(data.coupons.discount)} given as discount
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-lg font-bold text-primary mb-4">Top selling products</h2>
        {data.topProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No products sold in this period.</p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  #{idx + 1}
                </div>
                {product.image && (
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500">
                    {product.orders} order{product.orders !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{inr(product.amount)}</p>
                  <p className="text-xs text-gray-500">{product.units} units sold</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
