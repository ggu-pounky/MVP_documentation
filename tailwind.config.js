/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Neumorphic custom classes from globals.css
    'neumorphic-sidebar',
    'neumorphic-card',
    'neumorphic-button',
    'neumorphic-input',
    'neumorphic-link',
    'neumorphic-select',
    'neumorphic-textarea',
    'active',
    'notification-slide-in',
    // Background classes
    'bg-neumorphic',
    'bg-neumorphic-light',
    'bg-neumorphic-dark',
    // Text classes
    'text-neumorphic',
    'text-neumorphic-muted',
    // Border classes
    'border-neumorphic',
    'border-neumorphic-highlight',
    // Hover states
    'hover:bg-neumorphic-highlight',
    'hover:bg-neumorphic',
    'hover:bg-neumorphic-light',
    // Dark mode classes
    'dark',
    'dark:bg-neumorphic',
    'dark:bg-neumorphic-light',
    'dark:bg-neumorphic-dark',
    'dark:text-neumorphic',
    'dark:text-neumorphic-muted',
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
