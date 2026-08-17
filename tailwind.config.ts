import type { Config } from "tailwindcss";

// Paleta y tipografias tomadas directamente de artikore.com para que la app
// no desentone con el resto de la marca:
//   - Titulares en Playfair Display, texto en Lato.
//   - Dorado #CAB269, texto en gris pizarra #334155, fondo claro.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#334155",
          strong: "#343434",
          muted: "#7A7A7A",
          faint: "#A3A3A3"
        },
        gold: {
          DEFAULT: "#CAB269",
          light: "#CFB97A",
          dark: "#A8914F",
          wash: "#FAF7EF"
        },
        cream: {
          DEFAULT: "#F7F5F2",
          deep: "#F0ECE6"
        },
        line: {
          DEFAULT: "#E5E1DA",
          soft: "#EFEDE8"
        },
        danger: "#B44A3F",
        success: "#4A8C6F"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      borderRadius: {
        card: "12px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(52, 52, 52, 0.04), 0 8px 24px -16px rgba(52, 52, 52, 0.25)",
        lift: "0 2px 4px rgba(52, 52, 52, 0.05), 0 16px 40px -20px rgba(52, 52, 52, 0.35)"
      },
      letterSpacing: {
        eyebrow: "0.18em"
      },
      maxWidth: {
        form: "42rem"
      }
    }
  },
  plugins: []
};

export default config;
