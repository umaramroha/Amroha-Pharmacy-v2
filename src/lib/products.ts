import { prisma } from "@/lib/prisma";

/**
 * Shape handed to <ProductCard>. Prices are strings because Prisma's Decimal
 * objects cannot be passed from a server component to a client component.
 */
export type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  stock: number;
};

/**
 * Newest active products (same ordering the old /api/products call used).
 * If the database is unavailable the home page still renders, with an empty list.
 */
export async function getFeaturedProducts(limit = 4): Promise<FeaturedProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        mrp: true,
        image: true,
        stock: true,
      },
    });

    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price.toString(),
      mrp: p.mrp ? p.mrp.toString() : null,
      image: p.image,
      stock: p.stock,
    }));
  } catch (err) {
    console.error("Failed to load featured products:", err);
    return [];
  }
}
