import { Noto_Sans_Devanagari } from "next/font/google";

// Poppins (site font) has no Devanagari glyphs, so Hindi text gets its own font.
export const hindiFont = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
