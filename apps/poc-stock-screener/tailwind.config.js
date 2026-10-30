/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stock: {
          up: '#ef4444',
          down: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}

