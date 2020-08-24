const defaultTheme = require('tailwindcss/defaultTheme');

const brandColors = {
  green: '#2b322b',
};

const systemColors = {
  blue: '#007aff',
};

module.exports = {
  purge: {
    content: ['app/**/*.liquid', 'modules/**/*.liquid', './src/js/**/*.js'],
  },
  future: {
    removeDeprecatedGapUtilities: true
  },
  theme: {
    container: {
      center: true,
      padding: {
        default: '1rem',
        sm: '1rem',
        lg: '0',
        xl: '0',
      },
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
    },
  },
  variants: {
    borderWidth: ['responsive', 'hover'],
  },
  plugins: [require('@tailwindcss/custom-forms')],
};
