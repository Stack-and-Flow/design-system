import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TimeInput from './TimeInput';

const meta: Meta<typeof TimeInput> = {
  title: 'Atoms/TimeInput',
  component: TimeInput,
  parameters: {
    docs: { autodocs: true }
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    variant: { control: 'select', options: ['regular', 'underlined', 'line', 'bordered'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    format: { control: 'select', options: ['12h', '24h'] },
    showUnits: { control: 'multi-select', options: ['hours', 'minutes', 'seconds'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    showClockIcon: { control: 'boolean' },
    showTimezone: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    rounded: { control: 'boolean' },
    isFullWidth: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<typeof TimeInput>;

// Basic examples
export const DefaultTimeInput: Story = {
  args: {
    id: 'default-time',
    label: 'Select time',
    showUnits: ['hours', 'minutes'],
    format: '24h'
  }
};

export const TwelveHourFormat: Story = {
  args: {
    id: 'twelve-hour',
    label: '12 Hour Format',
    format: '12h',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T15:30:00')
  }
};

export const WithSeconds: Story = {
  args: {
    id: 'with-seconds',
    label: 'Time with seconds',
    showUnits: ['hours', 'minutes', 'seconds'],
    defaultValue: new Date('2024-01-01T14:30:45')
  }
};

export const OnlyHours: Story = {
  args: {
    id: 'only-hours',
    label: 'Hours only',
    showUnits: ['hours'],
    format: '24h'
  }
};

export const MinutesAndSeconds: Story = {
  args: {
    id: 'minutes-seconds',
    label: 'Minutes and seconds',
    showUnits: ['minutes', 'seconds'],
    defaultValue: new Date('2024-01-01T00:30:45')
  }
};

// Controlled vs Uncontrolled
export const UncontrolledPicker: Story = {
  args: {
    id: 'uncontrolled',
    label: 'Uncontrolled picker',
    defaultValue: new Date('2024-01-01T15:30:00'),
    showUnits: ['hours', 'minutes'],
    format: '24h'
  }
};

export const ControlledPicker: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | null>(new Date('2024-01-01T15:30:00'));

    return <TimeInput {...args} value={value} onChange={(newValue) => setValue(newValue)} />;
  },
  args: {
    id: 'controlled',
    label: 'Controlled picker',
    showUnits: ['hours', 'minutes'],
    format: '24h'
  }
};

// Label positions
export const LabelInside: Story = {
  args: {
    id: 'label-inside',
    label: 'Label inside',
    labelPosition: 'inside',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T09:15:00')
  }
};

export const LabelOutside: Story = {
  args: {
    id: 'label-outside',
    label: 'Label outside',
    labelPosition: 'outside',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T09:15:00')
  }
};

export const LabelOutsideLeft: Story = {
  args: {
    id: 'label-outside-left',
    label: 'Label outside left',
    labelPosition: 'outside-left',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T09:15:00')
  }
};

// Variants
export const UnderlinedVariant: Story = {
  args: {
    id: 'underlined',
    label: 'Underlined variant',
    variant: 'underlined',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T10:30:00')
  }
};

export const LineVariant: Story = {
  args: {
    id: 'line',
    label: 'Line variant',
    variant: 'line',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T10:30:00')
  }
};

export const BorderedVariant: Story = {
  args: {
    id: 'bordered',
    label: 'Bordered variant',
    variant: 'bordered',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T10:30:00')
  }
};

// Sizes
export const SmallSize: Story = {
  args: {
    id: 'small',
    label: 'Small size',
    size: 'sm',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T08:45:00')
  }
};

export const LargeSize: Story = {
  args: {
    id: 'large',
    label: 'Large size',
    size: 'lg',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T08:45:00')
  }
};

// States
export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Disabled',
    disabled: true,
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T12:00:00')
  }
};

export const ReadOnly: Story = {
  args: {
    id: 'readonly',
    label: 'Read only',
    readOnly: true,
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T12:00:00')
  }
};

export const Required: Story = {
  args: {
    id: 'required',
    label: 'Required field',
    isRequired: true,
    showUnits: ['hours', 'minutes']
  }
};

// With clock icon
export const WithClockIcon: Story = {
  args: {
    id: 'with-clock',
    label: 'With clock icon',
    showClockIcon: true,
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T16:20:00')
  }
};

// With timezone
export const WithTimezone: Story = {
  args: {
    id: 'with-timezone',
    label: 'With timezone',
    showTimezone: true,
    timezones: ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Europe/Madrid'],
    defaultTimezone: 'Europe/Madrid',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T15:30:00')
  }
};

// With description
export const WithDescription: Story = {
  args: {
    id: 'with-description',
    label: 'Meeting time',
    description: 'Select the time for your meeting',
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T14:00:00')
  }
};

// With errors
export const WithError: Story = {
  args: {
    id: 'with-error',
    label: 'Time with error',
    hint: { message: 'Please select a valid time', type: 'error' },
    showUnits: ['hours', 'minutes']
  }
};

export const WithWarning: Story = {
  args: {
    id: 'with-warning',
    label: 'Time with warning',
    hint: { message: 'This time is outside business hours', type: 'warning' },
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T22:00:00')
  }
};

export const WithSuccess: Story = {
  args: {
    id: 'with-success',
    label: 'Time with success',
    hint: { message: 'Perfect time selected!', type: 'success' },
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T14:30:00')
  }
};

// Time range constraints
export const WithTimeRange: Story = {
  args: {
    id: 'with-range',
    label: 'Business hours (9 AM - 5 PM)',
    timeRange: {
      minHour: 9,
      maxHour: 17
    },
    showUnits: ['hours', 'minutes'],
    hint: { message: 'Only business hours are allowed', type: 'info' }
  }
};

// Full width
export const FullWidth: Story = {
  args: {
    id: 'full-width',
    label: 'Full width',
    isFullWidth: true,
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T11:45:00')
  }
};

// Rounded
export const Rounded: Story = {
  args: {
    id: 'rounded',
    label: 'Rounded',
    rounded: true,
    showUnits: ['hours', 'minutes'],
    defaultValue: new Date('2024-01-01T13:20:00')
  }
};

// Complex example with all features
export const FullFeatured: Story = {
  args: {
    id: 'full-featured',
    label: 'Full featured time input',
    labelPosition: 'outside',
    variant: 'bordered',
    size: 'lg',
    format: '12h',
    showUnits: ['hours', 'minutes', 'seconds'],
    showClockIcon: true,
    showTimezone: true,
    timezones: ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Europe/Madrid'],
    defaultTimezone: 'Europe/Madrid',
    timeRange: {
      minHour: 8,
      maxHour: 18
    },
    description: 'Select a time between 8 AM and 6 PM',
    hint: { message: 'Business hours only', type: 'info' },
    defaultValue: new Date('2024-01-01T14:30:45')
  }
};
