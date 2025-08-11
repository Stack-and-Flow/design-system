import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { Calendar } from './index';

/**
 * ## DESCRIPTION
 * The Calendar component is a versatile date picker that allows users to select dates from a calendar interface.
 * It supports various configurations, including disabled dates, default selected dates, and custom date change handlers.
 * The component is designed to be accessible and customizable, making it suitable for a wide range of use cases.
 *
 * ## FEATURES
 * - **Date Selection**: Click on any available date to select it
 * - **Disabled Dates**: Prevent selection of specific dates by passing them in the `disabledDates` array
 * - **Current Date Highlighting**: The current date is visually highlighted in the calendar
 * - **Month Navigation**: Navigate between months using the previous/next buttons
 * - **Responsive Design**: Adapts to different screen sizes and containers
 *
 * ## USAGE
 * The Calendar component accepts the following main props:
 *
 * ### selectedDate
 * The currently selected date. Can be `null` if no date is selected.
 * ```tsx
 * <Calendar selectedDate={new Date()} onDateChange={handleDateChange} />
 * ```
 *
 * ### onDateChange
 * Callback function that is called when a date is selected.
 * ```tsx
 * const handleDateChange = (date: Date) => {
 *   console.log('Selected date:', date);
 * };
 * ```
 *
 * ### disabledDates
 * Array of dates that should be disabled and cannot be selected.
 * ```tsx
 * const disabledDates = [
 *   new Date(2024, 0, 15), // January 15, 2024
 *   new Date(2024, 0, 20)  // January 20, 2024
 * ];
 * <Calendar disabledDates={disabledDates} onDateChange={handleDateChange} />
 * ```
 *
 */
const meta: Meta<typeof Calendar> = {
  title: 'Atoms/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      autodocs: true
    },
    layout: 'centered'
  },
  tags: ['autodocs'],
  render: (args: React.ComponentProps<typeof Calendar>) => <Calendar {...args} />,
  argTypes: {
    selectedDate: {
      control: 'date',
      description: 'The currently selected date in the calendar.',
      table: {
        type: { summary: 'Date | null' },
        defaultValue: { summary: 'null' }
      }
    },
    onDateChange: {
      action: 'dateChanged',
      description: 'Callback that executes when the selected date changes.',
      table: {
        type: { summary: '(date: Date) => void' }
      }
    },
    disabledDates: {
      control: 'object',
      description: 'Array of dates that should be disabled.',
      table: {
        type: { summary: 'Date[]' },
        defaultValue: { summary: '[]' }
      }
    },
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
      description: 'Color theme of the calendar (light or dark).',
      table: {
        type: { summary: '"light" | "dark"' },
        defaultValue: { summary: 'light' }
      }
    },
    variant: {
      control: { type: 'radio' },
      options: ['filled', 'outlined'],
      description: 'Visual variant of the calendar (filled or outlined).',
      table: {
        type: { summary: '"filled" | "outlined"' },
        defaultValue: { summary: 'filled' }
      }
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the calendar (small, medium, large).',
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: 'md' }
      }
    },
    radius: {
      control: { type: 'radio' },
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Border radius of the calendar.',
      table: {
        type: { summary: '"none" | "sm" | "md" | "lg" | number' },
        defaultValue: { summary: 'md' }
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Calendar>;

/**
 * - **Default Calendar**: A basic calendar with no date selected and all dates enabled.
 */
export const Default: Story = {
  args: {
    selectedDate: null,
    onDateChange: (date: Date) => console.log('Date changed:', date)
  }
};
/**
 * - **Dark Mode**: Calendar with dark theme.
 */
export const DarkMode: Story = {
  args: {
    ...Default.args,
    theme: 'dark'
  }
};

/**
 * - **Outlined Variant**: Calendar with outlined variant.
 */
export const Outlined: Story = {
  args: {
    ...Default.args,
    variant: 'outlined'
  }
};

/**
 * - **Sizes**: Calendar in small, medium, and large sizes.
 */
export const Small: Story = {
  args: {
    ...Default.args,
    size: 'sm'
  }
};

export const Medium: Story = {
  args: {
    ...Default.args,
    size: 'md'
  }
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg'
  }
};

/**
 * - **Border Radius**: Calendar with different border radius options.
 */
export const RadiusNone: Story = {
  args: {
    ...Default.args,
    radius: 'none'
  }
};

export const RadiusSm: Story = {
  args: {
    ...Default.args,
    radius: 'sm'
  }
};

export const RadiusMd: Story = {
  args: {
    ...Default.args,
    radius: 'md'
  }
};

export const RadiusLg: Story = {
  args: {
    ...Default.args,
    radius: 'lg'
  }
};

/**
 * - **With Selected Date**: A calendar with a pre-selected date (15th of current month).
 *   This shows how the calendar looks when a date is already selected.
 */
export const WithSelectedDate: Story = {
  args: {
    ...Default.args,
    selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15)
  }
};

/**
 * - **With Disabled Dates**: A calendar with certain dates disabled (10th and 20th of current month).
 *   Disabled dates cannot be selected and are visually distinct.
 */
export const WithDisabledDates: Story = {
  args: {
    ...Default.args,
    disabledDates: [new Date(new Date().setDate(10)), new Date(new Date().setDate(20))]
  }
};

/**
 * - **Selected Date with Disabled Dates**: Combines both selected date and disabled dates functionality.
 *   Shows how the calendar handles both features simultaneously.
 */
export const WithSelectedAndDisabledDates: Story = {
  args: {
    selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    onDateChange: (date: Date) => console.log('Date changed:', date),
    disabledDates: [new Date(new Date().setDate(10)), new Date(new Date().setDate(20))]
  }
};

/**
 * - **Past Date Selected**: A calendar with a date from the past selected (January 15, 2024).
 *   Useful for testing historical date selection and display.
 */
export const WithPastSelectedDate: Story = {
  args: {
    ...Default.args,
    selectedDate: new Date(2024, 0, 15)
  }
};

/**
 * - **Multiple Disabled Dates**: A calendar with multiple disabled dates throughout the month.
 *   Demonstrates how the calendar handles a larger set of disabled dates.
 */
export const WithMultipleDisabledDates: Story = {
  render: () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const disabledDates = [
      new Date(currentYear, currentMonth, 5),
      new Date(currentYear, currentMonth, 12),
      new Date(currentYear, currentMonth, 18),
      new Date(currentYear, currentMonth, 25)
    ];

    return (
      <Calendar
        selectedDate={null}
        onDateChange={(date: Date) => console.log('Date changed:', date)}
        disabledDates={disabledDates}
      />
    );
  }
};
