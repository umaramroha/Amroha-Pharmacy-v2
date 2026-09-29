"use client";

import Link from "next/link";
import { useState } from "react";
import { blogs, blogCategories } from "@/data/blogs";

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            Health Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ayurvedic wisdom, Unani insights, aur practical health tips — sab
            ek jagah
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-xl font-bold mb-2 text-gray-700">
              No blogs found
            </h2>
            <p className="text-gray-500">
              Is category me abhi blogs nahi hain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={blog.image}
                    alt={blog.hindi.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  {/* Category + Read Time */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      ⏱ {blog.readTime} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary transition">
                    {blog.hindi.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {blog.hindi.content
                      .replace(/\n+/g, " ")
                      .slice(0, 120)}
                    ...
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      📅 {blog.date}
                    </span>
                    <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Count */}
        <p className="text-center text-sm text-gray-500 mt-10">
          {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? "s" : ""}{" "}
          {activeCategory !== "All" && `in ${activeCategory}`}
        </p>
      </div>
    </main>
  );
}
