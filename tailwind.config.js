/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

const daoPalette = {
  mist: '#f7f4ed',
  cloud: '#ede8df',
  lotus: '#d8b4a6',
  bamboo: '#6f8b6f',
  pine: '#2f5d50',
  ink: '#1f1a1c',
  dusk: '#3b4754',
  tea: '#a8b0a2',
  sand: '#cfc3b6',
}

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '2rem',
        xl: '3rem',
      },
    },
    extend: {
      colors: {
        dao: daoPalette,
      },
      backgroundImage: {
        'dao-gradient': 'linear-gradient(135deg, rgba(239,233,222,0.95), rgba(177,190,182,0.85))',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'serif'],
        display: ['"Zhi Mang Xing"', 'cursive'],
      },
      boxShadow: {
        mist: '0 20px 45px -20px rgba(31, 26, 28, 0.25)',
      },
    },
  },
  plugins: [forms],
}

