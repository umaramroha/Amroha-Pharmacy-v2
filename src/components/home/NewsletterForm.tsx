"use client";

import type { FormEvent } from "react";

/**
 * Event handlers (onSubmit) are not allowed in server components,
 * so the newsletter form lives in its own small client component.
 * Behaviour is unchanged: it opens WhatsApp with the entered email.
 */
export default function NewsletterForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    const msg = `📧 Newsletter Subscribe\n\nEmail: ${email}`;
    window.open(
      `https://wa.me/918077988509?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm transition whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
