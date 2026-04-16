import { create } from '@storybook/theming/create';

// Colors derived from src/styles/theme.css — Stack-and-Flow Design System
// --color-background-dark:      #060C13
// --color-surface-dark:         #0B131E
// --color-surface-raised-dark:  #0F1824
// --color-border-dark:          #172230
// --color-border-strong-dark:   #202C3C
// --color-brand-dark:           #ff0036
// --color-brand-dark-light:     #ff335e
// --color-text-dark:            #ffffff
// --color-text-secondary-dark:  #cccccc
// --color-text-tertiary-dark:   #888888
// --color-text-light:           #0a0a0a

export default create({
  base: 'dark',

  // Typography — --font-primary
  fontBase: "'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif",
  fontCode: 'ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, monospace',

  // Branding
  brandTitle: 'Stack-and-Flow Design System',
  brandUrl: 'https://github.com/Stack-and-Flow/design-system',
  brandImage: '/images/logo.svg',

  // Brand colors — --color-brand-dark
  colorPrimary: '#ff0036',
  colorSecondary: '#ff0036',

  // UI backgrounds — --color-background-dark / --color-surface-dark
  appBg: '#060C13',
  appContentBg: '#060C13',
  appPreviewBg: '#060C13',

  // Borders — --color-border-dark / --color-border-strong-dark / --radius-md
  appBorderColor: '#172230',
  appBorderRadius: 8,

  // Text — --color-text-dark / --color-text-light
  textColor: '#ffffff',
  textInverseColor: '#0a0a0a',
  textMutedColor: '#888888',

  // Toolbar — --color-surface-dark / --color-text-tertiary-dark / --color-brand-dark*
  barBg: '#0B131E',
  barTextColor: '#888888',
  barSelectedColor: '#ff0036',
  barHoverColor: '#ff335e',

  // Buttons — --color-surface-dark / --color-brand-dark
  buttonBg: '#0B131E',
  buttonBorder: '#ff0036',

  // Inputs — --color-surface-raised-dark / --color-border-dark / --color-border-strong-dark
  inputBg: '#0F1824',
  inputBorder: '#172230',
  inputTextColor: '#ffffff',
  inputBorderRadius: 8,
});
