import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
        interface: ["Inter", "sans-serif"],
        whitney: ["Whitney", "Inter", "sans-serif"],
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
        // Updated Beardsley brand colors - red, green, orange only
        office: {
          maroon: "#8B1538", // Primary red/maroon
          "maroon-light": "#A0476F", // Light maroon
          "maroon-dark": "#6B1028", // Dark maroon
          orange: "#F59E0B", // Primary orange
          "orange-light": "#FCD34D", // Light orange
          "orange-muted": "#FEF3C7", // Very light orange
          green: "#10B981", // Primary green
          "green-light": "#34D399", // Light green
          "green-muted": "#D1FAE5", // Very light green
          red: "#DC2626", // Bright red for alerts/errors
          "red-light": "#F87171", // Light red
          "red-muted": "#FEE2E2", // Very light red
        },
        // Room type colors updated with red/green/orange palette
        room: {
          conference: "#D1FAE5", // Light green
          kitchen: "#FED7AA", // Light orange
          office: "#F8FAFC", // Light gray (neutral)
          reception: "#FEE2E2", // Light red
          print: "#FCE7F3", // Light pink
          restroom: "#F3F4F6", // Very light gray
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
