import { batch1 } from "./batch1";
import { batch2 } from "./batch2";
import { batch3 } from "./batch3";
import { batch4 } from "./batch4";
import type { HealthTip } from "./types";

export { TIP_CATEGORIES } from "./types";
export type { HealthTip, TipText, TipSection, TipFaq, TipCategoryKey } from "./types";

/** All Health Tips, newest first. */
export const HEALTH_TIPS: HealthTip[] = [...batch1, ...batch2, ...batch3, ...batch4].sort((a, b) =>
  b.date.localeCompare(a.date)
);

export function getTip(slug: string): HealthTip | undefined {
  return HEALTH_TIPS.find((t) => t.slug === slug);
}
