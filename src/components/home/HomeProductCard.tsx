"use client";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/ToastProvider";

type Product = { id: string; name: string; slug: string; price: string; mrp: string | null; image: string | null; stock?: number; };

export default function HomeProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const showToast = useToast();
  const [isAdded, setIsAdded] = useState(false);
  const cartQty = items.find((i) => i.id === product.id)?.quantity || 0;

  const price = parseFloat(product.price);
  const mrp = product.mrp ? parseFloat(product.mrp) : price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const inStock = product.stock === undefined || product.stock > 0;

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    addToCart({ id: product.id, slug: product.slug, name: product.name, price, mrp: mrp > price ? mrp : undefined, image: product.image || undefined, quantity: 1 });
    showToast("Added to Cart");
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col h-full shadow-sm">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-gray-50 mb-3">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {discount}% OFF
          </span>
        )}
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2 mix-blend-multiply" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 text-4xl">🌿</div>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 leading-tight mb-1">{product.name}</h3>
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
              !inStock ? "bg-gray-100 text-gray-400" : isAdded ? "bg-emerald-600 text-white" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
            }`}
          >
            {!inStock ? "OUT" : isAdded ? "ADDED" : "ADD"}
          </button>
        </div>
      </div>
    </article>
  );
}