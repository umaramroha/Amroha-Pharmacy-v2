import { getCachedProducts } from "@/lib/products";
import type { HealthTip } from "@/data/healthTips";

export type TipProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  stock: number;
  category: string | null;
};

/** Real products for a tip's relatedProductSlugs. Missing or inactive slugs are skipped. */
export async function getTipProducts(tip: HealthTip): Promise<TipProduct[]> {
  if (tip.relatedProductSlugs.length === 0) return [];
  try {
    const all = await getCachedProducts();
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    const found: TipProduct[] = [];
    for (const slug of tip.relatedProductSlugs) {
      const p = bySlug.get(slug);
      if (!p) continue;
      found.push({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        mrp: p.mrp,
        image: p.image,
        stock: p.stock,
        category: p.category ?? null,
      });
    }
    return found;
  } catch (err) {
    console.error("Failed to load related products for health tip:", err);
    return [];
  }
}
