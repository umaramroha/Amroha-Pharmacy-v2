"use client";
import { useState } from "react";
import RevealSection from "./RevealSection";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How long does delivery take?", a: "Delivery within Amroha is 1-2 days. Nearby cities take 2-4 days, and the rest of India takes 4-7 business days." },
  { q: "Is Cash on Delivery available?", a: "Yes, COD is available for most PIN codes. You can check availability at checkout." },
  { q: "Are the medicines authentic?", a: "Yes, we source directly from trusted manufacturers and authorised suppliers. We only sell genuine products." },
  { q: "What is the return policy?", a: "Returns are accepted for damaged or wrong products within 48 hours. Please read our Returns Policy for full details." },
  { q: "How can I consult an expert?", a: "You can message us directly on WhatsApp with your concern, and our team will guide you." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <RevealSection className="py-12 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 text-left flex justify-between items-center font-semibold text-gray-900 hover:bg-gray-50 transition" aria-expanded={open === i}>
                {faq.q}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}