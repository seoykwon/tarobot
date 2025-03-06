import type { Config } from "tailwindcss";
import tailwindScrollbar from "tailwind-scrollbar";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)", 
        "card-foreground": "var(--card-foreground)",
      },
      keyframes: {
        dotWave: {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(-5px)", opacity: "0.5" },
        },
      },
      animation: {
        dotWave: "dotWave 1s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindScrollbar],
};

export default config;
