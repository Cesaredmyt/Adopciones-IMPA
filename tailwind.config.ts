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

          // Surfaces & semantic
          bg:           '#eef3ee',
          'bg-elev':    '#f4f8f4',
          surface:      '#ffffff',
          'surface-2':  '#f3f7f3',
          'surface-3':  '#e9efe9',
          card:         '#ffffff',
          tinted:       '#effaef',

          // Text
          text:        '#0f160f',
          'text-strong': '#07120a',
          muted:       '#586e58',
          subtle:      '#7a8e7a',
          quiet:       '#95a795',

          // Borders
          line:         '#dbe5db',
          'line-strong':'#bfd0bf',
          'line-faint': '#e7eee7',
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
        'impa-xs':   '0 1px 2px 0 rgb(10 24 14 / 0.04)',
        'impa-sm':   '0 1px 3px 0 rgb(10 24 14 / 0.06), 0 1px 2px -1px rgb(10 24 14 / 0.04)',
        'impa-md':   '0 6px 16px -4px rgb(10 24 14 / 0.08), 0 3px 6px -3px rgb(10 24 14 / 0.05)',
        'impa-lg':   '0 16px 32px -8px rgb(10 24 14 / 0.12), 0 6px 12px -4px rgb(10 24 14 / 0.06)',
        'impa-xl':   '0 28px 56px -12px rgb(10 24 14 / 0.18), 0 12px 20px -8px rgb(10 24 14 / 0.08)',
        'impa-glow': '0 12px 32px -8px rgb(23 207 23 / 0.32)',
        'impa-ring': '0 0 0 4px rgb(23 207 23 / 0.18)',
        'impa-ring-soft': '0 0 0 4px rgb(23 207 23 / 0.10)',
        'impa-inner': 'inset 0 1px 0 0 rgb(255 255 255 / 0.6)',
      },
      transitionTimingFunction: {
        'impa':      'cubic-bezier(0.22, 1, 0.36, 1)',
        'impa-out':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'impa-in':   'cubic-bezier(0.4, 0, 1, 1)',
      },
      backgroundImage: {
        'impa-mesh':
          'radial-gradient(60% 70% at 12% 18%, rgba(23,207,23,0.18), transparent 60%), radial-gradient(50% 60% at 92% 6%, rgba(63,210,63,0.12), transparent 60%), radial-gradient(70% 80% at 80% 100%, rgba(168,241,168,0.18), transparent 60%), linear-gradient(180deg, #ffffff 0%, #f6fbf6 100%)',
        'impa-cta':
          'linear-gradient(135deg, #17cf17 0%, #11a611 100%)',
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
