"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { concerns } from "@/data/concerns";
import ProductCard from "@/components/product/ProductCard";

type Product = {
  id: string; name: string; slug: string; price: string; mrp: string | null;
  image: string | null; category: string | null; description: string | null; stock: number;
};

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹300", value: "0-300" },
  { label: "₹300 – ₹500", value: "300-500" },
  { label: "Above ₹500", value: "500-99999" },
];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name" },
];

const categoryTitles: Record<string, string> = {
  "male-problems": "Men's Wellness", "female-problems": "Women's Wellness", "general-problems": "General Wellness",
};

function SlidersIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /><circle cx="9" cy="6" r="2" fill="white" /><circle cx="15" cy="12" r="2" fill="white" /><circle cx="10" cy="18" r="2" fill="white" /></svg>;
}
function SearchIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}
function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>;
}
function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m5 12 4 4L19 6" /></svg>;
}

export default function ProductListClient({ initialProducts, categoryParam, query, currentPage, totalPages }: { initialProducts: Product[]; categoryParam: string | null; query: string; currentPage: number; totalPages: number; }) {
  const allProducts = initialProducts;
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((product) => {
        const price = parseFloat(product.price);
        return price >= min && price <= max;
      });
    }
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
      case "price-desc": result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [allProducts, priceRange, sortBy]);

  const pageTitle = query ? `Search Results` : categoryParam ? categoryTitles[categoryParam] || "Our Products" : "Our Products";
  const hasFilters = priceRange !== "all" || sortBy !== "default" || !!categoryParam || !!query;

  const clearFilters = () => {
    setPriceRange("all");
    setSortBy("default");
    if (categoryParam || query) window.location.href = "/products";
  };

  const FilterContent = () => (
    <div className="space-y-7">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><SlidersIcon className="w-4 h-4" /></div>
          <h3 className="font-bold text-sm text-gray-900">Shop by Concern</h3>
        </div>
        <div className="space-y-1">
          {concerns.map((concern) => (
            <Link key={concern.slug} href={`/concerns/${concern.slug}`} onClick={() => setMobileFilterOpen(false)} className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-xs md:text-sm text-gray-600 hover:bg-[#f0f7f4] hover:text-primary transition">
              <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-primary shrink-0 text-xs">{concern.icon}</span>
              <span className="truncate">{concern.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-sm text-gray-900 mb-3">Category</h3>
        <div className="space-y-1">
          <Link href="/products" onClick={() => setMobileFilterOpen(false)} className={`flex items-center justify-between py-2 px-2.5 rounded-xl text-sm transition ${!categoryParam ? "bg-primary text-white font-semibold" : "text-gray-600 hover:bg-[#f0f7f4] hover:text-primary"}`}>
            <span>All Products</span>{!categoryParam && <CheckIcon className="w-4 h-4" />}
          </Link>
          {Object.entries(categoryTitles).map(([slug, name]) => (
            <Link key={slug} href={`/products?category=${slug}`} onClick={() => setMobileFilterOpen(false)} className={`flex items-center justify-between py-2 px-2.5 rounded-xl text-sm transition ${categoryParam === slug ? "bg-primary text-white font-semibold" : "text-gray-600 hover:bg-[#f0f7f4] hover:text-primary"}`}>
              <span>{name}</span>{categoryParam === slug && <CheckIcon className="w-4 h-4" />}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-sm text-gray-900 mb-3">Price</h3>
        <div className="space-y-1">
          {priceRanges.map((range) => (
            <button key={range.value} type="button" onClick={() => setPriceRange(range.value)} className={`w-full flex items-center justify-between text-left py-2 px-2.5 rounded-xl text-sm transition ${priceRange === range.value ? "bg-primary text-white font-semibold" : "text-gray-600 hover:bg-[#f0f7f4] hover:text-primary"}`}>
              <span>{range.label}</span>{priceRange === range.value && <CheckIcon className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
      {hasFilters && (
        <div className="border-t border-gray-100 pt-5">
          <button type="button" onClick={clearFilters} className="w-full py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 text-sm font-semibold transition">Clear All Filters</button>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] font-bold text-primary mb-1.5">AMROHA PHARMACY</p>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900">{pageTitle}</h1>
              {query ? <p className="text-sm text-gray-500 mt-2">Showing results for <span className="font-semibold text-gray-700">&quot;{query}&quot;</span></p> : <p className="text-sm text-gray-500 mt-2">Explore our Ayurvedic & Unani wellness collection.</p>}
            </div>
            <div className="self-start md:self-auto bg-[#f0f7f4] border border-[#e1eee9] rounded-full px-4 py-2">
              <span className="text-xs font-semibold text-primary">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><SlidersIcon className="w-4 h-4" /></div>
                  <h2 className="font-bold text-gray-900">Filters</h2>
                </div>
              </div>
              <FilterContent />
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between gap-3 mb-5">
              <button type="button" onClick={() => setMobileFilterOpen(true)} className="lg:hidden inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition"><SlidersIcon className="w-4 h-4" />Filters</button>
              {hasFilters && <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Filters applied</div>}
              <div className="flex items-center gap-2 ml-auto">
                <span className="hidden sm:block text-xs text-gray-500">Sort by</span>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-9 py-2.5 text-xs md:text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary cursor-pointer">
                    {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-4 h-4" />
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-5 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f0f7f4] text-primary flex items-center justify-center mb-5"><SearchIcon /></div>
                <h2 className="text-xl font-bold text-gray-900">No products found</h2>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">We couldn&apos;t find products matching your current search or filters.</p>
                <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-2 mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-bold transition">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-center gap-3 md:gap-5">
                  {filteredProducts.map((product) => <div key={product.id} className="w-[calc(50%-6px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"><ProductCard product={product} /></div>)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    {currentPage > 1 && (
                      <a href={`/products?page=${currentPage - 1}${categoryParam ? `&category=${categoryParam}` : ''}${query ? `&q=${query}` : ''}`} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-semibold">Previous</a>
                    )}
                    <span className="text-sm font-semibold text-gray-700">Page {currentPage} of {totalPages}</span>
                    {currentPage < totalPages && (
                      <a href={`/products?page=${currentPage + 1}${categoryParam ? `&category=${categoryParam}` : ''}${query ? `&q=${query}` : ''}`} className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition text-sm font-semibold">Next</a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {mobileFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[330px] max-w-[88vw] bg-white z-50 shadow-2xl lg:hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Filters</h2>
              <button onClick={() => setMobileFilterOpen(false)} className="text-gray-500 hover:text-gray-800"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 6l12 12M18 6 6 18"/></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5"><FilterContent /></div>
            <div className="p-4 border-t border-gray-100 bg-white">
              <button onClick={() => setMobileFilterOpen(false)} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition">Show Results</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
