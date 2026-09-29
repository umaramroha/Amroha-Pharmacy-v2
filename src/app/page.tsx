"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FeaturedProducts from "@/components/home/FeaturedProducts";

/* =========================================================
   TYPES
========================================================= */

type IconProps = {
  className?: string;
};

/* =========================================================
   ICONS
========================================================= */

function ShieldIcon({ className = "w-5 h-5" }: IconProps) {
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

function TruckIcon({ className = "w-5 h-5" }: IconProps) {
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

function CardIcon({ className = "w-5 h-5" }: IconProps) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: IconProps) {
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
      <path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 8.6 8.6 0 0 1-4-.95L3 21l1.9-5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </svg>
  );
}

function HeartIcon({ className = "w-5 h-5" }: IconProps) {
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
      <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
    </svg>
  );
}

function MaleWellnessIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="10" cy="14" r="5" />
      <path d="m14 10 6-6" />
      <path d="M16 4h4v4" />
    </svg>
  );
}

function SexualHealthIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
      <path d="M12 9v6" />
      <path d="M9 12h6" />
    </svg>
  );
}

function FertilityIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
      <path d="M18 5c1.5-1.5 2.5-2 3-2" />
    </svg>
  );
}

function WomenIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="4.5" />
      <path d="M12 12.5V22" />
      <path d="M8.5 19h7" />
    </svg>
  );
}

function DropIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z" />
      <path d="M9.5 15.5a2.8 2.8 0 0 0 5 0" />
    </svg>
  );
}

function DigestiveIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 3v6c0 2 1.5 3 3.5 3H13c2 0 3 1.5 3 3.5V21" />
      <path d="M8 3h4" />
      <path d="M16 3v4" />
      <path d="M5 21h11" />
    </svg>
  );
}

function ScaleIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 7h14l2 14H3L5 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
      <path d="m12 11 2 3" />
      <path d="M12 14h.01" />
    </svg>
  );
}

function JointIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 4a3 3 0 1 1 5.8 1.1l-2.2 4.5a3 3 0 0 0 .7 3.5l2.9 2.4a3 3 0 1 1-3.8 4.6l-3-2.5a8 8 0 0 1-1.8-9.5l1.6-3.2A3 3 0 0 1 8 4Z" />
    </svg>
  );
}

/* =========================================================
   DATA
========================================================= */

const promos = [
  {
    eyebrow: "AYURVEDIC & UNANI",
    title: "Wellness essentials",
    subtitle:
      "Explore products for everyday health & wellness.",
    badge: "Explore Range",
    bg: "bg-[#edf7f3]",
    accent: "text-[#0f4c3a]",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    href: "/products?category=general-problems",
  },
  {
    eyebrow: "EVERYDAY WELLNESS",
    title: "Better care, delivered",
    subtitle:
      "Browse our range of Ayurvedic & Unani products.",
    badge: "Shop Products",
    bg: "bg-[#eef5fb]",
    accent: "text-[#185a7a]",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500",
    href: "/products",
  },
  {
    eyebrow: "MEN'S WELLNESS",
    title: "Care for men's health",
    subtitle:
      "Explore our men's wellness collection.",
    badge: "Explore Men's Care",
    bg: "bg-[#f7f1e7]",
    accent: "text-[#805b25]",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
    href: "/products?category=male-problems",
  },
];

