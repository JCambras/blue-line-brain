/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ice: '#eaf2ff',
        ink: {
          DEFAULT: '#08111f',
          2: '#1a2840',
        },
        rink: {
          blue: '#1f4ed8',
          red: '#c43030',
        },
        gold: '#f5b41f',
      },
    },
  },
  plugins: [],
};
