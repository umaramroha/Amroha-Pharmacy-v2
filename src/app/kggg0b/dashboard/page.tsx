"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, Clock, Pill, IndianRupee, Users, ShoppingBag, 
  Image as ImageIcon, BarChart, Settings, LogOut, Ticket 
} from "lucide-react";

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenue: number;
  todayOrders?: number;
  todaySales?: number;
  pendingPayments?: number;
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

  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      color: "text-primary",
      bg: "bg-primary/10",
      icon: Package,
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      color: "text-orange-600",
      bg: "bg-orange-100",
      icon: Clock,
    },
    {
      label: "Active Products",
      value: stats?.totalProducts ?? 0,
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: Pill,
    },
    {
      label: "Revenue (excl. cancelled)",
      value: `₹${Number(stats?.revenue ?? 0).toFixed(0)}`,
      color: "text-green-600",
      bg: "bg-green-100",
      icon: IndianRupee,
    },
  ];

  const menuItems = [
    { label: "Orders", href: "/kggg0b/orders", icon: ShoppingBag, desc: "Manage customer orders" },
    { label: "Products", href: "/kggg0b/products", icon: Pill, desc: "Add, edit, delete products" },
    { label: "Banners", href: "/kggg0b/banners", icon: ImageIcon, desc: "Manage homepage banners" },
    { label: "Coupons", href: "/kggg0b/coupons", icon: Ticket, desc: "Create discount codes" },
    { label: "Customers", href: "/kggg0b/customers", icon: Users, desc: "View customer list" },
    { label: "Reports", href: "/kggg0b/reports", icon: BarChart, desc: "Sales & analytics" },
    { label: "Settings", href: "/kggg0b/settings", icon: Settings, desc: "Change email & password" },
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
          <p className="text-gray-600 text-sm mt-1">Welcome back, Admin</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
              <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mb-3`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Customers Count */}
      <div className="bg-white rounded-lg shadow-sm border p-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Registered Customers</p>
            <p className="text-2xl font-bold text-purple-600">{stats?.totalCustomers ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Today & Alerts */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Today&apos;s Orders</p>
          <p className="text-2xl font-bold text-primary">{stats?.todayOrders ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Today&apos;s Sales</p>
          <p className="text-2xl font-bold text-green-600">₹{Number(stats?.todaySales ?? 0).toFixed(0)}</p>
        </div>
        <Link href="/kggg0b/orders" className="bg-white rounded-lg shadow-sm border p-4 hover:border-primary transition">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Payment Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats?.pendingPayments ?? 0}</p>
        </Link>
        <Link href="/kggg0b/products" className="bg-white rounded-lg shadow-sm border p-4 hover:border-primary transition">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600">{(stats?.lowStock ?? []).length}</p>
        </Link>
      </div>

      {(stats?.lowStock ?? []).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-600">Low Stock (5 or less)</h2>
          <ul className="divide-y">
            {(stats?.lowStock ?? []).map((p) => (
              <li key={p.id} className="flex justify-between items-center py-2 text-sm">
                <span className="text-gray-800 pr-3">{p.name}</span>
                <span className={`font-bold whitespace-nowrap ${p.stock === 0 ? "text-red-600" : "text-orange-600"}`}>
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-primary">Recent Orders</h2>
          <Link href="/kggg0b/orders" className="text-sm text-primary font-semibold">View all</Link>
        </div>
        {(stats?.recentOrders ?? []).length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <ul className="divide-y">
            {(stats?.recentOrders ?? []).map((o) => (
              <li key={o.id} className="py-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-semibold">#{o.id.slice(-8).toUpperCase()}</span>
                  <span className="font-bold">₹{Number(o.total).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-0.5">
                  <span>
                    {o.customerName} · {o.paymentMethod} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}
                  </span>
                  <span className="font-semibold">{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4 text-primary">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md hover:border-primary transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