const concerns = [
  {
    name: "Men's Wellness",
    slug: "mens-vitality",
    icon: <MaleWellnessIcon />,
  },
  {
    name: "Sexual Wellness",
    slug: "sexual-health",
    icon: <SexualHealthIcon />,
  },
  {
    name: "Male Fertility",
    slug: "male-fertility",
    icon: <FertilityIcon />,
  },
  {
    name: "Women's Wellness",
    slug: "womens-health",
    icon: <WomenIcon />,
  },
  {
    name: "White Discharge",
    slug: "white-discharge",
    icon: <DropIcon />,
  },
  {
    name: "Digestive Care",
    slug: "gastric-digestion",
    icon: <DigestiveIcon />,
  },
  {
    name: "Weight Management",
    slug: "weight-loss",
    icon: <ScaleIcon />,
  },
  {
    name: "Joints & Pain",
    slug: "joints-pain",
    icon: <JointIcon />,
  },
];

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % promos.length);
  };

  const previousBanner = () => {
    setBannerIndex(
      (prev) => (prev - 1 + promos.length) % promos.length
    );
  };

  return (
    <main className="bg-[#f8faf9] text-gray-900">

      {/* =====================================================
          TRUST STRIP
      ===================================================== */}

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">

            <div className="flex items-center justify-center gap-2.5 py-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ShieldIcon className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-800">
                  Authentic
                </p>
                <p className="text-[9px] text-gray-400">
                  Carefully sourced
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 py-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <TruckIcon className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-800">
                  Delivery
                </p>
                <p className="text-[9px] text-gray-400">
                  Eligible locations
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 py-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <CardIcon className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-800">
                  Easy Payment
                </p>
                <p className="text-[9px] text-gray-400">
                  Multiple options
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center gap-2.5 py-3">
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <WhatsAppIcon className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-800">
                  WhatsApp
                </p>
                <p className="text-[9px] text-gray-400">
                  Easy assistance
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          HERO SLIDER
      ===================================================== */}

      <section className="bg-white py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl"
            onTouchStart={(e) => {
              setTouchStart(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              if (touchStart === null) return;

              const diff =
                touchStart - e.changedTouches[0].clientX;

              if (diff > 50) {
                nextBanner();
              } else if (diff < -50) {
                previousBanner();
              }

              setTouchStart(null);
            }}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${bannerIndex * 100}%)`,
              }}
            >
              {promos.map((promo, index) => (
                <div
                  key={promo.title}
                  className={`w-full shrink-0 ${promo.bg}`}
                >
                  <Link
                    href={promo.href}
                    className="min-h-[190px] md:min-h-[280px] flex items-center justify-between px-5 py-6 md:px-12 md:py-10"
                  >
                    <div className="max-w-xl">

                      <p
                        className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] ${promo.accent} mb-2`}
                      >
                        {promo.eyebrow}
                      </p>

                      <h1 className="text-2xl md:text-5xl font-black tracking-tight leading-[1.05] text-gray-900">
                        {promo.title}
                      </h1>

                      <p className="text-xs md:text-base text-gray-600 mt-2 md:mt-3 max-w-md">
                        {promo.subtitle}
                      </p>

                      <span
                        className={`inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-white text-xs md:text-sm font-bold shadow-sm ${promo.accent}`}
                      >
                        {promo.badge}
                        <span>→</span>
                      </span>

                    </div>

                    <div className="relative w-28 h-28 md:w-52 md:h-52 shrink-0">
                      <Image
                        src={promo.image}
                        alt={promo.title}
                        fill
                        priority={index === 0}
                        className="object-contain"
                        sizes="(max-width: 768px) 112px, 208px"
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop arrows */}

            <button
              type="button"
              onClick={previousBanner}
              aria-label="Previous banner"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-sm items-center justify-center text-gray-700 hover:text-primary transition"
            >
              ←
            </button>

            <button
              type="button"
              onClick={nextBanner}
              aria-label="Next banner"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-sm items-center justify-center text-gray-700 hover:text-primary transition"
            >
              →
            </button>
          </div>

          {/* Slider dots */}

          <div className="flex justify-center gap-1.5 mt-3">
            {promos.map((promo, index) => (
              <button
                key={promo.title}
                type="button"
                onClick={() => setBannerIndex(index)}
                aria-label={`Show banner ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === bannerIndex
                    ? "w-7 bg-primary"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          SHOP BY CONCERN
      ===================================================== */}

      <section className="bg-white py-7 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <div className="flex items-end justify-between mb-5">

            <div>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.16em] uppercase text-primary mb-1">
                FIND WHAT YOU NEED
              </p>

              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                Shop by Concern
              </h2>

              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Browse products by wellness category
              </p>
            </div>

            <Link
              href="/concerns"
              className="text-xs md:text-sm font-bold text-primary whitespace-nowrap hover:underline"
            >
              View All →
            </Link>

          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-x-2 gap-y-6 md:gap-x-4">

            {concerns.map((concern) => (
              <Link
                key={concern.slug}
                href={`/concerns/${concern.slug}`}
                className="group flex flex-col items-center text-center"
              >

                <div
                  className="
                    w-14 h-14
                    md:w-20 md:h-20
                    rounded-2xl
                    bg-[#f0f7f4]
                    border border-[#e1eee9]
                    text-primary
                    flex items-center justify-center
                    transition-all duration-300
                    group-hover:bg-primary
                    group-hover:text-white
                    group-hover:border-primary
                    group-hover:-translate-y-1
                    group-hover:shadow-md
                  "
                >
                  {concern.icon}
                </div>

                <p className="mt-2 text-[9px] md:text-xs font-semibold text-gray-700 leading-tight group-hover:text-primary transition max-w-[80px]">
                  {concern.name}
                </p>

              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}

      <section className="py-7 md:py-10 bg-[#f8faf9]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <div className="mb-5">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.16em] uppercase text-primary mb-1">
              EXPLORE COLLECTIONS
            </p>

            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">

            {/* Male */}

            <Link
              href="/products?category=male-problems"
              className="group relative overflow-hidden rounded-2xl bg-[#eaf5f1] p-5 md:p-7 min-h-[155px] flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="relative z-10">

                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  COLLECTION
                </span>

                <h3 className="text-xl md:text-2xl font-bold mt-1 text-gray-900">
                  Men&apos;s Wellness
                </h3>

                <p className="text-xs text-gray-600 mt-1">
                  Explore men&apos;s care products
                </p>

              </div>

              <span className="relative z-10 text-xs font-bold text-primary mt-4">
                Shop Now →
              </span>

              <span className="absolute -right-4 -bottom-10 text-[110px] font-black text-primary/5">
                M
              </span>
            </Link>

            {/* Female */}

            <Link
              href="/products?category=female-problems"
              className="group relative overflow-hidden rounded-2xl bg-[#fff2f5] p-5 md:p-7 min-h-[155px] flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="relative z-10">

                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600">
                  COLLECTION
                </span>

                <h3 className="text-xl md:text-2xl font-bold mt-1 text-gray-900">
                  Women&apos;s Wellness
                </h3>

                <p className="text-xs text-gray-600 mt-1">
                  Explore women&apos;s care products
                </p>

              </div>

              <span className="relative z-10 text-xs font-bold text-pink-600 mt-4">
                Shop Now →
              </span>

              <span className="absolute -right-4 -bottom-10 text-[110px] font-black text-pink-500/5">
                W
              </span>
            </Link>

            {/* General */}

            <Link
              href="/products?category=general-problems"
              className="group relative overflow-hidden rounded-2xl bg-[#eef6ec] p-5 md:p-7 min-h-[155px] flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="relative z-10">

                <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">
                  COLLECTION
                </span>

                <h3 className="text-xl md:text-2xl font-bold mt-1 text-gray-900">
                  General Wellness
                </h3>

                <p className="text-xs text-gray-600 mt-1">
                  Everyday health & wellness
                </p>

              </div>

              <span className="relative z-10 text-xs font-bold text-green-700 mt-4">
                Shop Now →
              </span>

              <span className="absolute -right-4 -bottom-10 text-[110px] font-black text-green-700/5">
                G
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
          BEST SELLERS
      ===================================================== */}

      <section className="bg-white py-7 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <div className="flex items-end justify-between mb-5">

            <div>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.16em] uppercase text-primary mb-1">
                POPULAR PRODUCTS
              </p>

              <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                Best Sellers
              </h2>

              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Popular choices from our store
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs md:text-sm font-bold text-primary whitespace-nowrap hover:underline"
            >
              View All →
            </Link>

          </div>

          <FeaturedProducts />

        </div>
      </section>

      {/* =====================================================
          TRUST / SERVICES
      ===================================================== */}

      <section className="py-7 md:py-10 bg-[#f8faf9]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <div className="text-center mb-6">

            <p className="text-[10px] md:text-xs font-bold tracking-[0.16em] uppercase text-primary mb-1">
              THE AMROHA PHARMACY DIFFERENCE
            </p>

            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              Simple, reliable healthcare shopping
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldIcon />
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Authentic Products
                </h3>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Carefully sourced Ayurvedic & Unani products.
                </p>
              </div>

            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TruckIcon />
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Doorstep Delivery
                </h3>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Convenient delivery across eligible locations.
                </p>
              </div>

            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <WhatsAppIcon />
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Easy Ordering
                </h3>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Order online or contact us for assistance.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
      ===================================================== */}

      <section className="bg-white py-7 md:py-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6">

          <div className="rounded-2xl md:rounded-3xl bg-primary px-5 py-7 md:px-10 md:py-9 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/60 mb-2">
                NEED ASSISTANCE?
              </p>

              <h2 className="text-xl md:text-3xl font-bold">
                Not sure what to choose?
              </h2>

              <p className="text-xs md:text-sm text-white/70 mt-1.5 max-w-lg">
                Contact Amroha Pharmacy for product and ordering assistance.
              </p>

            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-5 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition shrink-0"
            >
              Contact Us
              <span>→</span>
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="py-8 md:py-12 bg-[#f8faf9] border-t border-gray-100">

        <div className="max-w-2xl mx-auto px-4 text-center">

          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M8 10a4 4 0 0 0 8 0" />
            </svg>
          </div>

          <h2 className="text-xl md:text-3xl font-bold">
            Explore Amroha Pharmacy
          </h2>

          <p className="text-xs md:text-sm text-gray-500 mt-1.5">
            Browse our Ayurvedic & Unani wellness collection.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-5 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-bold transition"
          >
            Browse Products
            <span>→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}