import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { Calendar } from './index';

/**
 * ## DESCRIPTION
 * The Calendar component is a versatile, accessible date picker for React.
 * It supports a wide range of visual and functional props, including dark mode, variants, border radius, sizes, and more.
 *
 * ## FEATURES
 * - **Date Selection**: Click any available date to select it.
 * - **Disabled Dates**: Prevent selection of specific dates via the `disabledDates` array.
 * - **Min/Max Date**: Limit selectable dates with `minDate` and `maxDate` props.
 * - **Read-Only/Disabled**: Make the calendar read-only (`readOnly`) or fully disabled (`disabled`).
 * - **Current Date Highlighting**: The current date is visually highlighted.
 * - **Month/Year Navigation**: Navigate months/years using custom dropdown selectors (Radix UI based).
 * - **Variants**: Choose between `filled`, `outlined`, `soft`, and `ghost` visual styles.
 * - **Sizes & Radius**: Control size (`sm`, `md`, `lg`) and border radius (`none`, `sm`, `md`, `lg`, or number).
 * - **Show/Hide**: Animate calendar visibility with the `show` prop.
 * - **Accessibility**: ARIA roles, keyboard navigation, and color contrast are supported. See note below for known limitations.
 * - **Dark Mode**: Automatic dark mode support using Tailwind's `dark:` classes.
 *
 * ## USAGE
 *
 * ### Basic Example
 * ```tsx
 * <Calendar selectedDate={new Date()} onDateChange={handleDateChange} />
 * ```
 *
 * ### All Props
 * ```tsx
 * <Calendar
 *   selectedDate={new Date()}
 *   onDateChange={handleDateChange}
 *   disabledDates={[new Date(2024, 0, 15)]}
 *   minDate={new Date(2024, 0, 10)}
 *   maxDate={new Date(2024, 0, 25)}
 *   variant="outlined"
 *   size="lg"
 *   radius="md"
 *   show={true}
 *   disabled={false}
 *   readOnly={false}
 * />
 * ```
 *
 * ### Prop Reference
 * - `selectedDate: Date | null` — The currently selected date.
 * - `onDateChange: (date: Date) => void` — Callback when a date is selected.
 * - `disabledDates: Date[]` — Array of dates to disable.
 * - `minDate: Date` — Minimum selectable date.
 * - `maxDate: Date` — Maximum selectable date.
 * - `variant: 'filled' | 'outlined' | 'soft' | 'ghost'` — Visual style.
 * - `size: 'sm' | 'md' | 'lg'` — Calendar size.
 * - `radius: 'none' | 'sm' | 'md' | 'lg' | number` — Border radius.
 * - `show: boolean` — Show/hide the calendar with animation.
 * - `disabled: boolean` — Disables all interaction and selection.
 * - `readOnly: boolean` — Makes the calendar read-only (dates visible, not selectable).
 *
 * ## ACCESSIBILITY
 * - Uses ARIA roles (`application`, `grid`, `gridcell`, etc.) and keyboard navigation.
 * - Color contrast is ensured for all states (selected, disabled, out-of-month, etc.).
 * - **Known limitation:** The Dropdown component (Radix UI) used for month/year selectors may inject `aria-expanded` on elements with role="row" or `<tr>`, which is not allowed by the ARIA spec and may trigger accessibility linter errors. This cannot be fixed from the Calendar component.
 *
 * ## STORYBOOK CONTROLS
 * All props are available as Storybook controls for live editing and testing.
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
    },
    show: {
      control: { type: 'boolean' },
      description: 'Show or hide the calendar with animation.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    minDate: {
      control: 'date',
      description: 'The minimum selectable date. Dates before this will be disabled.',
      table: {
        type: { summary: 'Date' },
        defaultValue: { summary: 'undefined' }
      }
    },
    maxDate: {
      control: 'date',
      description: 'The maximum selectable date. Dates after this will be disabled.',
      table: {
        type: { summary: 'Date' },
        defaultValue: { summary: 'undefined' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all interaction and selection in the calendar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the calendar read-only (dates are visible but cannot be selected).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
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
 * - **Disabled Calendar**: All dates are disabled and cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  }
};

/**
 * - **Read-Only Calendar**: Dates are visible but cannot be selected.
 */
export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true
  }
};

/**
 * - **With Min/Max Date**: Calendar with a minimum and maximum selectable date.
 *   Dates outside this range are disabled and cannot be selected.
 */
export const WithMinMaxDate: Story = {
  args: {
    ...Default.args,
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), 25)
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
