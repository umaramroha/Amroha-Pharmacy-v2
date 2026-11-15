import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import LangSwitch from "@/components/healthTips/LangSwitch";
import { CATEGORY_STYLE } from "@/components/healthTips/categoryStyle";
import { HEALTH_TIPS, type HealthTip } from "@/data/healthTips";
import { TIP_CATEGORIES, type TipSection } from "@/data/healthTips/types";
import { buildTipJsonLd, tipUrl } from "@/lib/healthTipsSeo";
import type { TipProduct } from "@/lib/healthTipsProducts";
import { hindiFont } from "@/lib/hindiFont";
import { tipPath, type TipLang } from "@/lib/tipLang";
import { getWhatsAppLink } from "@/lib/whatsapp";

type UiText = {
  home: string;
  tips: string;
  minRead: string;
  by: string;
  team: string;
  updated: string;
  quick: string;
  doctor: string;
  faq: string;
  alsoSearched: string;
  disclaimer: string;
  related: string;
  relatedSub: string;
  viewAll: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  askMessage: string;
  share: string;
  shareMore: string;
  moreTips: string;
  readMore: string;
  back: string;
};

const UI: Record<TipLang, UiText> = {
  en: {
    home: "Home",
    tips: "Health Tips",
    minRead: "min read",
    by: "By",
    team: "Amroha Pharmacy Health Team",
    updated: "Last updated",
    quick: "Quick answer",
    doctor: "When to see a doctor",
    faq: "Frequently asked questions",
    alsoSearched: "Also searched as",
    disclaimer:
      "This article is general health information. It is not medical advice and does not replace a doctor's advice. If you have a health problem or take regular medicines, please consult a qualified doctor.",
    related: "Related products",
    relatedSub: "Products related to this article",
    viewAll: "View all",
    ctaTitle: "Have a question?",
    ctaText: "Message our team on WhatsApp and we will be happy to help.",
    ctaButton: "Ask on WhatsApp",
    askMessage: "Hello Amroha Pharmacy, I have a question about this article:",
    share: "Share",
    shareMore: "Read more:",
    moreTips: "More health tips",
    readMore: "Read more →",
    back: "← All health tips",
  },
  hi: {
    home: "होम",
    tips: "हेल्थ टिप्स",
    minRead: "मिनट में पढ़ें",
    by: "लेखक:",
    team: "अमरोहा फ़ार्मेसी हेल्थ टीम",
    updated: "आख़िरी अपडेट",
    quick: "सीधा जवाब",
    doctor: "डॉक्टर को कब दिखाएँ",
    faq: "अक्सर पूछे जाने वाले सवाल",
    alsoSearched: "इन नामों से भी खोजा जाता है",
    disclaimer:
      "यह लेख आम स्वास्थ्य जानकारी है। यह मेडिकल सलाह नहीं है और डॉक्टर की सलाह की जगह नहीं ले सकता। अगर आपको कोई स्वास्थ्य समस्या है या आप नियमित दवाइयाँ लेते हैं तो कृपया योग्य डॉक्टर से मिलें।",
    related: "संबंधित प्रोडक्ट्स",
    relatedSub: "इस लेख से जुड़े प्रोडक्ट्स",
    viewAll: "सभी देखें",
    ctaTitle: "कोई सवाल है?",
    ctaText: "WhatsApp पर हमारी टीम को लिखें, हमें आपकी मदद करके ख़ुशी होगी।",
    ctaButton: "WhatsApp पर पूछें",
    askMessage: "हैलो अमरोहा फ़ार्मेसी, मुझे इस लेख के बारे में एक सवाल है:",
    share: "शेयर करें",
    shareMore: "और पढ़ें:",
    moreTips: "और हेल्थ टिप्स",
    readMore: "पढ़ें →",
    back: "← सभी हेल्थ टिप्स",
  },
};

