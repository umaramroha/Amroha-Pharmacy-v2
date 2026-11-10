import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

const bodySchema = z
  .object({
    followUpStatus: z.enum(["PENDING", "DONE", "NOT_INTERESTED"]).nullable(),
    followUpAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
      .nullable(),
    followUpNote: z.string().trim().max(500, "Note is too long").nullable(),
  })
  .refine((d) => d.followUpStatus !== "PENDING" || !!d.followUpAt, {
    message: "Pick a follow-up date",
    path: ["followUpAt"],
  });

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getIronSession<AdminSessionData>(await cookies(), adminSessionOptions);
    if (!session.isAdminLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { followUpStatus, followUpAt, followUpNote } = parsed.data;

    // The date is a calendar day in IST (UTC+5:30)
    let at: Date | null = null;
    if (followUpAt) {
      at = new Date(followUpAt + "T00:00:00+05:30");
      if (Number.isNaN(at.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
    }

    try {
      await prisma.customer.update({
        where: { id },
        data: {
          followUpStatus,
          followUpAt: at,
          followUpNote: followUpNote ? followUpNote : null,
        },
        select: { id: true },
      });
    } catch (e: any) {
      if (e?.code === "P2025") {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
      throw e;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin follow-up error:", error);
    return NextResponse.json({ error: "Failed to save follow-up" }, { status: 500 });
  }
}
