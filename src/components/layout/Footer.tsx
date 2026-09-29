import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 mb-6">
          
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">Amroha Pharmacy</h3>
            <p className="text-sm opacity-80 leading-relaxed mb-3">
              A trusted destination for authentic Ayurvedic and Unani wellness
              products, with simple ordering and dependable delivery from
              Amroha.
            </p>
            <div className="space-y-1.5 text-xs opacity-90">
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
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
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

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-base shrink-0">📍</span>
                <span className="opacity-80 leading-relaxed text-xs">
                  Mohalla Nal, Amroha,
                  <br />
                  Uttar Pradesh, India
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-base shrink-0">📞</span>
                <a
                  href="tel:+918077988509"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition text-xs"
                >
                  +91 80779 88509
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-base shrink-0">✉️</span>
                <a
                  href="mailto:Amrohapharmastore@gmail.com"
                  className="opacity-80 hover:opacity-100 hover:text-secondary transition break-all text-xs"
                >
                  Amrohapharmastore@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 pt-4">
          
          {/* Policies — Smallest Line */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] leading-tight opacity-60 mb-3">
            <Link
              href="/policies/privacy"
              className="hover:opacity-100 hover:text-secondary transition"
            >
              Privacy
            </Link>
            <span className="opacity-40">·</span>
            <Link
              href="/policies/terms"
              className="hover:opacity-100 hover:text-secondary transition"
            >
              Terms
            </Link>
            <span className="opacity-40">·</span>
            <Link
              href="/policies/shipping"
              className="hover:opacity-100 hover:text-secondary transition"
            >
              Shipping
            </Link>
            <span className="opacity-40">·</span>
            <Link
              href="/policies/returns"
              className="hover:opacity-100 hover:text-secondary transition"
            >
              Returns
            </Link>
            <span className="opacity-40">·</span>
            <Link
              href="/policies/disclaimer"
              className="hover:opacity-100 hover:text-secondary transition"
            >
              Disclaimer
            </Link>
          </div>

          {/* Copyright — Even Smaller */}
          <p className="text-center text-[9px] opacity-50 leading-tight">
            © {new Date().getFullYear()} Amroha Pharmacy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
