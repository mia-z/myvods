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
      fontFamily: {
        "lobster": ["Lobster", "cursive"],
        "open-sans": ["Open Sans", "sans-serif"],
        "roboto": ["Roboto Flex", "sans-serif"],
        "roboto-monospace": ["Roboto Mono", "monospace"],
        "wix-madefor-text": ["Wix Madefor Text", "sans-serif"],
      }
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dark", "black", "luxury", "business", "coffee", "night", "halloween", "dracula"]
  }
}

