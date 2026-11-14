// Health Tips: content types. Every tip has an English and a Hindi (Devanagari) version.

export type TipSection = {
  heading: string;
  paragraphs?: string[];
  points?: string[];
};

export type TipFaq = { q: string; a: string };

export type TipText = {
  title: string;
  summary: string; // 1-2 sentences: tip list card and search description
  answer: string; // short direct answer shown at the top
  alsoSearchedAs: string[]; // other names people use for the same problem
  sections: TipSection[];
  doctorSigns: string[]; // when to see a doctor
  faqs: TipFaq[];
};

export type TipCategoryKey =
  | "mens-health"
  | "womens-health"
  | "digestion"
  | "joints-and-body"
  | "skin-and-hair"
  | "sugar-and-weight";

export const TIP_CATEGORIES: Record<TipCategoryKey, { en: string; hi: string }> = {
  "mens-health": { en: "Men's Health", hi: "पुरुषों का स्वास्थ्य" },
  "womens-health": { en: "Women's Health", hi: "महिलाओं का स्वास्थ्य" },
  digestion: { en: "Digestion", hi: "पाचन" },
  "joints-and-body": { en: "Joints & Body", hi: "जोड़ और शरीर" },
  "skin-and-hair": { en: "Skin & Hair", hi: "त्वचा और बाल" },
  "sugar-and-weight": { en: "Sugar & Weight", hi: "शुगर और वज़न" },
};

export type HealthTip = {
  slug: string;
  category: TipCategoryKey;
  readTime: number; // minutes
  date: string; // first published, YYYY-MM-DD
  updated: string; // last updated, YYYY-MM-DD
  relatedProductSlugs: string[]; // slugs of products from the shop
  en: TipText;
  hi: TipText;
};
