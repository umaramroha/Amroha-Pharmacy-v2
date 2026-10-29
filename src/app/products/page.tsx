import { getCachedProducts } from "@/lib/products";
import ProductListClient from "@/components/product/ProductListClient";

export const revalidate = 3600;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams.page || "1") || 1);
  const limit = 24;
  const skip = (page - 1) * limit;

  // Fetch all cached products (this is instantaneous after the first hit)
  const allProducts = await getCachedProducts();

  // Filter in memory (since we have cached all products)
  let filteredProducts = allProducts;
  
  if (resolvedParams.category) {
    filteredProducts = filteredProducts.filter(p => p.category === resolvedParams.category);
  }
  
  if (resolvedParams.q) {
    const q = resolvedParams.q.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
    );
  }

  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / limit);
  
  // Paginate
  const paginatedProducts = filteredProducts.slice(skip, skip + limit);

  // Serialize Decimal for Client Component
  const safeProducts = paginatedProducts.map(p => ({
    ...p,
    price: p.price.toString(),
    mrp: p.mrp ? p.mrp.toString() : null,
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
