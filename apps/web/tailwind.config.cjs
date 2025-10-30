/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: 'var(--brand-yellow)',
          black: 'var(--brand-black)'
        },
        state: {
          green: 'var(--green)',
          red: 'var(--red)',
          blue: 'var(--blue)',
          gray: 'var(--gray)'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
};
