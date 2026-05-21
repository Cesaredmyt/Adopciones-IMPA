// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        impa: {
          50:  '#ecfdec',
          100: '#d3f9d3',
          200: '#a8f1a8',
          300: '#74e574',
          400: '#3fd23f',
          500: '#17cf17',
          600: '#11a611',
          700: '#0f830f',
          800: '#0d660d',
          900: '#0a4f0a',
          bg:        '#f6f8f6',
          card:      '#ffffff',
          muted:     '#586e58',
          subtle:    '#638863',
          text:      '#111811',
          line:      '#dce5dc',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        'impa-xs': '0 1px 2px 0 rgb(17 24 17 / 0.04)',
        'impa-sm': '0 1px 3px 0 rgb(17 24 17 / 0.06), 0 1px 2px -1px rgb(17 24 17 / 0.04)',
        'impa-md': '0 4px 12px -2px rgb(17 24 17 / 0.08), 0 2px 4px -2px rgb(17 24 17 / 0.04)',
        'impa-lg': '0 12px 24px -8px rgb(17 24 17 / 0.10), 0 4px 8px -4px rgb(17 24 17 / 0.06)',
        'impa-xl': '0 24px 48px -12px rgb(17 24 17 / 0.14)',
        'impa-ring': '0 0 0 4px rgb(23 207 23 / 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
