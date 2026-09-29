import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Amroha Pharmacy</h3>
            <p className="text-sm opacity-80 leading-relaxed mb-4">
              A trusted destination for authentic Ayurvedic and Unani wellness
              products, with simple ordering and dependable delivery from
              Amroha.
            </p>
            <div className="space-y-2 text-sm opacity-90">
              <p className="flex items-center gap-2">
                <span>✓</span> Authentic products
              </p>
              <p className="flex items-center gap-2">
                <span>✓</span> Secure checkout
              </p>
              <p className="flex items-center gap-2">
                <span>✓</span> All India delivery
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-4 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/concerns"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Shop by Concern
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Wellness Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h3 className="text-base font-bold mb-4 uppercase tracking-wide">
              Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/policies/privacy"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/terms"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/returns"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/disclaimer"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-base font-bold mb-4 uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-lg shrink-0">📍</span>
                <span className="opacity-80 leading-relaxed">
                  Mohalla Nal, Amroha,
                  <br />
                  Uttar Pradesh, India
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg shrink-0">📞</span>
                <a
                  href="tel:+918077988509"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition"
                >
                  +91 80779 88509
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg shrink-0">✉️</span>
                <a
                  href="mailto:Amrohapharmastore@gmail.com"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition break-all"
                >
                  Amrohapharmastore@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center">
          <p className="text-xs md:text-sm opacity-70">
            © {new Date().getFullYear()} Amroha Pharmacy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
