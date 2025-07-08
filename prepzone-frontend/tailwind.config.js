/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        // Custom breakpoints for specific devices
        'xs': '475px',      // Small phones
        'sm': '640px',      // Large phones
        'md': '768px',      // iPad Mini
        'lg': '1024px',     // iPad Pro, Nest Hub
        'xl': '1280px',     // Large tablets
        '2xl': '1536px',    // Desktop
        // Device-specific breakpoints
        'ipad-mini': '768px',
        'ipad-air': '820px', 
        'surface-pro': '912px',
        'ipad-pro': '1024px',
        'nest-hub': '1024px',
        'zenbook-fold': '1920px',
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
};
