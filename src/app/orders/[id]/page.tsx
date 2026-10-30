"use client";

import { useState, useEffect, use, type ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Home,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { PREPAID_DISCOUNT_PERCENT } from "@/lib/offers";

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

type IconType = ComponentType<{ className?: string }>;

// ==============================
// CONSTANTS
// ==============================
const STATUS_STEPS: { key: string; label: string; icon: IconType }[] = [
  { key: "PENDING", label: "Order placed", icon: ShoppingBag },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Home },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Order placed", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-50 text-blue-700 ring-blue-200" },
  PROCESSING: { label: "Processing", className: "bg-purple-50 text-purple-700 ring-purple-200" },
  SHIPPED: { label: "Shipped", className: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  DELIVERED: { label: "Delivered", className: "bg-green-50 text-green-700 ring-green-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 ring-red-200" },
};

const STATUS_NOTE: Record<string, string> = {
  PENDING: "We have received your order and will confirm it shortly.",
  CONFIRMED: "Your order is confirmed and will be packed soon.",
  PROCESSING: "Your order is being packed.",
  SHIPPED: "Your order is on its way to you.",
  DELIVERED: "Your order has been delivered.",
};

// Statuses that CAN be cancelled
const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

const card = "rounded-2xl border border-gray-100 bg-white shadow-sm";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60";

// ==============================
// HELPERS
// ==============================
const round2 = (n: number) => Math.round(n * 100) / 100;

