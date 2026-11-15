"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORY_STYLE } from "@/components/healthTips/categoryStyle";
import type { TipListItem } from "@/components/healthTips/TipsList";
import { TIP_CATEGORIES } from "@/data/healthTips/types";
import { hindiFont } from "@/lib/hindiFont";
import { browserPrefersHindi, readSavedLang, tipPath, type TipLang } from "@/lib/tipLang";

const TEXT = {
  en: {
    title: "Health Tips",
    subtitle: "Simple tips for everyday health",
    viewAll: "View all",
    minRead: "min read",
    readMore: "Read more →",
  },
  hi: {
    title: "हेल्थ टिप्स",
    subtitle: "रोज़मर्रा की सेहत के लिए आसान टिप्स",
    viewAll: "सभी देखें",
    minRead: "मिनट में पढ़ें",
    readMore: "पढ़ें →",
  },
};

export default function HomeHealthTips({ items }: { items: TipListItem[] }) {
  // Server renders English. After load, the saved choice (or a Hindi browser) switches it.
  const [lang, setLang] = useState<TipLang>("en");

  useEffect(() => {
    setLang(readSavedLang() ?? (browserPrefersHindi() ? "hi" : "en"));
  }, []);

  const text = TEXT[lang];
  if (items.length === 0) return null;

  return (
    <section lang={lang} className={`border-t border-gray-100 bg-white py-8 md:py-12 ${lang === "hi" ? hindiFont.className : ""}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-4 flex items-end justify-between md:mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">{text.title}</h2>
            <p className="mt-0.5 text-xs text-gray-500 md:text-sm">{text.subtitle}</p>
          </div>
          <Link href="/blogs" className="text-xs font-semibold text-primary hover:underline md:text-sm">
            {text.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
          {items.map((item) => {
            const st = CATEGORY_STYLE[item.category];
            return (
              <Link
                key={item.slug}
                href={tipPath(item.slug, lang)}
                hrefLang={lang}
                className="group flex overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-md md:flex-col"
              >
                <div
                  className={`flex w-20 shrink-0 items-center justify-center bg-gradient-to-br text-3xl md:h-24 md:w-full md:text-4xl ${st.bg}`}
                  aria-hidden="true"
                >
                  {st.emoji}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {TIP_CATEGORIES[item.category][lang]}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      ⏱ {item.readTime} {text.minRead}
                    </span>
                  </div>
                  <h3
                    className={`line-clamp-2 text-sm font-bold text-gray-900 transition group-hover:text-primary md:text-base ${
                      lang === "hi" ? "leading-normal" : "leading-snug"
                    }`}
                  >
                    {item[lang].title}
                  </h3>
                  <p className="mt-1.5 hidden text-sm leading-relaxed text-gray-600 md:line-clamp-2">{item[lang].summary}</p>
                  <span className="mt-2 text-xs font-semibold text-primary md:mt-auto md:pt-3">{text.readMore}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
