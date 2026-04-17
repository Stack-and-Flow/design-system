import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import IconButton from './IconButton';

/**
 * ## DESCRIPTION
 * IconButton component is a button that displays an icon. It can be used for various actions in the UI, such as opening menus, submitting forms, or triggering other interactions. The component supports different variants, sizes, and styles to fit various design requirements.
 *
 * ## SEARCH ICONS
 * You can search for icons in the [Lucide Icons](https://lucide.dev/icons) library. Use the icon name as the `icon` prop value.
 *
 * ## DEPENDENCIES
 * - Icon: Uses Icon component from `lucide-react` for icons.
 *
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

export const Default: Story = {
  args: {
    variant: 'primary',
    icon: 'menu',
    size: 20,
    rounded: false,
    shadow: false,
    disabled: false,
    className: '',
    title: 'Menu'
  }
};

/**
 * - Default variant is `primary`.
 */

export const Primary: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' size={12} title='link' onClick={fn()} />
      <IconButton icon='menu' size={16} title='link' onClick={fn()} />
      <IconButton icon='menu' size={22} title='link' onClick={fn()} />
      <IconButton icon='menu' size={28} title='link' onClick={fn()} />
      <IconButton icon='menu' size={34} title='link' onClick={fn()} />
      <IconButton icon='menu' size={40} title='link' onClick={fn()} />
    </div>
  )
};

/**
 * - The secondary variant is used for less prominent actions, such as secondary buttons or links.
 * - It typically has a different color scheme compared to the primary variant, often using a lighter or more subdued color.
 */

export const Secondary: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' size={12} title='link' variant='secondary' onClick={fn()} />
      <IconButton icon='menu' size={16} title='link' variant='secondary' onClick={fn()} />
      <IconButton icon='menu' size={22} title='link' variant='secondary' onClick={fn()} />
      <IconButton icon='menu' size={28} title='link' variant='secondary' onClick={fn()} />
      <IconButton icon='menu' size={34} title='link' variant='secondary' onClick={fn()} />
      <IconButton icon='menu' size={40} title='link' variant='secondary' onClick={fn()} />
    </div>
  )
};

/**
 * - The tertiary variant is used for actions that are even less prominent than secondary actions, such as tertiary buttons or links.
 * - It usually has a more subtle appearance, often using a neutral color or a lighter shade of the secondary color.
 */

export const Outlined: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' size={12} title='link' variant='outlined' onClick={fn()} />
      <IconButton icon='menu' size={16} title='link' variant='outlined' onClick={fn()} />
      <IconButton icon='menu' size={22} title='link' variant='outlined' onClick={fn()} />
      <IconButton icon='menu' size={28} title='link' variant='outlined' onClick={fn()} />
      <IconButton icon='menu' size={34} title='link' variant='outlined' onClick={fn()} />
      <IconButton icon='menu' size={40} title='link' variant='outlined' onClick={fn()} />
    </div>
  )
};

/**
 * - The ghost variant is used for actions that should be very subtle, often used in contexts where the button is not the primary focus.
 * - It typically has no background or border, relying on the icon and hover effects to indicate interactivity.
 */

export const Ghost: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' size={12} title='link' variant='ghost' onClick={fn()} />
      <IconButton icon='menu' size={16} title='link' variant='ghost' onClick={fn()} />
      <IconButton icon='menu' size={22} title='link' variant='ghost' onClick={fn()} />
      <IconButton icon='menu' size={28} title='link' variant='ghost' onClick={fn()} />
      <IconButton icon='menu' size={34} title='link' variant='ghost' onClick={fn()} />
      <IconButton icon='menu' size={40} title='link' variant='ghost' onClick={fn()} />
    </div>
  )
};

/**
 * - The light variant is used for actions that should be visually distinct but not as prominent as the primary or secondary actions.
 * - It often uses a lighter color scheme, making it suitable for actions that are important but not the primary focus of the UI.
 */

export const Light: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' size={12} title='link' variant='light' onClick={fn()} />
      <IconButton icon='menu' size={16} title='link' variant='light' onClick={fn()} />
      <IconButton icon='menu' size={22} title='link' variant='light' onClick={fn()} />
      <IconButton icon='menu' size={28} title='link' variant='light' onClick={fn()} />
      <IconButton icon='menu' size={34} title='link' variant='light' onClick={fn()} />
      <IconButton icon='menu' size={40} title='link' variant='light' onClick={fn()} />
    </div>
  )
};

