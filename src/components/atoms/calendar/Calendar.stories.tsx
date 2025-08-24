import { CalendarDate } from '@internationalized/date';
import { startOfWeek } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Calendar } from './index';
import type { CalendarRadius } from './types';

/**
  ## DESCRIPTION
  The Calendar component is a highly customizable and accessible date picker for React, supporting internationalized dates, advanced visual variants, multi-month views, and modern UX features.

  ## FEATURES
  - **Date Selection**: Visual feedback for single and range selection, including drag & drop for ranges.
  - **Multi-Month View**: Display 1, 2, or 3 months side-by-side with a unified header and perfectly centered navigation controls.
  - **Month/Year Picker**: Two-column, HeroUI-style dropdown for fast navigation, with scrollbars hidden for a cleaner UI.
  - **Dark Mode & Variants**: Multiple visual styles (`filled`, `outlined`, `soft`, `ghost`) and full dark mode support.
  - **Customizable Size & Radius**: Choose from `sm`, `md`, `lg` sizes and border radius options.
  - **Min/Max & Disabled Dates**: Restrict selectable dates and disable specific days.
  - **Read-Only & Disabled Modes**: Prevent interaction when needed.
  - **Keyboard & Screen Reader Accessibility**: Full ARIA support and keyboard navigation.
  - **CVA Integration**: All variants, sizes, radius, disabled, and readOnly states managed with class-variance-authority (CVA).
  - **Internationalized Date Support**: Uses `@internationalized/date` (`CalendarDate`) for locale-aware date logic.
  - **Animations**: Smooth transitions for showing/hiding the calendar.
  - **Custom Highlighted Dates**: Highlight any date with custom colors or styles using the `highlightedDates` prop (e.g., holidays, events).
  - **Performance Optimizations**: Improved memoization and initialization order for faster rendering and reduced re-renders.
  - **No Runtime CSS Injection**: All styles are managed via Tailwind/CVA or inline styles—no runtime CSS injection.
  - **Maintainable Styling**: Compound variants for day styling are split into helper arrays for easier customization and maintainability.
  - **Standardized Props**: Calendar component props are now standardized for clarity and maintainability.
  - **Custom Color Prop**: The `color` prop allows you to select accessible color schemes for selected days and ranges. It supports a wide palette and works for all visual variants (`filled`, `outlined`, `soft`, `ghost`).
  - **Dynamic Hover Fix**: Improved hover effect for non-selected days, using a subtle background for better visual integration and accessibility. The hover color is now correctly prioritized.

  ## ACCESSIBILITY
  - Uses ARIA roles and keyboard navigation
  - Ensures color contrast for all states
  - Month/year picker and multi-month view are fully contained and accessible
  - Custom color schemes for selected/range days are designed to meet WCAG 2 AA contrast requirements.
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
    color: {
      control: { type: 'select' },
      options: [
        'default',
        'orange',
        'orange-light',
        'orange-dark',
        'yellow',
        'yellow-light',
        'yellow-dark',
        'green',
        'green-light',
        'green-dark',
        'teal',
        'teal-light',
        'teal-dark',
        'blue',
        'blue-light',
        'blue-dark',
        'indigo',
        'indigo-light',
        'indigo-dark',
        'purple',
        'purple-light',
        'purple-dark',
        'pink',
        'pink-light',
        'pink-dark'
      ],
      description: 'Color scheme for selected days and ranges.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' }
      }
    },
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
      control: 'date',
      description: 'The minimum selectable date (time ignored; only date is used). Dates before this will be disabled.',
      table: {
        type: { summary: 'Date (time ignored)' },
        defaultValue: { summary: 'undefined' }
      }
    },
    maxDate: {
      control: 'date',
      description: 'The maximum selectable date (time ignored; only date is used). Dates after this will be disabled.',
      table: {
        type: { summary: 'Date (time ignored)' },
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
    onDateChange: () => {
      /* noop */
    },
    size: 'md',
    variant: 'filled',
    radius: 'md',
    show: true,
    disabled: false,
    readOnly: false,
    firstDayOfWeek: 1,
    color: 'default'
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
            size='md'
            variant='filled'
            radius='md'
            disabled={false}
            firstDayOfWeek={1}
          />
        </div>
      </div>
    );
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
    onDateChange: () => {
      /* noop */
    },
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    variant: 'filled',
    color: 'default'
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
    firstDayOfWeek: 1,
    color: 'default'
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
    selectedDate: null,
    onDateChange: () => {
      /* noop */
    },
    size: 'md',
    show: true,
    disabled: false,
    readOnly: true,
    firstDayOfWeek: 1,
    color: 'default'
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
    onDateChange: () => {
      /* noop */
    },
    minDate: new Date(2025, 7, 10),
    maxDate: new Date(2025, 7, 20),
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    color: 'default'
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
    onDateChange: () => {
      /* noop */
    },
    color: 'default'
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
    selectedDate: new Date(2025, 7, 19),
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    onDateChange: () => {
      /* noop */
    },
    color: 'default'
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
    onDateChange: () => {
      /* noop */
    },
    color: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with specific disabled dates.'
      }
    }
  }
};

