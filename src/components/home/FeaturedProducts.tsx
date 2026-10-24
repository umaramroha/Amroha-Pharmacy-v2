import ProductCard from "@/components/product/ProductCard";
import type { FeaturedProduct } from "@/lib/products";

/**
 * Server component: receives products already loaded on the server,
 * so there is no loading skeleton and no extra /api/products request.
 * <ProductCard> itself stays a client component (cart + wishlist buttons).
 */
export default function FeaturedProducts({
  products,
}: {
  products: FeaturedProduct[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
