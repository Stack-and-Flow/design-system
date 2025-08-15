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
    colorsX: 'primary'
  }
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Divider orientation='horizontal' sizeWidth='lg' />
    </div>
  )
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Divider orientation='vertical' sizeWidth='sm' />
    </div>
  )
};

export const colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Divider orientation='horizontal' colorsX='primary' />
      <Divider orientation='horizontal' colorsX='secondary' />
      <Divider orientation='horizontal' colorsX='info' />
      <Divider orientation='horizontal' colorsX='success' />
      <Divider orientation='horizontal' colorsX='primaryDegrade' />
      <Divider orientation='horizontal' colorsX='secondaryDegrade' />
    </div>
  )
};

export const colorsshadow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Divider orientation='horizontal' shadow={true} colorsX='primaryDegrade' />
      <Divider orientation='horizontal' colorsX='primaryDegrade' />
    </div>
  )
};

export const animation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Divider orientation='horizontal' animated='pulse' />
      <Divider orientation='horizontal' animated='ping' />
      <Divider orientation='horizontal' animated='bounce' />
      <Divider orientation='horizontal' />
    </div>
  )
};
