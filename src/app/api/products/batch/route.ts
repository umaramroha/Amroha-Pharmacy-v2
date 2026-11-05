import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const BatchInput = z.object({
  ids: z.array(z.string().min(1).max(64)).min(1).max(100),
});

/**
 * POST /api/products/batch  body: { ids: string[] }
 * Returns up to 100 active products matching the ids.
 * Used by wishlist and blog related-products instead of the paginated list.
 */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const parsed = BatchInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid ids" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { id: { in: parsed.data.ids }, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        mrp: true,
        image: true,
        stock: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Batch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
