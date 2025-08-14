import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar } from './index';
import type { CalendarRadius } from './types';

/**
 * ## Calendar
 *
 * A highly customizable, accessible calendar/date picker component for React.
 *
 * ### Features
 * - Date selection with visual feedback
 * - Month/year picker with two-column HeroUI-style dropdown
 * - Dark mode and multiple visual variants
 * - Customizable size and border radius (string only)
 * - Min/max and disabled dates
 * - Read-only and disabled modes
 * - Full keyboard and screen reader accessibility
 * - All visual variants, sizes, radius, disabled, and readOnly states managed with class-variance-authority (CVA)
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
      description: 'Border radius of the calendar. Options: none, sm, md, lg.',
      table: {
        type: { summary: '"none" | "sm" | "md" | "lg"' },
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
    },
    theme: {
      table: { disable: true }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    selectedDate: null,
    onDateChange: (date) => console.log('Selected date:', date),
    size: 'md',
    variant: 'filled',
    radius: 'md',
    show: true,
    disabled: false,
    readOnly: false,
    firstDayOfWeek: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'Default calendar. You can select a date and use the controls to see different states.'
      }
    }
  }
};

export const ShowTransition: Story = {
  render: () => {
    const [show, setShow] = useState(false);
    return (
      <div
        style={{
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <button
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            borderRadius: '0.5rem',
            background: '#eee',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? 'Hide Calendar' : 'Show Calendar'}
        </button>
        <div
          style={{
            width: 'fit-content',
            transition: 'transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s cubic-bezier(.4,0,.2,1)',
            transform: show ? 'translateY(0)' : 'translateY(-40px)',
            opacity: show ? 1 : 0,
            pointerEvents: show ? 'auto' : 'none'
          }}
        >
          <Calendar
            show={show}
            selectedDate={null}
            onDateChange={() => {
              /* noop */
            }}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the calendar appearing with a slide-down transition, similar to a modal.'
      }
    }
  }
};

export const SizesVertical: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'flex-start',
        background: '#fff',
        padding: '2rem',
        borderRadius: '1rem'
      }}
    >
      <div>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Small</div>
        <Calendar
          id='calendar-sm'
          size='sm'
          selectedDate={null}
          onDateChange={() => {
            /* noop */
          }}
        />
      </div>
      <div>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Medium</div>
        <Calendar
          id='calendar-md'
          size='md'
          selectedDate={null}
          onDateChange={() => {
            /* noop */
          }}
        />
      </div>
      <div>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Large</div>
        <Calendar
          id='calendar-lg'
          size='lg'
          selectedDate={null}
          onDateChange={() => {
            /* noop */
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays all calendar sizes (sm, md, lg) stacked vertically for easy comparison.'
      }
    }
  }
};

export const SingleSelection: Story = {
  args: {
    selectedDate: null,
    onDateChange: (date) => console.log('Selected date:', date),
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'Single selection mode: Click a date to select it. Only one date can be selected at a time.'
      }
    }
  }
};

export const RangeSelection: Story = {
  args: {
    selectedDate: [null, null],
    onDateChange: (range) => console.log('Rango seleccionado:', range),
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    variant: 'filled'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Range selection mode: Select a range by clicking two dates. The calendar will highlight the selected range.'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    selectedDate: null,
    onDateChange: () => {
      /* noop */
    },
    size: 'md',
    show: true,
    disabled: true,
    firstDayOfWeek: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled calendar: No interaction or selection is allowed.'
      }
    }
  }
};

export const ReadOnly: Story = {
  args: {
    selectedDate: new Date(),
    onDateChange: () => {
      /* noop */
    },
    size: 'md',
    show: true,
    disabled: false,
    readOnly: true,
    firstDayOfWeek: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only calendar: Dates are visible but cannot be selected.'
      }
    }
  }
};

export const WithMinMax: Story = {
  args: {
    selectedDate: null,
    onDateChange: (date) => console.log('Fecha seleccionada:', date),
    minDate: new Date(2025, 7, 10),
    maxDate: new Date(2025, 7, 20),
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with min and max dates: Only dates between August 10 and August 20, 2025 can be selected.'
      }
    }
  }
};

export const Outlined: Story = {
  args: {
    selectedDate: null,
    variant: 'outlined',
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    onDateChange: (date) => console.log('Selected date:', date)
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with outlined visual style.'
      }
    }
  }
};

export const WithSelectedDate: Story = {
  args: {
    selectedDate: new Date(2025, 7, 15),
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    onDateChange: (date) => console.log('Selected date:', date)
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a pre-selected date.'
      }
    }
  }
};

export const WithDisabledDates: Story = {
  args: {
    selectedDate: null,
    disabledDates: [new Date(2025, 7, 10), new Date(2025, 7, 12), new Date(2025, 7, 18)],
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    onDateChange: (date) => console.log('Selected date:', date)
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with specific disabled dates.'
      }
    }
  }
};

export const CustomSelectedAndDisabledDates: Story = {
  args: {
    selectedDate: new Date(2025, 7, 15),
    disabledDates: [new Date(2025, 7, 10), new Date(2025, 7, 12), new Date(2025, 7, 18)],
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    onDateChange: (date) => console.log('Selected date:', date)
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a selected date and custom disabled dates.'
      }
    }
  }
};

// Custom style for WithRadius dropdown selected option
const selectStyle = document.createElement('style');
selectStyle.innerHTML = `
  .calendar-radius-bg select:focus option:checked,
  .calendar-radius-bg select option:checked {
    color: #e00;
    background: #fff;
  }
`;
document.head.appendChild(selectStyle);
// Add theme-aware background for WithRadius story
const style = document.createElement('style');
style.innerHTML = `
  .calendar-radius-bg {
    background: black;
    color: white;
  }
  @media (prefers-color-scheme: dark) {
    .calendar-radius-bg {
      background: white;
      color: black;
    }
  }
`;
document.head.appendChild(style);

export const WithRadius: Story = {
  render: () => {
    const [radius, setRadius] = useState<CalendarRadius>('md');
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
          padding: '2rem',
          borderRadius: '1rem',
          background: 'black',
          color: 'white'
        }}
        className='calendar-radius-bg'
      >
        <label htmlFor='radius-select' style={{ fontWeight: 'bold' }}>
          Select border radius:
        </label>
        <select
          id='radius-select'
          value={radius}
          onChange={(e) => setRadius(e.target.value as CalendarRadius)}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1rem' }}
        >
          <option value='none' style={{ color: 'black' }}>
            None
          </option>
          <option value='sm' style={{ color: 'black' }}>
            Small
          </option>
          <option value='md' style={{ color: 'black' }}>
            Medium
          </option>
          <option value='lg' style={{ color: 'black' }}>
            Large
          </option>
        </select>
        <Calendar
          radius={radius}
          selectedDate={null}
          onDateChange={() => {
            /* noop */
          }}
          size='md'
          show={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactively select the border radius for the calendar.'
      }
    }
  }
};
