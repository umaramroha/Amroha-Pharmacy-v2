import type { TipCategoryKey } from "@/data/healthTips/types";

// Each category gets a soft colour and an emoji, instead of random stock photos.
export const CATEGORY_STYLE: Record<TipCategoryKey, { emoji: string; bg: string }> = {
  "mens-health": { emoji: "💪", bg: "from-sky-50 to-blue-100" },
  "womens-health": { emoji: "🌸", bg: "from-rose-50 to-pink-100" },
  digestion: { emoji: "🍃", bg: "from-lime-50 to-green-100" },
  "joints-and-body": { emoji: "🦴", bg: "from-amber-50 to-orange-100" },
  "skin-and-hair": { emoji: "✨", bg: "from-fuchsia-50 to-purple-100" },
  "sugar-and-weight": { emoji: "⚖️", bg: "from-teal-50 to-cyan-100" },
};