export const WithCalendarDate: Story = {
  render: () => {
    const [locale, setLocale] = useState('en-US');
    const today = new Date();
    const [calendarDate, setCalendarDate] = useState(() =>
      startOfWeek(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()), locale)
    );

    // Update calendarDate when locale changes
    useEffect(() => {
      const newCalendarDate = startOfWeek(
        new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        locale
      );
      setCalendarDate(newCalendarDate);
    }, [locale]);

    return (
      <div style={{ padding: '2rem' }}>
        <label
          htmlFor='locale-select'
          style={{
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'block',
            background: 'var(--ds-bg, #fff)',
            color: 'var(--ds-label, #222)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem'
          }}
        >
          Locale:
        </label>
        <select
          id='locale-select'
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          style={{
            marginBottom: '2rem',
            padding: '0.5rem',
            fontSize: '1rem',
            background: 'var(--ds-bg, #fff)',
            color: 'var(--ds-label, #222)',
            border: '1px solid #ccc',
            borderRadius: '0.25rem'
          }}
        >
          <option value='en-US'>English (US)</option>
          <option value='es-ES'>Español (ES)</option>
          <option value='en-GB'>English (UK)</option>
        </select>
        <Calendar
          selectedDate={new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day)}
          onDateChange={() => {
            /* noop */
          }}
          size='md'
          show={true}
          locale={locale.startsWith('es') ? 'es' : 'en'}
        />
        <div
          style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            background:
              typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? '#222'
                : '#fff',
            color:
              typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? '#fff'
                : '#222',
            border: '2px dashed #e9a23b',
            borderRadius: '0.25rem',
            padding: '0.25rem 0.75rem'
          }}
        >
          <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>CalendarDate:</span>
          <code tabIndex={0} style={{ background: 'transparent', color: 'inherit', fontWeight: 'bold' }}>
            {calendarDate.toString()}
          </code>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to use @internationalized/date to get the current date and pass it to the Calendar component.'
      }
    }
  }
};

export const VisibleMonths: Story = {
  render: () => {
    const [visibleMonths, setVisibleMonths] = useState<number>(2);
    const [isDark, setIsDark] = useState(() => {
      if (typeof document !== 'undefined') {
        return document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark';
      }
      return false;
    });
    useEffect(() => {
      const handler = () => {
        setIsDark(document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark');
      };
      window.addEventListener('themechange', handler);
      const observer = new MutationObserver(handler);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
      return () => {
        window.removeEventListener('themechange', handler);
        observer.disconnect();
      };
    }, []);
    const bgColor = isDark ? '#18191e' : '#d1d5db';
    const textColor = isDark ? '#fff' : '#222';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
          padding: '2rem',
          borderRadius: '1rem',
          background: bgColor,
          color: textColor,
          boxShadow: isDark ? '0 2px 16px #0006' : '0 2px 16px #0001'
        }}
      >
        <label htmlFor='visible-months-select' style={{ fontWeight: 'bold' }}>
          Select number of visible months:
        </label>
        <select
          id='visible-months-select'
          value={visibleMonths}
          onChange={(e) => setVisibleMonths(Number(e.target.value))}
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            background: isDark ? '#18191e' : bgColor,
            color: isDark ? '#fff' : textColor,
            border: '1px solid #ccc'
          }}
        >
          <option value={1} style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            1
          </option>
          <option value={2} style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            2
          </option>
          <option value={3} style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            3
          </option>
        </select>
        <Calendar
          visibleMonths={visibleMonths}
          selectedDate={null}
          onDateChange={() => {
            // No-op for Storybook
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
        story: 'Interactively select the number of visible months (1, 2, or 3).'
      }
    }
  }
};

