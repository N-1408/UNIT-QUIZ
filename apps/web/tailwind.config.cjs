/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: 'var(--brand-yellow)', // TODO: replace with exact hex
          black: 'var(--brand-black)' // TODO: replace with exact hex
        },
        card: '#1111110d'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
};
