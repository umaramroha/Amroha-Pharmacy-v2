import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getActiveBanners } from "@/lib/banners";
import { getFeaturedProducts } from "@/lib/products";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import StatsStrip from "@/components/home/StatsStrip";
import PromoCarousel from "@/components/home/PromoCarousel";
import ConcernGrid from "@/components/home/ConcernGrid";
import HowToOrder from "@/components/home/HowToOrder";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import WhatsAppFloat from "@/components/home/WhatsAppFloat";
import NewsletterForm from "@/components/home/NewsletterForm";
import RevealSection from "@/components/home/RevealSection";

export const revalidate = 60;

export default async function Home() {
  const [banners, featuredProducts] = await Promise.all([
    getActiveBanners(),
    getFeaturedProducts(4),
  ]);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: "Amroha Pharmacy",
    address: { "@type": "PostalAddress", streetAddress: "Mohalla Nal", addressLocality: "Amroha", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
    telephone: "+91-8077988509",
    openingHours: "Mo-Sa 09:00-20:00"
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="sr-only">Amroha Pharmacy – Authentic Ayurvedic & Unani medicines</h1>

      <HeroSection />
      <StatsStrip />
      <PromoCarousel banners={banners} />
      <ConcernGrid />

      {/* New Arrivals */}
      {featuredProducts.length > 0 && (
        <RevealSection className="py-10 bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
                <p className="text-sm text-gray-500 mt-1">Our most popular products</p>
              </div>
              <Link href="/products" className="text-primary text-sm font-semibold hover:underline">View All →</Link>
            </div>
            <FeaturedProducts products={featuredProducts} />
          </div>
        </RevealSection>
      )}

      <HowToOrder />
      <Testimonials />
      <FAQ />

      {/* Final CTA */}
      <RevealSection className="py-12 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-white/80 mb-6">Our experts are here to help you find the right medicine.</p>
          <a href="https://wa.me/918077988509" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
            <MessageCircle className="w-5 h-5" /> Talk to an Expert
          </a>
        </div>
      </RevealSection>

      <RevealSection className="py-10 bg-white hidden md:block">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-primary">Get Health Tips & Offers</h2>
          <p className="text-sm text-gray-600 mb-4">Subscribe to receive Ayurvedic tips and exclusive offers</p>
          <NewsletterForm />
        </div>
      </RevealSection>

      <WhatsAppFloat />
    </div>
  );
}