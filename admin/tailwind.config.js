/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ─── ThankU Color Palette ─── */
      colors: {
        /* Primary — Cyan/Teal */
        primary: {
          DEFAULT: '#5FD5E3',
          50: '#EAF7F8',
          100: '#DDEEEF',
          200: '#BBE1E3',
          300: '#8CD3D9',
          400: '#5FD5E3',
          500: '#23C7C9',
          600: '#1EA3A5',
          700: '#188284',
          800: '#136567',
          900: '#0F5153',
          950: '#072E2F',
        },
        /* Secondary Accent — Orange */
        gold: {
          DEFAULT: '#FF8A00',
          50: '#FFF4E5',
          100: '#FFE5CC',
          200: '#FFCC99',
          300: '#FFB266',
          400: '#FF9933',
          500: '#FF8A00',
          600: '#E67A00',
          700: '#CC6C00',
          800: '#995200',
          900: '#663700',
          950: '#331C00',
        },
        /* Semantic Success */
        leaf: {
          DEFAULT: '#2ECC71',
          50: '#EAFAF1',
          100: '#D5F5E3',
          200: '#ABEBC6',
          300: '#82E0AA',
          400: '#58D68D',
          500: '#2ECC71',
          600: '#28B463',
          700: '#239B56',
          800: '#1D8348',
          900: '#186A3B',
          950: '#0E3E23',
        },
        /* Neutral borders / lines */
        tamarind: {
          50: 'var(--color-border-subtle)', 
          100: 'var(--color-border)', 
          200: 'var(--color-border)', 
          300: '#D1D5DB', 
          400: '#9CA3AF', 
          500: '#6B7280', 
          600: '#4B5563', 
          700: '#374151', 
          800: '#1F2937', 
          900: '#111827', 
          950: '#030712', 
        },
        /* Cream replacement for subtle backgrounds */
        cream: {
          DEFAULT: 'var(--color-highlight)',
          light: 'var(--color-highlight)',
        },
        /* Background & Surface Tokens */
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-highlight)',
        },
        surface: 'var(--color-surface)',
        /* Text Tokens */
        heading: 'var(--color-text-primary)',
        body: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        /* Status Colors */
        success: '#2ECC71',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        /* Sidebar */
        sidebar: {
          bg: '#111827',
          hover: '#1F2937',
          active: '#5FD5E3',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        },
      },
      /* ─── Typography ─── */
      fontFamily: {
        display: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        body: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
      },
      /* ─── Spacing ─── */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      /* ─── Shadows ─── */
      boxShadow: {
        'warm-sm': '0 2px 8px rgba(17, 24, 39, 0.04)',
        'warm-md': '0 4px 12px rgba(17, 24, 39, 0.08)',
        'warm-lg': '0 4px 16px rgba(17, 24, 39, 0.06)',
        'warm-xl': '0 8px 24px rgba(17, 24, 39, 0.12)',
        'warm-inner': 'inset 0 2px 4px rgba(17, 24, 39, 0.04)',
      },
      /* ─── Border Radius ─── */
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      /* ─── Animations ─── */
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
