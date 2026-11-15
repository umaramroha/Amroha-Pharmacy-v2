import HomeHealthTips from "@/components/home/HomeHealthTips";
import type { TipListItem } from "@/components/healthTips/TipsList";
import { HEALTH_TIPS, getTip, type HealthTip } from "@/data/healthTips";

// Tips shown on the home page. Change these slugs to feature other tips.
const FEATURED_SLUGS = [
  "gas-acidity-constipation-relief",
  "hair-fall-scalp-care-tips",
  "belly-fat-weight-loss-sustainable",
];

export default function HealthTipsSection() {
  const picked = FEATURED_SLUGS.map((s) => getTip(s)).filter((t): t is HealthTip => Boolean(t));
  const tips = picked.length > 0 ? picked : HEALTH_TIPS.slice(0, 3);
  const items: TipListItem[] = tips.map((t) => ({
    slug: t.slug,
    category: t.category,
    readTime: t.readTime,
    en: { title: t.en.title, summary: t.en.summary },
    hi: { title: t.hi.title, summary: t.hi.summary },
  }));
  return <HomeHealthTips items={items} />;
}
