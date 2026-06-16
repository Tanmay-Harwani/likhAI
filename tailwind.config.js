/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1318",
        surface: "#171D24",
        edge: "#232B34",
        dim: "#566270",
        fg: "#E9EDF1",
        saffron: "#E8A33D",
        error: "#E5484D",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
