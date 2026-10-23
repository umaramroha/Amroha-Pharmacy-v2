import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ReactNode } from "react";

type Props = {
  params: { slug: string };
  children: ReactNode;
};

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
      };
    }

    // Clean description (strip HTML if any, limit to 160 chars for Google)
    const plainDescription = product.description 
      ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 160) 
      : `Buy ${product.name} online at Amroha Pharmacy. Authentic Ayurvedic & Unani medicines.`;

    const imageUrl = product.image || (product.images && product.images.length > 0 ? product.images[0] : null);

    return {
      title: `${product.name} - Buy Online`,
      description: plainDescription,
      openGraph: {
        title: product.name,
        description: plainDescription,
        type: "website",
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("SEO Error for product:", error);
    return {
      title: "Product Details",
    };
  }
}

// 2. Layout Wrapper
export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
