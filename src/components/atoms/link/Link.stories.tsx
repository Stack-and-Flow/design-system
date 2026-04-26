import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Link from './Link';

/**
 *
 * ## DESCRIPTION
 * Link component for navigation and actions.
 *
 * ## DEPENDENCIES
 * - Icon: Uses Icon component from `lucide-react` for icons.
 *
 */

const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    variant: 'regular',
    href: '',
    target: '_blank',
    size: 'md',
    children: 'Lorem ipsum',
    className: '',
    title: ''
  }
};

/**
 * - Regular: Default link style.
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Regular: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Link size='sm' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
      <Link size='md' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
      <Link size='lg' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
    </div>
  )
};

/**
 * - Outlined: Link with outlined style.
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Outlined: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Link size='sm' variant='outlined' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
      <Link size='md' variant='outlined' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
      <Link size='lg' variant='outlined' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
    </div>
  )
};
/**
 * - Button: Link styled as a button.
 */

export const Button: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Link size='sm' variant='button' onClick={fn()}>
        Lorem Ipsum
      </Link>
      <Link size='md' variant='button' onClick={fn()}>
        Lorem Ipsum
      </Link>
      <Link size='lg' variant='button' onClick={fn()}>
        Lorem Ipsum
      </Link>
    </div>
  )
};

/**
 * - With Icon: Link with an icon.
 */

export const WithIcon: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Link size='md' icon='image' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
      <Link size='md' variant='outlined' icon='image' href='https://github.com/egdev6'>
        Lorem Ipsum
      </Link>
      <Link size='md' variant='button' icon='image' onClick={fn()}>
        Lorem Ipsum
      </Link>
    </div>
  )
};

/**
 * - You can change the target of the link to open in a new tab or the same tab.
 * - Use the `target` prop to specify the link behavior.
 */
export const Target: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Link size='md' href='https://github.com/egdev6' target='_blank' title='Open in new tab'>
        Open in new tab
      </Link>
      <Link size='md' href='https://github.com/egdev6' target='_self' title='Open in same tab'>
        Open in same tab
      </Link>
      <Link size='md' href='https://github.com/egdev6' target='_parent' title='Open in parent frame'>
        Open in parent frame
      </Link>
      <Link size='md' href='https://github.com/egdev6' target='_top' title='Open in top frame'>
        Open in top frame
      </Link>
    </div>
  )
};

/**
 * - Accessibility: The `title` prop is used to provide a tooltip or description for the link.
 * - Use the `title` attribute to provide additional context for screen readers.
 */

export const Accessibility: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Link size='md' href='https://github.com/egdev6' title='GitHub Profile'>
        GitHub Profile
      </Link>
    </div>
  )
};

/**
 * - Custom Class: You can add custom classes to the link for additional styling.
 * - You need to override the default classes using `!important` to ensure your styles take precedence.
 */

export const CustomClass: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Link size='md' href='https://github.com/egdev6' icon='arrow-right' className='!flex-row-reverse'>
        Custom Class Link
      </Link>
      <Link
        size='md'
        variant='outlined'
        href='https://github.com/egdev6'
        className='!border-blue-dark !bg-blue-dark !text-white hover:!bg-blue hover:!border-blue hover:!shadow-blue-dark'
      >
        Custom Class Link
      </Link>
    </div>
  )
};
