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
  metadataBase: new URL("https://amrohapharmacy.vercel.app"),
  title: {
    default: "Amroha Pharmacy - Ayurvedic & Unani Care",
    template: "%s | Amroha Pharmacy"
  },
  description:
    "Authentic Ayurvedic and Unani medicines in Amroha. Delivering wellness across India. Buy online for fast delivery.",
  keywords: [
    "Amroha Pharmacy", 
    "Ayurvedic medicines", 
    "Unani medicines", 
    "wellness",
    "online pharmacy",
    "ayurvedic store"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Amroha Pharmacy | Ayurvedic & Unani Wellness",
    description: "Authentic Ayurvedic and Unani wellness products from Amroha.",
    url: "https://amrohapharmacy.vercel.app",
    siteName: "Amroha Pharmacy",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=630&fit=crop", // Temporary high-quality pharmacy image
        width: 1200,
        height: 630,
        alt: "Amroha Pharmacy",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amroha Pharmacy - Ayurvedic & Unani Care",
    description: "Authentic Ayurvedic and Unani medicines delivered across India.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=630&fit=crop"],
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
