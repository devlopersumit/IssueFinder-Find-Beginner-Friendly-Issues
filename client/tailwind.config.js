/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Newsreader', 'Georgia', 'ui-serif', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#141414',
          soft: '#3f3f46',
          muted: '#71717a',
        },
        paper: {
          DEFAULT: '#fafafa',
          raised: '#ffffff',
          line: '#e4e4e7',
        },
        accent: {
          DEFAULT: '#0d9488',
          soft: '#ccfbf1',
          dark: '#0f766e',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20, 20, 20, 0.04), 0 8px 24px rgba(20, 20, 20, 0.04)',
      },
      backgroundImage: {
        'paper-wash':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13, 148, 136, 0.08), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(20, 20, 20, 0.03), transparent)',
      },
    },
  },
  plugins: [],
}
