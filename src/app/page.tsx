import Link from "next/link";
import { MessageCircle, Zap, ShieldCheck, Baby, Heart, Stethoscope, Flame, TrendingDown, Dumbbell, Bone, Droplets, Activity } from "lucide-react";
import HomeProductCard from "@/components/home/HomeProductCard";
import PromoCarousel from "@/components/home/PromoCarousel";
import TrustIcon from "@/components/ui/TrustIcon";
import { concerns } from "@/data/concerns";
import { getActiveBanners } from "@/lib/banners";
import { siteConfig } from "@/lib/config";
import { getFeaturedProducts } from "@/lib/products";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60;


const getConcernIcon = (slug: string) => {
  const p = { className: "w-6 h-6 md:w-8 md:h-8" };
  switch (slug) {
    case "mens-vitality": return <Zap {...p} />;
    case "sexual-health": return <ShieldCheck {...p} />;
    case "male-fertility": return <Baby {...p} />;
    case "womens-health": return <Heart {...p} />;
    case "white-discharge": return <Stethoscope {...p} />;
    case "gastric-digestion": return <Flame {...p} />;
    case "weight-loss": return <TrendingDown {...p} />;
    case "weight-gain": return <Dumbbell {...p} />;
    case "joints-pain": return <Bone {...p} />;
    case "diabetes": return <Droplets {...p} />;
    default: return <Activity {...p} />;
  }
};

export default async function Home() {
  const [banners, featuredProducts] = await Promise.all([
    getActiveBanners(),
    getFeaturedProducts(4),
  ]);

  const helpLink = getWhatsAppLink("Hello Amroha Pharmacy, I need help choosing a product.");

  const trust = [
    { icon: "shield", label: "100% Authentic", detail: "Ayurvedic & Unani" },
    { icon: "truck", label: "Fast Delivery", detail: "Across India" },
    { icon: "cash", label: "COD Available", detail: "Pay on delivery" },
    { icon: "support", label: "WhatsApp Support", detail: "Here to help" },
  ] as const;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: siteConfig.name,
    address: { "@type": "PostalAddress", streetAddress: "Mohalla Nal", addressLocality: "Amroha", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
    telephone: siteConfig.phone,
    openingHours: "Mo-Sa 09:00-20:00",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* HERO = Database Banner Carousel */}
      <PromoCarousel banners={banners} />

      {/* THIN TRUST STRIP */}
      <div className="border-y border-gray-100 bg-white py-3 overflow-hidden">
        <div className="mx-auto max-w-7xl md:px-6">
          
          {/* Mobile: Marquee (Scrolling) */}
          <div className="flex w-max animate-marquee md:hidden">
            {[...trust, ...trust, ...trust].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 px-4 shrink-0">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                  <TrustIcon name={item.icon} className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Desktop: Static Flex */}
          <ul className="hidden md:flex justify-center gap-8">
            {trust.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                  <TrustIcon name={item.icon} className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>

      {/* SHOP BY CONCERN (Desktop Only) */}
      <section className="hidden py-12 md:block bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop by Concern</h2>
              <p className="mt-1 text-sm text-gray-500">Find medicines by health problem</p>
            </div>
            <Link href="/concerns" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {concerns.map((c) => (
              <Link key={c.slug} href={`/concerns/${c.slug}`} className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 text-center transition hover:shadow-md">
                <div className="text-primary group-hover:text-white transition-colors">{getConcernIcon(c.slug)}</div>
                <h3 className="text-xs font-bold text-gray-900 group-hover:text-primary">{c.name}</h3>
                <p className="mt-0.5 text-[10px] text-gray-500">{c.hindiName}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS (Blinkit Style) */}
      {featuredProducts.length > 0 && (
        <section className="py-8 md:py-12 bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-3 md:px-6">
            <div className="mb-4 md:mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Best Selling Products</h2>
                <p className="mt-0.5 text-xs md:text-sm text-gray-500">Our most popular products</p>
              </div>
              <Link href="/products" className="text-xs md:text-sm font-semibold text-primary hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {featuredProducts.map((product) => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SHOP BY CONCERN - HORIZONTAL MARQUEE (Swipeable) - MOBILE ONLY */}
      <section className="py-8 bg-white border-t border-gray-100 md:hidden">
        <div className="mx-auto max-w-7xl md:px-6">
          <div className="flex items-center justify-between px-4 md:px-0 mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Shop by Concern</h2>
            <Link href="/concerns" className="text-xs md:text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-2 snap-x snap-mandatory scrollbar-hide">
            {concerns.map((c) => (
              <Link key={c.slug} href={`/concerns/${c.slug}`} className="group flex flex-col items-center shrink-0 w-20 md:w-28 snap-start">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/5 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition duration-300 text-primary shadow-sm">
                  {getConcernIcon(c.slug)}
                </div>
                <h3 className="text-[10px] md:text-xs font-semibold text-center text-gray-800 group-hover:text-primary leading-tight line-clamp-2">{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING WHATSAPP */}
      <a href={helpLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="fixed bottom-[88px] right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-green-600 text-white shadow-lg md:hidden">
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}