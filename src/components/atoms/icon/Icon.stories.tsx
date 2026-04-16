import type { Meta, StoryObj } from '@storybook/react';
import Icon from './Icon';

/**
 * ## DESCRIPTION
 * Icon component that renders SVG icons from the Lucide icon set.
 * It supports different sizes and colors, and can be used in various contexts.
 *
 * ## SEARCH ICONS
 * You can search for icons at [Lucide Icons](https://lucide.dev/icons).
 *
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

export const Default: Story = {
  args: {
    name: 'image-plus',
    color: 'text-color-brand-light',
    colorDark: 'dark:text-color-brand-dark',
    size: 24
  }
};
/**
 * - You can change the icon size by modifying the `size` prop.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
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
 * - You can change the icon color by modifying the `color` and `colorDark` props.
 * - You can use Tailwind CSS color classes like `text-red-500`, `text-blue-500`, etc.
 * - The `color` prop is used for light mode, and the `colorDark` prop is used for dark mode.
 */

export const Colors: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Icon name='image' size={12} color='text-color-orange' colorDark='dark:text-color-pink' />
      <Icon name='image' size={16} color='text-color-orange' colorDark='dark:text-color-pink' />
      <Icon name='image' size={22} color='text-color-orange' colorDark='dark:text-color-pink' />
      <Icon name='image' size={28} color='text-color-orange' colorDark='dark:text-color-pink' />
      <Icon name='image' size={34} color='text-color-orange' colorDark='dark:text-color-pink' />
      <Icon name='image' size={40} color='text-color-orange' colorDark='dark:text-color-pink' />
    </div>
  )
};

/**
 * - You can use the `className` prop to apply additional Tailwind CSS classes for styling.
 * - This allows you to customize the icon's appearance further, such as adding margins, padding, or hover effects.
 */
export const CustomClass: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Icon name='image' size={24} className='text-blue-500 hover:text-blue-700 transition-colors' />
      <Icon name='image' size={24} className='text-green-500 hover:text-green-700 transition-colors' />
      <Icon name='image' size={24} className='text-red-500 hover:text-red-700 transition-colors' />
    </div>
  )
};
