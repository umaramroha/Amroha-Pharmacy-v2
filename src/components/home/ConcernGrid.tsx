import Link from "next/link";
import { concerns } from "@/data/concerns";
import RevealSection from "./RevealSection";
import { Zap, ShieldCheck, Baby, Heart, Stethoscope, Flame, TrendingDown, Dumbbell, Bone, Droplets, Activity } from "lucide-react";

const renderConcernIcon = (slug: string) => {
  const p = { className: "w-7 h-7 md:w-9 md:h-9 text-primary transition-transform group-hover:scale-110" };
  switch (slug) {
    case "mens-vitality": return <Zap {...p} />;
    case "sexual-health": return <ShieldCheck {...p} />;
    case "male-fertility": return <Baby {...p} />;
    case "womens-health": return <Heart {...p} />;
    case "white-discharge": return <Stethoscope {...p} />;
    case "gastric-digestion": return <Flame {...p} />;
    case "weight-loss": return <TrendingDown {...p} />;
    case "weight-gain": return <Dumbbell {...p} />;
    case "joints-pain": return <Bone {...p} />;
    case "diabetes": return <Droplets {...p} />;
    default: return <Activity {...p} />;
  }
};

export default function ConcernGrid() {
  return (
    <RevealSection className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Concern</h2>
            <p className="text-sm text-gray-500 mt-1">Find medicines by health problem</p>
          </div>
          <Link href="/concerns" className="text-primary text-sm font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {concerns.map((c) => (
            <Link key={c.slug} href={`/concerns/${c.slug}`} className="group flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
                {renderConcernIcon(c.slug)}
              </div>
              <h3 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-primary transition leading-tight mb-1">{c.name}</h3>
              <p className="text-[10px] md:text-xs text-gray-500">{c.hindiName}</p>
            </Link>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}