"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Banner = {
  id: string;
  brand: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  theme: string;
  order: number;
  isActive: boolean;
};

const THEMES = [
  { value: "teal", label: "Teal (Green)" },
  { value: "blue", label: "Blue" },
  { value: "amber", label: "Amber (Yellow)" },
  { value: "rose", label: "Rose (Pink)" },
  { value: "indigo", label: "Indigo (Purple)" },
  { value: "emerald", label: "Emerald (Dark Green)" },
];

const EMPTY_FORM = {
  brand: "",
  title: "",
  subtitle: "",
  imageUrl: "",
  linkUrl: "",
  theme: "teal",
  order: "0",
  isActive: true,
};

export default function AdminBannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (showForm) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showForm]);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      brand: banner.brand,
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      theme: banner.theme,
      order: banner.order.toString(),
      isActive: banner.isActive,
    });
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError("");
    setMessage("");
  };

  // Cloudinary Upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("❌ Image must be under 5MB");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );
      fd.append("folder", "amroha-banners");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: fd }
      );

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData((f) => ({ ...f, imageUrl: data.secure_url }));
      setMessage("✅ Image uploaded");
    } catch (err) {
      console.error(err);
      setError("❌ Upload failed. Check Cloudinary preset (must be Unsigned)");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const url = editingId
        ? `/api/admin/banners/${editingId}`
        : "/api/admin/banners";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save banner");
        setSaving(false);
        return;
      }

      await fetchBanners();
      handleCancel();
    } catch (err) {
      console.error("Save error:", err);
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, brand: string) => {
    if (!confirm(`Delete banner "${brand}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchBanners();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (res.ok) {
        setBanners((prev) =>
          prev.map((b) =>
            b.id === banner.id ? { ...b, isActive: !b.isActive } : b
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
            Banners
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {banners.length} total banner{banners.length !== 1 ? "s" : ""} (max 10 recommended)
          </p>
        </div>
        {!showForm && banners.length < 10 && (
          <button
            onClick={handleNew}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition"
          >
            + Add Banner
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-primary">
            {editingId ? "Edit Banner" : "Add New Banner"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand / Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="e.g. AYURVEDIC RANGE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="e.g. Up to 20% off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="e.g. Immunity & overall health"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme (Color)
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) =>
                    setFormData({ ...formData, theme: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary bg-white"
                >
                  {THEMES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL (optional)
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="/products or https://wa.me/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order (chhota number pehle)
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="1"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2 border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image *
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="text-sm"
                  />
                  {uploading && (
                    <span className="text-sm text-blue-600">Uploading...</span>
                  )}
                </div>

                {formData.imageUrl && (
                  <div className="mt-3 flex items-center gap-4">
                    <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 break-all flex-1">
                      {formData.imageUrl}
                    </p>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="md:col-span-2 border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live Preview
                </label>
                <PreviewBanner
                  brand={formData.brand || "BRAND"}
                  title={formData.title || "Title"}
                  subtitle={formData.subtitle || "Subtitle"}
                  theme={formData.theme}
                  imageUrl={formData.imageUrl}
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active (frontend pe dikhega)
                  </span>
                </label>
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
                  ? "Update Banner"
                  : "Create Banner"}
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

      {/* Banners List */}
      {banners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-6xl mb-4">🖼️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">
            No banners yet
          </h2>
          <p className="text-gray-500 mb-6">
            Add your first banner to display on homepage.
          </p>
          <button
            onClick={handleNew}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition"
          >
            + Add First Banner
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4 flex-wrap ${
                !banner.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="w-24 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase text-gray-500">
                    {banner.brand}
                  </span>
                  {!banner.isActive && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {banner.theme}
                  </span>
                </div>
                <p className="font-semibold text-sm mt-1">{banner.title}</p>
                <p className="text-xs text-gray-500">{banner.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Order: {banner.order} · Link: {banner.linkUrl || "—"}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleEdit(banner)}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-full font-semibold transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(banner)}
                  className="text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full font-semibold transition"
                >
                  {banner.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(banner.id, banner.brand)}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-full font-semibold transition"
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

/* -------------------------------------------------------------------------- */
/* PREVIEW COMPONENT                                                          */
/* -------------------------------------------------------------------------- */

const THEME_MAP: Record<
  string,
  { bg: string; brandColor: string; text: string }
> = {
  teal: {
    bg: "bg-gradient-to-r from-teal-50 to-teal-100",
    brandColor: "text-teal-700",
    text: "text-gray-900",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    brandColor: "text-blue-700",
    text: "text-gray-900",
  },
  amber: {
    bg: "bg-gradient-to-r from-amber-50 to-amber-100",
    brandColor: "text-amber-700",
    text: "text-gray-900",
  },
  rose: {
    bg: "bg-gradient-to-r from-rose-50 to-rose-100",
    brandColor: "text-rose-700",
    text: "text-gray-900",
  },
  indigo: {
    bg: "bg-gradient-to-r from-indigo-50 to-indigo-100",
    brandColor: "text-indigo-700",
    text: "text-gray-900",
  },
  emerald: {
    bg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
    brandColor: "text-emerald-700",
    text: "text-gray-900",
  },
};

function PreviewBanner({
  brand,
  title,
  subtitle,
  theme,
  imageUrl,
}: {
  brand: string;
  title: string;
  subtitle: string;
  theme: string;
  imageUrl: string;
}) {
  const t = THEME_MAP[theme] || THEME_MAP.teal;

  return (
    <div className={`${t.bg} rounded-2xl p-4 md:p-6 flex items-center justify-between gap-4`}>
      <div className="flex-1 min-w-0">
        <p
          className={`text-[10px] md:text-xs font-bold ${t.brandColor} mb-1 tracking-wide uppercase`}
        >
          {brand}
        </p>
        <h3
          className={`text-2xl md:text-4xl font-black ${t.text} leading-tight mb-1`}
        >
          {title}
        </h3>
        <p className={`text-xs md:text-base ${t.text} opacity-80`}>
          {subtitle}
        </p>
      </div>
      <div className="shrink-0 w-20 h-20 md:w-32 md:h-32 relative">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-white/50 rounded flex items-center justify-center text-gray-400 text-xs">
            Image
          </div>
        )}
      </div>
    </div>
  );
}
