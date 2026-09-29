"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  ["Home", "/"], ["Shop", "/products"], ["Cart", "/cart"], ["Account", "/profile"],
];
export default function BottomNav() {
  const pathname = usePathname(); const { totalItems } = useCart(); const { isLoggedIn } = useAuth();
  const icon = (label: string) => label === "Home" ? "⌂" : label === "Shop" ? "⌕" : label === "Cart" ? "🛒" : "◯";
  return <nav className="mobile-bottom-nav md:hidden"><div className="grid h-[68px] grid-cols-4">{items.map(([label, href]) => { const actual = label === "Account" && !isLoggedIn ? "/login" : href; const active = actual === "/" ? pathname === "/" : pathname.startsWith(actual); return <Link key={label} href={actual} className={`relative flex flex-col items-center justify-center gap-0.5 ${active ? "text-emerald-700" : "text-slate-400"}`}><span className="text-xl leading-none">{icon(label)}</span><span className="text-[10px] font-bold">{label}</span>{label === "Cart" && totalItems > 0 && <span className="absolute left-1/2 top-2 ml-1.5 grid h-4 min-w-4 -translate-y-1/2 place-items-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">{totalItems > 9 ? "9+" : totalItems}</span>}{active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-emerald-700" />}</Link>})}</div></nav>;
}
