import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

/**
 * ## DESCRIPTION
 * Button is the primary interactive element for triggering actions.
 *
 * - Supports five visual variants to establish hierarchy: `primary`, `secondary`, `outlined`, `ghost`, `light`.
 * - Handles loading state with a spinner and prevents double-clicks automatically.
 * - Supports icons, full-width layout, toggle state (`aria-pressed`), and custom styles.
 * - Accessible: uses `aria-label`, `aria-disabled`, and `aria-pressed` correctly, and icon-only usage must provide a meaningful `ariaLabel`.
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    text: 'Button',
    onClick: fn()
  }
};

/**
 * The `variant` prop defines the visual style and hierarchy of the button.
 *
 * Available options:
 * - `primary` → Maximum prominence. Gradient background with neon glow. Use for the main action on a page.
 * - `secondary` → High prominence. Subtle red tint with gradient border. Use for supporting actions.
 * - `outlined` → Medium prominence. Brand-colored border, transparent background.
 * - `ghost` → Low prominence. No border or background. Blends into the surface.
 * - `light` → Minimal. Text-only with brand color. Use for tertiary actions.
 */
export const Variant: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' onClick={fn()} />
      <Button text='Secondary' variant='secondary' onClick={fn()} />
      <Button text='Outlined' variant='outlined' onClick={fn()} />
      <Button text='Ghost' variant='ghost' onClick={fn()} />
      <Button text='Light' variant='light' onClick={fn()} />
    </div>
  )
};

/**
 * The `size` prop controls the height, padding, and font size of the button.
 *
 * Available options:
 * - `sm` → Compact. Slightly below the 44px WCAG touch target — use only in non-touch-critical UIs.
 * - `md` → Default. Meets the 44px minimum touch target (WCAG Rule 10).
 * - `lg` → Large. Use for prominent CTAs or hero sections.
 */
export const Size: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Small' size='sm' onClick={fn()} />
      <Button text='Medium' size='md' onClick={fn()} />
      <Button text='Large' size='lg' onClick={fn()} />
    </div>
  )
};

/**
 * The `icon` prop adds a leading icon to the button using the Lucide icon set.
 *
 * Pass any valid Lucide icon name as a string (e.g. `'arrow-right'`, `'download'`).
 * The icon size scales automatically with the `size` prop.
 */
export const WithIcon: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' icon='arrow-right' onClick={fn()} />
      <Button text='Secondary' variant='secondary' icon='download' onClick={fn()} />
      <Button text='Outlined' variant='outlined' icon='pencil' onClick={fn()} />
      <Button text='Ghost' variant='ghost' icon='trash' onClick={fn()} />
      <Button text='Light' variant='light' icon='external-link' onClick={fn()} />
    </div>
  )
};

/**
 * Icon-only buttons MUST provide a meaningful `ariaLabel`.
 * The component does not generate generic fallback names for icon-only actions.
 */
export const IconOnly: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button ariaLabel='Download file' icon='download' onClick={fn()} />
      <Button ariaLabel='Open external link' icon='external-link' variant='outlined' onClick={fn()} />
    </div>
  )
};

/**
 * The `isLoading` prop switches the button into a loading state.
 *
 * While loading, the spinner replaces interaction feedback and clicks are ignored automatically.
 * Use this to prevent double submissions on async actions.
 */
export const Loading: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' isLoading={true} onClick={fn()} />
      <Button text='Secondary' variant='secondary' isLoading={true} onClick={fn()} />
      <Button text='Outlined' variant='outlined' isLoading={true} onClick={fn()} />
      <Button text='Ghost' variant='ghost' isLoading={true} onClick={fn()} />
      <Button text='Light' variant='light' isLoading={true} onClick={fn()} />
    </div>
  )
};

/**
 * The `disabled` prop prevents any interaction with the button.
 *
 * Disabled buttons use `aria-disabled` and reduced opacity.
 * Prefer `isLoading` over `disabled` when an async action is in progress.
 */
export const Disabled: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' disabled={true} onClick={fn()} />
      <Button text='Secondary' variant='secondary' disabled={true} onClick={fn()} />
      <Button text='Outlined' variant='outlined' disabled={true} onClick={fn()} />
      <Button text='Ghost' variant='ghost' disabled={true} onClick={fn()} />
      <Button text='Light' variant='light' disabled={true} onClick={fn()} />
    </div>
  )
};

/**
 * The `rounded` prop applies a fully rounded (pill) shape to the button.
 *
 * Defaults to `true`. Set to `false` for a standard rounded-corner style.
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Rounded' variant='primary' rounded={true} onClick={fn()} />
      <Button text='Not rounded' variant='primary' rounded={false} onClick={fn()} />
    </div>
  )
};

/**
 * The `uppercase` prop controls text casing.
 *
 * Defaults to `false`. Set to `true` to render the label in all caps.
 */
export const Uppercase: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Normal case' variant='primary' uppercase={false} onClick={fn()} />
      <Button text='Uppercase' variant='primary' uppercase={true} onClick={fn()} />
    </div>
  )
};

/**
 * The `isFullWidth` prop makes the button occupy the full width of its container.
 *
 * Useful inside forms, modals, or mobile layouts where the button should span the available space.
 */
export const FullWidth: Story = {
  render: () => (
    <div className='flex flex-col gap-4 w-80'>
      <Button text='Primary' variant='primary' isFullWidth={true} onClick={fn()} />
      <Button text='Secondary' variant='secondary' isFullWidth={true} onClick={fn()} />
      <Button text='Outlined' variant='outlined' isFullWidth={true} onClick={fn()} />
    </div>
  )
};

/**
 * The `aria-pressed` prop marks the button as a toggle.
 *
 * When set, the button communicates a pressed/unpressed state to assistive technologies via `aria-pressed`.
 * Use this for toggle actions like mute, bookmark, or follow.
 */
export const Pressed: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Unpressed' variant='outlined' aria-pressed={false} onClick={fn()} />
      <Button text='Pressed' variant='primary' aria-pressed={true} onClick={fn()} />
    </div>
  )
};
