/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./themes/**/*.{html,js}",
    "./assets/**/*.{js,css}"
  ],
  theme: {
    extend: {
      colors: {
        // from your Coolors palette
        'space-cadet': '#272A4C',
        'resolution-blue': '#272A7C',
        'marian-blue': '#1C4383',
        'argentinian-blue': '#69B4E4',
        'powder-blue': '#AAB8C5',
        'celestial-blue': '#2A9ED5',
        brand: {
          500: '#1C4383',   // marian-blue
          600: '#272A7C',   // resolution-blue
          700: '#272A4C'    // space-cadet
        },
        accent: {
          500: '#69B4E4',   // argentinian-blue
          600: '#2A9ED5'    // celestial-blue
        }
      },
      height: {
        hero: "56vw",       // responsive hero height
      },
      minHeight: {
        hero: "320px",      // minimum hero height
      },
      maxHeight: {
        hero: "620px",      // maximum hero height
      },
      dropShadow: {
        DEFAULT: '0 2px 4px rgba(0,0,0,0.5)',
        lg: '0 4px 8px rgba(0,0,0,0.7)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,.08)',
        card: '0 10px 20px rgba(39,42,76,.06)',
        btn: '0 6px 12px rgba(28,67,131,.18)',
      },
    },
  },
  plugins: [],
}
