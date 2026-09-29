import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

async function isAdmin() {
  const session = await getIronSession<AdminSessionData>(
    cookies(),
    adminSessionOptions
  );
  return session.isAdminLoggedIn && session.adminId;
}

// GET all products (admin — includes inactive)
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

// POST — create new product
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, price, mrp, image, category, stock } = body;

    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: "Name, slug and price are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { slug: slug.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : null,
        image: image?.trim() || null,
        category: category?.trim() || null,
        stock: parseInt(stock) || 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Admin create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
