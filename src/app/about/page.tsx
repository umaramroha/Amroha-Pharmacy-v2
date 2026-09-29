import Link from "next/link";
import { getWhatsAppLink, getContactMessage } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "About Us - Amroha Pharmacy",
  description:
    "Learn about Amroha Pharmacy - your trusted source for authentic Ayurvedic and Unani medicines in Amroha, Uttar Pradesh.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            About Amroha Pharmacy
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Authentic Ayurvedic aur Unani medicines, trusted by families
            across India — delivered from the heart of Amroha, Uttar Pradesh.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
        {/* Our Story */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-5">
            Our Story
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Amroha Pharmacy was founded with a simple mission — to make
              authentic Ayurvedic and Unani medicines easily accessible to
              every Indian household. Based in Amroha, Uttar Pradesh, we have
              been serving our community with genuine, high-quality traditional
              medicines sourced from trusted manufacturers, brands and
              authorised suppliers.
            </p>
            <p>
              We believe that nature has the power to heal, and our ancestors'
              wisdom in Ayurveda and Unani systems of medicine holds the key to
              holistic wellness. Every product we sell is carefully sourced
              from trusted manufacturers and traditional practitioners, and is
              backed by proper storage and handling practices.
            </p>
            <p>
              From tablets, capsules, and pills to Majoon and Safoof — we
              offer a complete range of remedies for male problems, female
              problems, and general health issues. Whether it is digestive
              discomfort, joint pain, low stamina, hair fall, or overall
              wellness — our curated range is designed to support your health
              journey naturally.
            </p>
            <p>
              In today's digital age, we have extended our traditional
              pharmacy to an online platform — so that customers across India
              can access authentic Ayurvedic and Unani medicines at the click
              of a button, with the same personal care and trust that our
              walk-in customers have experienced for years.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-5">
            Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 border-l-4 border-l-primary">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                To provide 100% authentic Ayurvedic and Unani medicines at
                affordable prices, delivering wellness and trust to every home
                across India — while maintaining the highest standards of
                quality, transparency and customer care.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 border-l-4 border-l-secondary">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                To become India's most trusted online destination for
                traditional medicine — preserving ancient wisdom of Ayurveda
                and Unani for modern health, and empowering every individual to
                lead a naturally healthier life.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-5">
            Why Choose Amroha Pharmacy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: "✅",
                title: "100% Authentic Products",
                desc: "Sourced directly from trusted manufacturers and authorised suppliers. Genuine Ayurvedic and Unani medicines only.",
              },
              {
                icon: "💰",
                title: "Affordable Prices",
                desc: "Best prices with regular discounts and offers. Free delivery in Amroha, and free delivery above thresholds across India.",
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Quick delivery across India with Cash on Delivery available in most serviceable PIN codes.",
              },
              {
                icon: "💬",
                title: "WhatsApp Support",
                desc: "Order directly on WhatsApp, ask questions and get personal guidance from our team.",
              },
              {
                icon: "👨‍⚕️",
                title: "Expert Guidance",
                desc: "Traditional knowledge with practical advice. We help you find the right remedy for your concern.",
              },
              {
                icon: "🔒",
                title: "Safe & Secure",
                desc: "Secure payments via UPI, protected checkout, and privacy-focused handling of your personal data.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 flex gap-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-5">
            What We Offer
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <p className="text-gray-700 leading-relaxed mb-5">
              Our curated range covers a wide spectrum of health concerns,
              under the categories of Ayurvedic and Unani systems of medicine:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Tablets & Capsules",
                "Pills & Granules",
                "Majoon & Safoof",
                "Herbal Oils",
                "Churna & Powders",
                "Syrups & Tonics",
                "Personal Care",
                "Wellness Products",
                "Traditional Formulations",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-background rounded-lg p-3 text-sm text-gray-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-5 leading-relaxed">
              We serve customers seeking support for various concerns
              including men's vitality, sexual health, women's wellness,
              gastric and digestive issues, weight management, joint and
              arthritis pain, skin and hair care, diabetes management and
              general wellness.
            </p>
          </div>
        </section>

        {/* Our Commitment */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-5">
            Our Commitment
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Quality:</strong> We only sell products that meet
              reasonable standards of authenticity, storage and handling.
              Every product is inspected before dispatch.
            </p>
            <p>
              <strong>Transparency:</strong> We clearly display product
              information, prices, MRP, delivery charges and policies so that
              you can make informed decisions.
            </p>
            <p>
              <strong>Responsibility:</strong> We encourage responsible use of
              all medicines and products. We clearly advise consulting a
              qualified healthcare professional where appropriate.
            </p>
            <p>
              <strong>Service:</strong> Our team is available on WhatsApp and
              phone to answer your questions, help you place orders, and
              resolve concerns — the traditional way, with a personal touch.
            </p>
          </div>
        </section>

        {/* Important Medical Note */}
        <section>
          <div className="p-5 md:p-6 bg-amber-50 border-l-4 border-amber-500 rounded-xl">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <span>⚠️</span>
              <span>Important Medical Note</span>
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              All products sold on Amroha Pharmacy are traditional Ayurvedic,
              Unani and wellness products. The information on this website is
              for general informational purposes only and is not a substitute
              for professional medical advice. Please consult a qualified
              healthcare professional before using any product, particularly
              if you are pregnant, breastfeeding, elderly, suffering from a
              medical condition or taking prescription medicines.
            </p>
            <Link
              href="/policies/disclaimer"
              className="inline-block mt-3 text-sm font-semibold text-amber-900 underline hover:text-amber-700"
            >
              Read full Medical Disclaimer →
            </Link>
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Koi Sawaal Hai?
            </h2>
            <p className="text-white/90 mb-6 max-w-lg mx-auto text-sm md:text-base">
              Hum aapki madad ke liye yahan hain. WhatsApp pe direct message
              karein ya call karein — hum aapki health journey me saath hain.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href={getWhatsAppLink(getContactMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                💬 WhatsApp Us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition"
              >
                📞 Contact Page
              </Link>
            </div>
          </div>
        </section>

        {/* Business Info */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-0.5">Business Name</p>
                <p className="font-semibold text-gray-900">
                  {siteConfig.name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Business Type</p>
                <p className="font-semibold text-gray-900">
                  Online Retail / E-Commerce
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Address</p>
                <p className="font-semibold text-gray-900">
                  {siteConfig.address}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Phone / WhatsApp</p>
                <p className="font-semibold text-gray-900">
                  {siteConfig.phone}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Email</p>
                <p className="font-semibold text-gray-900 break-all">
                  {siteConfig.email}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
