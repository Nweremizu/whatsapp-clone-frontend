/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        "whatsapp-login-bg": "#f8f8f8",
        "whatsapp-green": "#0a8d48",
        whatsapp: "#ededed",
      },
      fontFamily: {
        sans: ["open sans", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require("daisyui")],
};
