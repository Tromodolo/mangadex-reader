const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    "./resources/views/**/*.edge",
    "./resources/assets/ts/**/*.ts",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
	colors: {
		// Build your palette here
		transparent: 'transparent',
		current: 'currentColor',
		...colors,
	},
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
