const defaultTheme = require('tailwindcss/defaultTheme');

const brandColors = {
  green: '#2b322b',
};

const systemColors = {
  blue: '#007aff',
  'body-bg': ''
};

module.exports = {
  purge: {
    content: ['**/*.liquid', './src/js/**/*.js'],
    options: {
      safelist: [/^uppy-/]
    }
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
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
