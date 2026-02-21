/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Charcoal Grey - Modern Dark Base
        primary: "#3c4142", 
        "primary-light": "#505659",
        "primary-dark": "#27292b",

        // The Traditional Gold/Pastel Highlight
        accent: "#EFC853",
        "accent-dark": "#CFA431",

        // Adding the Silver/Metallic from your requirements
        silver: "#C0C0C0",
        "silver-light": "#E5E7EB",

        "text-dark": "#AAB2B7",
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