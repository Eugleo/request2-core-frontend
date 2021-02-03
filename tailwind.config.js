module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      boxShadow: {
        smooth: '0px 4px 3px rgba(0, 0, 0, 0.02), 0px 3px 8px 9px rgba(0, 0, 0, 0.01)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
