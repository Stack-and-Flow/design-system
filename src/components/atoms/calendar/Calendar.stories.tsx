import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './index';

/**
 * ## Calendar
 *
 * A highly customizable, accessible calendar/date picker component for React.
 *
 * ### Features
 * - Date selection with visual feedback
 * - Month/year picker with two-column HeroUI-style dropdown
 * - Dark mode and multiple visual variants
 * - Customizable size and border radius
 * - Min/max and disabled dates
 * - Read-only and disabled modes
 * - Full keyboard and screen reader accessibility
 *
 * ### Usage
 * ```tsx
 * <Calendar selectedDate={new Date()} onDateChange={handleDateChange} />
 * ```
 *
 * ### Props
 * - `selectedDate: Date | null` — The currently selected date
 * - `onDateChange: (date: Date) => void` — Callback when a date is selected
 * - `disabledDates?: Date[]` — Array of dates to disable
 * - `minDate?: Date` — Minimum selectable date
 * - `maxDate?: Date` — Maximum selectable date
 * - `variant?: 'filled' | 'outlined' | 'soft' | 'ghost'` — Visual style
 * - `size?: 'sm' | 'md' | 'lg'` — Calendar size
 * - `radius?: 'none' | 'sm' | 'md' | 'lg' | number` — Border radius
 * - `show?: boolean` — Show/hide the calendar with animation
 * - `disabled?: boolean` — Disables all interaction and selection
 * - `readOnly?: boolean` — Makes the calendar read-only (dates visible, not selectable)
 *
 * ### Accessibility
 * - Uses ARIA roles and keyboard navigation
 * - Color contrast for all states
 * - Month/year picker is fully contained and accessible
 */
const meta: Meta<typeof Calendar> = {
  title: 'Atoms/Calendar',
  component: Calendar,
  parameters: {
    docs: { autodocs: true },
    layout: 'centered'
  },
  tags: ['autodocs'],
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
      options: ['filled', 'outlined', 'soft', 'ghost'],
      description: 'Visual variant of the calendar.',
      table: {
        type: { summary: '"filled" | "outlined" | "soft" | "ghost"' },
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
      control: { type: 'date' },
      description:
        'The minimum selectable date (time is ignored; only date is used). Dates before this will be disabled.',
      table: {
        type: { summary: 'Date (time ignored)' },
        defaultValue: { summary: 'undefined' }
      },
      transform: (value: any) =>
        value
          ? new Date(new Date(value).getFullYear(), new Date(value).getMonth(), new Date(value).getDate())
          : undefined
    },
    maxDate: {
      control: { type: 'date' },
      description:
        'The maximum selectable date (time is ignored; only date is used). Dates after this will be disabled.',
      table: {
        type: { summary: 'Date (time ignored)' },
        defaultValue: { summary: 'undefined' }
      },
      transform: (value: any) =>
        value
          ? new Date(new Date(value).getFullYear(), new Date(value).getMonth(), new Date(value).getDate())
          : undefined
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
    onDateChange: (date: Date) => console.log('Date changed:', date),
    size: 'md',
    show: true,
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic calendar with no date selected and all dates enabled.'
      }
    }
  }
};

// Default first, then variants and feature stories

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with all interaction disabled.'
      }
    }
  }
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar in read-only mode (dates visible, not selectable).'
      }
    }
  }
};

export const WithMinMaxDate: Story = {
  args: {
    ...Default.args,
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), 25)
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a minimum and maximum selectable date.'
      }
    }
  }
};

export const Outlined: Story = {
  args: {
    ...Default.args,
    variant: 'outlined'
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with the outlined visual variant.'
      }
    }
  }
};

export const WithSelectedDate: Story = {
  args: {
    ...Default.args,
    selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15)
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a specific date selected.'
      }
    }
  }
};

export const WithDisabledDates: Story = {
  args: {
    ...Default.args,
    disabledDates: [new Date(new Date().setDate(10)), new Date(new Date().setDate(20))]
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with specific dates disabled.'
      }
    }
  }
};

export const WithSelectedAndDisabledDates: Story = {
  args: {
    selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    onDateChange: (date: Date) => console.log('Date changed:', date),
    disabledDates: [new Date(new Date().setDate(10)), new Date(new Date().setDate(20))]
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a selected date and some dates disabled.'
      }
    }
  }
};

export const WithPastSelectedDate: Story = {
  args: {
    ...Default.args,
    selectedDate: new Date(2024, 0, 15)
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a selected date in the past.'
      }
    }
  }
};

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
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with multiple disabled dates in the current month.'
      }
    }
  }
};
