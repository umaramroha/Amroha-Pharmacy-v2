"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TopProduct = {
  id: string;
  name: string;
  image: string | null;
  totalSold: number;
  orderCount: number;
  revenue: number;
};

type ReportData = {
  totalRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
  statusBreakdown: { status: string; _count: { status: number } }[];
  topProducts: TopProduct[];
  dailyRevenue: { [key: string]: number };
};

export default function AdminReportsPage() {
  const router = useRouter();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${Number(data.totalRevenue).toLocaleString("en-IN")}`,
      icon: "💰",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Orders",
      value: data.totalOrders,
      icon: "📦",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Delivered",
      value: data.deliveredOrders,
      icon: "✅",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Avg Order Value",
      value: `₹${Number(data.avgOrderValue).toFixed(0)}`,
      icon: "📊",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const maxDailyRevenue = Math.max(
    ...Object.values(data.dailyRevenue).map(Number),
    1
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/kggg0b/dashboard"
          className="text-sm text-primary hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Sales performance aur business insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm border p-4 md:p-6"
          >
            <div
              className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mb-3`}
            >
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary mb-4">
            Order Status Breakdown
          </h2>
          {data.statusBreakdown.length === 0 ? (
            <p className="text-gray-500 text-sm">Koi orders nahi hain.</p>
          ) : (
            <div className="space-y-3">
              {data.statusBreakdown.map((item) => (
                <div
                  key={item.status}
                  className="flex justify-between items-center"
                >
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      statusColors[item.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="font-bold text-gray-800">
                    {item._count.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Revenue */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary mb-4">
            Last 7 Days Revenue
          </h2>
          {Object.keys(data.dailyRevenue).length === 0 ? (
            <p className="text-gray-500 text-sm">
              Pichle 7 din me koi order nahi aaya.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.dailyRevenue).map(([date, amount]) => (
                <div key={date}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{date}</span>
                    <span className="font-semibold">
                      ₹{Number(amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{
                        width: `${(Number(amount) / maxDailyRevenue) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-lg font-bold text-primary mb-4">
          Top Selling Products
        </h2>
        {data.topProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Abhi tak koi product sell nahi hua.
          </p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  #{idx + 1}
                </div>
                {product.image && (
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {product.orderCount} order
                    {product.orderCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    ₹{product.revenue.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.totalSold} units sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
