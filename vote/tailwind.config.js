/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      height: {
      'outer-screen': '100lvh'
    }}
  },
  plugins: [],
}

