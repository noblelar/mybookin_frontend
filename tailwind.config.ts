import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
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
      manrope: ['var(--font-manrope)', 'sans-serif'],
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
        // ========== LIGHT THEME (Default) ==========
        // Primary Colors
        'navy': '#0B1C30', // Primary navy
        'navy-dark': '#131B2E', // Darker navy variant
        'body': '#45464D', // Body text color
        'muted': '#76777D', // Muted/tertiary text
        
        // UI Colors
        'blue-light': '#EFF4FF', // Light blue background
        'blue-accent': '#DCE9FF', // Accent blue
        'green': '#059669', // Success/positive green
        'green-dark': '#065F46', // Darker green
        'green-light': '#D1FAE5', // Light green background

        // Backgrounds
        'light': '#F8F9FF', // Light page background
        'light-secondary': '#F1F5F9', // Secondary light background
        'white': '#FFFFFF', // Pure white
        'black': '#000000', // Pure black

        // Borders & Dividers
        'border-subtle': 'rgba(198, 198, 205, 0.15)',
        'border-solid': 'rgba(198, 198, 205, 0.20)',

        // ========== DARK THEME ==========
        // Dark theme uses `dark:` prefix in Tailwind
        'dark-bg': '#121212', // Dark page background
        'dark-bg-secondary': '#1E1E1E', // Secondary dark background
        'dark-bg-tertiary': '#2A2A2A', // Tertiary dark background
        'dark-text': '#E0E0E0', // Primary light text for dark mode
        'dark-text-secondary': '#B0B0B0', // Secondary light text
        'dark-text-tertiary': '#808080', // Tertiary/muted text
        'dark-border': 'rgba(255, 255, 255, 0.10)',
        'dark-border-solid': 'rgba(255, 255, 255, 0.20)',

        // Brand colors (consistent across themes)
        'secondary': '#774C60',
        'tertiary': '#B75D69',
        'auxiliary': '#EACDC2',
        'button1': '#EACDC2',
        'button2': '#EACDC2',
        'button3': '#EACDC2',
        'button4': '#087443',
        'primary': '#176448',
        'black_light': '#525866',
      },

      backgroundColor: {
        // Light theme (default)
        'light-page': '#F8F9FF',
        'light-surface': '#FFFFFF',
        'light-surface-secondary': '#F1F5F9',
        'light-surface-tertiary': '#EFF4FF',

        // Dark theme
        'dark-page': '#121212',
        'dark-surface': '#1E1E1E',
        'dark-surface-secondary': '#2A2A2A',
        'dark-surface-tertiary': '#242424',
      },

      textColor: {
        // Light theme (default)
        'light-primary': '#0B1C30',
        'light-secondary': '#45464D',
        'light-tertiary': '#76777D',

        // Dark theme
        'dark-primary': '#E0E0E0',
        'dark-secondary': '#B0B0B0',
        'dark-tertiary': '#808080',
      },

      borderColor: {
        // Light theme (default)
        'light-subtle': 'rgba(198, 198, 205, 0.15)',
        'light-solid': 'rgba(198, 198, 205, 0.20)',

        // Dark theme
        'dark-subtle': 'rgba(255, 255, 255, 0.10)',
        'dark-solid': 'rgba(255, 255, 255, 0.20)',
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
