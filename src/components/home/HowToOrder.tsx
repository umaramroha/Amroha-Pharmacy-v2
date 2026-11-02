import RevealSection from "./RevealSection";
import { ShoppingBag, CheckCircle2, Truck } from "lucide-react";

export default function HowToOrder() {
  const steps = [
    { icon: ShoppingBag, title: "Choose Product", desc: "Browse our range and add items to your cart." },
    { icon: CheckCircle2, title: "Confirm Order", desc: "Pay online for 5% off, or choose Cash on Delivery." },
    { icon: Truck, title: "Get Delivered", desc: "We dispatch fast and deliver across India." },
  ];

  return (
    <RevealSection className="py-12 bg-primary/5">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">How to Order</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-primary/20 -z-10" />
          
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{i + 1}. {s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}