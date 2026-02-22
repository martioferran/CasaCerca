/** @type {import('tailwindcss').Config} */
const path = require('path');

// Get the correct paths relative to the config directory
const contentPaths = [
  path.join(__dirname, "../index.html"),
  path.join(__dirname, "../src/**/*.{js,ts,jsx,tsx}")
];

console.log('Tailwind scanning paths:', contentPaths);

export default {
  content: contentPaths,
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};