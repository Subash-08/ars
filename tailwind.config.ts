import type { Config } from "tailwindcss";

const siteFonts = ['var(--site-typeface, "Bricolage Grotesque")', '"Bricolage Grotesque"', "system-ui", '"Nirmala UI"', "sans-serif"];

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#16a34a",
          "green-dark": "#15803d",
          "green-light": "#dcfce7",
          electric: "#00d26a",
          blue: "#0284c7",
          "blue-dark": "#0369a1",
          dark: "#121417",
          card: "#1a1d24",
          surface: "#f8fafc",
        },
      },
      fontFamily: {
        sans: siteFonts,
        mono: siteFonts,
      },
    },
  },
  plugins: [],
};
export default config;
