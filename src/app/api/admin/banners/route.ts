import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";
import { revalidateTag, revalidatePath } from "next/cache";
import { BANNERS_CACHE_TAG } from "@/lib/banners";

import { z } from "zod";

const BannerInput = z.object({
  brand: z.string().trim().min(1).max(50),
  title: z.string().trim().min(1).max(100),
  subtitle: z.string().trim().max(200).optional().nullable(),
  imageUrl: z.string().url("Must be a valid URL"),
  linkUrl: z.string().url().optional().nullable().or(z.literal("")),
  theme: z.string().default("teal"),
  layout: z.string().default("split"),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});


export const dynamic = "force-dynamic";

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
    const parsed = BannerInput.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { brand, title, subtitle, imageUrl, linkUrl, theme, layout, order, isActive } = parsed.data;    

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
        order: order,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    // Make the home page show this change right away (instead of waiting up to 60s)
    revalidateTag(BANNERS_CACHE_TAG);
    revalidatePath("/");

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error("Admin create banner error:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
