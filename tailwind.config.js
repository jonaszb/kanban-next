module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lines-dark': '#3E3F4E',
        'lines-light': '#E4EBFA',
        'primary': '#635FC7',
        'primary-light': '#A8A4FF',
        'v-dark-grey': '#20212C',
        'dark-grey': '#2B2C37',
        'mid-grey': '#828FA3',
        'light-grey': '#F4F7FD',
        'danger': '#EA5555',
        'danger-light': '#FF9898',
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      }
    },
  },
  plugins: [],
}