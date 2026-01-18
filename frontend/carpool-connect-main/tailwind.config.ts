import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "drive": "drive 8s linear infinite",
        "float-delayed": "float-delayed 7s ease-in-out 2s infinite",
        "mesh": "mesh 20s linear infinite",
        "reveal": "reveal 0.8s ease-out forwards",
      },
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
      "fade-in": {
        from: { opacity: "0", transform: "translateY(10px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
      "slide-in": {
        from: { opacity: "0", transform: "translateX(-10px)" },
        to: { opacity: "1", transform: "translateX(0)" },
      },
      "scale-in": {
        from: { opacity: "0", transform: "scale(0.95)" },
        to: { opacity: "1", transform: "scale(1)" },
      },
      "float": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-20px)" },
      },
      "float-delayed": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-15px)" },
      },
      "shimmer": {
        "100%": { transform: "translateX(100%)" },
      },
      "drive": {
        "0%": { transform: "translateX(-20vw)" },
        "100%": { transform: "translateX(120vw)" },
      },
      "mesh": {
        "0%": { transform: "translate(0, 0) rotate(0deg)" },
        "20%": { transform: "translate(20px, 20px) rotate(20deg)" },
        "40%": { transform: "translate(-20px, 40px) rotate(180deg)" },
        "60%": { transform: "translate(20px, -20px) rotate(260deg)" },
        "80%": { transform: "translate(-20px, -20px) rotate(340deg)" },
        "100%": { transform: "translate(0, 0) rotate(360deg)" },
      },
      "reveal": {
        "0%": { opacity: "0", transform: "translateY(30px) scale(0.95)" },
        "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
      },
      "progress": {
        "0%": { transform: "scaleX(0)", transformOrigin: "left" },
        "100%": { transform: "scaleX(1)", transformOrigin: "left" },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
