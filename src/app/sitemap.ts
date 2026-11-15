import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";
import { HEALTH_TIPS } from "@/data/healthTips";
import { concerns } from "@/data/concerns";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://amrohapharmacy.vercel.app';

  // 1. Fetch all active products from database
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  // 2. Static routes
  const staticRoutes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/concerns',
    '/blogs',
    '/policies/privacy',
    '/policies/terms',
    '/policies/shipping',
    '/policies/returns',
    '/policies/disclaimer'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  // Health Tips: one entry per language, each pointing at the other (hreflang)
  const blogUrls: MetadataRoute.Sitemap = HEALTH_TIPS.flatMap((t) => {
    const en = `${baseUrl}/blogs/${t.slug}`;
    const hi = `${baseUrl}/blogs/hi/${t.slug}`;
    const lastModified = new Date(`${t.updated}T00:00:00Z`);
    const alternates = { languages: { en, hi } };
    return [
      { url: en, lastModified, changeFrequency: 'monthly' as const, priority: 0.6, alternates },
      { url: hi, lastModified, changeFrequency: 'monthly' as const, priority: 0.6, alternates },
    ];
  });
  const concernUrls = concerns.map(c => ({ url: `${baseUrl}/concerns/${c.slug}`, lastModified: new Date(), priority: 0.7 }));
  return [...staticRoutes, ...productUrls, ...blogUrls, ...concernUrls];
}
