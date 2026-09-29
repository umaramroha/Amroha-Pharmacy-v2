"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    image: string | null;
    slug: string;
  };
};

type Order = {
  id: string;
  customerName: string;
  customerMobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
          No Orders Yet
        </h1>
        <p className="text-gray-600 mb-8">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          href="/products"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
        My Orders
      </h1>
      <p className="text-gray-600 mb-8">
        {orders.length} order{orders.length > 1 ? "s" : ""} found
      </p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            {/* Header */}
<Link
  href={`/orders/${order.id}`}
  className="bg-gray-50 px-5 py-3 flex flex-wrap justify-between items-center gap-2 border-b hover:bg-gray-100 transition cursor-pointer"
>
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-sm font-semibold">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Ordered on</p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
                <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      statusColors[order.status] || "bg-gray-100 text-gray-800"
    }`}
  >
    {order.status}
  </span>
  <span className="text-xs text-primary font-medium">
    View Details →
  </span>
</Link>

            {/* Items */}
            <div className="p-5">
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.product.image && (
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-sm hover:text-primary line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">
                      ₹{parseFloat(item.price) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between items-center flex-wrap gap-2">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "UPI"}
                  </p>
                  <p className="text-xs mt-1">
                    Deliver to: {order.city}, {order.state} - {order.pincode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-xl font-bold text-primary">
                    ₹{order.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/profile"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Profile
        </Link>
      </div>
    </div>
  );
}