/**
 * - You can use the `rounded` prop to make the button fully rounded.
 * - This is useful for creating circular buttons or buttons with a pill shape.
 * * - The `shadow` prop can be used to add a shadow effect to the button, enhancing its visual depth and making it stand out.
 * * - The `shadow` prop can be combined with the `rounded` prop to create buttons with both rounded corners and shadow effects.
 */

export const RoundedShadow: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton
        icon='menu'
        size={12}
        title='link'
        variant='outlined'
        rounded={true}
        shadow={true}
        onClick={fn()}
      />
      <IconButton
        icon='menu'
        size={16}
        title='link'
        variant='outlined'
        rounded={true}
        shadow={true}
        onClick={fn()}
      />
      <IconButton
        icon='menu'
        size={22}
        title='link'
        variant='outlined'
        rounded={true}
        shadow={true}
        onClick={fn()}
      />
      <IconButton
        icon='menu'
        size={28}
        title='link'
        variant='outlined'
        rounded={true}
        shadow={true}
        onClick={fn()}
      />
      <IconButton
        icon='menu'
        size={34}
        title='link'
        variant='outlined'
        rounded={true}
        shadow={true}
        onClick={fn()}
      />
      <IconButton
        icon='menu'
        size={40}
        title='link'
        variant='outlined'
        rounded={true}
        shadow={true}
        onClick={fn()}
      />
    </div>
  )
};

/**
 * - The `disabled` prop can be used to disable the button, preventing any interaction.
 * - When the button is disabled, it typically appears grayed out or visually distinct to indicate that it is not interactive.
 */

export const Disabled: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' variant='primary' disabled={true} onClick={fn()} />
      <IconButton icon='menu' variant='secondary' disabled={true} onClick={fn()} />
      <IconButton icon='menu' variant='outlined' disabled={true} onClick={fn()} />
      <IconButton icon='menu' variant='ghost' disabled={true} onClick={fn()} />
      <IconButton icon='menu' variant='light' disabled={true} onClick={fn()} />
    </div>
  )
};

/**
 * - The `aria-pressed` prop can be used to indicate the pressed state of a toggle button.
 * - This is useful for accessibility, allowing screen readers to announce the state of the button.
 */

export const AriaPressed: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' variant='primary' aria-pressed={true} onClick={fn()} />
      <IconButton icon='menu' variant='secondary' aria-pressed={true} onClick={fn()} />
      <IconButton icon='menu' variant='outlined' aria-pressed={true} onClick={fn()} />
      <IconButton icon='menu' variant='ghost' aria-pressed={true} onClick={fn()} />
      <IconButton icon='menu' variant='light' aria-pressed={true} onClick={fn()} />
    </div>
  )
};

/**
 * - The `title` prop can be used to provide a tooltip or additional information about the button's action.
 * - This is useful for improving user experience and accessibility, as it provides context for the button's function.
 */
export const Title: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' variant='primary' title='Menu' onClick={fn()} />
      <IconButton icon='menu' variant='secondary' title='Menu' onClick={fn()} />
      <IconButton icon='menu' variant='outlined' title='Menu' onClick={fn()} />
      <IconButton icon='menu' variant='ghost' title='Menu' onClick={fn()} />
      <IconButton icon='menu' variant='light' title='Menu' onClick={fn()} />
    </div>
  )
};

/**
 * - The `className` prop can be used to apply custom styles or additional classes to the button.
 * - This allows for greater flexibility in styling the button to match specific design requirements.
 */

export const CutomClass: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='menu' size={12} title='link' className='bg-blue-500 text-white' onClick={fn()} />
      <IconButton icon='menu' size={16} title='link' className='bg-green-500 text-white' onClick={fn()} />
      <IconButton icon='menu' size={22} title='link' className='bg-red-500 text-white' onClick={fn()} />
      <IconButton icon='menu' size={28} title='link' className='bg-yellow-500 text-white' onClick={fn()} />
      <IconButton icon='menu' size={34} title='link' className='bg-purple-500 text-white' onClick={fn()} />
      <IconButton icon='menu' size={40} title='link' className='bg-pink-500 text-white' onClick={fn()} />
    </div>
  )
};
