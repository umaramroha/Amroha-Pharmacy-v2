"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

const categories = [
  { name: "Men's Wellness", slug: "male-problems" },
  { name: "Women's Wellness", slug: "female-problems" },
  { name: "General Wellness", slug: "general-problems" },
];

function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
  if (name === "heart") return <svg {...common}><path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/></svg>;
  if (name === "cart") return <svg {...common}><path d="M3 3h2l1.7 10.2a2 2 0 0 0 2 1.7h8.6a2 2 0 0 0 1.9-1.4L21 7H6"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>;
  if (name === "user") return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
  if (name === "menu") return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
  if (name === "x") return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
  if (name === "chevron") return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
  return null;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setCategoryOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,118,110,0.06)] backdrop-blur-xl">
      <div className="hidden bg-slate-950 text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[11px] font-medium tracking-wide sm:px-6 lg:px-8">
          <span className="text-slate-300">Authentic Ayurvedic & Unani care • Delivered across India</span>
          <div className="flex items-center gap-5">
            <a href="tel:+918077988509" className="transition hover:text-emerald-300">+91 80779 88509</a>
            <a href="https://wa.me/918077988509" target="_blank" rel="noopener noreferrer" className="transition hover:text-emerald-300">WhatsApp support</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center gap-3 lg:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Amroha Pharmacy home">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 sm:h-12 sm:w-12">
              <Image src="/logo.png" alt="Amroha Pharmacy" width={48} height={48} className="h-full w-full object-contain p-1" priority />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[15px] font-bold tracking-tight text-slate-950">Amroha Pharmacy</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Natural wellness</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <Link href="/" className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}>Home</Link>
            <Link href="/products" className={`nav-link ${pathname.startsWith("/products") ? "nav-link-active" : ""}`}>Shop</Link>
            <div className="relative">
              <button onClick={() => setCategoryOpen((v) => !v)} className={`nav-link inline-flex items-center gap-1 ${pathname.startsWith("/concerns") ? "nav-link-active" : ""}`}>
                Wellness <Icon name="chevron" className="h-3.5 w-3.5" />
              </button>
              {categoryOpen && (
                <>
                  <button aria-label="Close wellness menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setCategoryOpen(false)} />
                  <div className="absolute left-0 top-full z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                    {categories.map((category) => (
                      <Link key={category.slug} href={`/concerns/${category.slug}`} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">{category.name}</Link>
                    ))}
                    <Link href="/concerns" className="mt-1 block rounded-xl border-t border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-700">Explore all concerns →</Link>
                  </div>
                </>
              )}
            </div>
            <Link href="/blogs" className={`nav-link ${pathname.startsWith("/blogs") ? "nav-link-active" : ""}`}>Wellness journal</Link>
            <Link href="/about" className={`nav-link ${pathname === "/about" ? "nav-link-active" : ""}`}>About</Link>
          </nav>

          <form action="/products" className="ml-auto hidden max-w-md flex-1 md:block lg:max-w-xl">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <input name="q" placeholder="Search medicines, wellness & concerns" className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              <Icon name="search" className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            </label>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            <Link href="/wishlist" className="header-icon-btn" aria-label="Wishlist">
              <Icon name="heart" />
              {wishlistCount > 0 && <span className="badge badge-rose">{wishlistCount > 9 ? "9+" : wishlistCount}</span>}
            </Link>
            <Link href="/cart" className="header-icon-btn" aria-label="Cart">
              <Icon name="cart" />
              {totalItems > 0 && <span className="badge badge-amber">{totalItems > 9 ? "9+" : totalItems}</span>}
            </Link>
            {isLoggedIn && user ? (
              <div className="relative hidden sm:block">
                <button onClick={() => setUserOpen((v) => !v)} className="flex h-10 items-center gap-2 rounded-xl px-2 transition hover:bg-slate-50">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-700 text-xs font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="max-w-20 truncate text-xs font-bold text-slate-700">{user.name.split(" ")[0]}</span>
                  <Icon name="chevron" className="h-3.5 w-3.5 text-slate-400" />
                </button>
                {userOpen && (
                  <>
                    <button aria-label="Close account menu" className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                      <div className="rounded-xl bg-slate-50 px-3 py-3">
                        <p className="text-xs text-slate-400">Signed in as</p><p className="truncate text-sm font-semibold text-slate-800">{user.email}</p>
                      </div>
                      <Link href="/profile" className="menu-link">My profile</Link>
                      <Link href="/orders" className="menu-link">My orders</Link>
                      <button onClick={handleLogout} className="menu-link w-full text-left text-rose-600 hover:bg-rose-50">Log out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden rounded-xl px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 sm:block">Login</Link>
            )}
            <button onClick={() => setMobileOpen((v) => !v)} className="header-icon-btn lg:hidden" aria-label={mobileOpen ? "Close menu" : "Open menu"}>
              <Icon name={mobileOpen ? "x" : "menu"} />
            </button>
          </div>
        </div>

        <form action="/products" className="pb-3 md:hidden">
          <label className="relative block"><span className="sr-only">Search products</span><input name="q" placeholder="Search medicines & wellness" className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" /><Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></label>
        </form>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6" aria-label="Mobile navigation">
            {[
              ["Home", "/"], ["Shop products", "/products"], ["Shop by concern", "/concerns"], ["Wellness journal", "/blogs"], ["About us", "/about"], ["Contact", "/contact"],
            ].map(([label, href]) => <Link key={href} href={href} className="mobile-nav-link">{label}<span>→</span></Link>)}
            {isLoggedIn ? <><Link href="/profile" className="mobile-nav-link">My profile<span>→</span></Link><Link href="/orders" className="mobile-nav-link">My orders<span>→</span></Link><button onClick={handleLogout} className="mobile-nav-link w-full text-left text-rose-600">Log out<span>→</span></button></> : <Link href="/login" className="mt-2 block rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white">Login / create account</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}
