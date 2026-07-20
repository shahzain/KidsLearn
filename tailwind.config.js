/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        animals: {
          accent: '#F97316',
          from: '#FF9A3E',
          to: '#FB5E3B',
          soft1: '#FFF7ED',
          soft2: '#FFE7CC',
        },
        birds: {
          accent: '#0EA5E9',
          from: '#5CC8FF',
          to: '#0E8FE9',
          soft1: '#F0F9FF',
          soft2: '#D6EEFF',
        },
        counting: {
          accent: '#8B5CF6',
          from: '#A78BFA',
          to: '#7C3AED',
          soft1: '#F5F3FF',
          soft2: '#E6DEFF',
        },
        abc: {
          accent: '#22C55E',
          from: '#4ADE80',
          to: '#16A34A',
          soft1: '#F0FDF4',
          soft2: '#D6F7DF',
        },
      },
      borderRadius: {
        card: '2rem',
      },
      boxShadow: {
        card: '0 18px 40px -12px rgba(0,0,0,0.25)',
        soft: '0 10px 30px -10px rgba(0,0,0,0.2)',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-24px) rotate(8deg)' },
        },
        floatY2: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(18px) rotate(-6deg)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10px)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.9)' },
          '50%': { opacity: '0.9', transform: 'scale(1.15)' },
        },
      },
      animation: {
        'float-y': 'floatY 7s ease-in-out infinite',
        'float-y2': 'floatY2 9s ease-in-out infinite',
        drift: 'drift 12s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
