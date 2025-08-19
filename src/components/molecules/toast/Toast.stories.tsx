import type { Meta, StoryObj } from '@storybook/react';
import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    name: 'Default Name'
  }
};
