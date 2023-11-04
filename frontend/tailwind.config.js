const defaultTheme = require('tailwindcss/defaultTheme')
const { mauve, violet } = require('@radix-ui/colors')
const FONT_FAMILY = process.env.NEXT_PUBLIC_FONT_FAMILY || 'Quicksand'
const BODY_FONT_FAMILY = process.env.NEXT_PUBLIC_BODY_FONT_FAMILY || 'Inter'
const MONO_FONT_FAMILY =
  process.env.NEXT_PUBLIC_BODY_FONT_FAMILY || 'ui-monospace'
const PRIMARY_COLOR = process.env.NEXT_PUBLIC_PRIMARY_COLOR || 'default'

const primaryColors = require('./colors')
const { blackA } = require('@radix-ui/colors')

module.exports = {
  presetColors: primaryColors,
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))',
        21: 'repeat(21, minmax(0, 1fr))',
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      fontFamily: {
        sans: [`"${BODY_FONT_FAMILY}"`, ...defaultTheme.fontFamily.sans],
        headings: [`"${FONT_FAMILY}"`, ...defaultTheme.fontFamily.sans],
        mono: [`"${MONO_FONT_FAMILY}"`, ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        'slide-down': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideDown: {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        'spin-loading': 'spin 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite',
        'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'spin-reverse': 'spin 1s reverse linear infinite',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },

      colors: {
        primary: primaryColors[PRIMARY_COLOR],
        'dark-backdrop': 'rgba(0, 0, 0, 0.8)',
        backdrop: 'rgba(255, 255, 255, 0.8)',
        ...blackA,
        ...mauve,
        ...violet,
      },
    },
  },
  plugins: [
    require('tailwindcss-radix')(),
    require('@ramosdiego/reservoir')({
      buttons: {
        animate: true,
      },
    }),
  ],
}
