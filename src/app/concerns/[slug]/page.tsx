import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { concerns, getConcernBySlug } from "@/data/concerns";
import { getWhatsAppLink, getContactMessage } from "@/lib/whatsapp";
import ProductCard from "@/components/product/ProductCard";

export async function generateStaticParams() {
  return concerns.map((c) => ({ slug: c.slug }));
}

// Force dynamic rendering — products always fresh from DB
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const concern = getConcernBySlug(params.slug);
  if (!concern) return { title: "Concern Not Found" };
  return {
    title: `${concern.name} - Amroha Pharmacy`,
    description: concern.description,
  };
}

export default async function ConcernDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const concern = getConcernBySlug(params.slug);

  if (!concern) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { in: concern.relatedCategories },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price.toString(),
    mrp: p.mrp ? p.mrp.toString() : null,
    image: p.image,
    stock: p.stock,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/concerns" className="hover:text-primary">
          Concerns
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{concern.name}</span>
      </div>

      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-5xl md:text-6xl">{concern.icon}</span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm opacity-90 mb-1">{concern.hindiName}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {concern.name}
            </h1>
            <p className="text-sm md:text-base opacity-90 max-w-2xl">
              {concern.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Recommended Products
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Link
            href="/products"
            className="text-primary font-semibold hover:underline text-sm whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2 text-gray-700">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Is concern ke liye abhi products available nahi hain.
            </p>
            <a
              href={getWhatsAppLink(getContactMessage(concern.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold transition"
            >
              💬 WhatsApp pe Puchhein
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {serializedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-primary">
          Aur Concerns Dekhein
        </h2>
        <div className="flex flex-wrap gap-2">
          {concerns
            .filter((c) => c.slug !== concern.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/concerns/${c.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm font-medium transition"
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </Link>
            ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold mb-2 text-primary">
          Guidance Chahiye?
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Is concern ke baare me koi sawaal? WhatsApp pe expert se puchhein.
        </p>
        <a
          href={getWhatsAppLink(getContactMessage(concern.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold transition"
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
