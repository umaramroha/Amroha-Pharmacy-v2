import Link from "next/link";
import { Search, MessageCircle, Leaf, Pill } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-transparent pt-12 pb-16 md:pt-20 md:pb-24 px-4 text-center">
      {/* Decorative floating shapes */}
      <div className="absolute top-10 left-[10%] opacity-20 animate-float"><Leaf className="w-16 h-16 text-primary" /></div>
      <div className="absolute bottom-10 right-[10%] opacity-20 animate-float" style={{ animationDelay: '2s' }}><Pill className="w-20 h-20 text-secondary" /></div>
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
          Asli Ayurvedic & Unani Dawaiyan, <br className="hidden md:block" />
          <span className="text-primary">Ghar Tak</span>
        </h1>
        <p className="text-sm md:text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Delivering natural wellness from Amroha to your doorstep. Trusted by thousands of families across India.
        </p>

        <form action="/products" className="max-w-xl mx-auto mb-8 relative">
          <input type="text" name="q" placeholder="Search medicines, wellness & concerns..." className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-primary/20 bg-white shadow-lg text-sm md:text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white h-10 px-5 rounded-full text-sm font-bold hover:bg-primary-dark transition">Search</button>
        </form>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/products" className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-primary-dark transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Shop Now
          </Link>
          <a href={getWhatsAppLink("Hello, I need help choosing a medicine.")} target="_blank" rel="noopener noreferrer" className="bg-white text-primary border-2 border-primary px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-primary/5 transition flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" /> WhatsApp par poochhein
          </a>
        </div>
      </div>
    </section>
  );
}