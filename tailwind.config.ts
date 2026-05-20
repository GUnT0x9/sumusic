import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'var(--font-pretendard)', 'sans-serif']
      }
    }
  },
  plugins: []
}

export default config
