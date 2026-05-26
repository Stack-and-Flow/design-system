import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

/**
 * ## Description
 * Icon renders Lucide SVG glyphs with token-backed semantic tones and optional accessible labelling.
 *
 * ## Usage Guide
 * Use the `tone` variant for standard design-system color pairings.
 * Use `color` and `colorDark` only when a consumer needs a specific token override.
 * Provide `aria-label` or `title` when the icon must be announced; otherwise it remains decorative.
 */
const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Icon>;

/**
 * Shows the default decorative icon using the default brand tone.
 */
export const Default: Story = {
  args: {
    name: 'image-plus'
  }
};

/**
 * Compares the semantic tone variants available through the component CVA.
 */
export const ToneVariants: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4 rounded-lg bg-background-light p-6 dark:bg-background-dark'>
      <Icon name='image' tone='brand' />
      <Icon name='image' tone='default' />
      <Icon name='image' tone='muted' />
      <Icon name='image' tone='success' />
      <Icon name='image' tone='warning' />
      <Icon name='image' tone='danger' />
      <Icon name='image' tone='info' />
    </div>
  )
};

/**
 * Compares the supported numeric icon sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4 rounded-lg bg-background-light p-6 dark:bg-background-dark'>
      <Icon name='image' size={12} />
      <Icon name='image' size={16} />
      <Icon name='image' size={22} />
      <Icon name='image' size={28} />
      <Icon name='image' size={34} />
      <Icon name='image' size={40} />
    </div>
  )
};

/**
 * Demonstrates token-backed light and dark color overrides while keeping the default API.
 */
export const ColorOverrides: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4 rounded-lg bg-background-light p-6 dark:bg-background-dark'>
      <Icon name='image' color='text-orange' colorDark='dark:text-pink' />
      <Icon name='image' color='text-blue' colorDark='dark:text-info' />
      <Icon name='image' color='text-green' colorDark='dark:text-success' />
    </div>
  )
};

/**
 * Shows the semantic accessibility mode when a label is provided.
 */
export const Accessibility: Story = {
  args: {
    name: 'info',
    tone: 'info',
    'aria-label': 'More information'
  }
};
