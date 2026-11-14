"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { browserPrefersHindi, readSavedLang, saveLang, type TipLang } from "@/lib/tipLang";

type Props = { lang: TipLang; enHref: string; hiHref: string };

/**
 * Visible "English | हिंदी" switch. Each language has its own page address (good for search),
 * so the buttons are links. The choice is remembered, and if the saved (or browser) language
 * differs from this page, a small suggestion link is shown. There is no automatic redirect.
 */
export default function LangSwitch({ lang, enHref, hiHref }: Props) {
  const [suggest, setSuggest] = useState<TipLang | null>(null);

  useEffect(() => {
    const wanted = readSavedLang() ?? (browserPrefersHindi() ? "hi" : null);
    setSuggest(wanted && wanted !== lang ? wanted : null);
  }, [lang]);

  const tab = (target: TipLang, label: string, href: string) => (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      onClick={() => saveLang(target)}
      aria-current={lang === target ? "true" : undefined}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        lang === target ? "bg-primary text-white" : "text-gray-600 hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <div role="group" aria-label="Language" className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
        {tab("en", "English", enHref)}
        {tab("hi", "हिंदी", hiHref)}
      </div>
      {suggest && (
        <Link
          href={suggest === "hi" ? hiHref : enHref}
          hrefLang={suggest}
          lang={suggest}
          onClick={() => saveLang(suggest)}
          className="mt-3 block text-sm font-semibold text-primary hover:underline"
        >
          {suggest === "hi" ? "यह लेख हिंदी में पढ़ें →" : "Read this article in English →"}
        </Link>
      )}
    </div>
  );
}
