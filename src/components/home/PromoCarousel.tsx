"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BannerDTO } from "@/lib/banners";

// Theme -> Tailwind classes
const THEME_MAP: Record<string, { bg: string; brandColor: string; text: string }> = {
  teal: { bg: "bg-gradient-to-r from-teal-50 to-teal-100", brandColor: "text-teal-700", text: "text-gray-900" },
  blue: { bg: "bg-gradient-to-r from-blue-50 to-blue-100", brandColor: "text-blue-700", text: "text-gray-900" },
  amber: { bg: "bg-gradient-to-r from-amber-50 to-amber-100", brandColor: "text-amber-700", text: "text-gray-900" },
  rose: { bg: "bg-gradient-to-r from-rose-50 to-rose-100", brandColor: "text-rose-700", text: "text-gray-900" },
  indigo: { bg: "bg-gradient-to-r from-indigo-50 to-indigo-100", brandColor: "text-indigo-700", text: "text-gray-900" },
  emerald: { bg: "bg-gradient-to-r from-emerald-50 to-emerald-100", brandColor: "text-emerald-700", text: "text-gray-900" },
};

export default function PromoCarousel({ banners }: { banners: BannerDTO[] }) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const promos = banners.map((b) => {
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
      layout: b.layout || "split",
    };
  });

  // Auto-play logic
  useEffect(() => {
    if (promos.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promos.length]);

  if (promos.length === 0) return null;

  const nextSlide = () => setBannerIndex((prev) => (prev + 1) % promos.length);
  const prevSlide = () => setBannerIndex((prev) => (prev - 1 + promos.length) % promos.length);

  // THE GOLDEN CLASS: 4:3 on mobile, 16:7 on desktop
  const sizeClass = "aspect-[4/3] sm:aspect-[16/7]";

  return (
    <div className="py-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative px-4 md:px-6"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            if (start === null) return;
            const diff = start - e.changedTouches[0].clientX;
            if (diff > 50) nextSlide();
            else if (diff < -50) prevSlide();
          }}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
            >
              {promos.map((promo, idx) => {
                let content;

                if (promo.layout === "image-only") {
                  content = (
                    <div className={`relative ${sizeClass} bg-gray-100 overflow-hidden`}>
                      {promo.image ? (
                        <img src={promo.image} alt={promo.title || "Banner"} className="w-full h-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Banner</div>
                      )}
                    </div>
                  );
                } else if (promo.layout === "overlay") {
                  content = (
                    <div className={`relative ${sizeClass} bg-gray-100 overflow-hidden`}>
                      {promo.image && (
                        <img src={promo.image} alt={promo.title} className="w-full h-full object-cover object-center" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center p-6 md:p-12 text-white">
                        <p className="text-[10px] md:text-xs font-bold tracking-wide uppercase opacity-90 mb-1 md:mb-2">{promo.brand}</p>
                        <h3 className="text-2xl md:text-5xl font-black leading-tight mb-1 md:mb-2">{promo.title}</h3>
                        <p className="text-xs md:text-base opacity-90 max-w-lg">{promo.subtitle}</p>
                      </div>
                    </div>
                  );
                } else {
                  // SPLIT LAYOUT (Text left, Image right)
                  content = (
                    <div className={`${promo.bg} ${sizeClass} flex items-center justify-between overflow-hidden`}>
                      <div className="flex-1 min-w-0 z-10 p-6 md:p-12">
                        <p className={`text-[10px] md:text-sm font-bold ${promo.brandColor} mb-1 md:mb-2 tracking-wide uppercase`}>{promo.brand}</p>
                        <h3 className={`text-xl md:text-5xl font-black ${promo.text} leading-tight mb-1 md:mb-3`}>{promo.title}</h3>
                        <p className={`text-xs md:text-lg ${promo.text} opacity-80 max-w-md line-clamp-2 md:line-clamp-none`}>{promo.subtitle}</p>
                      </div>
                      <div className="shrink-0 w-[40%] md:w-[45%] h-full relative z-0 flex items-center justify-end pr-4 md:pr-8">
                        {promo.image ? (
                          <img src={promo.image} alt={promo.title} className="w-full h-[80%] md:h-[90%] object-contain drop-shadow-xl" />
                        ) : (
                          <div className="w-full h-full bg-white/40 rounded flex items-center justify-center text-gray-400 text-xs">Image</div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="shrink-0 w-full">
                    {promo.href ? (
                      <Link href={promo.href} target={promo.href.startsWith("http") ? "_blank" : undefined} rel={promo.href.startsWith("http") ? "noopener noreferrer" : undefined} className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrows (Desktop) */}
          {promos.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-md hidden md:flex z-20">
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-md hidden md:flex z-20">
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}

          {/* Dots (Bottom Right) */}
          {promos.length > 1 && (
            <div className="absolute bottom-3 right-8 flex items-center gap-1.5 z-20">
              {promos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setBannerIndex(idx)}
                  aria-label={`Go to banner ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${bannerIndex === idx ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-400/80 hover:bg-gray-600"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
