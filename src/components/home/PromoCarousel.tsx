"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import RevealSection from "@/components/home/RevealSection";
import type { BannerDTO } from "@/lib/banners";

// Theme -> Tailwind classes. Kept in /components (not /lib) on purpose:
// tailwind.config.ts only scans src/app and src/components, so classes
// written anywhere else would be purged from the CSS.
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

  if (promos.length === 0) return null;

  return (
<RevealSection className="py-4 bg-white">
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
                {promos.map((promo, idx) => {
                let content;

                if (promo.layout === "image-only") {
                  content = (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/7] sm:aspect-[16/5] bg-gray-100">
                      {promo.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={promo.image} alt={promo.title || "Banner"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Banner</div>
                      )}
                    </div>
                  );
                } else if (promo.layout === "overlay") {
                  content = (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/7] sm:aspect-[16/5] bg-gray-100">
                      {promo.image && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center p-4 md:p-6 text-white">
                        <p className="text-[10px] md:text-xs font-bold tracking-wide uppercase opacity-90 mb-1">{promo.brand}</p>
                        <h3 className="text-2xl md:text-4xl font-black leading-tight mb-1">{promo.title}</h3>
                        <p className="text-xs md:text-base opacity-90">{promo.subtitle}</p>
                      </div>
                    </div>
                  );
                } else {
                  content = (
                    <div className={`${promo.bg} rounded-2xl p-4 md:p-6 flex items-center justify-between gap-4 hover:shadow-md transition`}>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] md:text-xs font-bold ${promo.brandColor} mb-1 tracking-wide uppercase`}>{promo.brand}</p>
                        <h3 className={`text-2xl md:text-4xl font-black ${promo.text} leading-tight mb-1`}>{promo.title}</h3>
                        <p className={`text-xs md:text-base ${promo.text} opacity-80`}>{promo.subtitle}</p>
                      </div>
                      <div className="shrink-0 w-28 h-28 md:w-44 md:h-44 relative">
                        {promo.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={promo.image} alt={promo.title} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-white/50 rounded flex items-center justify-center text-gray-400 text-xs">Image</div>
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
                    ) : (content)}
                  </div>
                );
              })}
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
      </RevealSection>
  );
}
