import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#087F73", light: "#28A99B", dark: "#075E56" },
        secondary: { DEFAULT: "#E9A52A", light: "#F5CA73", dark: "#B87500" },
        background: { DEFAULT: "#FBFDFB", dark: "#1A1A1A" },
        surface: { DEFAULT: "#FFFFFF", dark: "#2A2A2A" },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
