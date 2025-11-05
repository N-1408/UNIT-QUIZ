import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        "brand-ink": "var(--brand-ink)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        card: "var(--card)",
        stroke: "var(--stroke)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        danger: "var(--danger)",
        muted: "var(--muted)"
      },
      backgroundImage: {
        "mesh-primary": "radial-gradient(circle at 20% 20%, var(--mesh-1), transparent 60%), radial-gradient(circle at 80% 0%, var(--mesh-2), transparent 55%), radial-gradient(circle at 50% 100%, var(--mesh-3), transparent 65%)"
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", ...fontFamily.sans]
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "calc(var(--radius-2xl) + 4px)"
      },
      boxShadow: {
        sm: "0 4px 12px rgba(15, 17, 21, 0.12)",
        md: "0 12px 28px rgba(15, 17, 21, 0.16)",
        lg: "0 18px 44px rgba(15, 17, 21, 0.22)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [animatePlugin]
};
