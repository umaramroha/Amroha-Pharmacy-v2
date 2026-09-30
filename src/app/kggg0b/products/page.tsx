"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  mrp: string | null;
  image: string | null;
  images: string[];
  category: string | null;
  stock: number;
  isActive: boolean;
};

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  price: "",
  mrp: "",
  image: "",
  images: [] as string[],
  category: "general-problems",
  stock: "0",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Auto-scroll to top when form opens
  useEffect(() => {
    if (showForm) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showForm]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      mrp: product.mrp || "",
      image: product.image || "",
      images: product.images || [],
      category: product.category || "general-problems",
      stock: product.stock.toString(),
    });
    setShowForm(true);
    setError("");
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError("");
  };

  // Add new image URL field
  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  // Update image at index
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  // Remove image at index
  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Clean images — remove empty ones
    const cleanImages = formData.images
      .map((img) => img.trim())
      .filter((img) => img !== "");

    // If primary image is empty but images has one, use first as primary
    let primaryImage = formData.image.trim();
    if (!primaryImage && cleanImages.length > 0) {
      primaryImage = cleanImages[0];
    }

    const payload = {
      ...formData,
      image: primaryImage,
      images: cleanImages,
    };

    try {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save product");
        setSaving(false);
        return;
      }

      await fetchProducts();
      handleCancel();
    } catch (err) {
      console.error("Save error:", err);
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isActive: !p.isActive } : p
          )
        );
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <Link
            href="/kggg0b/dashboard"
            className="text-sm text-primary hover:underline"
          >
            ← Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2">
            Products
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {products.length} total product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleNew}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-primary">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="e.g. Ayurvedic Capsule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug * (URL name, lowercase)
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingId}
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary disabled:bg-gray-100"
                  placeholder="e.g. ayurvedic-capsule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="299"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MRP (₹) — optional
                </label>
                <input
                  type="number"
                  value={formData.mrp}
                  onChange={(e) =>
                    setFormData({ ...formData, mrp: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="399"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary bg-white"
                >
                  <option value="male-problems">Male Problems</option>
                  <option value="female-problems">Female Problems</option>
                  <option value="general-problems">General Problems</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="100"
                />
              </div>

              {/* Primary Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image URL (Cover)
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="mt-2 w-24 h-24 bg-gray-100 rounded-md overflow-hidden border">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div className="md:col-span-2 border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images (Gallery)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="text-xs bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-full font-semibold transition"
                  >
                    + Add Image
                  </button>
                </div>

                {formData.images.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">
                    No additional images. Click "+ Add Image" to add more.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        {/* Preview */}
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0 border">
                          {img ? (
                            <img
                              src={img}
                              alt={`Image ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                              🖼
                            </div>
                          )}
                        </div>

                        {/* URL Input */}
                        <input
                          type="text"
                          value={img}
                          onChange={(e) =>
                            handleImageChange(idx, e.target.value)
                          }
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          placeholder={`Image ${idx + 1} URL`}
                        />

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-md transition text-sm font-semibold"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary resize-none"
                  placeholder="Product description..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Create Product"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-full font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-6xl mb-4">💊</div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">
            No products yet
          </h2>
          <p className="text-gray-500 mb-6">
            Add your first product to get started.
          </p>
          <button
            onClick={handleNew}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition"
          >
            + Add First Product
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4 flex-wrap ${
                !product.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0 relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">
                    💊
                  </div>
                )}
                {/* Image count badge */}
                {product.images && product.images.length > 0 && (
                  <span className="absolute bottom-0 right-0 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl">
                    +{product.images.length}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{product.name}</h3>
                  {!product.isActive && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono">
                  {product.slug}
                </p>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className="font-bold text-primary">
                    ₹{product.price}
                  </span>
                  {product.mrp && (
                    <span className="text-gray-400 line-through text-xs">
                      ₹{product.mrp}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Stock: {product.stock}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleToggleActive(product)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                    product.isActive
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {product.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium bg-red-100 text-red-800 hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
