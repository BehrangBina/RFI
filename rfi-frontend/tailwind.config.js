const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        night: '#050816',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      spacing: {
        128: '32rem',
      },
      screens: {
        '3xl': '1920px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: 0 },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-up': 'slide-up 0.6s ease-out both',
        'bounce-in': 'bounce-in 0.8s ease-out both',
        'spin-slow': 'spin 6s linear infinite',
      },
      boxShadow: {
        glow: '0 25px 60px -15px rgba(99, 102, 241, 0.45)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #312e81 0%, #7c3aed 45%, #ec4899 100%)',
      },
    },
  },
  plugins: [],
};
