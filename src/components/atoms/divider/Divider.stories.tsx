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
    horizontalWidth: 'sm',
    verticalHeight: 'sm',
    colors: 'primary'
  }
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Divider horizontalWidth='xs' />
      <Divider horizontalWidth='sm' />
      <Divider horizontalWidth='md' />
      <Divider horizontalWidth='lg' />
      <Divider horizontalWidth='xl' />
    </div>
  )
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Divider orientation='vertical' verticalHeight='sm' />
      <Divider orientation='vertical' verticalHeight='md' />
      <Divider orientation='vertical' verticalHeight='lg' />
    </div>
  )
};

export const ColorsHorizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Divider horizontalWidth='xs' colors='primary' />
      <Divider horizontalWidth='sm' colors='light' />
      <Divider horizontalWidth='md' colors='dark' />
      <Divider horizontalWidth='lg' colors='success' />
      <Divider horizontalWidth='xl' colors='info' />
    </div>
  )
};

/* 
export const Dark: Story = {
  render: () => (
    <div>
      <Divider width='sm' horizontalColor='text-gray-dark-100' />
      <Divider width='md' horizontalColor='text-gray-dark-100' />
      <Divider width='lg' horizontalColor='text-gray-dark-100' />
    </div>
  )
}; */
/* 
export const Light: Story = {
  render: () => (
    <div className='bg-amber-50 py-3 px-8'>
      <Divider width='sm' horizontalColor='text-gray-dark-900' />
      <Divider width='md' horizontalColor='text-gray-dark-900' />
      <Divider width='lg' horizontalColor='text-gray-dark-900' />
    </div>
  )
}; */
/* 
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
 */
