import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rate = await rateLimit(`products:${ip}`, 120, 60 * 1000, { failOpen: true });
    if (!rate.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q")?.slice(0, 80);

    const where: Prisma.ProductWhereInput = { isActive: true };

    const url = new URL(request.url);
    const page = Math.min(Math.max(parseInt(url.searchParams.get("page") || "1", 10) || 1, 1), 500);
    const limit = 24;
    const skip = (page - 1) * limit;
  

    if (category) {
      where.category = category;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      take: limit,
      skip,
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
