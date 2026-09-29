"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { blogs, getBlogBySlug, type Blog } from "@/data/blogs";
import { getWhatsAppLink } from "@/lib/whatsapp";
import ProductCard from "@/components/product/ProductCard";

type Lang = "hindi" | "english";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  stock?: number;
};

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [lang, setLang] = useState<Lang>("hindi");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [copied, setCopied] = useState(false);

  const blog = getBlogBySlug(slug);

  // Load language from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("a2z-blog-lang") as Lang | null;
    if (saved === "hindi" || saved === "english") {
      setLang(saved);
    }
  }, []);

  // Save language when changed
  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("a2z-blog-lang", newLang);
  };

  // Fetch related products
  useEffect(() => {
    if (!blog || blog.relatedProducts.length === 0) {
      setRelatedProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const all = data.products || [];
        const matched = all.filter((p: Product) =>
          blog.relatedProducts.includes(p.id)
        );
        setRelatedProducts(matched);
      } catch (err) {
        console.error("Failed to fetch related products", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [blog]);

  if (!blog) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-7">
            Ye blog exist nahi karta ya remove ho gaya hai.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition"
          >
            ← Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  const content = lang === "hindi" ? blog.hindi : blog.english;
  const shareMessage = `${content.title}\n\n${content.content.slice(0, 200)}...\n\nRead more: https://amrohapharmastore.vercel.app/blogs/${blog.slug}`;

  const relatedBlogs = blogs
    .filter((b) => b.slug !== blog.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-primary transition">
            Blogs
          </Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">
            {content.title}
          </span>
        </nav>

        {/* Category + Read Time */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded">
            {blog.category}
          </span>
          <span className="text-xs text-gray-500">
            ⏱ {blog.readTime} min read
          </span>
          <span className="text-xs text-gray-500">📅 {blog.date}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
          {content.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {blog.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {blog.author}
            </p>
            <p className="text-xs text-gray-500">Health Writer</p>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => handleLangChange("hindi")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                lang === "hindi"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => handleLangChange("english")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                lang === "english"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              English
            </button>
          </div>

          {/* Share Button */}
          <a
            href={getWhatsAppLink(shareMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share
          </a>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img
            src={blog.image}
            alt={content.title}
            className="w-full h-auto aspect-video object-cover"
          />
        </div>

        {/* Content */}
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10 mb-10">
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
            {content.content}
          </div>
        </article>

        {/* Related Products */}
        {loadingProducts ? (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border h-64"
                ></div>
              ))}
            </div>
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="mb-10">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Related Products
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Is blog se related products
                </p>
              </div>
              <Link
                href="/products"
                className="text-primary font-semibold hover:underline text-sm whitespace-nowrap"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : null}

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-8 md:p-10 mb-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Koi Sawaal Hai?
          </h3>
          <p className="text-white/90 mb-6 max-w-lg mx-auto">
            Is blog ke baare me ya apni health concern ke baare me expert se
            baat karein.
          </p>
          <a
            href={getWhatsAppLink(
              `Hello Amroha Pharmacy, mujhe is blog ke baare me sawaal hai: ${content.title}`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            💬 WhatsApp pe Puchhein
          </a>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Aur Blogs Padhein
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedBlogs.map((b) => (
                <Link
                  key={b.slug}
                  href={`/blogs/${b.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={b.image}
                      alt={b.hindi.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                      {b.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-2 line-clamp-2 group-hover:text-primary transition leading-snug">
                      {b.hindi.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      ⏱ {b.readTime} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            ← All Blogs
          </Link>
        </div>
      </div>
    </main>
  );
}