export const CustomSelectedAndDisabledDates: Story = {
  args: {
    selectedDate: new Date(2025, 7, 1),
    disabledDates: [new Date(2025, 7, 10), new Date(2025, 7, 12), new Date(2025, 7, 18), new Date(2025, 7, 31)],
    size: 'md',
    show: true,
    disabled: false,
    firstDayOfWeek: 1,
    onDateChange: () => {
      /* noop */
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a selected date and custom disabled dates.'
      }
    }
  }
};

export const HighlightedDates: Story = {
  render: () => {
    function getContrastText(bgColor: string): string {
      if (!bgColor) {
        return '#222';
      }
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? '#222' : '#fff';
    }

    const today = new Date();
    const eventDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    const holidayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5);
    const highlightedDates = [
      {
        date: eventDate,
        className: 'font-bold',
        style: { border: '2px solid #22c55e', background: '#22c55e', color: getContrastText('#22c55e') }
      },
      {
        date: holidayDate,
        className: 'font-bold',
        style: { border: '2px dashed #eab308', background: '#eab308', color: getContrastText('#eab308') }
      }
    ];

    return <Calendar highlightedDates={highlightedDates} show={true} size='md' variant='filled' />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to highlight custom dates (e.g., holidays, events) with custom colors and styles.'
      }
    }
  }
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
    const [isDark, setIsDark] = useState(() => {
      if (typeof document !== 'undefined') {
        return document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark';
      }
      return false;
    });
    useEffect(() => {
      const handler = () => {
        setIsDark(document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark');
      };
      window.addEventListener('themechange', handler);

      const observer = new MutationObserver(handler);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
      return () => {
        window.removeEventListener('themechange', handler);
        observer.disconnect();
      };
    }, []);
    const bgColor = isDark ? '#18191e' : '#d1d5db';
    const textColor = isDark ? '#fff' : '#222';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
          padding: '2rem',
          borderRadius: '1rem',
          background: bgColor,
          color: textColor,
          boxShadow: isDark ? '0 2px 16px #0006' : '0 2px 16px #0001'
        }}
      >
        <label htmlFor='size-select' style={{ fontWeight: 'bold' }}>
          Select calendar size:
        </label>
        <select
          id='size-select'
          value={size}
          onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg')}
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            background: isDark ? '#18191e' : bgColor,
            color: isDark ? '#fff' : textColor,
            border: '1px solid #ccc'
          }}
        >
          <option value='sm' style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            Small
          </option>
          <option value='md' style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            Medium
          </option>
          <option value='lg' style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            Large
          </option>
        </select>
        <Calendar
          size={size}
          selectedDate={null}
          onDateChange={() => {
            /* noop */
          }}
          show={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactively select the calendar size (sm, md, lg).'
      }
    }
  }
};

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
    background: white;
    color: black;
  }
  @media (prefers-color-scheme: dark) {
    .calendar-radius-bg {
      background: black;
      color: white;
    }
  }
`;
document.head.appendChild(style);

export const WithRadius: Story = {
  render: () => {
    const [radius, setRadius] = useState<CalendarRadius>('md');
    const [isDark, setIsDark] = useState(() => {
      if (typeof document !== 'undefined') {
        return document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark';
      }
      return false;
    });
    useEffect(() => {
      const handler = () => {
        setIsDark(document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark');
      };
      window.addEventListener('themechange', handler);
      const observer = new MutationObserver(handler);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
      return () => {
        window.removeEventListener('themechange', handler);
        observer.disconnect();
      };
    }, []);
    const bgColor = isDark ? '#18191e' : '#d1d5db';
    const textColor = isDark ? '#fff' : '#222';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
          padding: '2rem',
          borderRadius: '1rem',
          background: bgColor,
          color: textColor,
          boxShadow: isDark ? '0 2px 16px #0006' : '0 2px 16px #0001'
        }}
      >
        <label htmlFor='radius-select' style={{ fontWeight: 'bold' }}>
          Select border radius:
        </label>
        <select
          id='radius-select'
          value={radius}
          onChange={(e) => setRadius(e.target.value as CalendarRadius)}
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            background: isDark ? '#18191e' : bgColor,
            color: isDark ? '#fff' : textColor,
            border: '1px solid #ccc'
          }}
        >
          <option value='none' style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            None
          </option>
          <option value='sm' style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            Small
          </option>
          <option value='md' style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
            Medium
          </option>
          <option value='lg' style={{ background: isDark ? '#18191e' : '#fff', color: isDark ? '#fff' : '#222' }}>
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
