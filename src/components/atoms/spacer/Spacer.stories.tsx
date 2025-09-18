import type { Meta, StoryObj } from '@storybook/react';
import Spacer from './Spacer';

/**
 * ## DESCRIPTION
 * The Spacer component is responsible for providing spacing between components on both axes.
 * The numerical values follow a proportional scale in which each number is equivalent to that
 * value multiplied by 0.25 rem (1 = 0.25 rem, 2 = 0.5 rem, 3 = 0.75 rem, 4 = 1 rem, etc.).
 *
 * The spaceX and spaceY properties control horizontal and vertical spacing respectively,
 * allowing you to create the perfect spacing between components.
 *
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
  args: {
    spaceY: 10
  }
};

/**
 *Spacing on the Y axis.
 */

export const Vertical: Story = {
  render: () => (
    <>
      <div className='w-8 h-8 bg-red-500 border-2 border-red-600'></div>
      <Spacer spaceY={8} />
      <div className='w-8 h-8 bg-red-500 border-2 border-red-600'></div>
    </>
  )
};

/**
 *Spacing on the X axis.
 */

export const Horizontal: Story = {
  render: () => (
    <>
      <div className='flex'>
        <div className='w-8 h-8 bg-red-500 border-2 border-red-600'></div>
        <Spacer spaceX={8} />
        <div className='w-8 h-8 bg-red-500 border-2 border-red-600'></div>
      </div>
    </>
  )
};
