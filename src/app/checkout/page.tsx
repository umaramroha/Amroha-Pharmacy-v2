"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { validatePincode } from "@/data/delivery";
import { Smartphone, Camera, Send, AlertTriangle, ShoppingBag, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

// ==============================
// VALIDATION HELPERS
// ==============================
const validateMobile = (mobile: string): boolean => {
  const cleaned = mobile.replace(/[\s\-()]/g, "");
  const normalized = cleaned.length === 12 && cleaned.startsWith("91") ? cleaned.slice(2) : cleaned;
  return /^[6-9]\d{9}$/.test(normalized);
};

// ==============================
// SERVER QUOTE TYPE
// ==============================
type ServerQuote = {
  subtotal: number;
  mrpTotal: number;
  productDiscount: number;
  prepaidDiscount: number;
  deliveryFee: number;
  codAvailable: boolean;
  total: number;
  items: { id: string; name: string; quantity: number; unitPrice: number; lineTotal: number; }[];
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, loading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // State for Order ID and Total Amount
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placedTotal, setPlacedTotal] = useState<number | null>(null);

  // Quote state
  const [quote, setQuote] = useState<ServerQuote | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [quoteError, setQuoteError] = useState("");

  // Pincode verification state
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Scroll to top when order placed
  useEffect(() => {
    if (orderPlaced) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [orderPlaced]);

  // 1. PINCODE AUTO-FILL EFFECT
  useEffect(() => {
    if (formData.pincode.length !== 6) {
      setIsPincodeVerified(false);
      setPincodeError("");
      return;
    }

    const controller = new AbortController();
    const fetchDetails = async () => {
      setIsPincodeLoading(true);
      setPincodeError("");
      try {
        const res = await validatePincode(formData.pincode, controller.signal);
        if (res.valid && res.city && res.state) {
          setFormData((prev) => ({ ...prev, city: res.city || "", state: res.state || "" }));
          setIsPincodeVerified(true);
        } else {
          setFormData((prev) => ({ ...prev, city: "", state: "" }));
          setIsPincodeVerified(false);
          setPincodeError("Invalid Pincode. Please check and try again.");
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setPincodeError("Failed to verify pincode. You can enter it manually.");
          setIsPincodeVerified(false);
        }
      } finally {
        if (!controller.signal.aborted) setIsPincodeLoading(false);
      }
    };

    const timer = setTimeout(fetchDetails, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.pincode]);

  // 2. FETCH QUOTE EFFECT
  const cartKey = items.map((i) => `${i.id}:${i.quantity}`).sort().join(",");
  const userId = user?.id;

  useEffect(() => {
    if (orderPlaced) return;
    if (!userId || cartKey === "") {
      setQuote(null);
      setQuoteStatus("idle");
      return;
    }
    if (formData.pincode.length > 0 && formData.pincode.length !== 6) return;

    const controller = new AbortController();
    setQuoteStatus("loading");
    setQuote(null); // Clear old quote
    setQuoteError("");

    (async () => {
      try {
        const res = await fetch("/api/orders/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
            pincode: formData.pincode.length === 6 ? formData.pincode : undefined,
            paymentMethod,
          }),
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok || !data.quote) {
          setQuote(null);
          setQuoteError(data.error || "Could not confirm the order total.");
          setQuoteStatus("error");
          return;
        }

        setQuote(data.quote);
        setQuoteStatus("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setQuote(null);
        setQuoteError("Network error. Could not confirm the order total.");
        setQuoteStatus("error");
      }
    })();

    return () => controller.abort();
  }, [cartKey, userId, orderPlaced, formData.pincode, paymentMethod]);

  // Auto-switch to UPI if COD becomes unavailable
  useEffect(() => {
    if (quote && !quote.codAvailable && paymentMethod === "cod") {
      setPaymentMethod("upi");
    }
  }, [quote, paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!user) { setOrderError("Please login to place an order"); return; }
    if (!validateMobile(formData.mobile)) { setOrderError("Please enter a valid 10-digit mobile number."); return; }
    if (formData.pincode.length !== 6) { setOrderError("Please enter a valid 6-digit pincode."); return; }

    setPlacingOrder(true);
    setOrderError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerMobile: formData.mobile,
          customerEmail: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || "Failed to place order");
        setPlacingOrder(false);
        return;
      }

      setPlacedOrderId(data.order?.id || null);
      setPlacedTotal(data.order?.total != null ? Number(data.order.total) : null);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setOrderError("Network error. Please try again.");
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-16 text-center"><div className="animate-pulse h-8 bg-gray-200 rounded w-64 mx-auto"></div></div>;
  if (!user && !orderPlaced) return <div className="container mx-auto px-4 py-16 text-center max-w-md"><div className="text-6xl mb-4">🔒</div><h1 className="text-2xl font-bold mb-4 text-primary">Login Required</h1><p className="text-gray-600 mb-8">Please login to place your order.</p><Link href="/login" className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition">Login / Register</Link></div>;
  if (items.length === 0 && !orderPlaced) return <div className="container mx-auto px-4 py-16 text-center"><div className="text-6xl mb-4">🛒</div><h1 className="text-2xl font-bold mb-4 text-primary">Your Cart is Empty</h1><Link href="/products" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold transition">Shop Now</Link></div>;

  // ==========================================
  // SUCCESS SCREEN WITH PAYMENT
  // ==========================================
  if (orderPlaced) {
    const shortId = placedOrderId ? placedOrderId.slice(-8).toUpperCase() : "PENDING";
    const upiLinkFinal = `upi://pay?pa=${siteConfig.upiId}&pn=${encodeURIComponent(siteConfig.upiName)}&am=${placedTotal?.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${shortId}`)}`;
    const finalScreenshotMessage = `📸 *Payment Screenshot*\n\n👤 Name: ${formData.name}\n📱 Mobile: ${formData.mobile}\n🔖 Order ID: #${shortId}\n💰 Amount: ₹${placedTotal}\n💳 Payment Method: UPI\n\nPlease find my payment screenshot attached. Kindly confirm my order.`;

    return (
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Order Placed Successfully!</h1>
          <p className="text-gray-600">Your Order ID is <strong className="text-gray-900 font-mono text-lg">#{shortId}</strong></p>
        </div>

        {paymentMethod === "upi" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-amber-50 border-b border-amber-100 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">Action Required: Complete Your Payment</h3>
                  <p className="text-sm text-amber-700 mt-1">Please pay <strong>₹{placedTotal}</strong> using the options below, then share the screenshot on WhatsApp.</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <a href={upiLinkFinal} className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold text-base transition shadow-sm active:scale-95 w-full md:w-auto">
                  <Smartphone className="w-5 h-5" /> Pay ₹{placedTotal} via UPI App
                </a>
                <div className="mt-4 p-2.5 bg-gray-50 rounded-lg border inline-block">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">UPI ID</p>
                  <p className="text-sm font-bold text-gray-800 font-mono">{siteConfig.upiId}</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400 font-medium">OR SCAN QR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <div className="w-56 h-56 bg-white border-2 border-primary/20 rounded-xl flex items-center justify-center p-2">
                  <img src="/paytm-qr.png" alt="QR Code" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <p className="text-sm text-green-800 font-semibold mb-3 flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" /> Paid successfully? Send us the screenshot.
                </p>
                <a href={getWhatsAppLink(finalScreenshotMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl text-sm font-bold transition shadow-sm active:scale-95 w-full md:w-auto">
                  <Send className="w-4 h-4" /> Share Screenshot on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap mt-8">
          <Link href="/orders" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition">
            <ShoppingBag className="w-5 h-5" /> View My Orders
          </Link>
          <Link href="/products" className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-bold transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // CHECKOUT FORM
  // ==========================================
  return (
    <div className="container mx-auto px-4 pt-8 pb-32 md:pb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {orderError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{orderError}</div>}

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">1. Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input type="tel" required maxLength={13} value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/[^\d+\s-]/g, "") })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary" placeholder="9876543210" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary" placeholder="your@email.com" />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">2. Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                  <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary resize-none" placeholder="House no, street, landmark..."></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <div className="relative">
                      <input type="text" required inputMode="numeric" maxLength={6} value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })} className={`w-full border rounded-md px-4 py-2 focus:outline-none transition-colors ${pincodeError ? "border-red-500 focus:border-red-500" : isPincodeVerified ? "border-green-500 focus:border-green-500 bg-green-50/30" : "border-gray-300 focus:border-primary"}`} placeholder="244221" />
                      {isPincodeLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                      {isPincodeVerified && !isPincodeLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"><CheckCircle2 className="w-5 h-5" /></div>}
                    </div>
                    {pincodeError ? <p className="text-xs text-red-500 mt-1">{pincodeError}</p> : <p className="text-xs text-gray-500 mt-1">{isPincodeVerified ? "Pincode verified!" : "6-digit pincode"}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" required readOnly={isPincodeVerified} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={`w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary ${isPincodeVerified ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""}`} placeholder="Auto-filled or enter manually" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input type="text" required readOnly={isPincodeVerified} value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={`w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary ${isPincodeVerified ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""}`} placeholder="Auto-filled or enter manually" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">3. Payment Method</h2>
              <div className="space-y-3">
                {(() => {
                  const isCodDisabled = quote ? !quote.codAvailable : false;
                  return (
                    <label className={`flex items-center gap-3 p-3 border border-gray-300 rounded-lg transition ${isCodDisabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-gray-50"}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} disabled={isCodDisabled} className="w-4 h-4" />
                      <div>
                        <p className="font-semibold flex items-center gap-2">💵 Cash on Delivery</p>
                        <p className="text-xs text-gray-500">{isCodDisabled ? "Not available for this pincode" : "Pay when you receive your order"}</p>
                      </div>
                    </label>
                  );
                })()}

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} className="w-4 h-4" />
                  <div>
                    <p className="font-semibold flex items-center gap-2">📱 UPI Payment (Prepaid) <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase">Save 5%</span></p>
                    <p className="text-xs text-gray-500">Pay via GPay, PhonePe, Paytm, or any UPI app</p>
                  </div>
                </label>

                {paymentMethod === "upi" && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-900">Payment Instructions</h3>
                      <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                        You will be redirected to the payment page <strong>after</strong> placing the order. Please pay and share the screenshot on WhatsApp to confirm.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-primary">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm items-start">
                    <span className="text-gray-600 line-clamp-1 flex-1 pr-2">{item.name} <span className="text-xs text-gray-400">× {item.quantity}</span></span>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-gray-900">₹{quote?.items.find(l => l.id === item.id)?.lineTotal ?? item.price * item.quantity}</span>
                      {item.mrp && item.mrp > item.price && <span className="block text-[10px] text-gray-400 line-through">₹{(item.mrp * item.quantity).toFixed(2)}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Total MRP</span><span className="font-medium text-gray-900">₹{quote?.mrpTotal.toLocaleString("en-IN") || totalPrice}</span></div>
                {quote && quote.productDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Discount on MRP</span><span className="font-medium text-green-600">- ₹{quote.productDiscount.toLocaleString("en-IN")}</span></div>}
                {quote && quote.prepaidDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">5% Prepaid Discount</span><span className="font-medium text-green-600">- ₹{quote.prepaidDiscount.toLocaleString("en-IN")}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-gray-600">Delivery Fee</span><span className="font-semibold">{quote?.deliveryFee === 0 ? <span className="text-green-600">FREE</span> : quote?.deliveryFee != null ? `₹${quote.deliveryFee}` : "—"}</span></div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <span className="font-bold text-lg">Order Total</span>
                <span className="font-bold text-2xl text-primary">₹{quote?.total.toLocaleString("en-IN") || totalPrice}</span>
              </div>

              {quote && (quote.productDiscount > 0 || (quote.deliveryFee === 0 && quote.subtotal > 0)) && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-green-50 border border-green-100 p-2.5">
                  <span className="text-xs font-bold text-green-700">You save ₹{(quote.productDiscount + (quote.deliveryFee === 0 ? 50 : 0)).toLocaleString("en-IN")}</span>
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>
              )}

              <div className="fixed bottom-[68px] left-0 right-0 z-[55] flex items-center gap-4 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(16,35,30,0.08)] md:static md:mt-6 md:block md:border-0 md:bg-transparent md:p-0 md:shadow-none">
                <div className="shrink-0 md:hidden">
                  <p className="text-xs font-medium text-slate-500">Total Amount</p>
                  <p className="text-xl font-bold tabular-nums tracking-tight text-primary">₹{quote?.total.toLocaleString("en-IN") || totalPrice}</p>
                </div>
                <button type="submit" disabled={placingOrder} className="min-h-12 flex-1 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50 md:w-full">
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3 hidden md:block">By placing order you agree to our Terms</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
