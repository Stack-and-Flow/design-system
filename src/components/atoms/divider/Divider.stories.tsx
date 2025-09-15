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
  args: {}
};

/**
 * In the horizontal orientation, we have 5 sizes: XS, SM, MD, LG, and full.
 */

export const HorizontalSize: Story = {
  render: () => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
      <Divider orientation='horizontal' lengthX='xs' />
      <Divider orientation='horizontal' lengthX='sm' />
      <Divider orientation='horizontal' lengthX='md' />
      <Divider orientation='horizontal' lengthX='lg' />
      <Divider orientation='horizontal' lengthX='xl' />
    </div>
  )
};
/**
 * Vertically, there are three measurements: SM, MD, and LG.
 */
export const VerticalSize: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <Divider orientation='vertical' lengthY='xs' />
      <Divider orientation='vertical' lengthY='sm' />
      <Divider orientation='vertical' lengthY='md' />
    </div>
  )
};

/**
 * In both orientations, we have four thicknesses.
 */
export const Thickness: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <Divider orientation='vertical' thickness='xs' />
      <Divider orientation='vertical' thickness='sm' />
      <Divider orientation='vertical' thickness='md' />
      <Divider orientation='vertical' thickness='lg' />
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
      <Divider orientation='horizontal' color='bg-blue' />
      <Divider orientation='horizontal' color='bg-indigo' />
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
