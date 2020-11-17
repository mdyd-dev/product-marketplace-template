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
        ex: {
          ...brandColors,
          ...systemColors,
        },
      },
    },
  },
  variants: {
	borderWidth: ['responsive', 'hover', 'last'],
	padding: ['responsive', 'last'],
	margin: ['responsive', 'last']
  },
  plugins: [require('@tailwindcss/custom-forms')],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true
  }
};
