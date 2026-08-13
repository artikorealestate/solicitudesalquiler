import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1C1C1C",
        gold: "#CBB26A",
        warm: "#F7F5F2",
        border: "#E0DBD3"
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"]
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
};

export default config;
