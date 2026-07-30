/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        '3xs': '0.65rem',
        '4xs': '0.55rem',
      },
      colors: {
        primary: {
          50: '#fcfbfa',
          100: '#f5f3f1',
          200: '#e5e3e1',
          300: '#d5d3d1',
          400: '#a5a3a1',
          500: '#111111',
          600: '#111111',
          700: '#111111',
          800: '#111111',
          900: '#111111',
          950: '#0d0d0d',
        },
        cyan: {
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
        },
        sunset: {
          400: '#60a5fa',
          500: '#1e40af',
          600: '#1d4ed8',
        },
        purple: {
          400: '#64748b',
          500: '#475569',
          600: '#334155',
        },
        dark: {
          100: '#1e293b',
          200: '#0f172a',
          300: '#0b1329',
          400: '#070d1e',
          500: '#050915',
          600: '#03050c',
          700: '#020308',
          800: '#010204',
          900: '#000002',
        },
        luxury: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          accent: 'var(--accent)',
          surface: 'var(--glass-bg)',
          muted: 'var(--bg-secondary)',
          border: 'var(--border)',
          bg: 'var(--bg-primary)',
        }
      },
      fontFamily: {
        outfit: ['"Inter Tight"', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        heading: ['"Inter Tight"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scroll-left': 'scrollLeft 40s linear infinite',
        'scroll-right': 'scrollRight 40s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'plane-fly': 'planeFly 12s linear infinite',
        'cloud-move': 'cloudMove 20s linear infinite',
        'typing': 'typing 3s steps(40) infinite',
        'count-up': 'countUp 2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,212,255,0.3), 0 0 20px rgba(0,212,255,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        planeFly: {
          '0%': { transform: 'translateX(-100vw) translateY(50px) rotate(-5deg)' },
          '50%': { transform: 'translateX(50vw) translateY(-30px) rotate(2deg)' },
          '100%': { transform: 'translateX(200vw) translateY(20px) rotate(-3deg)' },
        },
        cloudMove: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        typing: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '100%' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,212,255,0.3)',
        'glow-orange': '0 0 20px rgba(255,107,53,0.3)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.16)',
        'premium': '0 20px 60px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
