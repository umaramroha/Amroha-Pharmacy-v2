"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductCard from "@/components/product/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  stock?: number;
};

export default function WishlistPage() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const all = data.products || [];
        setProducts(all.filter((p: Product) => items.includes(p.id)));
      } catch (err) {
        console.error("Failed to fetch wishlist products", err);
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [items]);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {items.length} item{items.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Products save karein aur baad me dekhein.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
