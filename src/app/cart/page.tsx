"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { getCartOrderMessage, getWhatsAppLink } from "@/lib/whatsapp";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  MessageCircle
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  
  const deliveryFee = totalPrice >= 500 || totalPrice === 0 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;
  
  const totalMrp = items.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
  const productDiscount = totalMrp - totalPrice;
  const totalSaved = productDiscount + deliveryFee;


  /* =======================================================
     EMPTY CART
  ======================================================= */
  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#f8faf9] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary mb-6">
            <ShoppingBag className="w-9 h-9" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">
            AMROHA PHARMACY
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-gray-500 mt-2 mb-7">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-full text-sm font-bold transition shadow-sm"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     CART
  ======================================================= */
  return (
    <main className="bg-[#f8faf9] min-h-screen pb-16">
      {/* HEADER */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-primary">
                AMROHA PHARMACY
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

          {/* CART ITEMS */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">Cart Items</h2>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-red-500 hover:text-red-700 transition"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 md:p-5">
                  <div className="flex gap-3 md:gap-5">
                    {/* Product Image */}
                    <Link href={`/products/${item.slug}`} className="w-[88px] h-[88px] md:w-28 md:h-28 shrink-0 rounded-xl bg-[#f5f7f6] overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-7 h-7 text-gray-300" />
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2 leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-primary font-bold text-sm md:text-base mt-1.5">
                            ₹{item.price}
                          </p>
                        </div>
                        <div className="hidden md:block text-right shrink-0">
                          <p className="text-[11px] text-gray-400">Subtotal</p>
                          <p className="font-bold text-lg text-primary">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>

                      {/* Mobile Subtotal */}
                      <div className="md:hidden flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <span className="text-[11px] text-gray-400">Subtotal</span>
                        <span className="font-bold text-sm text-primary">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items (MRP)</span>
                  <span className="font-medium text-gray-700 line-through">₹{totalMrp}</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Product Discount</span>
                    <span className="font-semibold text-green-600">- ₹{productDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-semibold text-gray-900">₹{deliveryFee === 0 ? 50 : deliveryFee}</span>
                </div>
                {deliveryFee === 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">FREE Delivery</span>
                    <span className="font-semibold text-green-600">- ₹50</span>
                  </div>
                )}
              </div>

              {deliveryFee > 0 && (
                <div className="mt-4 rounded-xl bg-[#f0f7f4] border border-[#e1eee9] p-3">
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Add <span className="font-bold text-primary">₹{500 - totalPrice}</span> more to get{" "}
                      <span className="font-bold text-green-600">FREE delivery</span>.
                    </p>
                  </div>
                </div>
              )}

              {deliveryFee === 0 && totalPrice > 0 && (
                <div className="mt-4 rounded-xl bg-green-50 border border-green-100 p-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600 shrink-0" />
                    <p className="text-xs font-semibold text-green-700">
                      You&apos;ve unlocked FREE delivery!
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-end justify-between mt-5 mb-5">
                <div>
                  <p className="text-sm text-gray-500">Order Total</p>
                </div>
                <span className="text-2xl font-black text-primary">₹{finalTotal}</span>
              </div>

              {totalSaved > 0 && (
                <div className="mb-5 flex items-center justify-between rounded-xl bg-green-50 border border-green-100 p-3">
                  <span className="text-sm font-bold text-green-700">₹{totalSaved} saved</span>
                  <span className="text-xs font-semibold text-green-700">You saved on this order!</span>
                </div>
              )}

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-sm transition shadow-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={getWhatsAppLink(getCartOrderMessage(items))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm transition"
              >
                <MessageCircle className="w-5 h-5" /> Order on WhatsApp
              </a>

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Secure Shopping</p>
                    <p className="text-[10px] text-gray-400">Your order details are protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Reliable Delivery</p>
                    <p className="text-[10px] text-gray-400">Delivered to your doorstep</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
