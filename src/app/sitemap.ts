import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";

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

  return [...staticRoutes, ...productUrls];
}
