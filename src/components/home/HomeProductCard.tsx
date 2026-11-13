"use client";
import { optimizeImage } from "@/lib/img";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/ToastProvider";

type Product = { id: string; name: string; slug: string; price: string; mrp: string | null; image: string | null; stock?: number; };

export default function HomeProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const showToast = useToast();
  const [isAdded, setIsAdded] = useState(false);
  
  const cartQty = items.find((i) => i.id === product.id)?.quantity || 0;
  const price = parseFloat(product.price);
  const mrp = product.mrp ? parseFloat(product.mrp) : price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const inStock = product.stock === undefined || product.stock > 0;
  const inWishlist = isInWishlist(product.id);

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
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
    <article className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col h-full shadow-sm relative group hover:shadow-md transition">
      <button
        onClick={handleWishlist}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200 transition hover:scale-110 active:scale-95"
      >
        <svg className={`h-4 w-4 ${inWishlist ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/></svg>
      </button>

      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-gray-50 mb-3">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {discount}% OFF
          </span>
        )}
        {product.image ? (
          <img src={optimizeImage(product.image, 400)} alt={product.name} className="h-full w-full object-contain p-2 mix-blend-multiply" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 text-4xl">🌿</div>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-gray-900">₹{price}</span>
              {mrp > price && <span className="text-xs text-gray-400 line-through">₹{mrp}</span>}
            </div>
            {cartQty > 0 && <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{cartQty} in cart</p>}
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              !inStock ? "bg-red-50 text-red-600 border border-red-200" : isAdded ? "bg-emerald-600 text-white" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
            }`}
          >
            {!inStock ? "OUT OF STOCK" : isAdded ? "ADDED" : "ADD"}
          </button>
        </div>
      </div>
    </article>
  );
}
