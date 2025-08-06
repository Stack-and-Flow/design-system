import type { Meta, StoryObj } from '@storybook/react';
import Divider from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    width: 'sm'
  }
};

export const Horizontal: Story = {
  render: () => (
    <div>
      <Divider width='sm' />
      <Divider width='md' />
      <Divider width='lg' />
    </div>
  )
};

export const Dark: Story = {
  render: () => (
    <div>
      <Divider width='sm' horizontalColor='text-gray-dark-100' />
      <Divider width='md' horizontalColor='text-gray-dark-100' />
      <Divider width='lg' horizontalColor='text-gray-dark-100' />
    </div>
  )
};

export const Light: Story = {
  render: () => (
    <div className='bg-amber-50 py-3 px-8'>
      <Divider width='sm' horizontalColor='text-gray-dark-900' />
      <Divider width='md' horizontalColor='text-gray-dark-900' />
      <Divider width='lg' horizontalColor='text-gray-dark-900' />
    </div>
  )
};

export const Vertical: Story = {
  render: () => (
    <>
      <div className='flex gap-2.5 items-center'>
        <Divider orientation='vertical' height='sm' />
        <Divider orientation='vertical' height='md' />
        <Divider orientation='vertical' height='lg' />
      </div>
    </>
  )
};

export const VerticalLight: Story = {
  render: () => (
    <>
      <div className='flex gap-2.5 items-center'>
        <Divider orientation='vertical' height='sm' verticalColor='bg-gray-dark-100' />
        <Divider orientation='vertical' height='md' verticalColor='bg-gray-dark-100' />
        <Divider orientation='vertical' height='lg' verticalColor='bg-gray-dark-100' />
      </div>
    </>
  )
};

export const VerticalDark: Story = {
  render: () => (
    <>
      <div className='flex gap-2.5 items-center justify-center w-96 bg-amber-50 py-3 px-8'>
        <Divider orientation='vertical' height='sm' verticalColor='bg-gray-dark-900' />
        <Divider orientation='vertical' height='md' verticalColor='bg-gray-dark-900' />
        <Divider orientation='vertical' height='lg' verticalColor='bg-gray-dark-900' />
      </div>
    </>
  )
};
