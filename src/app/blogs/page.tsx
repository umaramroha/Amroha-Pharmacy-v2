// HEALTH_TIPS_LIST_V1: Health Tips list. Server page that feeds the client list.
import TipsList, { type TipListItem } from "@/components/healthTips/TipsList";
import { HEALTH_TIPS } from "@/data/healthTips";

export default function HealthTipsPage() {
  const items: TipListItem[] = HEALTH_TIPS.map((t) => ({
    slug: t.slug,
    category: t.category,
    readTime: t.readTime,
    en: { title: t.en.title, summary: t.en.summary },
    hi: { title: t.hi.title, summary: t.hi.summary },
  }));
  return <TipsList items={items} />;
}
