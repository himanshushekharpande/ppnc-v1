/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./themes/**/*.{html,js}",
    "./assets/**/*.{js,css,jsx,ts,tsx}"
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
        hero: "620px",      // maximum hero height.
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

  plugins: [
    require('daisyui')
  ],

  daisyui: {
    /* DaisyUI theme registration — uses your palette */
    themes: [
      {
        ppnc: {
          "primary": "#1C4383",            // marian-blue
          "primary-content": "#ffffff",

          "secondary": "#2A9ED5",          // celestial-blue
          "secondary-content": "#072030",

          "accent": "#69B4E4",             // argentinian-blue
          "accent-content": "#072030",

          "neutral": "#272A4C",            // space-cadet
          "neutral-content": "#ffffff",

          "base-100": "#ffffff",
          "base-200": "#F5F7FA",
          "base-300": "#E5E7EB",
          "base-content": "#111827",

          "info": "#2A9ED5",
          "success": "#22C55E",
          "warning": "#F59E0B",
          "error": "#EF4444"
        },
      },
    ],

    /* If you want a different dark theme, change or add here */
    darkTheme: "ppnc",
    styled: true,     // enable DaisyUI component styles
    base: true,       // enable base styles (typography resets)
    utils: true,      // utility classes
    logs: true,       // helpful during dev — toggle false for CI
    rtl: false
  },

  /*
    Optional: if you use dynamic class names or theme toggles from JS,
    add critical classes to safelist so purge doesn't remove them.
    Example: safelist theme toggle classes or DaisyUI state classes.
  */
  safelist: [
    // DaisyUI theme class (if you switch theme via class)
    "theme-ppnc",
    // common DaisyUI classes you rely on (expand as needed)
    "btn", "btn-primary", "card", "card-compact", "bg-base-100",
    "text-primary", "text-secondary", "text-accent", "shadow-card", "shadow-btn"
  ],
}