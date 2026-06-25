/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep romantic reds → rose → blush
        romance: {
          deep: '#8c0f24',
          red: '#c41e3a',
          rose: '#ff4d6d',
          blush: '#ffd9e0',
        },
        // Sky blue → cyan → light
        sky: {
          DEFAULT: '#38bdf8',
          deep: '#1f7fb8',
          cyan: '#7df0ff',
          light: '#cffafe',
        },
        // Midnight navy ink
        ink: {
          900: '#060a1a',
          800: '#0a1128',
          700: '#101a3c',
          600: '#16224d',
        },
        cream: '#fff6f8',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        deva: ['Hind', '"Noto Sans Devanagari"', 'sans-serif'],
        devaSerif: ['"Tiro Devanagari Hindi"', 'Hind', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-rose': '0 0 50px -12px rgba(255,77,109,0.55)',
        'glow-sky': '0 0 50px -12px rgba(56,189,248,0.55)',
        glass:
          'inset 0 1px 0 0 rgba(255,255,255,0.10), 0 24px 70px -28px rgba(0,0,0,0.75)',
        seal: '0 8px 24px -8px rgba(140,15,36,0.7)',
      },
      backgroundImage: {
        'romance-gradient':
          'linear-gradient(120deg, #ff4d6d 0%, #c41e3a 38%, #7df0ff 100%)',
        'romance-soft':
          'linear-gradient(120deg, #ffd9e0 0%, #ff8aa3 45%, #cffafe 100%)',
        hairline:
          'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 12px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-22px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'floatSlow 11s ease-in-out infinite',
        shimmer: 'shimmer 3.5s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'glow-pulse': 'glowPulse 5s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
