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
    color: 'primary',
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
 * We have 4 colours in any orientation.
 */

export const HorizontalColor: Story = {
  render: () => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
      <Divider orientation='horizontal' color='primary' />
      <Divider orientation='horizontal' color='secondary' />
      <Divider orientation='horizontal' color='success' />
      <Divider orientation='horizontal' color='warning' />
    </div>
  )
};

export const VerticalColor: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <Divider orientation='vertical' color='primary' />
      <Divider orientation='vertical' color='secondary' />
      <Divider orientation='vertical' color='success' />
      <Divider orientation='vertical' color='warning' />
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

/**
 * In the animation, we have created two different ones, ‘kitt’ and “border”. The first one recalls a great effect such as the well-known ‘kitt’, 🚗 the fantastic car.
 */

export const animation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
      <Divider orientation='horizontal' animation='kitt' />
      <Divider orientation='horizontal' animation='border' />
    </div>
  )
};
