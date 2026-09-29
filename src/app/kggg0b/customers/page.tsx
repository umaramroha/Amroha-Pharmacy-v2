"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  createdAt: string;
  _count: {
    orders: number;
  };
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.mobile && c.mobile.includes(search))
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <Link
            href="/kggg0b/dashboard"
            className="text-sm text-primary hover:underline"
          >
            ← Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2">
            Customers
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {customers.length} total customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Customers List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">
            No customers found
          </h2>
          <p className="text-gray-500">
            {search
              ? "Koi customer match nahi hua."
              : "Abhi tak koi customer register nahi hua."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-lg border shadow-sm p-4 flex items-center gap-4 flex-wrap"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  📧 {customer.email}
                </p>
                {customer.mobile && (
                  <p className="text-sm text-gray-600">📱 {customer.mobile}</p>
                )}
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-medium">
                  {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right px-4 border-l">
                <p className="text-xs text-gray-500">Orders</p>
                <p className="text-lg font-bold text-primary">
                  {customer._count.orders}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
