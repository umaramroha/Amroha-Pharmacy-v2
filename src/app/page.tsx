"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  const [bannerIndex, setBannerIndex] = useState(0);
const [promos, setPromos] = useState<any[]>([]);
const [bannersLoading, setBannersLoading] = useState(true);

useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners", { cache: "no-store" });
      const data = await res.json();

      // Theme → Tailwind classes map
      const THEME_MAP: Record<string, { bg: string; brandColor: string; text: string }> = {
        teal: { bg: "bg-gradient-to-r from-teal-50 to-teal-100", brandColor: "text-teal-700", text: "text-gray-900" },
        blue: { bg: "bg-gradient-to-r from-blue-50 to-blue-100", brandColor: "text-blue-700", text: "text-gray-900" },
        amber: { bg: "bg-gradient-to-r from-amber-50 to-amber-100", brandColor: "text-amber-700", text: "text-gray-900" },
        rose: { bg: "bg-gradient-to-r from-rose-50 to-rose-100", brandColor: "text-rose-700", text: "text-gray-900" },
        indigo: { bg: "bg-gradient-to-r from-indigo-50 to-indigo-100", brandColor: "text-indigo-700", text: "text-gray-900" },
        emerald: { bg: "bg-gradient-to-r from-emerald-50 to-emerald-100", brandColor: "text-emerald-700", text: "text-gray-900" },
      };

      const mapped = (data.banners || []).map((b: any) => {
        const t = THEME_MAP[b.theme] || THEME_MAP.teal;
        return {
          brand: b.brand,
          title: b.title,
          subtitle: b.subtitle || "",
          brandColor: t.brandColor,
          bg: t.bg,
          text: t.text,
          image: b.imageUrl,
          href: b.linkUrl || "",
        };
      });

      setPromos(mapped);
      setBannerIndex(0);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    } finally {
      setBannersLoading(false);
    }
  };

  fetchBanners();
}, []);

  const concerns = [
    { name: "Men's Vitality", icon: "🦁", slug: "mens-vitality" },
    { name: "Sexual Health", icon: "🛡️", slug: "sexual-health" },
    { name: "Male Fertility", icon: "👶", slug: "male-fertility" },
    { name: "Women's Health", icon: "💗", slug: "womens-health" },
    { name: "Likoria", icon: "🩺", slug: "white-discharge" },
    { name: "Gastric & Acidity", icon: "🫀", slug: "gastric-digestion" },
    { name: "Weight Loss", icon: "📏", slug: "weight-loss" },
    { name: "Weight Gain", icon: "💪", slug: "weight-gain" },
    { name: "Joints & Pain", icon: "🦵", slug: "joints-pain" },
    { name: "Diabetes", icon: "🩸", slug: "diabetes" },
  ];

  return (
    <div>
      {/* ============================================ */}
      {/* MOBILE + DESKTOP: TRUST BADGES (Desktop Only on mobile?) */}
      {/* ============================================ */}
      {/* Trust Badges — Desktop only */}
      <section className="hidden md:block bg-white py-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[
              { icon: "✅", label: "100% Authentic" },
              { icon: "🚚", label: "Fast Delivery" },
              { icon: "💵", label: "COD Available" },
              { icon: "💬", label: "WhatsApp" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1 text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg md:text-xl">{item.icon}</span>
                </div>
                <p className="text-[10px] md:text-xs font-semibold text-gray-700 leading-tight">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MOBILE + DESKTOP: PROMO BANNER */}
      {/* ============================================ */}
{promos.length > 0 && (
<section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative px-4 md:px-6"
            onTouchStart={(e) => {
              (window as any).__bannerTouch = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const start = (window as any).__bannerTouch;
              if (start === null || start === undefined) return;
              const diff = start - e.changedTouches[0].clientX;
              if (diff > 50) {
                setBannerIndex((prev) => (prev + 1) % promos.length);
              } else if (diff < -50) {
                setBannerIndex(
                  (prev) => (prev - 1 + promos.length) % promos.length
                );
              }
            }}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${bannerIndex * 100}%)`,
                }}
              >
                {promos.map((promo, idx) => (
                  <div key={idx} className="shrink-0 w-full">
                    <Link
                      href={promo.href}
                      target={
                        promo.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        promo.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={`block ${promo.bg} rounded-2xl p-4 md:p-6 flex items-center justify-between gap-4 hover:shadow-md transition`}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[10px] md:text-xs font-bold ${promo.brandColor} mb-1 tracking-wide uppercase`}
                        >
                          {promo.brand}
                        </p>
                        <h3
                          className={`text-2xl md:text-4xl font-black ${promo.text} leading-tight mb-1`}
                        >
                          {promo.title}
                        </h3>
                        <p
                          className={`text-xs md:text-base ${promo.text} opacity-80`}
                        >
                          {promo.subtitle}
                        </p>
                      </div>

                      <div className="shrink-0 w-20 h-20 md:w-32 md:h-32 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
           src={promo.image}
           alt={promo.title}
           className="w-full h-full object-contain"
          />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 mt-3">
              {promos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setBannerIndex(idx)}
                  aria-label={`Go to banner ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    bannerIndex === idx
                      ? "w-7 h-2 bg-teal-700"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ============================================ */}
      {/* DESKTOP ONLY: SHOP BY CONCERN */}
      {/* ============================================ */}
      <section className="hidden md:block py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Shop by Concern
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Natural solutions for every health concern
              </p>
            </div>
            <Link
              href="/concerns"
              className="text-primary text-xs md:text-sm font-semibold hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {concerns.map((concern) => (
              <Link
                key={concern.slug}
                href={`/concerns/${concern.slug}`}
                className="group flex flex-col items-center text-center p-2 rounded-xl hover:bg-primary/5 transition"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary group-hover:scale-105 transition duration-300">
                  <span className="text-2xl md:text-3xl">{concern.icon}</span>
                </div>
                <h3 className="text-[10px] md:text-sm font-semibold text-gray-800 group-hover:text-primary transition leading-tight">
                  {concern.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DESKTOP ONLY: SHOP BY CATEGORY */}
      {/* ============================================ */}
      <section className="hidden md:block py-6 md:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-5">
            Shop by Category
          </h2>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <Link
              href="/products?category=male-problems"
              className="group p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center border-t-4 border-primary"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">💊</span>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-primary">
                Male
              </h3>
              <p className="text-[10px] md:text-xs text-gray-600 mt-1">
                Men&apos;s wellness
              </p>
            </Link>

            <Link
              href="/products?category=female-problems"
              className="group p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center border-t-4 border-secondary"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🌸</span>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-secondary">
                Female
              </h3>
              <p className="text-[10px] md:text-xs text-gray-600 mt-1">
                Women&apos;s wellness
              </p>
            </Link>

            <Link
              href="/products?category=general-problems"
              className="group p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center border-t-4 border-green-600"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🌿</span>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-green-700">
                General
              </h3>
              <p className="text-[10px] md:text-xs text-gray-600 mt-1">
                Everyday health
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MOBILE + DESKTOP: BEST SELLING PRODUCTS */}
      {/* ============================================ */}
      <section className="py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Best Selling Products
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Hamare sabse popular products
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary text-xs md:text-sm font-semibold hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* ============================================ */}
      {/* DESKTOP ONLY: WHY CHOOSE US */}
      {/* ============================================ */}
      <section className="hidden md:block py-6 md:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-5 text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <h3 className="text-base md:text-lg font-bold mb-1">
                Authentic Products
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                100% genuine Ayurvedic & Unani medicines.
              </p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-xl">🚚</span>
              </div>
              <h3 className="text-base md:text-lg font-bold mb-1">
                Fast Delivery
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Quick delivery with Cash on Delivery option.
              </p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍⚕️</span>
              </div>
              <h3 className="text-base md:text-lg font-bold mb-1">
                Expert Support
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Guidance from qualified experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DESKTOP ONLY: TESTIMONIALS */}
      {/* ============================================ */}
      <section className="hidden md:block py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-5 text-gray-900">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div className="bg-background rounded-xl border p-4 md:p-6">
              <div className="flex gap-0.5 text-secondary mb-3 text-sm">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-xs md:text-sm text-gray-700 mb-4 leading-relaxed">
                &ldquo;Bahut achhi quality ki medicines hain. Delivery bhi fast
                thi. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">
                    Rahul Khan
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-500">Amroha</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl border p-4 md:p-6">
              <div className="flex gap-0.5 text-secondary mb-3 text-sm">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-xs md:text-sm text-gray-700 mb-4 leading-relaxed">
                &ldquo;WhatsApp pe order karna bahut aasan tha. Saath hi
                guidance bhi mili. Thank you!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  F
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">
                    Fatima Ansari
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    Moradabad
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl border p-4 md:p-6">
              <div className="flex gap-0.5 text-secondary mb-3 text-sm">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-xs md:text-sm text-gray-700 mb-4 leading-relaxed">
                &ldquo;Genuine products aur reasonable price. Poore family ke
                liye yahan se order kiya.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">Adnan Ali</p>
                  <p className="text-[10px] md:text-xs text-gray-500">Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DESKTOP ONLY: NEWSLETTER */}
      {/* ============================================ */}
      <section className="hidden md:block py-6 md:py-10 bg-primary/5">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-2 text-primary">
            Get Health Tips & Offers
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mb-4">
            Subscribe to receive Ayurvedic tips and exclusive offers
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as any).email.value;
              const msg = `📧 Newsletter Subscribe\n\nEmail: ${email}`;
              window.open(
                `https://wa.me/918077988509?text=${encodeURIComponent(msg)}`,
                "_blank"
              );
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm transition whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ============================================ */}
      {/* MOBILE + DESKTOP: TALK TO EXPERT */}
      {/* ============================================ */}
      <section className="py-8 md:py-10 bg-background">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl">👨‍⚕️</span>
          </div>
          <h2 className="text-xl md:text-3xl font-bold mb-2 text-gray-900">
            Need Help Choosing?
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mb-5">
            Our experts are here to help you find the right medicine.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 md:px-8 py-3 rounded-full font-semibold text-sm transition shadow-md"
          >
            <span>💬</span>
            <span>Talk to an Expert</span>
          </Link>
        </div>
      </section>

      {/* ============================================ */}
      {/* MOBILE ONLY: WHATSAPP FLOATING BUTTON */}
      {/* ============================================ */}
      <a
        href="https://wa.me/918077988509?text=Hello%20Amroha%20Pharmacy%2C%20mujhe%20madad%20chahiye"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="md:hidden fixed right-4 bottom-20 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition transform hover:scale-110"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
