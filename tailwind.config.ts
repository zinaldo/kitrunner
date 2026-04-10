import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        stitch: "var(--stitch-radius)",
        candy: "1.25rem",
        "candy-pill": "9999px",
      },
      boxShadow: {
        "stitch-card":
          "0 10px 40px rgb(15 23 42 / 0.09), 0 2px 10px rgb(13 148 136 / 0.07)",
        "stitch-card-soft":
          "0 6px 28px rgb(15 23 42 / 0.07), 0 1px 4px rgb(13 148 136 / 0.06)",
        "candy-primary":
          "0 4px 16px rgb(224 64 160 / 0.22), 0 2px 6px rgb(124 82 170 / 0.08)",
        "candy-card":
          "0 8px 32px rgb(124 82 170 / 0.14), 0 2px 12px rgb(224 64 160 / 0.08)",
        "candy-card-soft":
          "0 6px 24px rgb(96 72 104 / 0.1), 0 1px 4px rgb(224 64 160 / 0.06)",
        "candy-tertiary":
          "0 4px 16px rgb(0 150 204 / 0.18), 0 2px 6px rgb(124 82 170 / 0.06)",
      },
      colors: {
        stitch: {
          canvas: "rgb(var(--stitch-canvas) / <alpha-value>)",
          surface: "rgb(var(--stitch-surface) / <alpha-value>)",
          ink: "rgb(var(--stitch-ink) / <alpha-value>)",
          muted: "rgb(var(--stitch-muted) / <alpha-value>)",
          accent: "rgb(var(--stitch-accent) / <alpha-value>)",
          "accent-soft": "rgb(var(--stitch-accent-soft) / <alpha-value>)",
        },
        candy: {
          background: "rgb(var(--candy-background) / <alpha-value>)",
          surface: "rgb(var(--candy-surface) / <alpha-value>)",
          container: "rgb(var(--candy-surface-container) / <alpha-value>)",
          "container-low": "rgb(var(--candy-surface-container-low) / <alpha-value>)",
          ink: "rgb(var(--candy-on-surface) / <alpha-value>)",
          muted: "rgb(var(--candy-on-surface-variant) / <alpha-value>)",
          outline: "rgb(var(--candy-outline) / <alpha-value>)",
          primary: "rgb(var(--candy-primary) / <alpha-value>)",
          "on-primary": "rgb(var(--candy-on-primary) / <alpha-value>)",
          "primary-container":
            "rgb(var(--candy-primary-container) / <alpha-value>)",
          secondary: "rgb(var(--candy-secondary) / <alpha-value>)",
          "on-secondary": "rgb(var(--candy-on-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--candy-tertiary) / <alpha-value>)",
          "on-tertiary": "rgb(var(--candy-on-tertiary) / <alpha-value>)",
          "primary-dim": "rgb(var(--candy-primary-fixed-dim) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
