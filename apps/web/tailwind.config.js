import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

const withOpacity = (variable) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variable}) / ${opacityValue})`;
    }
    return `rgb(var(${variable}))`;
  };
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: withOpacity("--color-brand-primary"),
          primary: withOpacity("--color-brand-primary"),
          gradient1: withOpacity("--color-brand-gradient1"),
          gradient2: withOpacity("--color-brand-gradient2"),
          light: withOpacity("--color-brand-light"),
          dark: withOpacity("--color-brand-dark"),
          ink: withOpacity("--color-brand-ink")
        },
        ui: {
          background: withOpacity("--color-ui-background"),
          surface: withOpacity("--color-ui-surface"),
          "surface-alt": withOpacity("--color-ui-surface-alt"),
          "surface-soft": withOpacity("--color-ui-surface-soft"),
          border: withOpacity("--color-ui-border"),
          "border-strong": withOpacity("--color-ui-border-strong"),
          shadow: withOpacity("--color-ui-shadow"),
          info: withOpacity("--color-ui-info"),
          success: withOpacity("--color-ui-success"),
          warning: withOpacity("--color-ui-warning"),
          danger: withOpacity("--color-ui-danger"),
          accent1: withOpacity("--color-ui-accent1"),
          accent2: withOpacity("--color-ui-accent2"),
          accent3: withOpacity("--color-ui-accent3")
        },
        text: {
          primary: withOpacity("--color-text-primary"),
          secondary: withOpacity("--color-text-secondary"),
          muted: withOpacity("--color-text-muted")
        },
        border: withOpacity("--color-ui-border"),
        background: withOpacity("--color-ui-background"),
        surface: withOpacity("--color-ui-surface"),
        "surface-alt": withOpacity("--color-ui-surface-alt"),
        "surface-soft": withOpacity("--color-ui-surface-soft"),
        "text-primary": withOpacity("--color-text-primary"),
        "text-secondary": withOpacity("--color-text-secondary"),
        "text-muted": withOpacity("--color-text-muted"),
        "accent-green": withOpacity("--color-ui-success"),
        "accent-blue": withOpacity("--color-ui-info"),
        "accent-amber": withOpacity("--color-ui-warning"),
        "accent-red": withOpacity("--color-ui-danger")
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
