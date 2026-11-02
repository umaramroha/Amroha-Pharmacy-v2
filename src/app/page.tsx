import Link from "next/link";
import { MessageCircle } from "lucide-react";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoCarousel from "@/components/home/PromoCarousel";
import RevealSection from "@/components/home/RevealSection";
import NewsletterForm from "@/components/home/NewsletterForm";
import TrustIcon from "@/components/ui/TrustIcon";
import { concerns } from "@/data/concerns";
import { getActiveBanners } from "@/lib/banners";
import { siteConfig, deliveryConfig } from "@/lib/config";
import { getFeaturedProducts } from "@/lib/products";
import { getWhatsAppLink } from "@/lib/whatsapp";

// Server par pre-render, har 60 second me refresh.
export const revalidate = 60;

export default async function Home() {
  const [banners, featuredProducts] = await Promise.all([
    getActiveBanners(),
    getFeaturedProducts(4),
  ]);

  const helpLink = getWhatsAppLink("Hello Amroha Pharmacy, mujhe dawai chunne mein madad chahiye.");

  const ld = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: siteConfig.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mohalla Nal",
      addressLocality: "Amroha",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    telephone: siteConfig.phone,
    openingHours: "Mo-Sa 09:00-20:00",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-white to-white px-4 pb-12 pt-10 text-center md:pb-20 md:pt-16">
        <div aria-hidden="true" className="hp-float pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
        <div aria-hidden="true" className="hp-float hp-float-slow pointer-events-none absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <p className="hp-rise mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary">
            Amroha, Uttar Pradesh se
          </p>
          <h1 className="hp-rise mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl" style={{ animationDelay: "0.1s" }}>
            Asli Ayurvedic & Unani Dawaiyan, <span className="text-primary">Ghar Tak</span>
          </h1>
          <p className="hp-rise mx-auto mb-8 max-w-xl text-sm text-gray-600 md:text-lg" style={{ animationDelay: "0.2s" }}>
            Amroha se authentic Ayurvedic aur Unani dawaiyan, poore India me delivery.
          </p>
          <div className="hp-rise mx-auto flex max-w-md flex-col justify-center gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
            <Link href="/products" className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark hover:shadow-lg">
              Shop Now
            </Link>
            <a href={helpLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border-2 border-primary bg-white px-8 py-3 text-sm font-bold text-primary transition hover:bg-primary/5">
              <MessageCircle className="h-5 w-5" /> WhatsApp par poochhein
            </a>
          </div>
          <p className="hp-rise mt-5 text-xs font-medium text-gray-500" style={{ animationDelay: "0.4s" }}>
            ₹{deliveryConfig.freeAbove} se upar free delivery · Cash on Delivery
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <RevealSection className="border-y border-slate-200/70 bg-white py-4">
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
                  <p className="text-[10px] font-bold leading-tight text-slate-900 md:text-sm">{item.label}</p>
                  <p className="mt-0.5 hidden text-[10px] leading-4 text-slate-500 md:block md:text-xs">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </RevealSection>

      <PromoCarousel banners={banners} />

      {/* Shop by Concern */}
      <RevealSection className="bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 md:text-3xl">Shop by Concern</h2>
              <p className="mt-1 text-xs text-gray-500 md:text-sm">Apni problem ke hisaab se dawai chuniye</p>
            </div>
            <Link href="/concerns" className="text-xs font-semibold text-primary hover:underline md:text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            {concerns.map((c) => (
              <Link key={c.slug} href={`/concerns/${c.slug}`} className="hp-card group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                <span aria-hidden="true" className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-2xl transition duration-300 group-hover:scale-110 md:h-16 md:w-16 md:text-3xl">
                  {c.icon}
                </span>
                <h3 className="text-sm font-bold leading-tight text-slate-900 transition group-hover:text-primary">{c.name}</h3>
                <p className="mt-1 text-xs leading-snug text-slate-500">{c.hindiName}</p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* New Arrivals */}
      {featuredProducts.length > 0 && (
        <RevealSection className="bg-background py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 md:text-3xl">New Arrivals</h2>
                <p className="mt-1 text-xs text-gray-500 md:text-sm">Hamare store ke naye products</p>
              </div>
              <Link href="/products" className="text-xs font-semibold text-primary hover:underline md:text-sm">View All →</Link>
            </div>
            <FeaturedProducts products={featuredProducts} />
          </div>
        </RevealSection>
      )}

      {/* Newsletter (sirf desktop) */}
      <RevealSection className="hidden bg-white py-10 md:block">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-2 text-2xl font-bold text-primary">Get Health Tips & Offers</h2>
          <p className="mb-4 text-sm text-gray-600">Subscribe to receive Ayurvedic tips and exclusive offers</p>
          <NewsletterForm />
        </div>
      </RevealSection>

      {/* Final CTA - mobile par -mb-16 se footer ke upar ki safed patti hat jaati hai */}
      <RevealSection className="-mb-16 bg-primary py-12 text-center text-white md:mb-0">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Dawai chunne me madad chahiye?</h2>
          <p className="mb-6 text-white/80">Hamari team aapko sahi dawai chunne me guide karegi.</p>
          <a href={helpLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-primary shadow-lg transition hover:bg-gray-100">
            <MessageCircle className="h-5 w-5" /> WhatsApp par baat karein
          </a>
        </div>
      </RevealSection>

      {/* Floating WhatsApp (sirf mobile) */}
      <a href={helpLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp par chat karein" className="hp-pulse fixed bottom-[88px] right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-green-700 text-white shadow-lg transition hover:scale-110 md:hidden">
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
