/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    fontFamily: {
      vazir: "Vazirmatn",
    },
    extend: {
      boxShadow: {
        "1input": "0 5px 10px 1px rgba(0, 187, 170, 0.2)",
      },
      backgroundImage: {
        "login-pattern": "url('/image/bg/bg.jpg')",
      },
    },
  },
  plugins: [],
};
