import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, getAdminSession } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import { revalidateTag, revalidatePath } from "next/cache";
import { BANNERS_CACHE_TAG } from "@/lib/banners";
import { z } from "zod";

const updateBannerSchema = z.object({
  brand: z.string().trim().min(1).max(50).optional(),
  title: z.string().trim().min(1).max(100).optional(),
  subtitle: z.string().trim().max(200).optional().nullable(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  linkUrl: z.string().trim().max(500).optional().nullable().refine(
    (val) => !val || val === "" || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
    "Must be a valid URL (http/https) or a relative path starting with /"
  ),
  theme: z.string().optional(),
  layout: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
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

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await getAdminSession();
    const rateCheck = await rateLimit(`admin-mutation:${session.adminId}`, 50, 60 * 60 * 1000, { failOpen: false });
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Admin rate limit exceeded" }, { status: 429 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = updateBannerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { brand, title, subtitle, imageUrl, linkUrl, theme, layout, order, isActive } = parsed.data;
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        ...(brand !== undefined && { brand: brand.trim() }),
        ...(title !== undefined && { title: title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle?.trim() || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
        ...(linkUrl !== undefined && { linkUrl: linkUrl?.trim() || null }),
        ...(theme !== undefined && { theme: theme?.trim() || "teal" }),
...(layout !== undefined && { layout: layout?.trim() || "split" }), 
       ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    // Make the home page show this change right away (instead of waiting up to 60s)
    revalidateTag(BANNERS_CACHE_TAG);
    revalidatePath("/");

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error("Admin update banner error:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.banner.delete({ where: { id: params.id } });

    // Make the home page show this change right away (instead of waiting up to 60s)
    revalidateTag(BANNERS_CACHE_TAG);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete banner error:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
