import Link from "next/link";
import { Star, MessageCircle, Zap, ShieldCheck, Baby, Heart, Stethoscope, Flame, TrendingDown, Dumbbell, Bone, Droplets, Pill, Flower2, Leaf } from "lucide-react";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoCarousel from "@/components/home/PromoCarousel";
import RevealSection from "@/components/home/RevealSection";
import NewsletterForm from "@/components/home/NewsletterForm";
import TrustIcon from "@/components/ui/TrustIcon";
import { getActiveBanners } from "@/lib/banners";
import { getFeaturedProducts } from "@/lib/products";

// Pre-render this page on the server and refresh it at most once a minute.
export const revalidate = 60;


const renderConcernIcon = (slug: string) => {
  const p = { className: "w-7 h-7 md:w-9 md:h-9 text-primary transition-transform group-hover:scale-110" };
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
    default: return <Zap {...p} />;
  }
};

export default async function Home() {
  // Both queries run at the same time, on the server, before any HTML is sent.
  const [banners, featuredProducts] = await Promise.all([
    getActiveBanners(),
    getFeaturedProducts(4),
  ]);

  const concerns = [
    { name: "Men's Vitality", icon: "🦁", slug: "mens-vitality" },
    { name: "Sexual Health", icon: "🛡️", slug: "sexual-health" },
    { name: "Male Fertility", icon: "👶", slug: "male-fertility" },
    { name: "Women's Health", icon: "💗", slug: "womens-health" },
    { name: "Likoria", icon: "🩺", slug: "white-discharge" },
    { name: "Gastric & Acidity", icon: "🫀", slug: "gastric-digestion" },
    { name: "Weight Loss", icon: "📏", slug: "weight-loss" },
    { name: "Weight Gain", icon: "💪", slug: "weight-gain" },
    { name: "Joints & Pain", icon: "🦵", slug: "joints-pain" },
    { name: "Diabetes", icon: "🩸", slug: "diabetes" },
  ];

  
  const ld = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: "Amroha Pharmacy",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mohalla Nal",
      addressLocality: "Amroha",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN"
    },
    telephone: "+91-8077988509",
    openingHours: "Mo-Sa 09:00-20:00"
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="sr-only">Amroha Pharmacy – Authentic Ayurvedic & Unani medicines</h1>
      {/* Trust badges */}
      <RevealSection className="border-b border-slate-200/70 bg-white py-4 md:py-5">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ul aria-label="Shop with confidence" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {([
              { icon: "shield", label: "100% Authentic", detail: "Ayurvedic & Unani care" },
              { icon: "truck", label: "Fast Delivery", detail: "Across India" },
              { icon: "cash", label: "COD Available", detail: "Pay on delivery" },
              { icon: "support", label: "WhatsApp Support", detail: "Here to help you" },
            ] as const).map((item) => (
              <li key={item.label} className="flex flex-row items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-2 md:gap-3 md:rounded-2xl md:p-4">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary md:h-10 md:w-10 md:rounded-xl">
                  <TrustIcon name={item.icon} className="h-3.5 w-3.5 md:h-6 md:w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold leading-tight text-slate-900 md:text-sm md:leading-5">{item.label}</p>
                  <p className="mt-0.5 hidden text-[10px] leading-4 text-slate-500 md:block md:text-xs">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </RevealSection>

      {/* ============================================ */}
      {/* MOBILE + DESKTOP: PROMO BANNER */}
      {/* ============================================ */}
      <PromoCarousel banners={banners} />

      {/* ============================================ */}
      {/* DESKTOP ONLY: SHOP BY CONCERN */}
      {/* ============================================ */}
      

      {/* ============================================ */}
      {/* DESKTOP ONLY: NEWSLETTER */}
      {/* ============================================ */}
      <RevealSection className="hidden md:block py-6 md:py-10 bg-primary/5">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-2 text-primary">
            Get Health Tips & Offers
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mb-4">
            Subscribe to receive Ayurvedic tips and exclusive offers
          </p>
          <NewsletterForm />
        </div>
      </RevealSection>

      {/* ============================================ */}
      {/* MOBILE + DESKTOP: TALK TO EXPERT */}
      {/* ============================================ */}
      <RevealSection className="py-8 md:py-10 bg-background">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl">👨‍⚕️</span>
          </div>
          <h2 className="text-xl md:text-3xl font-bold mb-2 text-gray-900">
            Need Help Choosing?
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mb-5">
            Our experts are here to help you find the right medicine.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 md:px-8 py-3 rounded-full font-semibold text-sm transition shadow-md"
          >
            <MessageCircle className="w-5 h-5" /> <span>Talk to an Expert</span>
          </Link>
        </div>
      </RevealSection>

      {/* ============================================ */}
      {/* MOBILE ONLY: WHATSAPP FLOATING BUTTON */}
      {/* ============================================ */}
      <a
        href="https://wa.me/918077988509?text=Hello%20Amroha%20Pharmacy%2C%20mujhe%20madad%20chahiye"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="md:hidden fixed right-4 bottom-20 z-40 w-14 h-14 bg-green-700 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition transform hover:scale-110"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
