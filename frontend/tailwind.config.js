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
        },
        // Accent gold
        accent: {
          400: '#f4c542',
          500: '#eab308',
          600: '#ca8a04',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
