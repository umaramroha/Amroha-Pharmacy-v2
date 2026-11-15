import { ImageResponse } from "next/og";

// Brand share image (1200x630) shown in WhatsApp, Facebook and Google link previews.
// To change the design, edit this file, then bump the ?v= number in layout.tsx and healthTipsSeo.ts
// so that WhatsApp and Facebook fetch the new picture.
export const runtime = "edge";

export async function GET() {
  const points = ["Delivery across India", "Cash on Delivery", "WhatsApp support"];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #087F73 0%, #075E56 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: -140,
            top: -140,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: -160,
            top: -200,
            width: 420,
            height: 420,
            borderRadius: 210,
            background: "rgba(233,165,42,0.18)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            fontSize: 26,
            letterSpacing: 3,
          }}
        >
          AMROHA, UTTAR PRADESH
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 112, lineHeight: 1.05 }}>Amroha Pharmacy</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 46, color: "#F5CA73" }}>
            Authentic Ayurvedic & Unani Care
          </div>
        </div>

        <div style={{ display: "flex", gap: 44, fontSize: 30, color: "rgba(255,255,255,0.92)" }}>
          {points.map((label) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: "#E9A52A" }} />
              <div style={{ display: "flex" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
