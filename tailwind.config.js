/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141A21",
        "ink-soft": "#2B333C",
        paper: "#ECEEF0",
        "paper-raised": "#F5F6F4",
        line: "#D3D6D0",
        "line-strong": "#B7BBB3",
        muted: "#5B6570",
        amber: "#E2A63B",
        "amber-soft": "#F6E4C2",
        depot: "#3E7F5C",
        "depot-soft": "#DCEAE1",
        alarm: "#C1442C",
        "alarm-soft": "#F3DCD6",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
      },
      boxShadow: {
        none: "none",
      },
      letterSpacing: {
        wide2: "0.08em",
      },
    },
  },
  plugins: [],
};
