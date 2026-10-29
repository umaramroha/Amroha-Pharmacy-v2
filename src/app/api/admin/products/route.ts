import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { PRODUCTS_CACHE_TAG } from "@/lib/products";
import { revalidateTag } from "next/cache";
import { adminSessionOptions, getAdminSession } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import {
  createProductSchema,
  validationErrorBody,
} from "@/lib/productSchema";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

async function isAdmin() {
  const session = await getIronSession<AdminSessionData>(
    await cookies(),
    adminSessionOptions
  );
  return session.isAdminLoggedIn && session.adminId;
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Admin get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await getAdminSession();
    const rateCheck = await rateLimit(`admin-mutation:${session.adminId}`, 50, 60 * 60 * 1000, { failOpen: false });
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Admin rate limit exceeded" }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(validationErrorBody(parsed.error), {
        status: 400,
      });
    }
    const data = parsed.data;

    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const cleanImages = data.images ?? [];
    const primaryImage = data.image?.trim() || null;
    const finalImages =
      cleanImages.length > 0 ? cleanImages : primaryImage ? [primaryImage] : [];

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description?.trim() || null,
        price: data.price,
        mrp: data.mrp ?? null,
        image: primaryImage || finalImages[0] || null,
        images: finalImages,
        category: data.category?.trim() || null,
        stock: data.stock ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    revalidateTag(PRODUCTS_CACHE_TAG);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Admin create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
