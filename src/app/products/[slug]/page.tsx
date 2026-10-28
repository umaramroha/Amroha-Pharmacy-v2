import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductDetailClient, { type ProductDetailProduct } from "@/components/product/ProductDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getActiveProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getActiveProduct(slug);
  if (!product) {
    return { title: "Product Not Found | Amroha Pharmacy", robots: { index: false, follow: false } };
  }
  const description = product.description?.trim() || `Explore ${product.name} at Amroha Pharmacy.`;
  return {
    title: `${product.name} | Amroha Pharmacy`,
    description: description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Amroha Pharmacy`,
      description: description.slice(0, 160),
      type: "website",
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getActiveProduct(slug);
  
  if (!product) notFound();

  const relatedProducts = product.category
    ? await prisma.product.findMany({
        where: { isActive: true, category: product.category, id: { not: product.id } },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : [];

  const serializeProduct = (item: NonNullable<typeof product>): ProductDetailProduct => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price.toString(),
    mrp: item.mrp?.toString() ?? null,
    image: item.image,
    images: item.images,
    category: item.category,
    description: item.description,
    stock: item.stock,
  });

  return (
    <ProductDetailClient
      product={serializeProduct(product)}
      similar={relatedProducts.map(serializeProduct)}
    />
  );
}
