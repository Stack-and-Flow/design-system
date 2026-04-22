import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Avatar } from './Avatar';

/**
 * ## DESCRIPTION
 * Avatar component is used to display user profile images or icons.
 * It supports different sizes and can show a fallback text when the image is not available.
 *
 * ## DEPENDENCIES
 * - [Radix UI Avatar](https://www.radix-ui.com/docs/primitives/components/avatar)
 *
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

export const Default: Story = {
  args: {
    size: 'md',
    alt: 'EG',
    className: ''
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify avatar is rendered with correct role
    const avatar = canvas.getByRole('img', { name: /EG/i });
    await expect(avatar).toBeInTheDocument();
  }
};

/**
 * - If you don't provide an image, the component will show a fallback text.
 * - The fallback text is set to "EG" by default, but you can change it by providing a different `alt` prop.
 */

export const WithoutImage: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Avatar src={''} size='sm' alt='EG' />
      <Avatar src={''} size='md' alt='EG' />
      <Avatar src={''} size='lg' alt='EG' />
      <Avatar src={''} size='xl' alt='EG' />
      <Avatar src={''} size='2xl' alt='EG' />
      <Avatar src={''} size='3xl' alt='EG' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all avatars render
    const avatars = canvas.getAllByRole('img');
    await expect(avatars.length).toBeGreaterThan(0);
  }
};

/**
 * - You can use the `src` prop to provide an image URL.
 * - The `alt` prop is used for accessibility and should describe the image.
 */

export const WithImage: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='sm' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='md' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='lg' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='xl' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='2xl' />
      <Avatar src='/images/logo-only.svg' alt='EG Logo' size='3xl' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all avatars are rendered
    const avatars = canvas.getAllByRole('img');
    await expect(avatars.length).toBeGreaterThan(0);
  }
};

/**
 *  - You can round the avatar using the `rounded` prop.
 *  - The available options are 'md', 'full', and 'none'.
 *  - The default value is 'md'.
 *  - This prop allows for customization of the avatar's appearance.
 */

export const Rounded: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Avatar src='' alt='EG' size='md' rounded='md' />
      <Avatar src='' alt='EG' size='md' rounded='full' />
      <Avatar src='' alt='EG' size='md' rounded='none' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all rounded variants are rendered
    const avatars = canvas.getAllByRole('img');
    await expect(avatars.length).toBe(3);
  }
};

/**
 * - When the avatar is clickable (e.g. profile link, account dropdown trigger), pass `onClick`.
 * - Hover/active scale effect and `cursor-pointer` are enabled automatically.
 */
export const Interactive: Story = {
  render: () => {
    const handleClick = fn();
    return (
      <div className='flex gap-4 items-center'>
        <Avatar src='' alt='User 1' size='sm' onClick={handleClick} />
        <Avatar src='' alt='User 2' size='md' onClick={handleClick} />
        <Avatar src='' alt='User 3' size='lg' onClick={handleClick} />
        <Avatar src='/images/logo-only.svg' alt='User 4' size='xl' onClick={handleClick} />
        <Avatar src='/images/logo-only.svg' alt='User 5' size='2xl' onClick={handleClick} />
        <Avatar src='/images/logo-only.svg' alt='User 6' size='3xl' onClick={handleClick} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all avatars are rendered
    const avatars = canvas.getAllByRole('img');
    await expect(avatars.length).toBeGreaterThan(0);

    // Click on the first avatar
    const firstAvatar = avatars[0];
    await userEvent.click(firstAvatar);

    // Verify cursor-pointer class is applied
    await expect(firstAvatar).toHaveClass('cursor-pointer');
  }
};
