import type { Config } from "tailwindcss";

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
        obsidian: {
          950: "#060911",
          900: "#0B0F19",
          850: "#0F1626",
          800: "#141D30",
          700: "#1E2A44",
          600: "#2B3B5E",
        },
        crimson: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
        },
        cyber: {
          teal: "#0D9488",
          cyan: "#06B6D4",
          glow: "rgba(13, 148, 136, 0.25)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-glow": "radial-gradient(at 0% 0%, rgba(225, 29, 72, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(13, 148, 136, 0.1) 0px, transparent 50%)",
      },
      boxShadow: {
        "glow-crimson": "0 0 25px -5px rgba(225, 29, 72, 0.35)",
        "glow-teal": "0 0 25px -5px rgba(13, 148, 136, 0.35)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "card-depth": "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
