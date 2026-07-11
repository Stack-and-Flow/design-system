import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Snippet } from './Snippet';

/**
 * ## Description
 * Snippet renders short or multiline code blocks with a token-backed surface and an optional copy action.
 *
 * ## Dependencies
 * Uses `IconButton` for the copy affordance.
 *
 * ## Usage Guide
 * Use `aria-label` to customize the copy button name for assistive technology or product-specific copy. `disableCopy` removes the action entirely when the snippet is meant to be read-only or decorative.
 */
const meta: Meta<typeof Snippet> = {
  title: 'Molecules/Snippet',
  component: Snippet,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Snippet>;

/**
 * Shows the default snippet configuration without overriding the default visual variants.
 */
export const Default: Story = {
  args: {
    children: 'pnpm add @stack-and-flow/design-system',
    onCopy: action('copy')
  }
};

/**
 * Shows the visual hierarchy available through the variant prop.
 */
export const Variant: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-3'>
      <Snippet onCopy={action('solid-copy')}>Solid snippet</Snippet>
      <Snippet variant='outline' onCopy={action('outline-copy')}>
        Outline snippet
      </Snippet>
      <Snippet variant='shadow' onCopy={action('shadow-copy')}>
        Shadow snippet
      </Snippet>
    </div>
  )
};

/**
 * Shows the semantic color surface options while keeping the same structure.
 */
export const Color: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      <Snippet color='default' onCopy={action('default-color-copy')}>
        Default color
      </Snippet>
      <Snippet color='primary' onCopy={action('primary-color-copy')}>
        Primary color
      </Snippet>
      <Snippet color='secondary' onCopy={action('secondary-color-copy')}>
        Secondary color
      </Snippet>
      <Snippet color='success' onCopy={action('success-color-copy')}>
        Success color
      </Snippet>
      <Snippet color='warning' onCopy={action('warning-color-copy')}>
        Warning color
      </Snippet>
      <Snippet color='danger' onCopy={action('danger-color-copy')}>
        Danger color
      </Snippet>
      <Snippet color='info' onCopy={action('info-color-copy')}>
        Info color
      </Snippet>
    </div>
  )
};

/**
 * Shows the supported size scale for compact and large code snippets.
 */
export const Size: Story = {
  render: () => (
    <div className='grid gap-4'>
      <Snippet size='sm' onCopy={action('small-copy')}>
        Small snippet
      </Snippet>
      <Snippet size='md' onCopy={action('medium-copy')}>
        Medium snippet
      </Snippet>
      <Snippet size='lg' onCopy={action('large-copy')}>
        Large snippet
      </Snippet>
    </div>
  )
};

/**
 * Shows the available rounded scale for surface composition.
 */
export const Rounded: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      <Snippet rounded='none' onCopy={action('rounded-none-copy')}>
        Rounded none
      </Snippet>
      <Snippet rounded='xs' onCopy={action('rounded-xs-copy')}>
        Rounded xs
      </Snippet>
      <Snippet rounded='sm' onCopy={action('rounded-sm-copy')}>
        Rounded sm
      </Snippet>
      <Snippet rounded='md' onCopy={action('rounded-md-copy')}>
        Rounded md
      </Snippet>
      <Snippet rounded='lg' onCopy={action('rounded-lg-copy')}>
        Rounded lg
      </Snippet>
      <Snippet rounded='xl' onCopy={action('rounded-xl-copy')}>
        Rounded xl
      </Snippet>
      <Snippet rounded='full' onCopy={action('rounded-full-copy')}>
        Rounded full
      </Snippet>
    </div>
  )
};

/**
 * Shows multiline content while preserving the horizontal copy affordance.
 */
export const Multiline: Story = {
  render: () => (
    <Snippet onCopy={action('multiline-copy')}>
      {`pnpm install
pnpm run build
pnpm test`}
    </Snippet>
  )
};

/**
 * Shows the non-interactive state when copy is intentionally unavailable.
 */
export const Disabled: Story = {
  args: {
    children: 'Read-only snippet',
    disableCopy: true
  }
};

/**
 * Shows how token-backed utility classes can extend the component without bypassing the theme.
 * Use opaque surface tokens for branded containers and keep tint tokens for interactive overlays.
 */
export const CustomClassName: Story = {
  args: {
    children: 'Themed custom class',
    className:
      'border-brand-light bg-red-surface-light text-text-light dark:border-brand-dark dark:bg-red-surface-dark dark:text-text-dark',
    onCopy: action('custom-class-copy')
  }
};

/**
 * Shows accessible copy-button labeling and an explicit controlled content relationship.
 */
export const AccessibleCopyAction: Story = {
  args: {
    id: 'install-command',
    'aria-controls': 'install-command-code',
    'aria-label': 'Copy installation command',
    children: 'pnpm add @stack-and-flow/design-system',
    onCopy: action('accessible-copy')
  }
};

/**
 * Shows the copy callback using the canonical Storybook action helper.
 */
export const WithOnCopy: Story = {
  args: {
    children: 'pnpm run storybook',
    onCopy: action('copy-callback')
  }
};
