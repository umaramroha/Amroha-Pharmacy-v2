"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, logout, updateProfile } = useAuth();
  const { totalItems: wishlistCount } = useWishlist();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        mobile: user.mobile || "",
      });
    }
  }, [isLoggedIn, loading, router, user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded-lg w-32" />

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-44" />
                  <div className="h-3 bg-gray-200 rounded w-28" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-24 bg-gray-200 rounded-2xl" />
              <div className="h-24 bg-gray-200 rounded-2xl" />
              <div className="h-24 bg-gray-200 rounded-2xl" />
              <div className="h-24 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "User";
  const initials = user.name
    ?.split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      setSaving(false);
      return;
    }

    if (!formData.mobile.trim()) {
      setError("Please enter your mobile number.");
      setSaving(false);
      return;
    }

    const result = await updateProfile(
      formData.name.trim(),
      formData.mobile.trim()
    );

    setSaving(false);

    if (result.success) {
      setEditing(false);
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } else {
      setError(result.message || "Unable to update your profile.");
    }
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setEditing(!editing);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const memberSince =
    user.createdAt && !isNaN(new Date(user.createdAt).getTime())
      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  return (
    <main className="min-h-screen bg-[#f7f9f8]">
      <div className="max-w-md mx-auto px-4 pt-5 pb-24 md:pb-10">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
              Amroha Pharmacy
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              My Account
            </h1>
          </div>

          <Link
            href="/products"
            aria-label="Continue shopping"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:border-primary hover:text-primary transition"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="19" cy="20" r="1" />
              <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
            </svg>
          </Link>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-sm text-green-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
              ✓
            </span>
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
              !
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Profile Card */}
        <section className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
          {/* Decorative background */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />

          <div className="relative p-5">
            <div className="flex items-start gap-4">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-sm ring-4 ring-white">
                  {initials || "U"}
                </div>

                <span
                  className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-[3px] border-white"
                  title="Active"
                />
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1 pt-1">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {user.name}
                </h2>

                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 min-w-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <span className="truncate">{user.email}</span>
                </div>

                {user.mobile && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                    </svg>

                    <span>{user.mobile}</span>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                type="button"
                onClick={handleEdit}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  editing
                    ? "bg-gray-100 text-gray-700"
                    : "border border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            {/* Account Status */}
            <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-gray-600">
                  Account active
                </span>
              </div>

              <span className="text-[11px] text-gray-400">
                Member since {memberSince}
              </span>
            </div>
          </div>
        </section>

        {/* Edit Profile */}
        {editing && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4"
          >
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Edit Profile
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Keep your account information up to date.
              </p>
            </div>

            <div className="space-y-3.5">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </div>

                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving changes...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Quick Actions */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h3 className="text-sm font-bold text-gray-900">
              Quick Access
            </h3>

            <span className="text-[11px] text-gray-400">
              Manage your account
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">

            {/* Orders */}
            <Link
              href="/orders"
              className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:border-primary/30 hover:shadow-md transition active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>

                <svg
                  className="text-gray-300 group-hover:text-primary transition"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>

              <p className="mt-3 font-semibold text-sm text-gray-900">
                My Orders
              </p>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Track & view orders
              </p>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="group relative bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:border-red-200 hover:shadow-md transition active:scale-[0.98]"
            >
              {wishlistCount > 0 && (
                <span className="absolute top-3 right-3 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}

              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                </svg>
              </div>

              <p className="mt-3 font-semibold text-sm text-gray-900">
                Wishlist
              </p>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Your saved products
              </p>
            </Link>

            {/* Shop */}
            <Link
              href="/products"
              className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:border-primary/30 hover:shadow-md transition active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M8 10a4 4 0 0 0 8 0" />
                  </svg>
                </div>

                <svg
                  className="text-gray-300 group-hover:text-primary transition"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>

              <p className="mt-3 font-semibold text-sm text-gray-900">
                Shop
              </p>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Browse medicines
              </p>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.9-.95L3 21l1.95-5.1A8.5 8.5 0 1 1 21 11.5Z" />
                    <path d="M8 12h.01" />
                    <path d="M12 12h.01" />
                    <path d="M16 12h.01" />
                  </svg>
                </div>

                <svg
                  className="text-gray-300 group-hover:text-blue-600 transition"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>

              <p className="mt-3 font-semibold text-sm text-gray-900">
                Help & Support
              </p>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Contact Amroha Pharmacy
              </p>
            </Link>
          </div>
        </section>

        {/* Account Information */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">
              Account Information
            </h3>
          </div>

          <div className="divide-y divide-gray-100">

            {/* Email */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                  Email Address
                </p>

                <p className="text-xs font-medium text-gray-800 truncate mt-0.5">
                  {user.email}
                </p>
              </div>

              <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                  Mobile Number
                </p>

                <p className="text-xs font-medium text-gray-800 mt-0.5">
                  {user.mobile || "Not added"}
                </p>
              </div>

              {user.mobile && (
                <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Added
                </span>
              )}
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                  Member Since
                </p>

                <p className="text-xs font-medium text-gray-800 mt-0.5">
                  {memberSince}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.99]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
          </svg>

          Sign Out
        </button>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-gray-400">
            © {new Date().getFullYear()} Amroha Pharmacy
          </p>

          <p className="text-[9px] text-gray-300 mt-1">
            Ayurvedic & Unani Care
          </p>
        </div>
      </div>
    </main>
  );
}
