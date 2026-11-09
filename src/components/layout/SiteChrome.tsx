"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

// Admin pages (/kggg0b/...) get no customer header, footer or bottom nav.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname === "/kggg0b" || pathname.startsWith("/kggg0b/");

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
