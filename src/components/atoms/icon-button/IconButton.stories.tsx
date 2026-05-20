import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

/**
 * ## Description
 * IconButton renders a single-action control with a Lucide icon and Stack-and-Flow button variants.
 *
 * ## Dependencies
 * Uses Lucide dynamic icons for the visual glyph.
 *
 * ## Usage Guide
 * Provide a meaningful accessible name with `title`, `ariaLabel`, or `aria-label`. Named sizes (`sm`, `md`, `lg`) change both the button target and the icon; legacy numeric sizes keep the exact icon size and map the button target to the closest named size. Use `shadow={false}` only when a quiet context needs to suppress glow, and use `aria-pressed` only to announce toggle-button state to assistive technology.
 */
const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof IconButton>;

/**
 * Shows the default icon button configuration without overriding default variants.
 */
export const Default: Story = {
  args: {
    icon: 'menu',
    title: 'Open menu',
    onClick: action('icon-button-click')
  }
};

/**
 * Shows the visual hierarchy available through the variant prop.
 */
export const Variant: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <IconButton icon='menu' title='Open menu' variant='primary' onClick={action('primary-click')} />
      <IconButton icon='copy' title='Copy text' variant='secondary' onClick={action('secondary-click')} />
      <IconButton icon='pencil' title='Edit item' variant='outlined' onClick={action('outlined-click')} />
      <IconButton icon='x' title='Close panel' variant='ghost' onClick={action('ghost-click')} />
      <IconButton icon='external-link' title='Open link' variant='light' onClick={action('light-click')} />
    </div>
  )
};

/**
 * Shows size options changing the full button target and the icon together.
 */
export const Size: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <IconButton icon='menu' size='sm' title='Open small menu' onClick={action('small-click')} />
      <IconButton icon='menu' size='md' title='Open medium menu' onClick={action('medium-click')} />
      <IconButton icon='menu' size='lg' title='Open large menu' onClick={action('large-click')} />
    </div>
  )
};

/**
 * Shows the rounded shape toggle for square and pill icon buttons.
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <IconButton icon='menu' rounded={false} title='Open square menu' onClick={action('rounded-off-click')} />
      <IconButton icon='menu' rounded={true} title='Open round menu' onClick={action('rounded-on-click')} />
    </div>
  )
};

/**
 * Shows that shadow only toggles the token glow; it does not change hierarchy or behavior.
 */
export const Shadow: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <IconButton icon='star' title='Favorite with glow' variant='secondary' onClick={action('shadow-on-click')} />
      <IconButton
        icon='star'
        shadow={false}
        title='Favorite without glow'
        variant='secondary'
        onClick={action('shadow-off-click')}
      />
    </div>
  )
};

/**
 * Shows toggle-button semantics: aria-pressed announces state, while the variant communicates it visually.
 */
export const ToggleState: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <IconButton
        icon='bookmark'
        title='Save item'
        aria-pressed={false}
        variant='outlined'
        onClick={action('toggle-off-click')}
      />
      <IconButton
        icon='bookmark-check'
        title='Saved item'
        aria-pressed={true}
        variant='primary'
        onClick={action('toggle-on-click')}
      />
    </div>
  )
};

/**
 * Shows the non-interactive disabled state across the available variants.
 */
export const Disabled: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <IconButton
        icon='menu'
        title='Open disabled menu'
        variant='primary'
        disabled={true}
        onClick={action('disabled-primary-click')}
      />
      <IconButton
        icon='copy'
        title='Copy disabled text'
        variant='secondary'
        disabled={true}
        onClick={action('disabled-secondary-click')}
      />
      <IconButton
        icon='pencil'
        title='Edit disabled item'
        variant='outlined'
        disabled={true}
        onClick={action('disabled-outlined-click')}
      />
      <IconButton
        icon='x'
        title='Close disabled panel'
        variant='ghost'
        disabled={true}
        onClick={action('disabled-ghost-click')}
      />
      <IconButton
        icon='external-link'
        title='Open disabled link'
        variant='light'
        disabled={true}
        onClick={action('disabled-light-click')}
      />
    </div>
  )
};

/**
 * Shows how token-backed utility classes can extend the component without bypassing the theme.
 */
export const CustomClassName: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <IconButton
        icon='sparkles'
        title='Highlight item'
        variant='ghost'
        className='border-brand-light bg-red-tint-subtle text-brand-light dark:border-brand-dark dark:text-brand-dark'
        onClick={action('custom-class-click')}
      />
    </div>
  )
};
