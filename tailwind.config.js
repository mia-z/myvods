/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{svelte,html,ts,js}" ],
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dark", "black", "luxury", "business", "coffee", "night", "halloween", "dracula"]
  }
}

