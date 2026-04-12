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
        "uptempo-headline": [
          "var(--font-uptempo-headline)",
          "Lexend",
          "ui-sans-serif",
          "sans-serif",
        ],
        "uptempo-body": [
          "var(--font-uptempo-body)",
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "sans-serif",
        ],
      },
      borderRadius: {
        stitch: "var(--stitch-radius)",
        candy: "1.25rem",
        "candy-pill": "9999px",
      },
      boxShadow: {
        "uptempo-card": "0 12px 40px rgba(27, 19, 69, 0.06)",
        "uptempo-cta": "0 8px 24px rgba(0, 101, 140, 0.25)",
        "uptempo-cta-hover": "0 12px 32px rgba(0, 101, 140, 0.35)",
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
        /** Stitch uptempo_dynamic / login_sign_in — Material-style semantic tokens */
        uptempo: {
          background: "#fdf8ff",
          surface: "#fdf8ff",
          primary: "#00658c",
          "primary-container": "#00b0f0",
          secondary: "#5f588d",
          "secondary-container": "#cbc2fe",
          "on-secondary-container": "#554e82",
          tertiary: "#006a63",
          "tertiary-container": "#00b8ac",
          "on-background": "#1b1345",
          "on-surface": "#1b1345",
          "on-surface-variant": "#3e4850",
          "on-primary": "#ffffff",
          "on-primary-container": "#003f59",
          "on-secondary": "#ffffff",
          "on-tertiary-container": "#00423d",
          outline: "#6e7881",
          "outline-variant": "#bdc8d1",
          "surface-container": "#f1ebff",
          "surface-container-low": "#f7f1ff",
          "surface-container-lowest": "#ffffff",
          "surface-container-high": "#ebe5ff",
          "surface-container-highest": "#e5deff",
          error: "#ba1a1a",
          "error-container": "#ffdad6",
          "on-error": "#ffffff",
          "on-error-container": "#93000a",
        },
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
