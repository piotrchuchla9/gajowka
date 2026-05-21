/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F1E8',
        'bg-2': '#ECE5D3',
        ink: '#1F2419',
        'ink-soft': '#3D4233',
        rust: '#7A3E1D',
        'rust-dark': '#5E2F15',
        moss: '#4A5D3A',
        linen: '#A89B7C',
        accent: '#E8C39A',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        kenburns: 'kenburns 20s ease-in-out infinite alternate',
        bounce: 'bounce 2s infinite',
        pulse: 'pulse 2s infinite',
      },
      keyframes: {
        kenburns: {
          from: { transform: 'scale(1) translate(0,0)' },
          to: { transform: 'scale(1.1) translate(-2%, -1%)' },
        },
      },
    },
  },
  plugins: [],
};
