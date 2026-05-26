import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';

const frameClass =
  'inline-flex rounded-md border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark';
const markerClass = 'rounded-sm bg-primary shadow-glow-focus-light dark:shadow-glow-focus-dark';

/**
 * ## Description
 * Spacer renders decorative, token-based empty space between layout elements.
 * Use it when a composition needs an explicit spacing atom instead of coupling
 * adjacent components with one-off margins.
 *
 * ## Usage Guide
 * Prefer `axis` and `size` for new usage. `spaceX` and `spaceY` remain available
 * for directional overrides and legacy compositions. The spacer itself stays
 * invisible; these stories show its effect through the distance between markers.
 */
const meta: Meta<typeof Spacer> = {
  title: 'Atoms/Spacer',
  component: Spacer,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Spacer>;

export const Default: Story = {
  render: () => (
    <div className={`${frameClass} flex-col`}>
      <div className={`h-8 w-24 ${markerClass}`} />
      <Spacer />
      <div className={`h-8 w-24 ${markerClass}`} />
    </div>
  )
};

/** Vertical spacing separates stacked content while the spacer remains invisible. */
export const Vertical: Story = {
  render: () => (
    <div className={`${frameClass} flex-col`}>
      <div className={`h-8 w-24 ${markerClass}`} />
      <Spacer axis='vertical' size={8} />
      <div className={`h-8 w-24 ${markerClass}`} />
    </div>
  )
};

/** Horizontal spacing separates inline content while the spacer remains invisible. */
export const Horizontal: Story = {
  render: () => (
    <div className={`${frameClass} items-center`}>
      <div className={`h-8 w-8 ${markerClass}`} />
      <Spacer axis='horizontal' size={8} />
      <div className={`h-8 w-8 ${markerClass}`} />
    </div>
  )
};

/** Both-axis spacing reserves invisible width and height in a layout. */
export const BothAxes: Story = {
  render: () => (
    <div className={`${frameClass} items-start`}>
      <div className={`h-8 w-8 ${markerClass}`} />
      <Spacer axis='both' size={12} />
      <div className={`h-8 w-8 ${markerClass}`} />
    </div>
  )
};

/** Directional overrides preserve the previous `spaceX` and `spaceY` API. */
export const DirectionalOverrides: Story = {
  render: () => (
    <div className={`${frameClass} flex-col`}>
      <div className={`h-8 w-24 ${markerClass}`} />
      <Spacer spaceX={16} spaceY={6} />
      <div className={`h-8 w-24 ${markerClass}`} />
    </div>
  )
};
