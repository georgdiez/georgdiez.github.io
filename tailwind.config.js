module.exports = {
  purge: {
    content: [
      './**/*.html',
      './**/*.js',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'navy-900': '#0a1f3d',
        'navy-800': '#102e5c',
        'navy-700': '#0c2750',
        'cyan-sub': '#7fd4ff',
        'text-on-dark': '#dcecff',
      },
      fontFamily: {
        sans: ['"Open Sans"'],
        serif: ['"Playfair Display"'],
      },
      animation: {
        bounce: "bounce 1s linear infinite",
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-12%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
        },
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}