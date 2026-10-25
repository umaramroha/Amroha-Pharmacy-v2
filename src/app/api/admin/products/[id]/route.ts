import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";
import {
  updateProductSchema,
  validationErrorBody,
  MRP_BELOW_PRICE_MESSAGE,
} from "@/lib/productSchema";

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Admin get product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Strict validation of every field that was sent (partial updates allowed)
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(validationErrorBody(parsed.error), {
        status: 400,
      });
    }
    const data = parsed.data;

    // MRP must be >= price. When both are sent the schema already checked it.
    // When only one is sent, compare it with the value saved in the database.
    if ((data.price !== undefined) !== (data.mrp !== undefined)) {
      const saved = await prisma.product.findUnique({
        where: { id: params.id },
        select: { price: true, mrp: true },
      });
      if (!saved) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const price = data.price !== undefined ? data.price : Number(saved.price);
      const mrp =
        data.mrp !== undefined
          ? data.mrp
          : saved.mrp === null
          ? null
          : Number(saved.mrp);

      if (mrp !== null && mrp < price) {
        const message =
          data.price !== undefined
            ? `${MRP_BELOW_PRICE_MESSAGE} (saved MRP is ${mrp}). Update the MRP as well.`
            : `${MRP_BELOW_PRICE_MESSAGE} (saved price is ${price}).`;
        return NextResponse.json(
          {
            error: message,
            issues: [{ field: "mrp", message }],
          },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description?.trim() || null;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.mrp !== undefined) updateData.mrp = data.mrp; // null clears it
    if (data.category !== undefined)
      updateData.category = data.category?.trim() || null;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.images !== undefined) {
      updateData.images = data.images;
      updateData.image = data.images[0] || null;
    } else if (data.image !== undefined) {
      updateData.image = data.image?.trim() || null;
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Admin update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orderItemCount = await prisma.orderItem.count({
      where: { productId: params.id },
    });
    if (orderItemCount > 0) {
      await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Product deactivated (used in existing orders)",
      });
    }
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Admin delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
