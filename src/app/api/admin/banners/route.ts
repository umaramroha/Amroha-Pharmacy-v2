import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

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

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ banners });
  } catch (error: any) {
    console.error("Admin get banners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
const { brand, title, subtitle, imageUrl, linkUrl, theme, layout, order, isActive } = body;    

    if (!brand || !title || !imageUrl) {
      return NextResponse.json(
        { error: "Brand, title and imageUrl are required" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        brand: brand.trim(),
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || null,
        theme: theme?.trim() || "teal",
        layout: layout?.trim() || "split",
        order: parseInt(order) || 0,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error("Admin create banner error:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
