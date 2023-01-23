module.exports = {
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Animation that collapses the list item when it's being deleted
      keyframes: {
        'collapse-input': {
          '0%': { height: '2.5rem', opacity: 1, 'margin-bottom': '.75rem' },
          '100%': { height: 0, opacity: 0, 'margin-bottom': 0 },
        }
      },
      animation: {
        'collapse-input': 'collapse-input .25s ease-in-out',
        'expand-input': 'collapse-input .25s ease-in-out reverse',
      },
      boxShadow: {
        'menu-dark': '0 1rem 3rem -1rem rgba(59,130,246,.2)',
        menu: '0 1rem 3rem -1rem rgba(0,0,0,.3)'
      },
      width: {
        '86': '21.5rem',
        '120': '30rem' 
      },
      colors: {
        'lines-dark': '#3E3F4E',
        'lines-light': '#E4EBFA',
        'primary': '#635FC7',
        'primary-light': '#A8A4FF',
        'v-dark-grey': '#20212C',
        'dark-grey': '#2B2C37',
        'mid-grey': '#828FA3',
        'grey-highlight': '#9797971a',
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