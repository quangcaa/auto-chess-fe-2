/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-color': '#EDEBE9',
        'nav-color': '#'
      },
      width: {
        '7/8' : '87.5%',
      },
    },

  },
  plugins: [],
}