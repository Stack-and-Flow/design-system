import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

/**
 * ## DESCRIPTION
 * Button component for various actions in the application.
 * It supports different variants, sizes, and loading states.
 *
 * ##DEPENDENCIES
 * - `spinners-react`: For loading spinner.
 * - Icon: Uses Icon component from `lucide-react` for icons.
 *
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
    variant: 'primary',
    size: 'md',
    text: 'Lorem ipsum',
    type: 'button',
    disabled: false,
    isFullWidth: false,
    isLoading: false,
    ariaLabel: '',
    onClick: fn()
  }
};

/**
 * - Default variant is primary with medium size.
 */

export const Primary: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Lorem ipsum' size='sm' onClick={fn()} />
      <Button text='Lorem ipsum' size='md' onClick={fn()} />
      <Button text='Lorem ipsum' size='lg' onClick={fn()} />
    </div>
  )
};

/**
 * - Secondary variant is used for less emphasized actions.
 * - It has a different color scheme compared to the primary variant.
 */

export const Secondary: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Lorem ipsum' size='sm' variant='secondary' onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='secondary' onClick={fn()} />
      <Button text='Lorem ipsum' size='lg' variant='secondary' onClick={fn()} />
    </div>
  )
};

/**
 * - Outlined variant is used for actions that need to be visually distinct but not as prominent as primary actions.
 * - It has a border but no background color.
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Outlined: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Lorem ipsum' size='sm' variant='outlined' onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='outlined' onClick={fn()} />
      <Button text='Lorem ipsum' size='lg' variant='outlined' onClick={fn()} />
    </div>
  )
};

/**
 * - Ghost variant is used for actions that should blend into the background.
 * - It has no background or border, making it suitable for minimalistic designs.
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Ghost: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Lorem ipsum' size='sm' variant='ghost' onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='ghost' onClick={fn()} />
      <Button text='Lorem ipsum' size='lg' variant='ghost' onClick={fn()} />
    </div>
  )
};

/**
 * - Light variant is used for actions that should be less prominent than primary actions but still noticeable.
 * - It has a lighter color scheme compared to the primary variant.
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Light: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Lorem ipsum' size='sm' variant='light' onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='light' onClick={fn()} />
      <Button text='Lorem ipsum' size='lg' variant='light' onClick={fn()} />
    </div>
  )
};

/**
 * - You can use isLoading prop to indicate that the button is in a loading state.
 * - This will show a spinner inside the button and disable further clicks.
 */

export const Loading: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Button text='Lorem ipsum' size='md' variant='primary' isLoading={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='secondary' isLoading={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='outlined' isLoading={true} onClick={fn()} />
    </div>
  )
};

/**
 * - You can use icon prop to add an icon to the button.
 * - This can enhance the visual appeal and usability of the button.
 */

export const WithIcon: Story = {
  render: () => (
    <>
      <div className='flex gap-4 items-center justify-center'>
        <Button text='Lorem ipsum' size='md' variant='primary' icon='image' onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='outlined' icon='image' onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='light' icon='image' onClick={fn()} />
      </div>
      <div className='flex gap-4 items-center justify-center pt-4'>
        <Button text='Lorem ipsum' size='md' variant='secondary' icon='image' onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='ghost' icon='image' onClick={fn()} />
      </div>
    </>
  )
};

/**
 * - This option allows you to customize the button's appearance with rounded corners.
 * - You can set the rounded prop to true to apply a fully rounded style.
 */

export const Rounded: Story = {
  render: () => (
    <>
      <div className='flex gap-4 items-center justify-center'>
        <Button text='Lorem ipsum' size='md' variant='primary' rounded={true} onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='outlined' rounded={true} onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='light' rounded={true} onClick={fn()} />
      </div>
      <div className='flex gap-4 items-center justify-center pt-4'>
        <Button text='Lorem ipsum' size='md' variant='secondary' rounded={true} onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='ghost' rounded={true} onClick={fn()} />
      </div>
    </>
  )
};

/**
 * - This option allows you to customize the button's appearance with uppercase text.
 * - The value is true by default, which means the button text will be displayed in uppercase.
 * - You can set the uppercase prop to false to disable uppercase styling.
 */

export const Lowercase: Story = {
  render: () => (
    <>
      <div className='flex gap-4 items-center justify-center'>
        <Button text='Lorem ipsum' size='md' variant='primary' uppercase={false} onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='outlined' uppercase={false} onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='light' uppercase={false} onClick={fn()} />
      </div>
      <div className='flex gap-4 items-center justify-center pt-4'>
        <Button text='Lorem ipsum' size='md' variant='secondary' uppercase={false} onClick={fn()} />
        <Button text='Lorem ipsum' size='md' variant='ghost' uppercase={false} onClick={fn()} />
      </div>
    </>
  )
};

/**
 * - This option allows you to customize the button's appearance with full width.
 * - You can set the isFullWidth prop to true to make the button occupy the full width of its container.
 */

export const FullWidth: Story = {
  render: () => (
    <div className='flex flex-col gap-4 items-center justify-center'>
      <Button text='Lorem ipsum' size='md' variant='primary' isFullWidth={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='outlined' isFullWidth={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='light' isFullWidth={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='secondary' isFullWidth={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='ghost' isFullWidth={true} onClick={fn()} />
    </div>
  )
};

/**
 * -You can disable the button by setting the disabled prop to true.
 * - This will prevent any interaction with the button.
 */

export const Disabled: Story = {
  render: () => (
    <div className='flex gap-4 items-center justify-center'>
      <Button text='Lorem ipsum' size='md' variant='primary' disabled={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='outlined' disabled={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='light' disabled={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='secondary' disabled={true} onClick={fn()} />
      <Button text='Lorem ipsum' size='md' variant='ghost' disabled={true} onClick={fn()} />
    </div>
  )
};

/**
 * - This option allows you to customize the button's appearance editing className.
 * - You can add custom styles or classes to the button using the className prop.
 */

export const CustomStyles: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    text: 'Lorem ipsum',
    type: 'button',
    disabled: false,
    isFullWidth: false,
    isLoading: false,
    ariaLabel: '',
    icon: 'arrow-right',
    className: '!flex-row-reverse'
  }
};
