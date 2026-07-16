/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neumorphic: {
          DEFAULT: '#0a0a0a',
          light: '#121212',
          dark: '#050505',
          border: '#2a2a2a',
          highlight: '#3a3a3a',
          text: '#e0e0e0',
          muted: '#8a8a8a',
        },
      },
      backgroundColor: {
        neumorphic: '#0a0a0a',
        'neumorphic-light': '#121212',
        'neumorphic-dark': '#050505',
      },
      textColor: {
        neumorphic: '#e0e0e0',
        'neumorphic-muted': '#8a8a8a',
      },
      borderColor: {
        neumorphic: '#2a2a2a',
        'neumorphic-highlight': '#3a3a3a',
      },
    },
  },
  plugins: [],
}
