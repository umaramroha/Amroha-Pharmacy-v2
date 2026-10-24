import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/** Tag used to refresh the cache when an admin edits banners. */
export const BANNERS_CACHE_TAG = "banners";

/**
 * Only plain strings / numbers here (no Date objects), so the value can be
 * cached and then passed straight to a client component as props.
 */
export type BannerDTO = {
  id: string;
  brand: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  theme: string;
  layout: string;
  order: number;
};

/**
 * Reads active banners from the database and caches the result for 60 seconds.
 * The cache is cleared immediately by revalidateTag(BANNERS_CACHE_TAG)
 * whenever an admin creates, edits or deletes a banner.
 *
 * Throws if the database fails (a failed result is never cached).
 */
export const fetchActiveBanners = unstable_cache(
  async (): Promise<BannerDTO[]> =>
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        brand: true,
        title: true,
        subtitle: true,
        imageUrl: true,
        linkUrl: true,
        theme: true,
        layout: true,
        order: true,
      },
    }),
  ["active-banners"],
  { revalidate: 60, tags: [BANNERS_CACHE_TAG] }
);

/**
 * Safe version for pages: if the database is down, the page still renders
 * (just without the banner slider) instead of crashing.
 */
export async function getActiveBanners(): Promise<BannerDTO[]> {
  try {
    return await fetchActiveBanners();
  } catch (err) {
    console.error("Failed to load banners:", err);
    return [];
  }
}
