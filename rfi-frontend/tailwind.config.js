/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'draw-stroke': 'drawStroke 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'loading-bar': 'loadingBar 2s ease-in-out infinite',
      },
      keyframes: {
        drawStroke: {
          '0%': { strokeDasharray: '2000', strokeDashoffset: '2000', fill: 'transparent' },
          '40%': { strokeDashoffset: '0', fill: 'transparent' },
          '60%': { strokeDashoffset: '0', fill: 'currentColor', opacity: '1' },
          '100%': { strokeDashoffset: '0', fill: 'currentColor', opacity: '1' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
    },
  },
  plugins: [],
}
