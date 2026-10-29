import Link from "next/link";
import { Star, MessageCircle } from "lucide-react";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoCarousel from "@/components/home/PromoCarousel";
import RevealSection from "@/components/home/RevealSection";
import NewsletterForm from "@/components/home/NewsletterForm";
import TrustIcon from "@/components/ui/TrustIcon";
import { getActiveBanners } from "@/lib/banners";
import { getFeaturedProducts } from "@/lib/products";

// Pre-render this page on the server and refresh it at most once a minute.
export const revalidate = 60;

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

  return (
    <div>
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
      <RevealSection className="hidden md:block py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Shop by Concern
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Natural solutions for every health concern
              </p>
            </div>
            <Link
              href="/concerns"
              className="text-primary text-xs md:text-sm font-semibold hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 overflow-x-auto pb-2">
            {concerns.map((concern) => (
              <Link
                key={concern.slug}
                href={`/concerns/${concern.slug}`}
                className="group flex flex-col items-center text-center p-2 rounded-xl hover:bg-primary/5 transition"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary group-hover:scale-105 transition duration-300">
                  <span className="text-2xl md:text-3xl">{concern.icon}</span>
                </div>
                <h3 className="text-[10px] md:text-sm font-semibold text-gray-800 group-hover:text-primary transition leading-tight">
                  {concern.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ============================================ */}
      {/* DESKTOP ONLY: SHOP BY CATEGORY */}
      {/* ============================================ */}
      <RevealSection className="hidden md:block py-6 md:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-5">
            Shop by Category
          </h2>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <Link
              href="/products?category=male-problems"
              className="group p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center border-t-4 border-primary"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">💊</span>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-primary">
                Male
              </h3>
              <p className="text-[10px] md:text-xs text-gray-600 mt-1">
                Men&apos;s wellness
              </p>
            </Link>

            <Link
              href="/products?category=female-problems"
              className="group p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center border-t-4 border-secondary"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🌸</span>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-secondary">
                Female
              </h3>
              <p className="text-[10px] md:text-xs text-gray-600 mt-1">
                Women&apos;s wellness
              </p>
            </Link>

            <Link
              href="/products?category=general-problems"
              className="group p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center border-t-4 border-green-600"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🌿</span>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-green-700">
                General
              </h3>
              <p className="text-[10px] md:text-xs text-gray-600 mt-1">
                Everyday health
              </p>
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* ============================================ */}
      {/* MOBILE + DESKTOP: BEST SELLING PRODUCTS */}
      {/* ============================================ */}
      <RevealSection className="py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Best Selling Products
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Our most popular products
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary text-xs md:text-sm font-semibold hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>
          <FeaturedProducts products={featuredProducts} />
        </div>
      </RevealSection>

      {/* ============================================ */}
      {/* DESKTOP ONLY: WHY CHOOSE US */}
      {/* ============================================ */}
      <RevealSection className="hidden md:block py-6 md:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-5 text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div className="text-center p-4 md:p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <TrustIcon name="shield" />
              </div>
              <h3 className="text-base md:text-lg font-bold mb-1">
                Authentic Products
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                100% genuine Ayurvedic & Unani medicines.
              </p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <TrustIcon name="truck" />
              </div>
              <h3 className="text-base md:text-lg font-bold mb-1">
                Fast Delivery
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Quick delivery with Cash on Delivery option.
              </p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <TrustIcon name="support" />
              </div>
              <h3 className="text-base md:text-lg font-bold mb-1">
                Expert Support
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Guidance from qualified experts.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ============================================ */}
      {/* DESKTOP ONLY: TESTIMONIALS */}
      {/* ============================================ */}
      <RevealSection className="hidden md:block py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-5 text-gray-900">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div className="bg-background rounded-xl border p-4 md:p-6">
              <div className="flex gap-0.5 text-secondary mb-3 text-sm">
                <><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></>
              </div>
              <p className="text-xs md:text-sm text-gray-700 mb-4 leading-relaxed">
                &ldquo;Bahut achhi quality ki medicines hain. Delivery bhi fast
                thi. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">
                    Rahul Khan
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-500">Amroha</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl border p-4 md:p-6">
              <div className="flex gap-0.5 text-secondary mb-3 text-sm">
                <><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></>
              </div>
              <p className="text-xs md:text-sm text-gray-700 mb-4 leading-relaxed">
                &ldquo;WhatsApp pe order karna bahut aasan tha. Saath hi
                guidance bhi mili. Thank you!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  F
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">
                    Fatima Ansari
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    Moradabad
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl border p-4 md:p-6">
              <div className="flex gap-0.5 text-secondary mb-3 text-sm">
                <><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></>
              </div>
              <p className="text-xs md:text-sm text-gray-700 mb-4 leading-relaxed">
                &ldquo;Genuine products aur reasonable price. Poore family ke
                liye yahan se order kiya.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">Adnan Ali</p>
                  <p className="text-[10px] md:text-xs text-gray-500">Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

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
        className="md:hidden fixed right-4 bottom-20 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition transform hover:scale-110"
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
