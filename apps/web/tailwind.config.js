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
        "mesh-primary":
          "radial-gradient(120% 120% at 0% 0%, rgba(255,95,0,0.35) 0%, transparent 55%), radial-gradient(80% 120% at 100% 0%, rgba(14,165,233,0.45) 0%, transparent 60%), radial-gradient(90% 120% at 50% 100%, rgba(96,165,250,0.4) 0%, transparent 65%)"
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
        sm: "0 8px 20px rgba(15, 17, 21, 0.10)",
        md: "0 16px 40px rgba(15, 17, 21, 0.18)",
        lg: "0 24px 60px rgba(15, 17, 21, 0.25)",
        glass: "0 18px 42px rgba(14, 22, 34, 0.22)"
      },
      dropShadow: {
        glow: ["0 8px 18px rgba(255, 95, 0, 0.25)", "0 12px 32px rgba(34, 211, 238, 0.15)"]
      },
      transitionDuration: {
        soft: "300ms"
      },
      transitionTimingFunction: {
        fluid: "cubic-bezier(0.4, 0, 0.2, 1)"
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
