import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { rateLimit } from "@/lib/rateLimit";
import { optOutEmail } from "@/lib/marketing";

export const dynamic = "force-dynamic";

// My Account switch: turns promotional emails ON or OFF for the logged-in customer.
export async function PATCH(request: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.userId },
      select: { email: true, lastPasswordChange: true },
    });
    if (!customer || (session.lastPasswordChange && new Date(session.lastPasswordChange) < customer.lastPasswordChange)) {
      session.destroy();
      return NextResponse.json({ error: "Session expired. Please login again." }, { status: 401 });
    }

    const rate = await rateLimit("marketing:" + session.userId, 20, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    if (typeof body?.optIn !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (body.optIn) {
      await prisma.customer.update({
        where: { id: session.userId },
        data: { marketingOptIn: true, marketingOptInAt: new Date(), marketingOptOutAt: null },
      });
    } else {
      // Also switches off a footer sign-up that uses the same email address.
      await optOutEmail(customer.email);
    }

    return NextResponse.json({ success: true, marketingOptIn: body.optIn });
  } catch (error) {
    console.error("Marketing preference error:", error);
    return NextResponse.json({ error: "Could not save your choice. Please try again." }, { status: 500 });
  }
}
