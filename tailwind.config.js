const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {

  theme: {
    extend: {
      colors: {
        page: '#f3f4f6',
        panel: '#fff',
        text: {
          DEFAULT: '#374151',
          inverted: '#fff'
        },
        interaction: {
          DEFAULT: '#1d4ed8',
          hover: '#3466e3',
          disabled: '#bfdbfe'
        },
        danger: {
          DEFAULT: '#b91c1c',
          hover: '#ca3a31',
          disabled: '#fecaca'
        },
        confirmation: {
          DEFAULT: '#047857',
          hover: '#098f69',
          disabled: '#bbddd3'
        }
      }
    },

    container: {
      center: true,
      padding: {
        default: '1rem',
        sm: '1rem',
        lg: '0',
        xl: '0',
      },
    },

  },

  variants: {
	  borderWidth: ['responsive', 'hover', 'last'],
	  padding: ['responsive', 'last'],
	  margin: ['responsive', 'first', 'last']
  },

  plugins: [require('@tailwindcss/forms')],

  purge: {
    content: ['**/*.liquid', './src/js/**/*.js'],
    options: {
      safelist: [/^uppy-/]
    }
  }

};
