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
        "brand-light": "var(--brand-light)",
        "brand-dark": "var(--brand-dark)",
        "brand-ink": "var(--brand-ink)",
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        "surface-soft": "var(--surface-soft)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "accent-green": "var(--accent-green)",
        "accent-blue": "var(--accent-blue)",
        "accent-purple": "var(--accent-purple)",
        "accent-teal": "var(--accent-teal)",
        "accent-amber": "var(--accent-amber)",
        "accent-pink": "var(--accent-pink)",
        "accent-cyan": "var(--accent-cyan)",
        "accent-lime": "var(--accent-lime)",
        "accent-indigo": "var(--accent-indigo)",
        "accent-sky": "var(--accent-sky)",
        "accent-red": "var(--accent-red)"
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", ...fontFamily.sans]
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)"
      },
      boxShadow: {
        "elev-sm": "var(--shadow-sm)",
        "elev-md": "var(--shadow-md)",
        "elev-lg": "var(--shadow-lg)"
      },
      transitionDuration: {
        swift: "150ms",
        soft: "220ms"
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
