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
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Divider orientation='horizontal' size='xs' />
      <Divider orientation='horizontal' size='sm' />
      <Divider orientation='horizontal' size='md' />
      <Divider orientation='horizontal' size='lg' />
      <Divider orientation='horizontal' size='xl' />
    </div>
  )
};
/**
 * We also offer five sizes in vertical: XS, SM, MD, LG, and full.
 */
export const VerticalSize: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
      <Divider orientation='vertical' size='xs' />
      <Divider orientation='vertical' size='sm' />
      <Divider orientation='vertical' size='md' />
      <Divider orientation='vertical' size='lg' />
      <Divider orientation='vertical' size='xl' />
    </div>
  )
};

/**
 * In both orientations, we have four thicknesses.
 */
export const ThicknessHorizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
      <Divider orientation='horizontal' thickness='xs' />
      <Divider orientation='horizontal' thickness='sm' />
      <Divider orientation='horizontal' thickness='md' />
      <Divider orientation='horizontal' thickness='lg' />
    </div>
  )
};

/**
 * In both orientations, we have four thicknesses.
 */
export const ThicknessVertical: Story = {
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
      <Divider orientation='horizontal' size='md' color='bg-color-primary' />
      <Divider orientation='horizontal' size='md' color='bg-color-blue' />
      <Divider orientation='horizontal' size='md' color='bg-color-indigo' />
    </div>
  )
};

/**
 * We can give it more stylish corners
 */
export const Corner: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}
    >
      <Divider orientation='horizontal' size='lg' thickness='md' corner='none' />
      <Divider orientation='horizontal' size='lg' thickness='md' corner='rounded' />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Divider orientation='vertical' size='lg' thickness='lg' corner='none' />
        <Divider orientation='vertical' size='lg' thickness='lg' corner='rounded' />
      </div>
    </div>
  )
};
