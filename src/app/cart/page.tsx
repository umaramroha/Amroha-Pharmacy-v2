"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { getCartOrderMessage, getWhatsAppLink } from "@/lib/whatsapp";

/* =========================================================
   ICONS
========================================================= */

function ShoppingBagIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function TrashIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="m9 7 .5-2h5L15 7" />
      <path d="M6 7l1 14h10l1-14" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function TruckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

function ShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3 4 7v5c0 4.8 3.4 7.8 8 9 4.6-1.2 8-4.2 8-9V7l-8-4Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* =========================================================
   CART PAGE
========================================================= */

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  const deliveryFee =
    totalPrice >= 500 || totalPrice === 0 ? 0 : 50;

  const finalTotal = totalPrice + deliveryFee;

  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#f8faf9] flex items-center justify-center px-4 py-16">

        <div className="w-full max-w-md text-center">

          <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary mb-6">
            <ShoppingBagIcon className="w-9 h-9" />
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
            <ArrowRightIcon />
          </Link>

        </div>

      </main>
    );
  }

  /* =======================================================
     CART
  ======================================================= */

  return (
    <main className="bg-[#f8faf9] min-h-screen">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-white border-b border-gray-100">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBagIcon className="w-5 h-5" />
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

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="lg:col-span-2">

            <div className="flex items-center justify-between mb-3">

              <h2 className="font-bold text-gray-900">
                Cart Items
              </h2>

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

                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 md:p-5"
                >

                  <div className="flex gap-3 md:gap-5">

                    {/* Product Image */}

                    <Link
                      href={`/products/${item.id}`}
                      className="w-[88px] h-[88px] md:w-28 md:h-28 shrink-0 rounded-xl bg-[#f5f7f6] overflow-hidden flex items-center justify-center"
                    >

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBagIcon className="w-7 h-7 text-gray-300" />
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

                        {/* Desktop Subtotal */}

                        <div className="hidden md:block text-right shrink-0">

                          <p className="text-[11px] text-gray-400">
                            Subtotal
                          </p>

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
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                          >
                            <MinusIcon />
                          </button>

                          <span className="w-9 text-center text-sm font-bold text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                          >
                            <PlusIcon />
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition"
                        >
                          <TrashIcon />
                          Remove
                        </button>

                      </div>

                      {/* Mobile Subtotal */}

                      <div className="md:hidden flex justify-between items-center mt-3 pt-3 border-t border-gray-100">

                        <span className="text-[11px] text-gray-400">
                          Subtotal
                        </span>

                        <span className="font-bold text-sm text-primary">
                          ₹{item.price * item.quantity}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* Continue Shopping */}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeftIcon />
              Continue Shopping
            </Link>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 lg:sticky lg:top-24">

              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Order Summary
              </h2>

              {/* Price Details */}

              <div className="space-y-3 pb-5 border-b border-gray-100">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{totalPrice}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Delivery Fee
                  </span>

                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      ₹{deliveryFee}
                    </span>
                  )}

                </div>

              </div>

              {/* Free Delivery Message */}

              {deliveryFee > 0 && (
                <div className="mt-4 rounded-xl bg-[#f0f7f4] border border-[#e1eee9] p-3">

                  <div className="flex items-start gap-2">

                    <TruckIcon className="w-4 h-4 text-primary mt-0.5 shrink-0" />

                    <p className="text-xs text-gray-600 leading-relaxed">

                      Add{" "}
                      <span className="font-bold text-primary">
                        ₹{500 - totalPrice}
                      </span>{" "}
                      more to get{" "}
                      <span className="font-bold text-green-600">
                        FREE delivery
                      </span>
                      .

                    </p>

                  </div>

                </div>
              )}

              {deliveryFee === 0 && totalPrice > 0 && (
                <div className="mt-4 rounded-xl bg-green-50 border border-green-100 p-3">

                  <div className="flex items-center gap-2">

                    <TruckIcon className="w-4 h-4 text-green-600 shrink-0" />

                    <p className="text-xs font-semibold text-green-700">
                      You&apos;ve unlocked FREE delivery!
                    </p>

                  </div>

                </div>
              )}

              {/* Total */}

              <div className="flex items-end justify-between mt-5 mb-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Total Amount
                  </p>

                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Inclusive of delivery charges
                  </p>
                </div>

                <span className="text-2xl font-black text-primary">
                  ₹{finalTotal}
                </span>

              </div>

              {/* Checkout */}

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-sm transition shadow-sm"
              >
                Proceed to Checkout
                <ArrowRightIcon />
              </Link>

              {/* WhatsApp */}

              <a
                href={getWhatsAppLink(
                  getCartOrderMessage(items)
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm transition"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Order on WhatsApp
              </a>

              {/* Trust */}

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">

                <div className="flex items-center gap-2.5">

                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <ShieldIcon className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Secure Shopping
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Your order details are protected
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-2.5">

                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <TruckIcon className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Reliable Delivery
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Delivered to your doorstep
                    </p>
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