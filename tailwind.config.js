/** @type {import('tailwindcss').Config} */
import { screens as defaultScreens } from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      xs: { min: "475px" },
      ...defaultScreens,
    },
  },
  plugins: [],
};
