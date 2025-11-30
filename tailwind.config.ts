import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#05070d',
          800: '#0a0f1c',
          700: '#11182b',
          accent: '#4f46e5',
          neon: '#63f7ff',
        },
      },
      boxShadow: {
        glow: '0 0 30px rgba(99, 247, 255, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
