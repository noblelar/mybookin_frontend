import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class', '.dark'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      abeezee: ['var(--font-abeezee)', 'sans-serif'],
      abel: ['var(--font-abel)', 'sans-serif'],
      opensans: ['var(--font-open-sans)', 'sans-serif'],
      inter: ['var(--font-inter)', 'sans-serif'],
      neuemontreal: ['var(--font-neue-montreal)', 'sans-serif'],
    },
    rotate: {
      '0': '0deg',
      '15': '15deg',
      '30': '30deg',
      '45': '45deg',
      '60': '60deg',
      '75': '75deg',
      '90': '90deg',
      '105': '105deg',
      '120': '120deg',
      '135': '135deg',
      '150': '150deg',
      '165': '165deg',
      '180': '180deg',
      '195': '195deg',
      '210': '210deg',
      '225': '225deg',
      '240': '240deg',
      '255': '255deg',
      '270': '270deg',
    },
    extend: {
      colors: {
        // MyBookins Design System
        secondary: '#774C60',
        tertiary: '#B75D69',
        auxiliary: '#EACDC2',
        button1: '#EACDC2',
        button2: '#EACDC2',
        button3: '#EACDC2',
        button4: '#087443',
        primary: '#176448',
        black_light: '#525866',
        // MyBookins Booking Colors
        'navy': '#0B1C30',
        'body': '#45464D',
        'muted': '#76777D',
        'border-subtle': 'rgba(198, 198, 205, 0.15)',
        'border-solid': 'rgba(198, 198, 205, 0.20)',
        'blue-light': '#EFF4FF',
        'blue-accent': '#DCE9FF',
        'green': '#059669',
        'green-dark': '#065F46',
        'green-light': '#D1FAE5',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config
