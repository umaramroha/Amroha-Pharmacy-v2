"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, Clock, Pill, IndianRupee, Users, ShoppingBag, 
  Image as ImageIcon, BarChart, Settings, LogOut, Ticket, Mail 
} from "lucide-react";

type Stats = {
  totalOrders: number;
  activeOrders?: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenue: number;
  todayOrders?: number;
  todaySales?: number;
  pendingPayments?: number;
  failedEmails?: number;
  lowStock?: { id: string; name: string; stock: number }[];
  recentOrders?: {
    id: string;
    customerName: string;
    total: number | string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
  }[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/kggg0b/login");
  };

  const overviewCards = [
    { label: "Active Orders", value: stats?.activeOrders ?? 0, icon: Package, tint: "bg-primary/10 text-primary", num: "text-gray-900" },
    { label: "Pending", value: stats?.pendingOrders ?? 0, icon: Clock, tint: "bg-orange-100 text-orange-600", num: "text-orange-600" },
    { label: "Revenue (received)", value: "₹" + Number(stats?.revenue ?? 0).toFixed(0), icon: IndianRupee, tint: "bg-green-100 text-green-600", num: "text-green-600" },
    { label: "Customers", value: stats?.totalCustomers ?? 0, icon: Users, tint: "bg-primary/10 text-primary", num: "text-gray-900" },
    { label: "Active Products", value: stats?.totalProducts ?? 0, icon: Pill, tint: "bg-primary/10 text-primary", num: "text-gray-900" },
  ];

  const todayCards = [
    { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: ShoppingBag, tint: "bg-primary/10 text-primary", num: "text-gray-900" },
    { label: "Today's Sales", value: "₹" + Number(stats?.todaySales ?? 0).toFixed(0), icon: IndianRupee, tint: "bg-green-100 text-green-600", num: "text-green-600" },
  ];

  const statusBadge: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const menuItems = [
    { label: "Orders", href: "/kggg0b/orders", icon: ShoppingBag, desc: "Manage orders" },
    { label: "Products", href: "/kggg0b/products", icon: Pill, desc: "Add, edit, delete" },
    { label: "Banners", href: "/kggg0b/banners", icon: ImageIcon, desc: "Homepage banners" },
    { label: "Coupons", href: "/kggg0b/coupons", icon: Ticket, desc: "Discount codes" },
    { label: "Customers", href: "/kggg0b/customers", icon: Users, desc: "Customer list" },
    { label: "Reports", href: "/kggg0b/reports", icon: BarChart, desc: "Sales & analytics" },
    { label: "Email Log", href: "/kggg0b/notifications", icon: Mail, desc: "Sent & failed" },
    { label: "Settings", href: "/kggg0b/settings", icon: Settings, desc: "Email & password" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
            View Website
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Failed emails alert */}
      {(stats?.failedEmails ?? 0) > 0 && (
        <Link href="/kggg0b/notifications?status=FAILED" className="block bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm font-medium hover:bg-red-100 transition">
          ⚠ {stats?.failedEmails} email(s) failed to send. Tap to review and re-send.
        </Link>
      )}

      {/* Overview */}
      <p className="text-[11px] md:text-xs font-bold tracking-wider uppercase text-gray-500 mb-2">Overview</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3">
        {overviewCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={"bg-white rounded-xl border p-3 md:p-4 flex items-center gap-2.5 md:gap-3" + (i === overviewCards.length - 1 && overviewCards.length % 2 === 1 ? " col-span-2 md:col-span-1" : "")}>
              <div className={"w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 " + c.tint}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs text-gray-500 leading-tight">{c.label}</p>
                <p className={"text-lg md:text-2xl font-bold leading-tight " + c.num}>{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today */}
      <p className="text-[11px] md:text-xs font-bold tracking-wider uppercase text-gray-500 mt-5 mb-2">Today</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3">
        {todayCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-xl border p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
              <div className={"w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 " + c.tint}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs text-gray-500 leading-tight">{c.label}</p>
                <p className={"text-lg md:text-2xl font-bold leading-tight " + c.num}>{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Needs attention */}
      <p className="text-[11px] md:text-xs font-bold tracking-wider uppercase text-gray-500 mt-5 mb-2">Needs attention</p>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2.5 md:gap-3">
        {(stats?.lowStock ?? []).length > 0 && (
          <div className="bg-white rounded-xl border p-3 md:p-4 lg:col-span-2">
            <h2 className="text-sm md:text-base font-bold mb-1 text-red-600">Low Stock (5 or less)</h2>
            <ul className="divide-y">
              {(stats?.lowStock ?? []).map((p) => (
                <li key={p.id} className="flex justify-between items-center py-2 text-sm gap-3">
                  <span className="text-gray-800">{p.name}</span>
                  <span className={"text-[11px] md:text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap " + (p.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700")}>
                    {p.stock === 0 ? "Out of stock" : p.stock + " left"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={"bg-white rounded-xl border p-3 md:p-4 " + ((stats?.lowStock ?? []).length > 0 ? "lg:col-span-3" : "lg:col-span-5")}>
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm md:text-base font-bold text-gray-900">Recent Orders</h2>
            <Link href="/kggg0b/orders" className="text-xs md:text-sm text-primary font-semibold">View all</Link>
          </div>
          {(stats?.recentOrders ?? []).length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No orders yet.</p>
          ) : (
            <ul className="divide-y">
              {(stats?.recentOrders ?? []).map((o) => (
                <li key={o.id}>
                  <Link href="/kggg0b/orders" className="flex justify-between items-center py-2 gap-3 hover:bg-gray-50 rounded">
                    <div className="min-w-0">
                      <p className="font-mono font-semibold text-sm">#{o.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[11px] md:text-xs text-gray-500 truncate">
                        {o.customerName} · {o.paymentMethod} · {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm">₹{Number(o.total).toFixed(0)}</p>
                      <span className={"inline-block text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full " + (statusBadge[o.status] || "bg-gray-100 text-gray-800")}>{o.status}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <p className="text-[11px] md:text-xs font-bold tracking-wider uppercase text-gray-500 mt-5 mb-2">Quick actions</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="bg-white rounded-xl border p-3 hover:shadow-md hover:border-primary transition group flex items-center gap-2.5 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition">
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm md:text-base group-hover:text-primary transition leading-tight">{item.label}</h3>
                <p className="text-[11px] md:text-xs text-gray-500 leading-tight">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
