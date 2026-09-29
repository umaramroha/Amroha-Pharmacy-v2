import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions } from "@/lib/adminSession";

type AdminSessionData = {
  adminId?: string;
  email?: string;
  role?: string;
  isAdminLoggedIn: boolean;
};

async function getAdminSession() {
  const session = await getIronSession<AdminSessionData>(
    cookies(),
    adminSessionOptions
  );
  return session;
}

// GET current admin info
export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session.isAdminLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.adminId },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!admin) {
      session.destroy();
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error("Get admin settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin" },
      { status: 500 }
    );
  }
}

// PATCH — update email and/or password
export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session.isAdminLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newEmail, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to make changes" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.adminId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const updateData: any = {};

    // Update email
    if (newEmail && newEmail.trim().toLowerCase() !== admin.email) {
      const cleanEmail = newEmail.trim().toLowerCase();

      // Check if email is already taken
      const existing = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      });

      if (existing && existing.id !== admin.id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }

      updateData.email = cleanEmail;
    }

    // Update password
if (newPassword) {
  if (newPassword.length < 10) {
    return NextResponse.json(
      { error: "Password must be at least 10 characters long" },
      { status: 400 }
    );
  }

  // Require at least one uppercase, one lowercase, one number, one special char
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return NextResponse.json(
      {
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
      { status: 400 }
    );
  }

  updateData.password = await bcrypt.hash(newPassword, 10);
}

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updateData,
      select: { id: true, email: true, role: true },
    });

    // Update session if email changed
    if (updateData.email) {
      session.email = updateData.email;
      await session.save();
    }

    return NextResponse.json({ success: true, admin: updated });
  } catch (error: any) {
    console.error("Update admin settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
