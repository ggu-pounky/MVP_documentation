import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background-start-rgb))',
        foreground: 'rgb(var(--foreground-rgb))',
        card: 'rgb(var(--card-rgb))',
        'card-border': 'rgb(var(--card-border-rgb))',
        primary: 'rgb(var(--primary-rgb))',
        secondary: 'rgb(var(--secondary-rgb))',
      },
    },
  },
  plugins: [],
};

export default config;
