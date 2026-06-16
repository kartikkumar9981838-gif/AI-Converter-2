/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#04040a',
        surface: '#0d0d18',
        elevated: '#12121f',
        border: '#1e1e35',
        violet: '#7c3aed',
        'violet-glow': '#a855f7',
        cyan: '#06b6d4',
        'text-primary': '#f1f0ff',
        'text-sub': '#8b8ba8',
        muted: '#4a4a6a',
        success: '#10b981',
        error: '#ef4444',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
