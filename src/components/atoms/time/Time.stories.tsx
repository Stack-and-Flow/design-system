import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import Time from './Time';

/**
 * A time input component with individually editable segments (hour, minute, optional second).
 * Segments are keyboard-navigable and support arrow key increment/decrement.
 * Includes stepper buttons for pointer-based control.
 * Supports 12h/24h formats, all Input variants, hint states, and rounded style.
 */
const meta: Meta<typeof Time> = {
  title: 'Atoms/Time',
  component: Time,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Time>;

/**
 * Default time component with hour and minute segments.
 */
export const Default: Story = {
  args: {
    id: 'time-default',
    label: 'Time',
    onChange: action('time-change')
  }
};

/**
 * Time component without a visible label.
 */
export const WithoutLabel: Story = {
  args: {
    ...Default.args,
    id: 'time-no-label',
    label: undefined
  }
};

/**
 * Time component with disabled state.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    id: 'time-disabled',
    disabled: true
  }
};

/**
 * Time component with required indicator.
 */
export const Required: Story = {
  args: {
    ...Default.args,
    id: 'time-required',
    isRequired: true
  }
};

/**
 * Time component with info hint message.
 */
export const WithHintInfo: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-info',
    hint: { type: 'info', message: 'Enter the start time for the event' }
  }
};

/**
 * Time component with error hint message.
 */
export const WithHintError: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-error',
    hint: { type: 'error', message: 'Please enter a valid time' }
  }
};

/**
 * Time component with warning hint message.
 */
export const WithHintWarning: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-warning',
    hint: { type: 'warning', message: 'This time slot may conflict with another event' }
  }
};

/**
 * Time component with success hint message.
 */
export const WithHintSuccess: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-success',
    hint: { type: 'success', message: 'Time slot is available' }
  }
};

/**
 * Time component with bordered variant.
 */
export const BorderedVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-bordered',
    variant: 'bordered'
  }
};

/**
 * Time component with underlined variant.
 */
export const UnderlinedVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-underlined',
    variant: 'underlined'
  }
};

/**
 * Time component with line variant.
 */
export const LineVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-line',
    variant: 'line'
  }
};

/**
 * Time component with rounded style.
 */
export const Rounded: Story = {
  args: {
    ...Default.args,
    id: 'time-rounded',
    rounded: true
  }
};

/**
 * Time component with different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Time id='time-size-sm' label='Small' size='sm' onChange={action('small change')} />
      <Time id='time-size-md' label='Medium' size='md' onChange={action('medium change')} />
      <Time id='time-size-lg' label='Large' size='lg' onChange={action('large change')} />
    </div>
  )
};

/**
 * Time component with seconds granularity.
 */
export const WithSeconds: Story = {
  args: {
    ...Default.args,
    id: 'time-seconds',
    granularity: 'second',
    hint: { type: 'info', message: 'Includes hour, minute, and second segments' }
  }
};

/**
 * Time component in 12-hour format with AM/PM segment.
 */
export const TwelveHourFormat: Story = {
  args: {
    ...Default.args,
    id: 'time-12h',
    hourCycle: 12,
    hint: { type: 'info', message: '12-hour format with AM/PM segment' }
  }
};

/**
 * Time component with clock icon.
 */
export const WithClockIcon: Story = {
  args: {
    ...Default.args,
    id: 'time-clock-icon',
    showClockIcon: true
  }
};

/**
 * Time component with full width.
 */
export const FullWidth: Story = {
  args: {
    ...Default.args,
    id: 'time-fullwidth',
    isFullWidth: true
  }
};

/**
 * Time component with stepper buttons.
 */
export const WithSteppers: Story = {
  args: {
    ...Default.args,
    id: 'time-steppers',
    showSteppers: true,
    hint: { type: 'info', message: 'Use the arrows or keyboard to adjust the time' }
  }
};

/**
 * Time component with combined states.
 */
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
