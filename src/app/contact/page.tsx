"use client";

import { useState } from "react";
import { getWhatsAppLink, getContactMessage } from "@/lib/whatsapp";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const validateMobile = (mobile: string): boolean => {
    const cleaned = mobile.replace(/[\s\-()]/g, "").replace(/^\+?91/, "");
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateMobile(formData.mobile)) {
      setError(
        "Kripya sahi 10-digit mobile number daalein (jaise 9876543210)."
      );
      return;
    }

    const message = `📩 *New Contact Message*

👤 Name: ${formData.name}
📱 Mobile: ${formData.mobile}
📧 Email: ${formData.email || "Not provided"}

💬 Message:
${formData.message}`;

    window.open(getWhatsAppLink(message), "_blank");

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: "", mobile: "", email: "", message: "" });
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hum aapki madad ke liye yahan hain. WhatsApp, phone ya form ke
            through humse sampark karein.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Get in Touch
            </h2>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    Address
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Mohalla Nal, Amroha,
                    <br />
                    Uttar Pradesh, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    Phone
                  </h3>
                  <a
                    href="tel:+918077988509"
                    className="text-gray-600 text-sm hover:text-primary transition"
                  >
                    +91 80779 88509
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    Email
                  </h3>
                  <a
                    href="mailto:Amrohapharmastore@gmail.com"
                    className="text-gray-600 text-sm hover:text-primary transition break-all"
                  >
                    Amrohapharmastore@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    WhatsApp
                  </h3>
                  <a
                    href={getWhatsAppLink(getContactMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm hover:text-primary transition"
                  >
                    Chat with us
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-xs text-green-800 leading-relaxed">
                💡 <strong>Quick Response:</strong> WhatsApp pe sabse jaldi
                reply milta hai. Order, product ya kisi bhi sawaal ke liye
                direct message karein.
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-800 leading-relaxed">
                🕐 <strong>Business Hours:</strong> Monday to Saturday, 9:00 AM
                – 8:00 PM IST
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Send us a Message
            </h2>

            {sent && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                ✓ Message WhatsApp pe bhej diya gaya!
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={13}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobile: e.target.value.replace(/[^\d+\s-]/g, ""),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="9876543210"
                />
                <p className="text-xs text-gray-500 mt-1">
                  10-digit mobile number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send via WhatsApp
              </button>

              <p className="text-xs text-gray-500 text-center">
                Message WhatsApp pe khulega, wahin se bhej dena
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
