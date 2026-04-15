import { create } from '@storybook/theming/create';

export default create({
  base: 'dark',

  // Typography
  fontBase: "'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif",
  fontCode: 'monospace',

  // Branding
  brandTitle: 'Stack-and-Flow Design System',
  brandUrl: 'https://github.com/Stack-and-Flow/design-system',
  brandImage: '/images/logo.svg',

  // Colors
  colorPrimary: '#ff0036',
  colorSecondary: '#ff0036',

  // UI
  appBg: '#000000',
  appContentBg: '#000000',
  appBorderColor: '#1a1a1a',
  appBorderRadius: 8,
  textColor: '#ffffff',
  textInverseColor: '#ffffff',

  // Toolbar
  barBg: '#0a0a0a',
  barTextColor: '#888888',
  barSelectedColor: '#ff0036',
  barHoverColor: '#ff4d72',

  // Button
  buttonBg: '#0a0a0a',
  buttonBorder: '#ff0036'
});
