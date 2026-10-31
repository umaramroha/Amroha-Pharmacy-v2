import Link from "next/link";
import { concerns } from "@/data/concerns";
import { Zap, ShieldCheck, Baby, Heart, Stethoscope, Flame, TrendingDown, Dumbbell, Bone, Droplets, Activity } from "lucide-react";

const getIcon = (slug: string) => {
  const p = { className: "w-10 h-10 transition-transform group-hover:scale-110" };
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

export const metadata = {
  title: "Shop by Concern - Amroha Pharmacy",
  description:
    "Natural solutions for every health concern. Browse products by Ayurvedic and Unani expert-approved concerns.",
};

export default function ConcernsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-primary">
          Shop by Concern
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Natural solutions for every health concern — approved by Ayurvedic and Unani experts
          approved
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {concerns.map((concern) => (
          <Link
            key={concern.slug}
            href={`/concerns/${concern.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md border transition overflow-hidden"
          >
            <div className="p-5 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-105 transition duration-300">
                <div className="text-primary group-hover:text-white transition-colors">{getIcon(concern.slug)}</div>
              </div>
              <h2 className="text-base md:text-lg font-bold mb-1 text-gray-800 group-hover:text-primary transition">
                {concern.name}
              </h2>
              <p className="text-xs text-gray-500 mb-3">{concern.hindiName}</p>
              <p className="text-xs text-gray-600 line-clamp-3 mb-4">
                {concern.description}
              </p>
              <span className="text-primary font-semibold text-sm mt-auto">
                View Products →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
