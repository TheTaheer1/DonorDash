/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { brand: '#a52b37', ink: '#29262a', canvas: '#f8f7f5', line: '#e9e4e1' },
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
      boxShadow: { soft: '0 12px 24px rgba(109,21,34,.13)' }
    }
  },
  plugins: []
};
