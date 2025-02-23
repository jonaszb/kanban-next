module.exports = {
    darkMode: 'class',
    future: {
        hoverOnlyWhenSupported: true,
    },
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            // Animation that collapses the list item when it's being deleted
            keyframes: {
                'collapse-input': {
                    '0%': { height: '2.5rem', opacity: 1, 'margin-bottom': '.75rem' },
                    '85%': { height: '.5rem', opacity: 0, 'margin-bottom': '.15rem' },
                    '100%': { height: 0, opacity: 0, 'margin-bottom': 0 },
                },
                'background-float': {
                    '0%': { transform: 'translate(0, 0)' },
                    '20%': { transform: 'translate(10px, 15px)' },
                    '40%': { transform: 'translate(-10px, -10px) scale(1.1)' },
                    '60%': { transform: 'translate(0, 0) scale(1.05)' },
                    '80%': { transform: 'translate(5px, -5px) scale(1.1)' },
                    '100%': { transform: 'translate(0, 0) scale(1)' },
                },
                'fade-in': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            animation: {
                'spin-slow': 'spin 16s linear infinite',
                'collapse-input': 'collapse-input .25s ease-in-out',
                'expand-input': 'collapse-input .25s ease-in-out reverse',
                'fade-in': 'fade-in .15s ease-out forwards',
            },
            boxShadow: {
                'menu-dark': '0 1rem 3rem -1rem rgba(59,130,246,.2)',
                menu: '0 1rem 3rem -1rem rgba(0,0,0,.3)',
            },
            width: {
                86: '21.5rem',
                120: '30rem',
            },
            colors: {
                'lines-dark': '#3E3F4E',
                'lines-light': '#E4EBFA',
                primary: '#635FC7',
                'primary-light': '#A8A4FF',
                'v-dark-grey': '#20212C',
                'dark-grey': '#2B2C37',
                'mid-grey': '#828FA3',
                'grey-highlight': '#9797971a',
                'light-grey': '#F4F7FD',
                danger: '#EA5555',
                'danger-light': '#FF9898',
            },
            fontFamily: {
                jakarta: ['Plus Jakarta Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
