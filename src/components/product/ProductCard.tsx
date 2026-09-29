"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

type Product = { id: string; name: string; slug: string; price: string; mrp: string | null; image: string | null; stock?: number; category?: string | null };

function Heart({ active }: { active: boolean }) { return <svg className={`h-4 w-4 ${active ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/></svg>; }

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const price = parseFloat(product.price); const mrp = product.mrp ? parseFloat(product.mrp) : price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const inWishlist = isInWishlist(product.id); const inStock = product.stock === undefined || product.stock > 0;
  const handleAdd = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (!inStock) return; addToCart({ id: product.id, name: product.name, price, image: product.image || undefined, quantity: 1 }); setJustAdded(true); setTimeout(() => setJustAdded(false), 1400); };
  const handleWishlist = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); };

  return (
    <article className="product-card group">
      <div className="relative">
        {discount > 0 && <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white">{discount}% OFF</span>}
        <button onClick={handleWishlist} aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm ring-1 ring-slate-200 transition hover:scale-105"><Heart active={inWishlist} /></button>
        <Link href={`/products/${product.slug}`} className="block">
          <div className="product-image-wrap">
            {product.image ? <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105" /> : <span className="text-5xl">🌿</span>}
          </div>
          <div className="px-4 pb-2 pt-4">
            {product.category && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">{product.category}</p>}
            <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-5 text-slate-800 transition group-hover:text-emerald-800">{product.name}</h3>
            <div className="mt-3 flex items-baseline gap-2"><span className="text-lg font-extrabold tracking-tight text-slate-950">₹{price.toLocaleString("en-IN")}</span>{mrp > price && <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString("en-IN")}</span>}</div>
          </div>
        </Link>
      </div>
      <div className="px-4 pb-4 pt-2"><button onClick={handleAdd} disabled={!inStock} className={`w-full rounded-xl px-3 py-2.5 text-xs font-extrabold uppercase tracking-wider transition ${!inStock ? "cursor-not-allowed bg-slate-100 text-slate-400" : justAdded ? "bg-emerald-700 text-white" : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white"}`}>{!inStock ? "Out of stock" : justAdded ? "Added to cart ✓" : "Add to cart"}</button></div>
    </article>
  );
}
