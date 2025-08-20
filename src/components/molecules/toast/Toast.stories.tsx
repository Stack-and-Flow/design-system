import Button from '@/components/atoms/button/Button.tsx';
import type { Meta, StoryObj } from '@storybook/react';
import Toast from './ToastItem';
import { Toaster } from './Toaster';
import { toast } from './toast';

const meta: Meta<typeof Toast> = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-screen h-screen'>
        <Toaster duration={5000} />
        <Story />
      </div>
    )
  ]
};
export default meta;

type Story = StoryObj<typeof Toast>;

/**
 * - Default variant is `default`.
 */
export const Default: Story = {
  render: () => <Button text='Show toast' onClick={() => toast('Hello, world!')} />
};

/**
 * - Success variant is `success`.
 */
export const Success: Story = {
  render: () => <Button text='Show toast' onClick={() => toast.success('Hello, world!')} />
};
