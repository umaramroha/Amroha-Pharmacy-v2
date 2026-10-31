"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { getCartOrderMessage, getWhatsAppLink } from "@/lib/whatsapp";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Truck, ShieldCheck, MessageCircle } from "lucide-react";

// Helper for estimated delivery date
const getEstimatedDelivery = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3); // 3 days from now
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  // AMAZON-STYLE CALCULATIONS
  const totalMrp = items.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
  const discountOnMrp = totalMrp - totalPrice;
  const deliveryFee = 0; // Calculated at checkout based on pincode
  const isFreeDelivery = false;
  const finalTotal = totalPrice + deliveryFee;
  const totalSaved = discountOnMrp;

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#f8faf9] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary mb-6">
            <ShoppingBag className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
          <p className="text-sm text-gray-500 mt-2 mb-7">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full text-sm font-bold shadow-sm">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f8faf9] min-h-screen pb-16">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><ShoppingBag className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-primary">AMROHA PHARMACY</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          
          {/* CART ITEMS (Clean Pharmacy Style) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-gray-900 text-lg">Cart Items</h2>
              <button onClick={clearCart} className="text-xs font-semibold text-red-500 hover:text-red-700">Clear Cart</button>
            </div>
            
            {items.map((item) => {
              const itemDiscount = item.mrp && item.mrp > item.price 
                ? Math.round(((item.mrp - item.price) / item.mrp) * 100) 
                : 0;

              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 relative">
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="w-[88px] h-[110px] md:w-[100px] md:h-[120px] shrink-0 rounded-lg bg-[#f5f7f6] overflow-hidden border border-gray-100 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="pr-6">
                      <h3 className="font-bold text-sm md:text-base text-gray-900 line-clamp-2 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Amroha Pharmacy</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-bold text-base md:text-lg text-gray-900">₹{item.price}</span>
                      {itemDiscount > 0 && (
                        <>
                          <span className="text-xs text-gray-400 line-through">MRP ₹{item.mrp}</span>
                          <span className="text-xs font-semibold text-orange-500">₹{(item.mrp! - item.price) * item.quantity} Off</span>
                        </>
                      )}
                    </div>

                    {/* Qty & Delivery Estimate */}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden h-8">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 bg-white transition"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-800 bg-white border-x border-gray-300 py-1">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 bg-white transition"><Plus className="w-3 h-3" /></button>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 font-medium">
                        <Truck className="w-3.5 h-3.5 text-primary" />
                        Delivery by <span className="text-gray-900 font-bold">{getEstimatedDelivery()}</span>
                      </div>
                    </div>

                    {/* Remove Button (Top Right) */}
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
            
            <Link href="/products" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Price Details</h2>

              <div className="space-y-3 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total MRP</span>
                  <span className="font-medium text-gray-900">₹{totalMrp.toLocaleString("en-IN")}</span>
                </div>
                {discountOnMrp > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount on MRP</span>
                    <span className="font-medium text-green-600">- ₹{discountOnMrp.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-900 text-xs">Calculated at checkout</span>
                </div>
                
              </div>

              <div className="flex items-center justify-between mt-5 mb-5">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-black text-primary">₹{finalTotal.toLocaleString("en-IN")}</span>
              </div>

              {totalSaved > 0 && (
                <div className="mb-5 flex items-center justify-between rounded-xl bg-green-50 border border-green-100 p-3">
                  <span className="text-sm font-bold text-green-700">You save ₹{totalSaved.toLocaleString("en-IN")}</span>
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>
              )}

              <Link href="/checkout" className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-sm transition shadow-sm active:scale-95">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={getWhatsAppLink(getCartOrderMessage(items))} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full mt-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm transition active:scale-95">
                <MessageCircle className="w-5 h-5" /> Order on WhatsApp
              </a>

              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-600" /> 100% Authentic Medicines
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
