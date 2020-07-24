const defaultTheme = require('tailwindcss/defaultTheme');

const brandColors = {
  green: '#2b322b',
};

const systemColors = {
  blue: '#007aff',
};

module.exports = {
  purge: {
    mode: 'all',
    content: ['app/**/*.liquid', './src/**/*.liquid', './src/js/**/*.js'],
  },
  theme: {
    container: {
      center: true,
      padding: '0'
    },
    extend: {
      colors: {
        // `ex` prefix will create classes like `text-ex-red`
        ex: {
          ...brandColors,
          ...systemColors,
        },
      },
      // fontFamily: {
      //   sans: ['Lato', ...defaultTheme.fontFamily.sans],
      // },
      screens: {
        xxl: '1410px',
      },
    },
  },
  variants: {
    borderWidth: ['responsive', 'hover'],
  },
  plugins: [require('@tailwindcss/custom-forms')],
};
