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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
const { brand, title, subtitle, imageUrl, linkUrl, theme, layout, order, isActive } = body;
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
       ...(order !== undefined && { order: parseInt(order) || 0 }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error("Admin update banner error:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.banner.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete banner error:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
