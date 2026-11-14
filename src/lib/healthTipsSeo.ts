import type { Metadata } from "next";
import { getTip, type HealthTip } from "@/data/healthTips";
import { tipPath, type TipLang } from "@/lib/tipLang";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://amrohapharmacy.vercel.app").replace(/\/$/, "");

const ORG_NAME = "Amroha Pharmacy";
const TEAM_NAME = "Amroha Pharmacy Health Team";

// Same temporary image as layout.tsx. Change both when the final share image is ready.
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=630&fit=crop";

export function tipUrl(slug: string, lang: TipLang): string {
  return `${SITE_URL}${tipPath(slug, lang)}`;
}

export function buildTipMetadata(slug: string, lang: TipLang): Metadata {
  const tip = getTip(slug);
  if (!tip) {
    return { title: "Health Tip Not Found", robots: { index: false, follow: false } };
  }
  const t = tip[lang];
  const url = tipUrl(slug, lang);
  return {
    title: t.title,
    description: t.summary,
    alternates: {
      canonical: url,
      languages: {
        en: tipUrl(slug, "en"),
        hi: tipUrl(slug, "hi"),
        "x-default": tipUrl(slug, "en"),
      },
    },
    openGraph: {
      type: "article",
      title: t.title,
      description: t.summary,
      url,
      siteName: ORG_NAME,
      locale: lang === "hi" ? "hi_IN" : "en_IN",
      publishedTime: tip.date,
      modifiedTime: tip.updated,
      authors: [TEAM_NAME],
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: ORG_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.summary,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/** Article + FAQPage + BreadcrumbList structured data for one tip in one language. */
export function buildTipJsonLd(tip: HealthTip, lang: TipLang) {
  const t = tip[lang];
  const url = tipUrl(tip.slug, lang);
  const inLanguage = lang === "hi" ? "hi-IN" : "en-IN";
  const homeName = lang === "hi" ? "होम" : "Home";
  const listName = lang === "hi" ? "हेल्थ टिप्स" : "Health Tips";

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: t.title,
      description: t.summary,
      inLanguage,
      datePublished: tip.date,
      dateModified: tip.updated,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: TEAM_NAME, url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: ORG_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage,
      mainEntity: t.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: homeName, item: SITE_URL },
        { "@type": "ListItem", position: 2, name: listName, item: `${SITE_URL}/blogs` },
        { "@type": "ListItem", position: 3, name: t.title, item: url },
      ],
    },
  ];
}