const inr = (value: string | number) => {
  const n = typeof value === "number" ? value : parseFloat(value);
  const safe = Number.isFinite(n) ? n : 0;
  return `₹${safe.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(safe) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

// Names/addresses typed in ALL CAPS are shown in normal capitalisation.
const tidy = (value: string) => {
  const v = (value || "").trim();
  if (!/[a-z]/i.test(v) || v !== v.toUpperCase()) return v;
  return v.toLowerCase().replace(/(^|[\s,/(-])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());
};

function getPaymentStatus(order: Order, amountDue: string) {
  switch (order.paymentStatus) {
    case "PAID":
      return { text: "Paid", className: "text-green-600" };
    case "REFUND_PENDING":
      return { text: "Refund pending", className: "text-orange-600" };
    case "PENDING":
      return order.paymentMethod === "cod"
        ? { text: `Pay ${amountDue} on delivery`, className: "text-gray-900" }
        : { text: "Awaiting payment", className: "text-amber-600" };
    default:
      return { text: order.paymentStatus, className: "text-gray-900" };
  }
}

export default function OrderDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = use(props.params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [isSwitchingPayment, setIsSwitchingPayment] = useState(false);
  const [switchError, setSwitchError] = useState("");

  useEffect(() => {
    const load = async () => {
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

    load();
  }, [params.id, router]);

  const handleCancel = async () => {
    if (!order) return;

    // Confirm dialog
    const confirmed = window.confirm(
      "Do you want to cancel this order?\n\nThis action cannot be undone. Stock will be restored and if payment has been made, the refund will be processed within 5-7 business days."
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
        setCancelError(data.error || "We could not cancel your order. Please try again.");
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
      setCancelError("Network error. Please try again.");
      setCancelling(false);
    }
  };

  const handleSwitchPayment = async (newMethod: "cod" | "upi") => {
    if (!order) return;

    const msg = newMethod === "cod"
      ? `Switch to COD? The ${PREPAID_DISCOUNT_PERCENT}% discount will be removed. WARNING: If you have ALREADY paid via UPI, do NOT switch to COD.`
      : `Switch to UPI payment? You will get ${PREPAID_DISCOUNT_PERCENT}% off and need to pay by UPI.`;

    if (!window.confirm(msg)) return;

    setIsSwitchingPayment(true);
    setSwitchError("");

    try {
      const res = await fetch(`/api/orders/${order.id}/switch-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newMethod }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSwitchError(data.error || "Failed to switch payment method.");
        setIsSwitchingPayment(false);
        return;
      }

      // Update local state with new total and method
      setOrder({
        ...order,
        paymentMethod: data.order.paymentMethod,
        subtotal: String(data.order.subtotal),
        deliveryFee: String(data.order.deliveryFee),
        total: String(data.order.total),
      });
      setIsSwitchingPayment(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSwitchError("Network error. Please try again.");
      setIsSwitchingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-gray-200"></div>
          <div className="h-8 w-56 rounded bg-gray-200"></div>
          <div className="h-32 rounded-2xl bg-gray-200"></div>
          <div className="h-64 rounded-2xl bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Search className="h-7 w-7" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Order not found</h1>
        <p className="mb-8 text-gray-600">
          We could not find this order. It may not exist, or it may belong to a different account.
        </p>
        <Link href="/orders" className={primaryBtn}>
          Go to My Orders
        </Link>
      </div>
    );
  }

  // ==============================
  // DERIVED VALUES
  // ==============================
  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const isCod = order.paymentMethod === "cod";

  // Payment method can be changed only while the order is unpaid and not shipped.
  const canSwitchPayment = canCancel && !cancelSuccess && order.paymentStatus === "PENDING";
  const needsUpiPayment = canSwitchPayment && !isCod;

  const subtotalNum = parseFloat(order.subtotal) || 0;
  const deliveryFeeNum = parseFloat(order.deliveryFee) || 0;
  const totalNum = parseFloat(order.total) || 0;

  // Discount already included in the total of a prepaid order
  const prepaidDiscount = isCod ? 0 : Math.max(0, round2(subtotalNum + deliveryFeeNum - totalNum));
  const codTotal = round2(subtotalNum + deliveryFeeNum);
  const upiSaving = Math.round(subtotalNum * PREPAID_DISCOUNT_PERCENT) / 100;
  const upiTotal = round2(codTotal - upiSaving);

  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const shortOrderId = order.id.slice(-8).toUpperCase();
  const placedAt = new Date(order.createdAt);
  const placedOn = `${placedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}, ${placedAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}`;

  const badge = STATUS_BADGE[order.status] ?? { label: order.status, className: "bg-gray-50 text-gray-700 ring-gray-200" };
  const payment = getPaymentStatus(order, inr(order.total));

  const upiPayLink = `upi://pay?pa=${siteConfig.upiId}&pn=${encodeURIComponent(siteConfig.upiName)}&am=${totalNum.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${shortOrderId}`)}`;
  const screenshotMessage = `📸 *Payment Screenshot*\n\n👤 Name: ${order.customerName}\n📱 Mobile: ${order.customerMobile}\n🔖 Order ID: #${shortOrderId}\n💰 Amount: ${inr(order.total)}\n💳 Payment Method: UPI\n\nPlease find my payment screenshot attached. Kindly confirm my order.`;
  const helpMessage = `Hello Amroha Pharmacy, I need help with my order #${shortOrderId}.`;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
      <Link
        href="/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> My Orders
      </Link>

      {/* Title */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Order #{shortOrderId}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {placedOn} · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Cancelled confirmation */}
      {cancelSuccess && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-800">Your order has been cancelled</p>
            <p className="mt-1 text-sm text-green-700">
              {order.paymentStatus === "PAID"
                ? "Your refund will be processed within 5-7 business days. A confirmation email has been sent."
                : "No payment was made, so no refund is required. A confirmation email has been sent."}
            </p>
          </div>
        </div>
      )}

      {/* Payment due (UPI orders that are still unpaid) */}
      {needsUpiPayment && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-amber-900">Payment pending</h2>
              <p className="mt-1 text-sm text-amber-800">
                Please pay <strong>{inr(order.total)}</strong> by UPI, then send us the payment screenshot on WhatsApp to confirm your order.
              </p>
              <p className="mt-2 text-xs text-amber-800">
                UPI ID: <span className="font-mono font-semibold">{siteConfig.upiId}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a href={upiPayLink} className={primaryBtn}>
              <Smartphone className="h-4 w-4" /> Pay {inr(order.total)} via UPI
            </a>
            <a
              href={getWhatsAppLink(screenshotMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
            >
              <MessageCircle className="h-4 w-4" /> Send screenshot on WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: status + items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order status */}
          <section className={`${card} p-5 md:p-6`}>
            <h2 className="text-base font-semibold text-gray-900">Order Status</h2>

            {isCancelled ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-red-700">This order was cancelled</p>
                  <p className="mt-1 text-sm text-red-600">
                    If you have any questions about this order, please contact us.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <ol className="mt-6 flex items-start">
                  {STATUS_STEPS.map((step, idx) => {
                    const done = idx <= currentStepIndex;
                    const Icon = step.icon;
                    return (
                      <li key={step.key} className="relative flex flex-1 flex-col items-center text-center">
                        {idx > 0 && (
                          <span
                            className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${
                              done ? "bg-primary" : "bg-gray-200"
                            }`}
                          />
                        )}
                        <span
                          className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 ${
                            done
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 bg-white text-gray-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span
                          className={`mt-2 px-0.5 text-[11px] font-medium leading-tight sm:text-xs ${
                            done ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                {STATUS_NOTE[order.status] && (
                  <p className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    {STATUS_NOTE[order.status]}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Items */}
          <section className={`${card} p-5 md:p-6`}>
            <h2 className="text-base font-semibold text-gray-900">
              Items in this order ({itemCount})
            </h2>
            <ul className="mt-2 divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-2 last:pb-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-[#f5f7f6]"
                  >
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-300" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="mt-1 text-xs text-gray-500">{inr(item.price)} each</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    {inr((parseFloat(item.price) || 0) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* RIGHT: price, address, payment, help */}
        <div className="space-y-6 lg:col-span-1">
          {/* Price details */}
          <section className={`${card} p-5`}>
            <h2 className="text-base font-semibold text-gray-900">Price Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">
                  Price ({itemCount} {itemCount === 1 ? "item" : "items"})
                </dt>
                <dd className="font-medium text-gray-900">{inr(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">Delivery charges</dt>
                <dd className="font-medium">
                  {deliveryFeeNum === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span className="text-gray-900">{inr(order.deliveryFee)}</span>
                  )}
                </dd>
              </div>
              {prepaidDiscount > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-600">Prepaid discount ({PREPAID_DISCOUNT_PERCENT}%)</dt>
                  <dd className="font-medium text-green-600">− {inr(prepaidDiscount)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
              <span className="text-sm font-semibold text-gray-900">Total Amount</span>
              <span className="text-lg font-bold text-gray-900">{inr(order.total)}</span>
            </div>
            {prepaidDiscount > 0 && (
              <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                You saved {inr(prepaidDiscount)} by paying online
              </p>
            )}
          </section>

          {/* Delivery address */}
          <section className={`${card} p-5`}>
            <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{tidy(order.customerName)}</p>
              <p className="mt-2 flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>
                  {tidy(order.address)}
                  <br />
                  {tidy(order.city)}, {tidy(order.state)} - {order.pincode}
                </span>
              </p>
              <p className="mt-2 flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                {order.customerMobile}
              </p>
              {order.customerEmail && (
                <p className="mt-2 flex items-center gap-2 break-all">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  {order.customerEmail}
                </p>
              )}
            </div>
          </section>

          {/* Payment */}
          <section className={`${card} p-5`}>
            <h2 className="text-base font-semibold text-gray-900">Payment</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-600">Method</dt>
                <dd className="flex items-center gap-2 font-medium text-gray-900">
                  {isCod ? (
                    <IndianRupee className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Smartphone className="h-4 w-4 text-gray-400" />
                  )}
                  {isCod ? "Cash on Delivery" : "UPI (Prepaid)"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-600">Status</dt>
                <dd className={`text-right font-medium ${payment.className}`}>{payment.text}</dd>
              </div>
            </dl>

            {canSwitchPayment && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                {switchError && (
                  <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {switchError}
                  </div>
                )}
                {isCod ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                    <p className="text-sm font-semibold text-green-800">
                      Save {inr(upiSaving)} with UPI
                    </p>
                    <p className="mt-0.5 text-xs text-green-700">
                      Pay online and your total becomes {inr(upiTotal)} instead of {inr(codTotal)}.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSwitchPayment("upi")}
                      disabled={isSwitchingPayment}
                      className={`${primaryBtn} mt-3 w-full`}
                    >
                      {isSwitchingPayment ? "Updating..." : `Pay ${inr(upiTotal)} via UPI`}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSwitchPayment("cod")}
                      disabled={isSwitchingPayment}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSwitchingPayment ? "Updating..." : "Change to Cash on Delivery"}
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      The {PREPAID_DISCOUNT_PERCENT}% prepaid discount will be removed. New total: {inr(codTotal)}.
                    </p>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Help */}
          <section className={`${card} p-5`}>
            <h2 className="text-base font-semibold text-gray-900">Need help with this order?</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href={getWhatsAppLink(helpMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <a
                href={`tel:+${siteConfig.phoneRaw}`}
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                <Phone className="h-4 w-4" /> Call {siteConfig.phone}
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Cancel order (kept at the bottom, low emphasis) */}
      {canCancel && !cancelSuccess && (
        <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Changed your mind?</p>
            <p className="text-xs text-gray-500">You can cancel this order until it is shipped.</p>
            {cancelError && <p className="mt-2 text-sm text-red-600">{cancelError}</p>}
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
        </div>
      )}
    </div>
  );
}
