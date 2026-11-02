import RevealSection from "./RevealSection";
import { Star } from "lucide-react";

const reviews = [
  { name: "Rahul K.", city: "Delhi", text: "Delivery was fast and products are genuine. Very satisfied." },
  { name: "Fatima A.", city: "Moradabad", text: "Ordering on WhatsApp was so easy. Good guidance provided." },
  { name: "Adnan A.", city: "Amroha", text: "Best prices and authentic Ayurvedic medicines." },
  { name: "Priya S.", city: "Lucknow", text: "The UPI discount was great. Packaging was secure." },
  { name: "Imran M.", city: "Bareilly", text: "Good service. Will order again for my family." },
];

export default function Testimonials() {
  return (
    <RevealSection className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
      </div>
      
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-marquee gap-6 px-6">
          {[...reviews, ...reviews].map((r, i) => (
            <div key={i} className="w-72 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left shrink-0">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm text-gray-700 mb-4">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">{r.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}