/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // The Deep Emerald Green
        primary: "#2D4940", 
        "primary-light": "#42665b",
        "primary-dark": "#1f332d",

        // The Traditional Gold/Pastel Highlight
        accent: "#F6E38F",
        "accent-dark": "#e0c768",

        // Adding the Silver/Metallic from your requirements
        silver: "#C0C0C0",
        "silver-light": "#E5E7EB",

        "text-dark": "#1A1A1A",
        "bg-light": "#F5F5F5", // Off-white clean background
      },
      fontFamily: {
        clash: ["ClashDisplay", "sans-serif"], // Bold Anime Headlines
        editor: ["Editorial", "serif"],      // Elegant Chikankari Details
      },
    },
  },
  plugins: [],
};