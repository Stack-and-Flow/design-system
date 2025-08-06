import type { Meta, StoryObj } from '@storybook/react';
import Switch from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Switch label',
    size: 'md',
    color: 'secondary',
    variant: 'default',
    labelPlacement: 'right',
    rounded: true,
    withIcon: false,
    thumbIcon: false
  }
};
