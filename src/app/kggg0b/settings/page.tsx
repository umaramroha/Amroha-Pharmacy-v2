"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Admin = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.status === 401) {
        router.push("/kggg0b/login");
        return;
      }
      const data = await res.json();
      setAdmin(data.admin);
      setFormData((prev) => ({ ...prev, newEmail: data.admin.email }));
    } catch (err) {
      console.error("Failed to fetch admin", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.currentPassword) {
      setError("Current password is required");
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        return;
      }
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newEmail: formData.newEmail,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update settings");
        setSaving(false);
        return;
      }

      setAdmin(data.admin);
      setSuccess("Settings updated successfully!");
      setFormData({
        currentPassword: "",
        newEmail: data.admin.email,
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
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

  if (!admin) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/kggg0b/dashboard"
        className="text-sm text-primary hover:underline"
      >
        ← Dashboard
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-2">
        Account Settings
      </h1>
      <p className="text-gray-600 text-sm mb-8">
        Change your admin email and password
      </p>

      {/* Current Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-xs text-blue-700 mb-1">Current Admin</p>
        <p className="font-semibold text-blue-900">{admin.email}</p>
        <p className="text-xs text-blue-700 mt-1">
          Role: {admin.role} | Since:{" "}
{admin.createdAt && !isNaN(new Date(admin.createdAt).getTime())
  ? new Date(admin.createdAt).toLocaleDateString("en-IN")
  : "N/A"}
        </p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border p-6 space-y-6"
      >
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password * (verify karne ke liye)
          </label>
          <input
            type="password"
            required
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
            placeholder="Enter current password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Koi bhi change karne ke liye ye zaroori hai
          </p>
        </div>

        <hr />

        {/* New Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Email
          </label>
          <input
            type="email"
            value={formData.newEmail}
            onChange={(e) =>
              setFormData({ ...formData, newEmail: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
            placeholder="newemail@example.com"
          />
        </div>

        <hr />

        {/* New Password */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Change Password (optional)
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="Min 6 characters (khali chhodo agar change nahi karna)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="Re-enter new password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

    </div>
  );
}
