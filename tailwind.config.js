/** @type {import('tailwindcss').Config} */
module.exports = {
  // ADD "./app/**/*.{js,jsx,ts,tsx}" TO THIS ARRAY:
  content: [
    "./App.js", 
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}