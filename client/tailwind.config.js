/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007BFF", // Vibrant Blue
        secondary: "#F8F9FA", // Light Gray
        accent: "#28A745", // Success Green
        "text-dark": "#343A40",
        "text-light": "#6C757D",
        "border-color": "#E9ECEF",
        "light-gray": "#E9ECEF", // Lighter Gray for subtle dividers (alias for border-color)
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
      },
      fontFamily: {
        primary: ["Inter", "sans-serif"],
        secondary: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          lg: "1rem",
          xl: "1rem",
          "2xl": "1rem",
        },
        // Chakra UI will primarily handle container widths, 
        // but these can be references or fallbacks.
      },
      maxWidth: {
        "container-main": "1400px", // For search/homepage
        "container-detail": "1300px", // For listing details
        "container-form": "800px", // For form page
        "container-header": "1400px", // For header consistency across widest pages
      },
      boxShadow: {
        subtle: "0 2px 8px rgba(0,0,0,0.05)",
        "card-hover": "0 6px 16px rgba(0,0,0,0.1)",
        "form-container": "0 4px 15px rgba(0,0,0,0.1)",
        "search-bar": "0 4px 12px rgba(0,0,0,0.1)",
        sidebar: "0 4px 12px rgba(0,0,0,0.05)",
      }
    },
  },
  plugins: [],
}
