import Link from "next/link";
import {
  Zap, ShieldCheck, Baby, Heart, Stethoscope, Flame, TrendingDown, Dumbbell, Bone, Droplets, Activity,
  MessageCircle, Phone, MapPin, Clock,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import PromoCarousel from "@/components/home/PromoCarousel";
import TrustIcon from "@/components/ui/TrustIcon";
import { concerns } from "@/data/concerns";
import { getActiveBanners } from "@/lib/banners";
import { siteConfig, deliveryConfig } from "@/lib/config";
import { getFeaturedProducts } from "@/lib/products";
import { getWhatsAppLink } from "@/lib/whatsapp";

// Server par pre-render, har 60 second me refresh.
export const revalidate = 60;

const concernIcon = (slug: string) => {
  const p = { className: "h-6 w-6 md:h-7 md:w-7" };
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

type TrustItem = { icon: "shield" | "truck" | "cash" | "support"; label: string; detail: string };

export default async function Home() {
  const [banners, featuredProducts] = await Promise.all([
    getActiveBanners(),
    getFeaturedProducts(4),
  ]);

  const helpLink = getWhatsAppLink("Hello Amroha Pharmacy, mujhe dawai chunne mein madad chahiye.");

  const trust: TrustItem[] = [
    { icon: "shield", label: "100% Authentic", detail: "Ayurvedic & Unani" },
    { icon: "truck", label: "Delivery across India", detail: `₹${deliveryConfig.freeAbove} se upar free` },
    { icon: "cash", label: "Cash on Delivery", detail: "Ghar par payment" },
    { icon: "support", label: "WhatsApp Support", detail: "Madad ke liye" },
  ];

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
      <section className="px-4 pt-3 md:px-6 md:pt-5">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-[#f1f7f5] px-5 py-9 md:rounded-[36px] md:px-14 md:py-16">
          <div className="md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-14">
            <div>
              <h1 className="hp-rise text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
                Asli Ayurvedic aur Unani dawaiyan, ghar tak.
              </h1>
              <p className="hp-rise mt-4 max-w-md text-base leading-relaxed text-slate-600 md:text-lg" style={{ animationDelay: "0.1s" }}>
                Amroha, Uttar Pradesh se poore India me delivery.
              </p>
              <div className="hp-rise mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.2s" }}>
                <Link href="/products" className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
                  Shop Now
                </Link>
                <a href={helpLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp par poochhein
                </a>
              </div>
            </div>

            <ul aria-label="Hamari suvidhayein" className="hp-rise mt-8 grid grid-cols-2 gap-3 md:mt-0 md:grid-cols-1" style={{ animationDelay: "0.3s" }}>
              {trust.map((item) => (
                <li key={item.label} className="flex items-center gap-3 rounded-2xl bg-white p-3 md:p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-[#087F73] md:h-11 md:w-11">
                    <TrustIcon name={item.icon} className="h-5 w-5 md:h-6 md:w-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight text-slate-900 md:text-sm">{item.label}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500 md:text-xs">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PromoCarousel banners={banners} />

      {/* Shop by Concern - sirf desktop/web par */}
      <section className="hidden py-14 md:block">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Shop by Concern</h2>
              <p className="mt-1 text-sm text-slate-500">Apni problem ke hisaab se dawai chuniye</p>
            </div>
            <Link href="/concerns" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {concerns.map((c) => (
              <Link key={c.slug} href={`/concerns/${c.slug}`} className="hp-lift group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-5 text-center">
                <span className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-[#087F73] transition-colors duration-300 group-hover:bg-[#087F73] group-hover:text-white">
                  {concernIcon(c.slug)}
                </span>
                <h3 className="text-sm font-semibold leading-tight text-slate-900">{c.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{c.hindiName}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals - mobile par side-scroll, desktop par 4 column */}
      {featuredProducts.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-5 flex items-end justify-between md:mb-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">New Arrivals</h2>
                <p className="mt-1 text-sm text-slate-500">Hamare store ke naye products</p>
              </div>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
            <div className="hp-scroll -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to order - ye sach me ek sequence hai, isliye numbering */}
      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Order karna aasan hai</h2>
          <ol className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-6">
            {[
              { title: "Dawai chuniye", text: "Products ya apni problem se dawai dhundhiye aur cart me daaliye." },
              { title: "Order confirm kijiye", text: "Online payment kijiye ya Cash on Delivery chuniye. Madad chahiye to WhatsApp par poochhein." },
              { title: "Ghar par delivery", text: `Poore India me delivery. ₹${deliveryConfig.freeAbove} se upar free.` },
            ].map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-2xl bg-[#f1f7f5] p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#087F73] text-sm font-semibold text-white">{i + 1}</span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Store info - mobile par -mb-16 se footer ke upar ki safed patti hat jaati hai */}
      <section className="-mb-16 bg-[#f1f7f5] py-12 md:mb-0 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:grid md:grid-cols-2 md:items-center md:gap-12 md:px-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Dawai chunne me madad chahiye?</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 md:text-base">
              Apni problem bataiye, hamari team sahi jaankari degi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={helpLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
                <MessageCircle className="h-4 w-4" /> WhatsApp par baat karein
              </a>
              <a href={`tel:+${siteConfig.phoneRaw}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-slate-50">
                <Phone className="h-4 w-4" /> Call karein
              </a>
            </div>
          </div>
          <ul className="mt-8 space-y-4 md:mt-0">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#087F73]" />
              <span className="text-sm text-slate-700">Mohalla Nal, Amroha, Uttar Pradesh</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#087F73]" />
              <span className="text-sm text-slate-700">Somvar se Shanivar, subah 9 se shaam 8 baje</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#087F73]" />
              <span className="text-sm text-slate-700">{siteConfig.phone}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Floating WhatsApp (sirf mobile) */}
      <a href={helpLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp par chat karein" className="hp-pulse fixed bottom-[88px] right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-green-700 text-white shadow-lg transition hover:scale-110 md:hidden">
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
