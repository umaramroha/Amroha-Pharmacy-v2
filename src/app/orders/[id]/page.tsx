"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  customerEmail: string | null;
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

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: "📝" },
  { key: "CONFIRMED", label: "Confirmed", icon: "✅" },
  { key: "PROCESSING", label: "Processing", icon: "📦" },
  { key: "SHIPPED", label: "Shipped", icon: "🚚" },
  { key: "DELIVERED", label: "Delivered", icon: "🎉" },
];

// Statuses that CAN be cancelled
const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 404 || res.status === 403) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setOrder(data.order);
    } catch (err) {
      console.error("Failed to fetch order", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    // Confirm dialog
    const confirmed = window.confirm(
      "Kya aap ye order cancel karna chahte hain?\n\nYe action undo nahi hoga. Stock wapas add ho jayega aur agar payment ho chuki hai toh refund 5-7 working days me process hoga."
    );

    if (!confirmed) return;

    setCancelling(true);
    setCancelError("");

    try {
      const res = await fetch(`/api/orders/${params.id}/cancel`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setCancelError(data.error || "Order cancel nahi ho paya.");
        setCancelling(false);
        return;
      }

      // Update local order status
      setOrder({ ...order, status: "CANCELLED" });
      setCancelSuccess(true);
      setCancelling(false);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Cancel error:", err);
      setCancelError("Network error. Kripya dobara try karein.");
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded-lg max-w-2xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Order Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Ye order exist nahi karta ya aap ise dekh nahi sakte.
        </p>
        <Link
          href="/orders"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
        >
          My Orders
        </Link>
      </div>
    );
  }

  // Get current step index
  const currentStepIndex = STATUS_STEPS.findIndex(
    (s) => s.key === order.status
  );
  const isCancelled = order.status === "CANCELLED";
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/orders"
        className="text-sm text-primary hover:underline mb-4 inline-block"
      >
        ← Back to Orders
      </Link>

      {/* Success Message */}
      {cancelSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-800">
            ✅ Order successfully cancel ho gaya!
          </p>
          <p className="text-xs text-green-700 mt-1">
            {order.paymentStatus === "PAID"
              ? "Refund 5-7 working days me process hoga. Confirmation email bhej di gayi hai."
              : "Koi payment nahi hui thi, isliye refund ki zaroorat nahi. Confirmation email bhej di gayi hai."}
          </p>
        </div>
      )}

      {/* Error Message */}
      {cancelError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {cancelError}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-lg font-semibold">
              #{order.id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-primary">₹{order.total}</p>
          </div>
        </div>

        {/* Cancel Button */}
        {canCancel && !cancelSuccess && (
          <div className="mt-5 pt-5 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full md:w-auto px-6 py-2.5 rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? "Cancelling..." : "❌ Cancel Order"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Order abhi "{order.status}" status me hai, isliye cancel kar
              sakte hain. Shipped hone ke baad cancel nahi hoga.
            </p>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-bold mb-6 text-primary">Order Tracking</h2>

        {isCancelled ? (
          <div className="text-center py-6">
            <div className="text-6xl mb-3">❌</div>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              Order Cancelled
            </h3>
            <p className="text-sm text-gray-600">
              Ye order cancel kar diya gaya hai. Koi question ho toh contact
              karo.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200"></div>

            <div className="space-y-6 relative">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 z-10 border-2 transition ${
                        isCompleted
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-400 border-gray-300"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                    >
                      {isCompleted ? step.icon : "○"}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p
                        className={`font-semibold ${
                          isCompleted ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-primary mt-1 font-medium">
                          Current Status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 text-primary">
          Items ({order.items.length})
        </h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 border-b last:border-b-0"
            >
              {item.product.image && (
                <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0">
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
                  ₹{item.price} × {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-sm">
                ₹{parseFloat(item.price) * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span>
              {parseFloat(order.deliveryFee) === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `₹${order.deliveryFee}`
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span className="text-primary">₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-bold mb-3 text-primary">
          Delivery Address
        </h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p className="font-medium">{order.customerName}</p>
          <p>📱 {order.customerMobile}</p>
          {order.customerEmail && <p>📧 {order.customerEmail}</p>}
          <p className="pt-2">
            📍 {order.address}
            <br />
            {order.city}, {order.state} - {order.pincode}
          </p>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-3 text-primary">Payment</h2>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Method</span>
            <span className="font-medium">
              {order.paymentMethod === "cod"
                ? "💵 Cash on Delivery"
                : "📱 UPI"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span
              className={`font-medium ${
                order.paymentStatus === "PAID"
                  ? "text-green-600"
                  : order.paymentStatus === "REFUND_PENDING"
                  ? "text-orange-600"
                  : "text-yellow-600"
              }`}
            >
              {order.paymentStatus === "REFUND_PENDING"
                ? "Refund Pending"
                : order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Koi sawaal hai?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Contact us
        </Link>
      </div>
    </div>
  );
}
