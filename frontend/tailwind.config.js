/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Jaren '70 - Warm wood & leather tones
        wood: {
          50: '#faf6f0',
          100: '#f5f0e6',
          200: '#e8e0d0',
          300: '#d4c8b8',
          400: '#b8a48a',
          500: '#8b7355',
          600: '#6b5a45',
          700: '#5a3d2b',
          800: '#3d2817',
          900: '#2d1810',
          950: '#1a0f0a',
        },
        // Bronze/Copper accents
        bronze: {
          50: '#fdf8f0',
          100: '#fcefd8',
          200: '#f8ddb0',
          300: '#f2c67e',
          400: '#daa520',
          500: '#cd7f32',
          600: '#a0522d',
          700: '#8b5a2b',
          800: '#704214',
          900: '#5c3610',
          950: '#3d2308',
        },
        // Cream/Paper tones
        cream: {
          50: '#fefdfb',
          100: '#faf6f0',
          200: '#f5f0e6',
          300: '#e8e0d0',
          400: '#d4c8b8',
          500: '#c4b8a8',
          600: '#a89888',
          700: '#8c7868',
          800: '#705850',
          900: '#544038',
          950: '#382820',
        },
        // Smoke/Atmosphere
        smoke: {
          50: '#f8f6f4',
          100: '#e8e4de',
          200: '#d0c8be',
          300: '#b8a898',
          400: '#9a8878',
          500: '#7c6858',
          600: '#605040',
          700: '#483830',
          800: '#302420',
          900: '#1a1210',
          950: '#0d0805',
        },
      },
      // 70s Typography - Elegant serifs
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Libre Baskerville"', 'Georgia', 'serif'],
        sans: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Courier Prime"', '"Courier New"', 'monospace'],
      },
      // Subtle rounded corners
      borderRadius: {
        'none': '0',
        DEFAULT: '4px',
        'sm': '2px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },
      spacing: {
        '18': '4.5rem',
      },
      // 70s animations - subtle and warm
      animation: {
        'flicker': 'flicker 8s ease-in-out infinite',
        'warm-pulse': 'warm-pulse 4s ease-in-out infinite',
        'smoke-drift': 'smoke-drift 15s ease-in-out infinite',
        'vinyl-spin': 'vinyl-spin 4s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '0.95' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.97' },
        },
        'warm-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(205, 127, 50, 0.15)',
          },
          '50%': { 
            boxShadow: '0 0 35px rgba(205, 127, 50, 0.25)',
          },
        },
        'smoke-drift': {
          '0%': { 
            transform: 'translateY(0) translateX(0)', 
            opacity: '0.08' 
          },
          '50%': { 
            transform: 'translateY(-30px) translateX(10px)', 
            opacity: '0.04' 
          },
          '100%': { 
            transform: 'translateY(-60px) translateX(-5px)', 
            opacity: '0' 
          },
        },
        'vinyl-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 60px rgba(205, 127, 50, 0.06)',
        'warm-lg': '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(205, 127, 50, 0.1)',
        'inset-warm': 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 30px rgba(205, 127, 50, 0.15)',
      },
    },
  },
  plugins: [],
};
