/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  important: "#__next",
  theme: {
    extend: {
      animation: {
        fadein: "fadein 0.5s ease-in-out",
        fadeinslow: "fadein 1s ease-in-out",
        drop: "drop 0.5s ease-in-out",
        risefast: "rise 0.2s ease-in-out",
        rise: "rise 0.5s ease-in-out",
        riseslow: "rise 1s ease-in-out",
        goleft: "goleft 0.5s ease-in-out",
        goright: "goright 0.5s ease-in-out",
      },
      keyframes: {
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "100%" },
        },
        drop: {
          "0%": { transform: "translate(0vh, -100vh)" },
          "100%": { transform: "translate(0vh, 0vh)" },
        },
        rise: {
          "0%": { transform: "translate(0vh, 100vh)" },
          "100%": { transform: "translate(0vh, 0vh)" },
        },
        goleft: {
          "0%": { transform: "translate(100vh, 0vh)" },
          "100%": { transform: "translate(0vh, 0vh)" },
        },
        goright: {
          "0%": { transform: "translate(-100vh, 0vh)" },
          "100%": { transform: "translate(0vh, 0vh)" },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
