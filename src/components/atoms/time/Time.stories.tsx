import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import Time from './Time';

const meta: Meta<typeof Time> = {
  title: 'Atoms/Time',
  component: Time,
  parameters: {
    docs: {
      autodocs: true,
      description: {
        component:
          'A time input component with individually editable segments (hour, minute, optional second). ' +
          'Segments are keyboard-navigable and support arrow key increment/decrement. ' +
          'Includes stepper buttons for pointer-based control. ' +
          'Supports 12h/24h formats, all Input variants, hint states, and rounded style.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Time>;

export const Default: Story = {
  args: {
    id: 'time-default',
    label: 'Time',
    onChange: action('time-change')
  }
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    id: 'time-disabled',
    disabled: true
  }
};

export const Required: Story = {
  args: {
    ...Default.args,
    id: 'time-required',
    isRequired: true
  }
};

export const WithHintInfo: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-info',
    hint: { type: 'info', message: 'Enter the start time for the event' }
  }
};

export const WithHintError: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-error',
    hint: { type: 'error', message: 'Please enter a valid time' }
  }
};

export const WithHintWarning: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-warning',
    hint: { type: 'warning', message: 'This time slot may conflict with another event' }
  }
};

export const WithHintSuccess: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-success',
    hint: { type: 'success', message: 'Time slot is available' }
  }
};

export const BorderedVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-bordered',
    variant: 'bordered'
  }
};

export const UnderlinedVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-underlined',
    variant: 'underlined'
  }
};

export const LineVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-line',
    variant: 'line'
  }
};

export const Rounded: Story = {
  args: {
    ...Default.args,
    id: 'time-rounded',
    rounded: true
  }
};

export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Time id='time-size-sm' label='Small' size='sm' onChange={action('small change')} />
      <Time id='time-size-md' label='Medium' size='md' onChange={action('medium change')} />
      <Time id='time-size-lg' label='Large' size='lg' onChange={action('large change')} />
    </div>
  )
};

export const WithSeconds: Story = {
  args: {
    ...Default.args,
    id: 'time-seconds',
    granularity: 'second',
    hint: { type: 'info', message: 'Includes hour, minute, and second segments' }
  }
};

export const TwelveHourFormat: Story = {
  args: {
    ...Default.args,
    id: 'time-12h',
    hourCycle: 12,
    hint: { type: 'info', message: '12-hour format with AM/PM segment' }
  }
};

export const WithClockIcon: Story = {
  args: {
    ...Default.args,
    id: 'time-clock-icon',
    showClockIcon: true
  }
};

export const FullWidth: Story = {
  args: {
    ...Default.args,
    id: 'time-fullwidth',
    isFullWidth: true
  }
};

export const WithSteppers: Story = {
  args: {
    ...Default.args,
    id: 'time-steppers',
    showSteppers: true,
    hint: { type: 'info', message: 'Use the arrows or keyboard to adjust the time' }
  }
};

export const CombinedStates: Story = {
  args: {
    ...Default.args,
    id: 'time-combined',
    label: 'Meeting Time',
    variant: 'bordered',
    size: 'md',
    isRequired: true,
    showSteppers: true,
    showClockIcon: true
  }
};
