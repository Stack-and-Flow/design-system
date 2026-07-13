import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Time } from './Time';

/**
 * ## Description
 * A high-fidelity, segmented time input component that allows users to edit hours, minutes, and optional seconds individually.
 *
 * ## Dependencies
 * Consumes the `useTime` hook for segment layout and Keyboard accessibility, and `Icon` for decorators and stepper button controls.
 *
 * ## Usage Guide
 * Use the arrow keys (`ArrowUp`/`ArrowDown`) or mouse scroll/buttons to cycle through values. Use `ArrowLeft`/`ArrowRight` to transition focus between segments. Use the `hourCycle` prop to toggle between 12-hour format with AM/PM and standard 24-hour format.
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
 * Demonstrates the default time component with hour and minute segments to showcase the basic interactive states and structure.
 */
export const Default: Story = {
  args: {
    id: 'time-default',
    label: 'Time',
    onChange: action('time-change')
  }
};

/**
 * Illustrates the time component rendered without a visible label for self-contained layouts or compact UI contexts.
 */
export const WithoutLabel: Story = {
  args: {
    ...Default.args,
    id: 'time-no-label',
    label: undefined
  }
};

/**
 * Shows the time component in a completely disabled state, verifying that segment selection and pointer events are blocked.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    id: 'time-disabled',
    disabled: true
  }
};

/**
 * Highlights a mandatory field scenario using the required indicator asterisk beside the label text.
 */
export const Required: Story = {
  args: {
    ...Default.args,
    id: 'time-required',
    isRequired: true
  }
};

/**
 * Shows how supportive hint text and icons are styled for informational contextual messages.
 */
export const WithHintInfo: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-info',
    hint: { type: 'info', message: 'Enter the start time for the event' }
  }
};

/**
 * Validates the error validation feedback layout and color geometry when an invalid input is entered.
 */
export const WithHintError: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-error',
    hint: { type: 'error', message: 'Please enter a valid time' }
  }
};

/**
 * Showcases the warning hint variant to notify users of non-blocking scheduling warnings or slots conflict.
 */
export const WithHintWarning: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-warning',
    hint: { type: 'warning', message: 'This time slot may conflict with another event' }
  }
};

/**
 * Verifies the success indicator state when the chosen time slot passes business rules validation.
 */
export const WithHintSuccess: Story = {
  args: {
    ...Default.args,
    id: 'time-hint-success',
    hint: { type: 'success', message: 'Time slot is available' }
  }
};

/**
 * Shows the bordered variant layout for applications needing higher contrast border definitions.
 */
export const BorderedVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-bordered',
    variant: 'bordered'
  }
};

/**
 * Shows the underlined variant to support classic minimalist web-form styles.
 */
export const UnderlinedVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-underlined',
    variant: 'underlined'
  }
};

/**
 * Demonstrates a bottom-bordered style that matches line-variant design system themes.
 */
export const LineVariant: Story = {
  args: {
    ...Default.args,
    id: 'time-line',
    variant: 'line'
  }
};

/**
 * Demonstrates the pill-rounded geometry variant for modern fluid layouts.
 */
export const Rounded: Story = {
  args: {
    ...Default.args,
    id: 'time-rounded',
    rounded: true
  }
};

/**
 * Compares the scale of the component across small, medium, and large field sizes.
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
 * Demonstrates full precision temporal inputs including seconds granularity.
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
 * Illustrates 12-hour AM/PM format support, ensuring proper selection/navigation boundaries.
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
 * Includes a decorative clock adornment inside the input's start content area.
 */
export const WithClockIcon: Story = {
  args: {
    ...Default.args,
    id: 'time-clock-icon',
    showClockIcon: true
  }
};

/**
 * Displays the component stretched to 100% width, ideal for full-width grid layouts.
 */
export const FullWidth: Story = {
  args: {
    ...Default.args,
    id: 'time-fullwidth',
    isFullWidth: true
  }
};

/**
 * Features increment/decrement side steppers to offer standard mouse click adjustments.
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
 * Synthesizes multiple layout properties, labels, and adornments into a complex composite form field configuration.
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
