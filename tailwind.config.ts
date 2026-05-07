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
        display: ["var(--display)"],
        body: ["var(--body)"],
        mono: ["var(--mono)"],
      },
      colors: {
        tone: {
          bg: "var(--tone-bg)",
          paper: "var(--tone-paper)",
          ink: "var(--tone-ink)",
          "ink-soft": "var(--tone-ink-soft)",
          accent: "var(--tone-accent)",
          leaf: "var(--tone-leaf)",
          rule: "var(--tone-rule)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
