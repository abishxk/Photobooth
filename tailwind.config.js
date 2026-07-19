/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      colors: {
        paper: {
          50: '#fdfaf5',
          100: '#faf7f0',
          200: '#f5efe0',
          300: '#ede3cc',
        },
        ink: {
          900: '#1a1209',
          800: '#2c2018',
          700: '#3d2e1f',
          600: '#5a4433',
        },
        amber: {
          vintage: '#d4a853',
          light: '#e8c47a',
          dark: '#a07830',
        },
        sepia: {
          100: '#f4ebe0',
          200: '#e8d5b5',
          300: '#d4b896',
          400: '#b89060',
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'vintage': '4px 4px 0px rgba(44, 32, 24, 0.15)',
        'strip': '0 8px 32px rgba(44, 32, 24, 0.18), 0 2px 8px rgba(44, 32, 24, 0.1)',
        'camera': '0 20px 60px rgba(44, 32, 24, 0.2), 0 8px 24px rgba(44, 32, 24, 0.12)',
      },
      animation: {
        'flash': 'flash 0.4s ease-out',
        'shutter': 'shutter 0.3s ease-in-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'countdown-pop': 'countdownPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        shutter: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.05)' },
          '100%': { transform: 'scaleY(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        countdownPop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
