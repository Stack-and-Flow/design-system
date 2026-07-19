import { addons } from '@storybook/manager-api';
import theme from './theme';

export const storybookCollapsedRoots = ['primitives', 'atoms', 'molecules', 'organisms'];

addons.setConfig({
  theme: theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: storybookCollapsedRoots
  }
});
