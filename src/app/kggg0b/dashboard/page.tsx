"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenue: number;
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
      icon: "📦",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      color: "text-orange-600",
      bg: "bg-orange-100",
      icon: "⏳",
    },
    {
      label: "Active Products",
      value: stats?.totalProducts ?? 0,
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: "💊",
    },
    {
      label: "Total Revenue",
      value: `₹${Number(stats?.revenue ?? 0).toFixed(0)}`,
      color: "text-green-600",
      bg: "bg-green-100",
      icon: "💰",
    },
  ];

  const menuItems = [
    {
      label: "Orders",
      href: "/kggg0b/orders",
      icon: "📦",
      desc: "Manage customer orders",
    },
    {
      label: "Products",
      href: "/kggg0b/products",
      icon: "💊",
      desc: "Add, edit, delete products",
    },
{
  label: "Banners",
  href: "/kggg0b/banners",
  icon: "🖼️",
},
   {
      label: "Customers",
      href: "/kggg0b/customers",
      icon: "👥",
      desc: "View customer list",
    },
      {
    label: "Reports",
    href: "/kggg0b/reports",
    icon: "📈",
    desc: "Sales & analytics",
  },
  {
    label: "Settings",
    href: "/kggg0b/settings",
    icon: "⚙️",
    desc: "Change email & password",
  },
];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
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
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Welcome back, Admin
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
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

      {/* Customers Count */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm border p-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registered Customers</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalCustomers}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4 text-primary">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md hover:border-primary transition group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary transition">
                <span className="text-2xl group-hover:scale-110 transition">
                  {item.icon}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
