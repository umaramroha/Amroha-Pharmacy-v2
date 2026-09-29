
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";
import { concerns } from "@/data/concerns";
import ProductCard from "@/components/product/ProductCard";

/* =========================================================
   TYPES
========================================================= */

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  category: string | null;
  description: string | null;
  stock: number;
};

/* =========================================================
   DATA
========================================================= */

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
  "male-problems": "Men's Wellness",
  "female-problems": "Women's Wellness",
  "general-problems": "General Wellness",
};

/* =========================================================
   ICONS
========================================================= */

function FilterIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function SlidersIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <circle cx="9" cy="6" r="2" fill="white" />
      <circle cx="15" cy="12" r="2" fill="white" />
      <circle cx="10" cy="18" r="2" fill="white" />
    </svg>
  );
}

function SearchIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronDownIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowLeftIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
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

/* =========================================================
   SKELETON
========================================================= */

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />

      <div className="p-3.5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />

        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCTS CONTENT
========================================================= */

function ProductsContent() {
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const query = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (categoryParam) {
          params.set("category", categoryParam);
        }

        if (query) {
          params.set("q", query);
        }

        const res = await fetch(
          `/api/products?${params.toString()}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        setAllProducts(data.products || []);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, query]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (priceRange !== "all") {
      const [min, max] = priceRange
        .split("-")
        .map(Number);

      result = result.filter((product) => {
        const price = parseFloat(product.price);

        return price >= min && price <= max;
      });
    }

    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) =>
            parseFloat(a.price) -
            parseFloat(b.price)
        );
        break;

      case "price-desc":
        result.sort(
          (a, b) =>
            parseFloat(b.price) -
            parseFloat(a.price)
        );
        break;

      case "name":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return result;
  }, [allProducts, priceRange, sortBy]);

  /* =======================================================
     PAGE TITLE
  ======================================================= */

  const pageTitle = query
    ? `Search Results`
    : categoryParam
    ? categoryTitles[categoryParam] ||
      "Our Products"
    : "Our Products";

  const hasFilters =
    priceRange !== "all" ||
    sortBy !== "default" ||
    !!categoryParam ||
    !!query;

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setPriceRange("all");
    setSortBy("default");

    if (
      categoryParam ||
      query
    ) {
      window.location.href = "/products";
    }
  };

  /* =======================================================
     FILTER CONTENT
  ======================================================= */

  const FilterContent = () => (
    <div className="space-y-7">

      {/* =================================================
          CONCERNS
      ================================================= */}

      <div>

        <div className="flex items-center gap-2 mb-3">

          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FilterIcon className="w-4 h-4" />
          </div>

          <h3 className="font-bold text-sm text-gray-900">
            Shop by Concern
          </h3>

        </div>

        <div className="space-y-1">

          {concerns.map((concern) => (
            <Link
              key={concern.slug}
              href={`/concerns/${concern.slug}`}
              onClick={() =>
                setMobileFilterOpen(false)
              }
              className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-xs md:text-sm text-gray-600 hover:bg-[#f0f7f4] hover:text-primary transition"
            >

              <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-primary shrink-0 text-xs">
                {concern.icon}
              </span>

              <span className="truncate">
                {concern.name}
              </span>

            </Link>
          ))}

        </div>

      </div>

      {/* =================================================
          CATEGORY
      ================================================= */}

      <div className="border-t border-gray-100 pt-6">

        <h3 className="font-bold text-sm text-gray-900 mb-3">
          Category
        </h3>

        <div className="space-y-1">

          <Link
            href="/products"
            onClick={() =>
              setMobileFilterOpen(false)
            }
            className={`flex items-center justify-between py-2 px-2.5 rounded-xl text-sm transition ${
              !categoryParam
                ? "bg-primary text-white font-semibold"
                : "text-gray-600 hover:bg-[#f0f7f4] hover:text-primary"
            }`}
          >
            <span>All Products</span>

            {!categoryParam && (
              <CheckIcon className="w-4 h-4" />
            )}
          </Link>

          {Object.entries(categoryTitles).map(
            ([slug, name]) => (
              <Link
                key={slug}
                href={`/products?category=${slug}`}
                onClick={() =>
                  setMobileFilterOpen(false)
                }
                className={`flex items-center justify-between py-2 px-2.5 rounded-xl text-sm transition ${
                  categoryParam === slug
                    ? "bg-primary text-white font-semibold"
                    : "text-gray-600 hover:bg-[#f0f7f4] hover:text-primary"
                }`}
              >
                <span>{name}</span>

                {categoryParam === slug && (
                  <CheckIcon className="w-4 h-4" />
                )}
              </Link>
            )
          )}

        </div>

      </div>

      {/* =================================================
          PRICE
      ================================================= */}

      <div className="border-t border-gray-100 pt-6">

        <h3 className="font-bold text-sm text-gray-900 mb-3">
          Price
        </h3>

        <div className="space-y-1">

          {priceRanges.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() =>
                setPriceRange(range.value)
              }
              className={`w-full flex items-center justify-between text-left py-2 px-2.5 rounded-xl text-sm transition ${
                priceRange === range.value
                  ? "bg-primary text-white font-semibold"
                  : "text-gray-600 hover:bg-[#f0f7f4] hover:text-primary"
              }`}
            >
              <span>{range.label}</span>

              {priceRange === range.value && (
                <CheckIcon className="w-4 h-4" />
              )}
            </button>
          ))}

        </div>

      </div>

      {/* =================================================
          CLEAR
      ================================================= */}

      {hasFilters && (
        <div className="border-t border-gray-100 pt-5">

          <button
            type="button"
            onClick={clearFilters}
            className="w-full py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 text-sm font-semibold transition"
          >
            Clear All Filters
          </button>

        </div>
      )}

    </div>
  );

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f8faf9]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="bg-white border-b border-gray-100">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div>

              <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] font-bold text-primary mb-1.5">
                AMROHA PHARMACY
              </p>

              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900">
                {pageTitle}
              </h1>

              {query && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing results for{" "}
                  <span className="font-semibold text-gray-700">
                    &quot;{query}&quot;
                  </span>
                </p>
              )}

              {!query && (
                <p className="text-sm text-gray-500 mt-2">
                  Explore our Ayurvedic & Unani wellness collection.
                </p>
              )}

            </div>

            {/* Product Count */}

            <div className="self-start md:self-auto bg-[#f0f7f4] border border-[#e1eee9] rounded-full px-4 py-2">

              <span className="text-xs font-semibold text-primary">
                {loading
                  ? "Loading products..."
                  : `${filteredProducts.length} product${
                      filteredProducts.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-8">

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block lg:col-span-1">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">

              <div className="flex items-center justify-between mb-5">

                <div className="flex items-center gap-2">

                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <SlidersIcon className="w-4 h-4" />
                  </div>

                  <h2 className="font-bold text-gray-900">
                    Filters
                  </h2>

                </div>

              </div>

              <FilterContent />

            </div>

          </aside>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="lg:col-span-3">

            {/* Toolbar */}

            <div className="flex items-center justify-between gap-3 mb-5">

              {/* Mobile Filter */}

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(true)
                }
                className="lg:hidden inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition"
              >
                <SlidersIcon className="w-4 h-4" />
                Filters
              </button>

              {/* Active filter indicator */}

              {hasFilters && (
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">

                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />

                  Filters applied

                </div>
              )}

              {/* Sort */}

              <div className="flex items-center gap-2 ml-auto">

                <span className="hidden sm:block text-xs text-gray-500">
                  Sort by
                </span>

                <div className="relative">

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value)
                    }
                    className="
                      appearance-none
                      bg-white
                      border border-gray-200
                      rounded-xl
                      pl-3 pr-9
                      py-2.5
                      text-xs md:text-sm
                      font-semibold
                      text-gray-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary/10
                      focus:border-primary
                      cursor-pointer
                    "
                  >
                    {sortOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-4 h-4" />

                </div>

              </div>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">

                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <ProductSkeleton
                      key={index}
                    />
                  )
                )}

              </div>

            ) : filteredProducts.length === 0 ? (

              /* ===============================================
                 EMPTY STATE
              =============================================== */

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-5 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f0f7f4] text-primary flex items-center justify-center mb-5">
                  <SearchIcon />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  No products found
                </h2>

                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  We couldn&apos;t find products matching your current search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-bold transition"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              /* ===============================================
                 PRODUCTS GRID
              =============================================== */

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">

                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}

              </div>

            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ===================================================== */}

      {mobileFilterOpen && (
        <>

          {/* Overlay */}

          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={() =>
              setMobileFilterOpen(false)
            }
          />

          {/* Drawer */}

          <div className="fixed right-0 top-0 bottom-0 w-[330px] max-w-[88vw] bg-white z-50 shadow-2xl lg:hidden flex flex-col">

            {/* Drawer Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">

              <div className="flex items-center gap-2.5">

                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <SlidersIcon className="w-4 h-4" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Filters
                  </h2>

                  <p className="text-[10px] text-gray-400">
                    Refine your products
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(false)
                }
                aria-label="Close filters"
                className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
              >
                <XIcon />
              </button>

            </div>

            {/* Drawer Content */}

            <div className="flex-1 overflow-y-auto p-5">

              <FilterContent />

            </div>

            {/* Drawer Footer */}

            <div className="border-t border-gray-100 p-4 shrink-0 bg-white">

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(false)
                }
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-sm font-bold transition"
              >
                Show{" "}
                {filteredProducts.length} Products
              </button>

            </div>

          </div>

        </>
      )}

    </main>
  );
}

/* =========================================================
   PAGE WRAPPER
========================================================= */

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8faf9]">

          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

            <div className="animate-pulse">

              <div className="h-3 bg-gray-200 rounded w-32 mb-3" />

              <div className="h-9 bg-gray-200 rounded w-64 mb-3" />

              <div className="h-4 bg-gray-200 rounded w-80 mb-8" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <ProductSkeleton
                      key={index}
                    />
                  )
                )}

              </div>

            </div>

          </div>

        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}