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
    orientation: 'horizontal',
    color: 'bg-primary',
    sizeWidth: 'lg'
  }
};

/**
 * In the horizontal orientation, we have 5 sizes: XS, SM, MD, LG, and full.
 */

export const HorizontalSize: Story = {
  render: () => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
      <Divider orientation='horizontal' sizeWidth='xs' />
      <Divider orientation='horizontal' sizeWidth='sm' />
      <Divider orientation='horizontal' sizeWidth='md' />
      <Divider orientation='horizontal' sizeWidth='lg' />
      <Divider orientation='horizontal' sizeWidth='full' />
    </div>
  )
};

/**
 * Vertically, there are three measurements: SM, MD, and LG.
 */
export const VerticalSize: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <Divider orientation='vertical' sizeHeight='sm' />
      <Divider orientation='vertical' sizeHeight='md' />
      <Divider orientation='vertical' sizeHeight='lg' />
    </div>
  )
};

/**
 * You can customise the colour of the line with a class name.
 */
export const Color: Story = {
  render: () => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
      <Divider orientation='horizontal' color='bg-primary' />
    </div>
  )
};

/**
 * There are two hover effects: ‘bright’ and ‘zoom’.
 */
export const Hover: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
      <Divider orientation='horizontal' hover='bright' />
      <Divider orientation='horizontal' hover='zoom' />
    </div>
  )
};
