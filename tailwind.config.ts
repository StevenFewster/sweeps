import type { Config } from "tailwindcss";

// Palette shared with stevenfewster.com (see its tailwind.config.cjs).
const wedgewood = {
  50: "#f2f9f9",
  100: "#ddeff0",
  200: "#bfe0e2",
  300: "#92cace",
  400: "#5faab1",
  500: "#438e96",
  600: "#3b757f",
  700: "#356169",
  800: "#325158",
  900: "#2d464c",
  950: "#1a2c32",
};

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { wedgewood },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "60%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-out": "fadeOut 2s ease-in-out forwards",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      {
        wedgewood: {
          "color-scheme": "light",
          primary: wedgewood[600],
          "primary-content": "#ffffff",
          secondary: wedgewood[400],
          "secondary-content": wedgewood[950],
          accent: wedgewood[300],
          "accent-content": wedgewood[950],
          neutral: wedgewood[900],
          "neutral-content": wedgewood[50],
          "base-100": "#ffffff",
          "base-200": wedgewood[50],
          "base-300": wedgewood[200],
          "base-content": "#111827",
          info: wedgewood[400],
          success: wedgewood[500],
          warning: "#d97706",
          error: "#b91c1c",
          "--rounded-box": "0",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "9999px",
          "--animation-btn": "0",
          "--animation-input": "0",
          "--btn-focus-scale": "1",
        },
      },
    ],
  },
};

export default config;
