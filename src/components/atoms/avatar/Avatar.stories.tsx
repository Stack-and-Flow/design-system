import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

/**
 * ## Description
 * Avatar displays a user or organization image with an initials fallback when the image is missing or unavailable.
 *
 * ## Dependencies
 * Uses Radix UI Avatar for image loading and fallback behavior.
 *
 * ## Usage Guide
 * Use `alt` as the accessible name. Passing `onClick` renders the avatar as a real button for account menus, profile triggers, or identity actions.
 */
const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Avatar>;

/**
 * Default avatar with the component default size and radius.
 */
export const Default: Story = {
  args: {
    alt: 'El Gentleman',
    onClick: undefined
  }
};

/**
 * Avatars can render initials when no image source is available.
 */
export const WithoutImage: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Avatar size='sm' alt='El Gentleman' />
      <Avatar size='md' alt='El Gentleman' />
      <Avatar size='lg' alt='El Gentleman' />
      <Avatar size='xl' alt='El Gentleman' />
      <Avatar size='2xl' alt='El Gentleman' />
      <Avatar size='3xl' alt='El Gentleman' />
    </div>
  )
};

/**
 * The `src` prop displays an image while keeping `alt` as the accessible avatar name.
 */
export const WithImage: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='sm' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='md' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='lg' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='xl' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='2xl' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='3xl' />
    </div>
  )
};

/**
 * The `rounded` prop changes the corner radius.
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Avatar alt='Square Avatar' rounded='none' />
      <Avatar alt='Soft Avatar' rounded='md' />
      <Avatar alt='Pill Avatar' rounded='full' />
    </div>
  )
};

/**
 * Passing `onClick` renders Avatar as a button with keyboard and focus semantics.
 */
export const Interactive: Story = {
  args: {
    alt: 'Open profile',
    rounded: 'full',
    onClick: action('avatar.click')
  }
};

/**
 * Disabled interactive avatars keep button semantics while blocking activation.
 */
export const Disabled: Story = {
  args: {
    alt: 'Profile unavailable',
    rounded: 'full',
    disabled: true,
    onClick: action('avatar.click')
  }
};
