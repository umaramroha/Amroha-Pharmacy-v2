import { NextResponse } from "next/server";
import { fetchActiveBanners } from "@/lib/banners";

// Kept dynamic on purpose so `next build` never needs database access for this route.
// The database work itself is cached for 60s inside fetchActiveBanners().
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banners = await fetchActiveBanners();

    return NextResponse.json(
      { banners },
      {
        headers: {
          // Let Vercel's CDN / browsers reuse the response for a minute
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Public banners API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}
