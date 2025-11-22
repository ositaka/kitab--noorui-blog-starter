import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include noorui-rtl package so Tailwind generates classes used by its components
    './node_modules/noorui-rtl/dist/**/*.{js,mjs}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Define all themeable values here for easy customization
      colors: {
        callout: {
          info: {
            bg: 'var(--callout-info-bg)',
            border: 'var(--callout-info-border)',
          },
          warning: {
            bg: 'var(--callout-warning-bg)',
            border: 'var(--callout-warning-border)',
          },
          error: {
            bg: 'var(--callout-error-bg)',
            border: 'var(--callout-error-border)',
          },
          success: {
            bg: 'var(--callout-success-bg)',
            border: 'var(--callout-success-border)',
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            'h1, h2, h3, h4, h5, h6': {
              scrollMarginTop: 'var(--prose-scroll-margin)',
            },
            'pre': {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              borderRadius: 'var(--radius)',
              padding: 'var(--prose-pre-padding)',
              overflow: 'auto',
            },
            'code': {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              padding: 'var(--prose-code-padding)',
              borderRadius: 'var(--prose-code-radius)',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'blockquote': {
              borderInlineStartWidth: 'var(--prose-blockquote-border-width)',
              borderInlineStartColor: 'var(--tw-prose-quote-borders)',
              paddingInlineStart: 'var(--prose-blockquote-padding)',
              fontStyle: 'italic',
            },
            'ul, ol': {
              paddingInlineStart: 'var(--prose-list-padding)',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
    // Custom plugin to define CSS variables - all theme config in one place
    plugin(function ({ addBase }) {
      addBase({
        ':root': {
          // Prose/Content spacing
          '--prose-scroll-margin': '100px',
          '--prose-pre-padding': '1rem',
          '--prose-code-padding': '0.2rem 0.4rem',
          '--prose-code-radius': '0.25rem',
          '--prose-blockquote-border-width': '4px',
          '--prose-blockquote-padding': '1rem',
          '--prose-list-padding': '1.5rem',

          // Callout colors - Light mode
          '--callout-info-bg': 'hsl(210 100% 97%)',
          '--callout-info-border': 'hsl(210 100% 80%)',
          '--callout-warning-bg': 'hsl(48 100% 97%)',
          '--callout-warning-border': 'hsl(48 100% 70%)',
          '--callout-error-bg': 'hsl(0 100% 97%)',
          '--callout-error-border': 'hsl(0 70% 80%)',
          '--callout-success-bg': 'hsl(142 100% 97%)',
          '--callout-success-border': 'hsl(142 70% 70%)',
        },
        '.dark': {
          // Callout colors - Dark mode
          '--callout-info-bg': 'hsl(210 100% 10%)',
          '--callout-info-border': 'hsl(210 60% 30%)',
          '--callout-warning-bg': 'hsl(48 100% 10%)',
          '--callout-warning-border': 'hsl(48 60% 30%)',
          '--callout-error-bg': 'hsl(0 100% 10%)',
          '--callout-error-border': 'hsl(0 50% 30%)',
          '--callout-success-bg': 'hsl(142 100% 10%)',
          '--callout-success-border': 'hsl(142 50% 30%)',
        },
      })
    }),
    // Custom plugin for component styles
    plugin(function ({ addComponents }) {
      addComponents({
        // Callout styles
        '.callout[data-callout-type="info"]': {
          backgroundColor: 'var(--callout-info-bg)',
          borderColor: 'var(--callout-info-border)',
        },
        '.callout[data-callout-type="warning"]': {
          backgroundColor: 'var(--callout-warning-bg)',
          borderColor: 'var(--callout-warning-border)',
        },
        '.callout[data-callout-type="error"]': {
          backgroundColor: 'var(--callout-error-bg)',
          borderColor: 'var(--callout-error-border)',
        },
        '.callout[data-callout-type="success"]': {
          backgroundColor: 'var(--callout-success-bg)',
          borderColor: 'var(--callout-success-border)',
        },
        // Shiki code blocks
        '.shiki, .shiki span': {
          color: 'var(--shiki-light) !important',
          backgroundColor: 'transparent !important',
        },
        '.dark .shiki, .dark .shiki span': {
          color: 'var(--shiki-dark) !important',
        },
        // Prose RTL support
        '[dir="rtl"] .prose blockquote': {
          borderInlineStartWidth: 'var(--prose-blockquote-border-width)',
          borderInlineEndWidth: '0',
          paddingInlineStart: 'var(--prose-blockquote-padding)',
          paddingInlineEnd: '0',
        },
        '[dir="rtl"] .prose ul, [dir="rtl"] .prose ol': {
          paddingInlineStart: 'var(--prose-list-padding)',
          paddingInlineEnd: '0',
        },
      })
    }),
  ],
}

export default config
