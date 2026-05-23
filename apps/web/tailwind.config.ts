import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#04070d",
          900: "#08111f",
          800: "#0f1f33"
        },
        aurora: {
          50: "#e7fffb",
          400: "#43f0d1",
          500: "#12d7b9",
          600: "#0ba394"
        },
        gold: {
          300: "#f8e7a1",
          400: "#e8c766",
          500: "#c89a2d"
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(18, 215, 185, 0.28)",
        gold: "0 0 30px rgba(232, 199, 102, 0.24)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top, rgba(67,240,209,0.18), transparent 28%), radial-gradient(circle at 80% 20%, rgba(232,199,102,0.12), transparent 20%), linear-gradient(180deg, rgba(4,7,13,0.8), rgba(4,7,13,1))"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -18px, 0)" }
        },
        pulseRing: {
          "0%": { transform: "scale(0.96)", opacity: "0.35" },
          "70%": { transform: "scale(1.12)", opacity: "0.08" },
          "100%": { transform: "scale(1.2)", opacity: "0" }
        }
      },
      animation: {
        drift: "drift 10s ease-in-out infinite",
        pulseRing: "pulseRing 2.8s ease-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
