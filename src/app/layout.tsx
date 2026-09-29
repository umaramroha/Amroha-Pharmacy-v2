import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { GoogleAnalytics } from "@next/third-parties/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://amrohapharmacy.com"),
  title: "Amroha Pharmacy - Ayurvedic & Unani Care",
  description:
    "Authentic Ayurvedic and Unani medicines in Amroha. Delivering wellness across India.",
  keywords: ["Amroha Pharmacy", "Ayurvedic medicines", "Unani medicines", "wellness"],
  openGraph: {
    title: "Amroha Pharmacy | Ayurvedic & Unani Wellness",
    description: "Authentic Ayurvedic and Unani wellness products from Amroha.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-background text-gray-800 antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
                <Footer />
                <BottomNav />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
