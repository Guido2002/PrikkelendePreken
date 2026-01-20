/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm, inviting primary color (deep burgundy/wine)
        primary: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7894',
          500: '#df4d70',
          600: '#c9305a',
          700: '#a92349',
          800: '#8d2041',
          900: '#781f3c',
          950: '#420c1e',
        },
        // Warm neutral tones
        warm: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4de',
          300: '#d6cfc5',
          400: '#b8ad9e',
          500: '#9a8d7c',
          600: '#7d7164',
          700: '#665c52',
          800: '#564e46',
          900: '#4a443d',
          950: '#2d2a26',
        },
        // Accent gold
        accent: {
          100: '#fef9e7',
          400: '#f4c542',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
      },
      // 90s System fonts
      fontFamily: {
        sans: ['"MS Sans Serif"', '"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        heading: ['"Arial Black"', 'Impact', 'Haettenschweiler', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
        comic: ['"Comic Sans MS"', 'cursive'],
      },
      // 90s has NO border-radius, but keep 0 available
      borderRadius: {
        'none': '0',
        DEFAULT: '0',
      },
      spacing: {
        '18': '4.5rem',
      },
      // 90s animations
      animation: {
        'rainbow': 'rainbow 4s linear infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'blink': 'blink-90s 1s step-end infinite',
      },
      keyframes: {
        rainbow: {
          '0%': { color: '#df4d70' },
          '17%': { color: '#f4c542' },
          '33%': { color: '#00aa00' },
          '50%': { color: '#0080ff' },
          '67%': { color: '#781f3c' },
          '83%': { color: '#a92349' },
          '100%': { color: '#df4d70' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(223, 77, 112, 0.7)',
          },
          '50%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 10px 2px rgba(223, 77, 112, 0.5)',
          },
        },
        'blink-90s': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
