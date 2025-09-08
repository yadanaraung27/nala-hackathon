/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        basewhite: "var(--basewhite)",
        "colors-white-100": "var(--colors-white-100)",
        "gray-100": "var(--gray-100)",
        "gray-200": "var(--gray-200)",
        "gray-300": "var(--gray-300)",
        "gray-500": "var(--gray-500)",
        "gray-700": "var(--gray-700)",
        "gray-900": "var(--gray-900)",
        "neutral-white": "var(--neutral-white)",
        "w-300": "var(--w-300)",
        "w-500": "var(--w-500)",
      },
      fontFamily: {
        "charts-group": "var(--charts-group-font-family)",
        "display-sm-medium": "var(--display-sm-medium-font-family)",
        "display-sm-semibold": "var(--display-sm-semibold-font-family)",
        "m3-headline-medium-emphasized":
          "var(--m3-headline-medium-emphasized-font-family)",
        "text-lg-medium": "var(--text-lg-medium-font-family)",
        "text-md-medium": "var(--text-md-medium-font-family)",
        "text-md-normal": "var(--text-md-normal-font-family)",
        "text-sm-medium": "var(--text-sm-medium-font-family)",
        "text-sm-normal": "var(--text-sm-normal-font-family)",
        "text-xs-medium": "var(--text-xs-medium-font-family)",
        "text-xs-normal": "var(--text-xs-normal-font-family)",
      },
      boxShadow: {
        "shadow-sm": "var(--shadow-sm)",
        "shadow-xs": "var(--shadow-xs)",
      },
    },
  },
  plugins: [],
};
