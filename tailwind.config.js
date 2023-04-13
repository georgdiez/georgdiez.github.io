module.exports = {
  purge: true,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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