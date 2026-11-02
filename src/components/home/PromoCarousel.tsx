"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BannerDTO } from "@/lib/banners";

const THEME_MAP: Record<string, { bg: string; brandColor: string; text: string }> = {
  teal: { bg: "bg-gradient-to-r from-teal-50 to-teal-100", brandColor: "text-teal-700", text: "text-gray-900" },
  blue: { bg: "bg-gradient-to-r from-blue-50 to-blue-100", brandColor: "text-blue-700", text: "text-gray-900" },
  amber: { bg: "bg-gradient-to-r from-amber-50 to-amber-100", brandColor: "text-amber-700", text: "text-gray-900" },
  rose: { bg: "bg-gradient-to-r from-rose-50 to-rose-100", brandColor: "text-rose-700", text: "text-gray-900" },
  indigo: { bg: "bg-gradient-to-r from-indigo-50 to-indigo-100", brandColor: "text-indigo-700", text: "text-gray-900" },
  emerald: { bg: "bg-gradient-to-r from-emerald-50 to-emerald-100", brandColor: "text-emerald-700", text: "text-gray-900" },
};

export default function PromoCarousel({ banners }: { banners: BannerDTO[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const promos = banners.map((b) => {
    const t = THEME_MAP[b.theme] || THEME_MAP.teal;
    return { ...b, ...t, href: b.linkUrl || "" };
  });

  useEffect(() => {
    if (paused || promos.length <= 1) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % promos.length), 5000);
    return () => clearInterval(timer);
  }, [paused, promos.length]);

  if (promos.length === 0) return null;

  const next = () => setIndex((prev) => (prev + 1) % promos.length);
  const prev = () => setIndex((prev) => (prev - 1 + promos.length) % promos.length);

  return (
    <div className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; setPaused(true); }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) next(); else if (diff < -50) prev();
          touchStartX.current = null; setPaused(false);
        }}
      >
        <div className="overflow-hidden rounded-3xl">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
            {promos.map((promo, idx) => {
              let content;
              if (promo.layout === "image-only") {
                content = (
                  <div className="relative aspect-[16/7] sm:aspect-[16/5] bg-gray-100">
                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                  </div>
                );
              } else if (promo.layout === "overlay") {
                content = (
                  <div className="relative aspect-[16/7] sm:aspect-[16/5] bg-gray-100">
                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center p-6 md:p-12 text-white">
                      <p className="text-xs md:text-sm font-bold tracking-wide uppercase opacity-90 mb-2">{promo.brand}</p>
                      <h3 className="text-2xl md:text-5xl font-black leading-tight mb-2">{promo.title}</h3>
                      <p className="text-sm md:text-lg opacity-90 max-w-lg">{promo.subtitle}</p>
                    </div>
                  </div>
                );
              } else {
                content = (
                  <div className={`${promo.bg} aspect-[16/7] sm:aspect-[16/5] p-6 md:p-12 flex items-center justify-between gap-4`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs md:text-sm font-bold ${promo.brandColor} mb-2 tracking-wide uppercase`}>{promo.brand}</p>
                      <h3 className={`text-2xl md:text-5xl font-black ${promo.text} leading-tight mb-2`}>{promo.title}</h3>
                      <p className={`text-sm md:text-lg ${promo.text} opacity-80 max-w-lg`}>{promo.subtitle}</p>
                    </div>
                    <div className="shrink-0 w-32 h-32 md:w-64 md:h-64 relative hidden sm:block">
                      <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-contain drop-shadow-xl" />
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className="shrink-0 w-full" style={{ aspectRatio: promo.width && promo.height ? `${promo.width}/${promo.height}` : undefined }}>
                  {promo.href ? <Link href={promo.href} className="block">{content}</Link> : content}
                </div>
              );
            })}
          </div>
        </div>

        {promos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white text-gray-800 z-10 hidden md:flex"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white text-gray-800 z-10 hidden md:flex"><ChevronRight className="w-5 h-5" /></button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {promos.map((_, idx) => (
                <button key={idx} onClick={() => setIndex(idx)} className={`transition-all duration-300 rounded-full ${index === idx ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/60 hover:bg-white"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}