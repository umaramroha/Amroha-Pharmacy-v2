"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/ToastProvider";

type Product = { id: string; name: string; slug: string; price: string; mrp: string | null; image: string | null; stock?: number; category?: string | null };

function Heart({ active }: { active: boolean }) { return <svg className={`h-4 w-4 ${active ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/></svg>; }

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const cartQty = items.find((i) => i.id === product.id)?.quantity || 0;
  const { toggleWishlist, isInWishlist } = useWishlist();
  const showToast = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const price = parseFloat(product.price);
  const mrp = product.mrp ? parseFloat(product.mrp) : price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const inWishlist = isInWishlist(product.id);
  const inStock = product.stock === undefined || product.stock > 0;

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart({ id: product.id, slug: product.slug, name: product.name, price, mrp: mrp > price ? mrp : undefined, image: product.image || undefined, quantity: 1 });
    showToast("Added to Cart");
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="product-card group bg-white rounded-2xl border border-slate-100 flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-sm">
            {discount}% OFF
          </span>
        )}
        {cartQty > 0 && (
          <span className="absolute right-3 top-14 z-10 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cartQty} in cart
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm ring-1 ring-slate-200 transition hover:scale-110 active:scale-95"
        >
          <Heart active={inWishlist} />
        </button>

        <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-t-2xl">
          <div className="product-image-wrap overflow-hidden transition-shadow duration-300 group-hover:shadow-[inset_0_0_24px_rgba(8,127,115,0.08)]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
              />
            ) : (
              <span className="text-5xl">🌿</span>
            )}
          </div>
        </Link>
      </div>

      <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
        <div className="px-4 pb-2 pt-4 flex-1">
          {product.category && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
              {product.category}
            </p>
          )}
          <h3 className="line-clamp-2 min-h-[3rem] text-sm font-semibold leading-6 sm:text-base text-slate-800 transition-colors group-hover:text-emerald-800">
            {product.name}
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold tabular-nums tracking-tight sm:text-2xl text-slate-950">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {mrp > price && (
              <span className="text-xs text-slate-500 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-2">
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className={`w-full rounded-xl px-3 py-3 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] ${
            !inStock
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : isAdded
                ? "bg-emerald-700 text-white"
                : "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-dark hover:shadow-md hover:shadow-primary/25"
          }`}
        >
          {!inStock ? "Out of stock" : isAdded ? "✓ Added to Cart" : cartQty > 0 ? `Add to cart (${cartQty} in cart)` : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