function formatDate(iso: string, lang: TipLang): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function SectionBlock({ section }: { section: TipSection }) {
  // Paragraphs and bullet points are shown in the order they were written in the data file.
  const order = Object.keys(section).filter(
    (k): k is "paragraphs" | "points" => k === "paragraphs" || k === "points"
  );
  return (
    <section className="mb-9">
      <h2 className="mb-3 text-xl font-bold leading-snug text-gray-900 md:text-2xl">{section.heading}</h2>
      <div className="space-y-3">
        {order.map((k) =>
          k === "paragraphs" ? (
            <div key={k} className="space-y-3">
              {section.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ) : (
            <ul key={k} className="list-disc space-y-2 pl-5 marker:text-primary">
              {section.points?.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )
        )}
      </div>
    </section>
  );
}

type Props = { tip: HealthTip; lang: TipLang; products: TipProduct[] };

export default function TipArticle({ tip, lang, products }: Props) {
  const t = tip[lang];
  const ui = UI[lang];
  const url = tipUrl(tip.slug, lang);
  const jsonLd = JSON.stringify(buildTipJsonLd(tip, lang)).replace(/</g, "\\u003c");

  const shareHref = `https://wa.me/?text=${encodeURIComponent(`${t.title}\n\n${t.summary}\n\n${ui.shareMore} ${url}`)}`;
  const askHref = getWhatsAppLink(`${ui.askMessage} ${t.title}`);

  const others = HEALTH_TIPS.filter((x) => x.slug !== tip.slug);
  const moreTips = [
    ...others.filter((x) => x.category === tip.category),
    ...others.filter((x) => x.category !== tip.category),
  ].slice(0, 3);

  return (
    <div lang={lang} className={`min-h-screen bg-[#f8fafc] ${lang === "hi" ? hindiFont.className : ""}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary">
            {ui.home}
          </Link>
          <span>/</span>
          <Link href="/blogs" className="transition hover:text-primary">
            {ui.tips}
          </Link>
          <span>/</span>
          <span className="max-w-[220px] truncate text-gray-700">{t.title}</span>
        </nav>

        {/* Category, read time */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            {TIP_CATEGORIES[tip.category][lang]}
          </span>
          <span className="text-xs text-gray-500">
            ⏱ {tip.readTime} {ui.minRead}
          </span>
        </div>

        <h1 className={`mb-5 text-3xl font-bold text-gray-900 md:text-4xl ${lang === "hi" ? "leading-snug" : "leading-tight"}`}>{t.title}</h1>

        {/* Author and dates */}
        <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">A</div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {ui.by} {ui.team}
            </p>
            <p className="text-xs text-gray-500">
              {ui.updated}: <time dateTime={tip.updated}>{formatDate(tip.updated, lang)}</time>
            </p>
          </div>
        </div>

        {/* Language switch + share */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <LangSwitch lang={lang} enHref={tipPath(tip.slug, "en")} hiHref={tipPath(tip.slug, "hi")} />
          <a
            href={shareHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {ui.share}
          </a>
        </div>

        {/* Article */}
        <article className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 text-[17px] leading-8 text-gray-700 shadow-sm md:p-10">
          {/* Direct answer first */}
          <div className="mb-9 rounded-r-xl border-l-4 border-primary bg-primary/5 p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">{ui.quick}</p>
            <p className="font-medium text-gray-900">{t.answer}</p>
          </div>

          {t.sections.map((s) => (
            <SectionBlock key={s.heading} section={s} />
          ))}

          {/* When to see a doctor */}
          <section className="mb-9 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-3 text-xl font-bold leading-snug text-gray-900 md:text-2xl">{ui.doctor}</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-amber-600">
              {t.doctorSigns.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>

          {/* FAQs */}
          <section className="mb-9">
            <h2 className="mb-4 text-xl font-bold leading-snug text-gray-900 md:text-2xl">{ui.faq}</h2>
            <div className="space-y-5">
              {t.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-gray-900">{f.q}</h3>
                  <p className="mt-1">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-600">{ui.disclaimer}</p>

          {t.alsoSearchedAs.length > 0 && (
            <p className="mt-5 text-sm text-gray-500">
              {ui.alsoSearched}: {t.alsoSearchedAs.join(" · ")}
            </p>
          )}
        </article>

        {/* Related products (only when this tip has real products linked) */}
        {products.length > 0 && (
          <div className="mb-10">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{ui.related}</h2>
                <p className="mt-1 text-sm text-gray-500">{ui.relatedSub}</p>
              </div>
              <Link href="/products" className="whitespace-nowrap text-sm font-semibold text-primary hover:underline">
                {ui.viewAll} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Ask on WhatsApp */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 text-center text-white md:p-10">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">{ui.ctaTitle}</h2>
          <p className="mx-auto mb-6 max-w-lg text-white/90">{ui.ctaText}</p>
          <a
            href={askHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition hover:bg-gray-100"
          >
            💬 {ui.ctaButton}
          </a>
        </div>

        {/* More tips, in the same language */}
        {moreTips.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{ui.moreTips}</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {moreTips.map((m) => {
                const st = CATEGORY_STYLE[m.category];
                return (
                  <Link
                    key={m.slug}
                    href={tipPath(m.slug, lang)}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
                  >
                    <div className={`flex h-20 items-center justify-center bg-gradient-to-br text-4xl ${st.bg}`} aria-hidden="true">
                      {st.emoji}
                    </div>
                    <div className="p-4">
                      <span className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {TIP_CATEGORIES[m.category][lang]}
                      </span>
                      <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition group-hover:text-primary">
                        {m[lang].title}
                      </h3>
                      <p className="mt-2 text-xs text-gray-500">
                        ⏱ {m.readTime} {ui.minRead}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/blogs" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            {ui.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
