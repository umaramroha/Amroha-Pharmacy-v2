import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TipArticle from "@/components/healthTips/TipArticle";
import { HEALTH_TIPS, getTip } from "@/data/healthTips";
import { buildTipMetadata } from "@/lib/healthTipsSeo";
import { getTipProducts } from "@/lib/healthTipsProducts";

export const revalidate = 3600;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HEALTH_TIPS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildTipMetadata(slug, "hi");
}

export default async function HindiHealthTipPage({ params }: Props) {
  const { slug } = await params;
  const tip = getTip(slug);
  if (!tip) notFound();
  const products = await getTipProducts(tip);
  return <TipArticle tip={tip} lang="hi" products={products} />;
}
