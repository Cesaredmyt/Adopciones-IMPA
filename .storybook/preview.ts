import type { Preview } from '@storybook/nextjs-vite'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'impa-bg',
      values: [
        { name: 'impa-bg', value: '#f6f8f6' },
        { name: 'white', value: '#ffffff' },
        { name: 'impa-cream', value: '#faf5ef' },
        { name: 'impa-tinted', value: '#edf8ed' },
      ],
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;