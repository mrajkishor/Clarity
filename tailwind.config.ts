import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "tree-line": "hsl(var(--tree-line))",
        tag: {
          sage: "hsl(var(--tag-sage))",
          "sage-text": "hsl(var(--tag-sage-text))",
          sky: "hsl(var(--tag-sky))",
          "sky-text": "hsl(var(--tag-sky-text))",
          amber: "hsl(var(--tag-amber))",
          "amber-text": "hsl(var(--tag-amber-text))",
          rose: "hsl(var(--tag-rose))",
          "rose-text": "hsl(var(--tag-rose-text))",
          violet: "hsl(var(--tag-violet))",
          "violet-text": "hsl(var(--tag-violet-text))",
          neutral: "hsl(var(--tag-neutral))",
          "neutral-text": "hsl(var(--tag-neutral-text))",
        },
        status: {
          "in-progress": "hsl(var(--status-in-progress))",
          "in-progress-bg": "hsl(var(--status-in-progress-bg))",
          blocked: "hsl(var(--status-blocked))",
          "blocked-bg": "hsl(var(--status-blocked-bg))",
          "on-hold": "hsl(var(--status-on-hold))",
          "on-hold-bg": "hsl(var(--status-on-hold-bg))",
          done: "hsl(var(--status-done))",
          "done-bg": "hsl(var(--status-done-bg))",
          cancelled: "hsl(var(--status-cancelled))",
          "cancelled-bg": "hsl(var(--status-cancelled-bg))",
        },
        importance: {
          high: "hsl(var(--importance-high))",
          "high-bg": "hsl(var(--importance-high-bg))",
          medium: "hsl(var(--importance-medium))",
          "medium-bg": "hsl(var(--importance-medium-bg))",
          low: "hsl(var(--importance-low))",
          "low-bg": "hsl(var(--importance-low-bg))",
        },
        carryover: {
          yes: "hsl(var(--carryover-yes))",
          "yes-bg": "hsl(var(--carryover-yes-bg))",
          no: "hsl(var(--carryover-no))",
          "no-bg": "hsl(var(--carryover-no-bg))",
          split: "hsl(var(--carryover-split))",
          "split-bg": "hsl(var(--carryover-split-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(4px)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "expand": {
          "0%": { height: "0", opacity: "0" },
          "100%": { height: "var(--expand-height, auto)", opacity: "1" },
        },
        "collapse": {
          "0%": { height: "var(--expand-height, auto)", opacity: "1" },
          "100%": { height: "0", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.15s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "expand": "expand 0.25s ease-out",
        "collapse": "collapse 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
