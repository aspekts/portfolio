/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Bricolage Grotesque', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Onest', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#0D0D0F',
        surface: '#111115',
        elevated: '#1A1A22',
        overlay: '#242430',
        signal: {
          DEFAULT: '#7C6FD4',
          plus: '#9D93E8',
          minus: '#5A4EBA',
        },
      },
    },
  },
  plugins: [],
};
