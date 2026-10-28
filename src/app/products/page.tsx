import { prisma } from "@/lib/prisma";
import ProductListClient from "@/components/product/ProductListClient";

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams.page || "1") || 1);
  const limit = 24;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };
  
  if (resolvedParams.category) {
    where.category = resolvedParams.category;
  }
  
  if (resolvedParams.q) {
    where.OR = [
      { name: { contains: resolvedParams.q, mode: "insensitive" } },
      { description: { contains: resolvedParams.q, mode: "insensitive" } },
    ];
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({ 
      take: limit, 
      skip, 
      where, 
      orderBy: { createdAt: "desc" } 
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Serialize Decimal and Date objects for the Client Component
  const safeProducts = products.map(p => ({
    ...p,
    price: p.price.toString(),
    mrp: p.mrp ? p.mrp.toString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <ProductListClient 
      initialProducts={safeProducts} 
      categoryParam={resolvedParams.category || null} 
      query={resolvedParams.q || ""} 
      currentPage={page} 
      totalPages={totalPages} 
    />
  );
}
