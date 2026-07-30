/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          accent: '#6366f1',
          gold: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e'
        },
        dark: {
          bg: '#0b0f19',
          card: '#111827',
          border: '#1f2937',
          hover: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
