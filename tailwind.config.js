/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        padding: "15px",
        center: true,
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    backgroundPosition: {
      'center-bottom': 'center bottom'
    },
    backgroundImage: {
      'custom-fall': "url('https://www.adagio.com/images6/carbon_offset/animation_fall.webp'), url('https://www.adagio.com/images6/carbon_offset/footer_fall_retina.webp')",
    },
  },
  plugins: [],
};
