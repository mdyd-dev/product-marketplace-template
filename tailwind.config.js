module.exports = {

  theme: {
    extend: {
      colors: {
        page: '#f3f4f6',
        panel: '#fff',
        frame: '#e2e8f0',
        content: {
          DEFAULT: '#374151',
          inverted: '#fff',
          sidenote: '#4a586d'
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

    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.frame')
    })

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