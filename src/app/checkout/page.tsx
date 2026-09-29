"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

// ==============================
// VALIDATION HELPERS
// ==============================
const validateMobile = (mobile: string): boolean => {
  const cleaned = mobile.replace(/[\s\-()]/g, "").replace(/^\+?91/, "");
  return /^[6-9]\d{9}$/.test(cleaned);
};

const validatePincode = (pincode: string): boolean => {
  return /^[1-9]\d{5}$/.test(pincode);
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, loading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const deliveryFee = totalPrice >= 500 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ✅ FIX 1: Scroll to top when order placed
  useEffect(() => {
    if (orderPlaced) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [orderPlaced]);

  const upiLink = `upi://pay?pa=${siteConfig.upiId}&pn=${encodeURIComponent(
    siteConfig.upiName
  )}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent(
    `Order ${Date.now().toString().slice(-6)}`
  )}`;

  const paymentScreenshotMessage = `📸 *Payment Screenshot*

👤 Name: ${formData.name}
📱 Mobile: ${formData.mobile}
💰 Amount: ₹${finalTotal}
💳 Payment Method: UPI

Please find my payment screenshot attached. Kindly confirm my order.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!user) {
      setOrderError("Please login to place an order");
      return;
    }

    // ✅ FIX 2: Mobile validation
    if (!validateMobile(formData.mobile)) {
      setOrderError(
        "Please enter a valid 10-digit mobile number (e.g. 9876543210)."
      );
      return;
    }

    // ✅ FIX 3: Pincode validation
    if (!validatePincode(formData.pincode)) {
      setOrderError(
        "Please enter a valid 6-digit pincode (e.g. 244221)."
      );
      return;
    }

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
          items: items.map((i) => ({
            id: i.id,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal: totalPrice,
          deliveryFee: deliveryFee,
          total: finalTotal,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.error || "Failed to place order");
        setPlacingOrder(false);
        return;
      }

      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Order error:", err);
      setOrderError("Network error. Please try again.");
      setPlacingOrder(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  // Login required
  if (!user && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-4 text-primary">Login Required</h1>
        <p className="text-gray-600 mb-8">Please login to place your order.</p>
        <Link
          href="/login"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Your Cart is Empty
        </h1>
        <Link
          href="/products"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  // Success screen
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 text-center max-w-lg">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for shopping with {siteConfig.name}. We&apos;ll contact you
          soon on your mobile number.
        </p>

        {paymentMethod === "upi" && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            <p className="font-semibold mb-2">
              📸 Payment Screenshot Bhejna Na Bhoolen
            </p>
            <p className="mb-3">
              Order confirm karne ke liye apna payment screenshot WhatsApp pe
              submit it.
            </p>
            <a
              href={getWhatsAppLink(paymentScreenshotMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold transition"
            >
              📤 Send Screenshot on WhatsApp
            </a>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/orders"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {orderError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {orderError}
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">
                1. Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile: e.target.value.replace(/[^\d+\s-]/g, ""),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="9876543210"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    10-digit mobile number
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">
                2. Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary resize-none"
                    placeholder="House no, street, landmark..."
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pincode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="244221"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      6-digit pincode
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">
                3. Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">💵 Cash on Delivery</p>
                    <p className="text-xs text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">📱 UPI Payment (Prepaid)</p>
                    <p className="text-xs text-gray-500">
                      Scan QR code or pay via UPI app
                    </p>
                  </div>
                </label>

                {paymentMethod === "upi" && (
                  <div className="mt-4 p-5 bg-gray-50 rounded-lg border space-y-4">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Scan to pay ₹{finalTotal}
                      </p>
                      <div className="w-64 h-64 mx-auto bg-white border-2 border-primary/20 rounded-lg flex items-center justify-center p-2">
                        <img
                          src="/paytm-qr.png"
                          alt="Paytm QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Scan using GPay, PhonePe, Paytm, or any UPI app
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs text-gray-500 font-medium">
                        YA
                      </span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">
                        Click the button below to open your payment app
                      </p>
                      <a
                        href={upiLink}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold transition"
                      >
                        💳 Pay ₹{finalTotal} via UPI App
                      </a>
                      <div className="mt-3 p-2 bg-white rounded-lg border inline-block">
                        <p className="text-xs text-gray-500 mb-0.5">UPI ID:</p>
                        <p className="text-sm font-semibold text-gray-800 font-mono">
                          {siteConfig.upiId}
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-800 font-semibold mb-2">
                        📸 Please share payment screenshot after paying
                      </p>
                      <a
                        href={getWhatsAppLink(paymentScreenshotMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                      >
                        📤 Share Screenshot on WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-primary">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">
                  ₹{finalTotal}
                </span>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing order you agree to our Terms
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
