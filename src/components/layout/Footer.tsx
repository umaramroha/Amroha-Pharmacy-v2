import Link from "next/link";

const links = [
  ["Home", "/"], ["Products", "/products"], ["Shop by concern", "/concerns"], ["About us", "/about"], ["Wellness journal", "/blogs"], ["Contact", "/contact"],
];
const policies = [["Privacy", "/policies/privacy"], ["Terms", "/policies/terms"], ["Shipping", "/policies/shipping"], ["Returns", "/policies/returns"], ["Disclaimer", "/policies/disclaimer"]];

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.25fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white p-1"><img src="/logo.png" alt="Amroha Pharmacy" className="h-full w-full object-contain" /></span>
              <span><span className="block text-base font-bold">Amroha Pharmacy</span><span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-emerald-300">Natural wellness</span></span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">A trusted destination for authentic Ayurvedic and Unani wellness products, with simple ordering and dependable delivery from Amroha.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-300"><span className="rounded-full border border-white/10 px-3 py-1.5">Authentic products</span><span className="rounded-full border border-white/10 px-3 py-1.5">Secure checkout</span><span className="rounded-full border border-white/10 px-3 py-1.5">India delivery</span></div>
          </div>
          <div><h3 className="footer-heading">Explore</h3><div className="space-y-2">{links.map(([label, href]) => <Link key={href} href={href} className="footer-link">{label}</Link>)}</div></div>
          <div><h3 className="footer-heading">Policies</h3><div className="space-y-2">{policies.map(([label, href]) => <Link key={href} href={href} className="footer-link">{label}</Link>)}</div></div>
          <div><h3 className="footer-heading">Contact</h3><div className="space-y-4 text-sm text-slate-400"><p><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Visit</span>Mohalla Nal, Amroha, Uttar Pradesh, India</p><p><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Call</span><a href="tel:+918077988509" className="text-slate-200 hover:text-emerald-300">+91 80779 88509</a></p><p><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</span><a href="mailto:Amrohapharmastore@gmail.com" className="break-all text-slate-200 hover:text-emerald-300">Amrohapharmastore@gmail.com</a></p></div></div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Amroha Pharmacy. All rights reserved.</p><p>Designed for a calmer, clearer shopping experience.</p></div>
      </div>
    </footer>
  );
}
