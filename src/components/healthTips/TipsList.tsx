"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORY_STYLE } from "@/components/healthTips/categoryStyle";
import { TIP_CATEGORIES, type TipCategoryKey } from "@/data/healthTips/types";
import { hindiFont } from "@/lib/hindiFont";
import { browserPrefersHindi, readSavedLang, saveLang, tipPath, type TipLang } from "@/lib/tipLang";

export type TipListItem = {
  slug: string;
  category: TipCategoryKey;
  readTime: number;
  en: { title: string; summary: string };
  hi: { title: string; summary: string };
};

const TEXT = {
  en: {
    title: "Health Tips",
    subtitle: "Ayurvedic wisdom, Unani insights and practical health tips, all in one place.",
    all: "All",
    minRead: "min read",
    readMore: "Read more →",
    count: (n: number) => `${n} health tip${n === 1 ? "" : "s"}`,
  },
  hi: {
    title: "हेल्थ टिप्स",
    subtitle: "आयुर्वेदिक और यूनानी देखभाल पर आसान हेल्थ टिप्स, सब एक ही जगह।",
    all: "सभी",
    minRead: "मिनट में पढ़ें",
    readMore: "पढ़ें →",
    count: (n: number) => `${n} हेल्थ टिप्स`,
  },
};

export default function TipsList({ items }: { items: TipListItem[] }) {
  // Server renders English. After load, the saved choice (or a Hindi browser) switches it.
  const [lang, setLang] = useState<TipLang>("en");
  const [category, setCategory] = useState<"all" | TipCategoryKey>("all");

  useEffect(() => {
    setLang(readSavedLang() ?? (browserPrefersHindi() ? "hi" : "en"));
  }, []);

  const choose = (next: TipLang) => {
    setLang(next);
    saveLang(next);
  };

  const text = TEXT[lang];
  const categories = (Object.keys(TIP_CATEGORIES) as TipCategoryKey[]).filter((k) =>
    items.some((i) => i.category === k)
  );
  const shown = category === "all" ? items : items.filter((i) => i.category === category);

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      active ? "bg-primary text-white shadow-sm" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className={`min-h-screen bg-[#f8fafc] ${lang === "hi" ? hindiFont.className : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 lang={lang} className="mb-3 text-3xl font-bold text-gray-900 md:text-5xl">
            {text.title}
          </h1>
          <p lang={lang} className="mx-auto max-w-2xl text-gray-600">
            {text.subtitle}
          </p>
        </div>

        {/* Language switch */}
        <div className="mb-6 flex justify-center">
          <div role="group" aria-label="Language" className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
            {(["en", "hi"] as const).map((l) => (
              <button
                key={l}
                type="button"
                lang={l}
                onClick={() => choose(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
                  lang === l ? "bg-primary text-white" : "text-gray-600 hover:text-primary"
                }`}
              >
                {l === "en" ? "English" : "हिंदी"}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setCategory("all")} className={pill(category === "all")}>
            {text.all}
          </button>
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={pill(category === c)}>
              {TIP_CATEGORIES[c][lang]}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {shown.map((item) => {
            const st = CATEGORY_STYLE[item.category];
            return (
              <Link
                key={item.slug}
                href={tipPath(item.slug, lang)}
                hrefLang={lang}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className={`flex h-28 items-center justify-center bg-gradient-to-br text-5xl ${st.bg}`} aria-hidden="true">
                  {st.emoji}
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                      {TIP_CATEGORIES[item.category][lang]}
                    </span>
                    <span className="text-xs text-gray-500">
                      ⏱ {item.readTime} {text.minRead}
                    </span>
                  </div>
                  <h2
                    lang={lang}
                    className={`mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition group-hover:text-primary ${
                      lang === "hi" ? "leading-normal" : "leading-snug"
                    }`}
                  >
                    {item[lang].title}
                  </h2>
                  <p lang={lang} className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {item[lang].summary}
                  </p>
                  <span className="mt-auto border-t border-gray-100 pt-4 text-sm font-semibold text-primary">{text.readMore}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <p lang={lang} className="mt-10 text-center text-sm text-gray-500">
          {text.count(shown.length)}
        </p>
      </div>
    </div>
  );
}
