/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas-neue': ['Bebas Neue', 'sans-serif'],
        'barlow': ['Barlow', 'sans-serif'],
        'barlow-condensed': ['Barlow Condensed', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        'primary-dk': 'var(--primary-dk)',
        secondary: 'var(--secondary)',
        gold: 'var(--gold)',
        'gold-dim': 'var(--gold-dim)',
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      animation: {
        'fade-up': 'fade-up 0.9s ease both',
        'fade-down': 'fade-down 0.8s ease both',
        'float-up': 'float-up linear infinite',
        pulse: 'pulse 2s ease infinite',
      },
      keyframes: {
        'fade-up': {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-down': {
          'from': { opacity: '0', transform: 'translateY(-16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'float-up': {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(-20vh) scale(1.2)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}