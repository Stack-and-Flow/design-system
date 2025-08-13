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
 * - Customizable size and border radius (string or number)
 * - Min/max and disabled dates
 * - Read-only and disabled modes
 * - Full keyboard and screen reader accessibility
 * - All visual variants, sizes, radius, theme, disabled, and readOnly states managed with class-variance-authority (CVA)
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
      description: 'The currently selected date in the calendar.'
      // theme control removed
      // Removed invalid summary property
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
      control: { type: 'text' },
      description: 'Border radius of the calendar. Accepts string (none, sm, md, lg) or number (px).',
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
    },
    firstDayOfWeek: {
      control: { type: 'number', min: 0, max: 6 },
      description: 'The first day of the week (0 = Sunday, 1 = Monday, ... 6 = Saturday).',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Calendar>;
// ...existing code...

export const Default: Story = {
  args: {
    selectedDate: null,
    onDateChange: (date: Date) => console.log('Date changed:', date),
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic calendar with no date selected and all dates enabled. You can change the first day of the week using the control.'
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

export const CustomSelectedAndDisabledDates: Story = {
  args: {
    ...Default.args,
    selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    disabledDates: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 10),
      new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      new Date(new Date().getFullYear(), new Date().getMonth(), 12),
      new Date(new Date().getFullYear(), new Date().getMonth(), 18),
      new Date(new Date().getFullYear(), new Date().getMonth(), 25)
    ]
  },
  argTypes: {
    selectedDate: {
      control: 'date',
      description: 'The currently selected date in the calendar.'
    },
    disabledDates: {
      control: 'object',
      description: 'Array of dates that should be disabled.'
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'Calendar with a customizable selected date and multiple disabled dates. Use the controls to test different scenarios, including past dates.'
      }
    }
  }
};

export const RangeSelection: Story = {
  args: {
    ...Default.args,
    range: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 10),
      new Date(new Date().getFullYear(), new Date().getMonth(), 15)
    ],
    onRangeChange: (range: [Date | null, Date | null]) => {
      console.log('Range changed:', range);
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'Calendar with range (multidate) selection enabled. Click to select a start and end date; all dates in between will be highlighted.'
      }
    }
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Small</h3>
        <Calendar size='sm' id='calendar-sm' />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Medium</h3>
        <Calendar size='md' id='calendar-md' />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Large</h3>
        <Calendar size='lg' id='calendar-lg' />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all calendar sizes: small, medium, and large.'
      }
    }
  }
};

export const Radius: Story = {
  args: {
    ...Default.args,
    radius: 'md'
  },
  argTypes: {
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 0, 4, 8, 16, 24, 32],
      description: 'Border radius of the calendar. Accepts string (none, sm, md, lg) or number (px).',
      table: {
        type: { summary: '"none" | "sm" | "md" | "lg" | number' },
        defaultValue: { summary: 'md' }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with selectable border radius. Use the select control to change the radius.'
      }
    }
  }
};
