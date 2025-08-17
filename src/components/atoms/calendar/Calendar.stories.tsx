import { CalendarDate } from '@internationalized/date';
import { startOfWeek } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Calendar } from './index';
import type { CalendarRadius } from './types';

/**
    ## DESCRIPTION
    The Calendar component is a highly customizable and accessible date picker for React, supporting internationalized dates and advanced visual variants.

    ## FEATURES
    - **Date Selection**: Visual feedback for single and range selection ( drag&drop).
    - **Month/Year Picker**: Two-column HeroUI-style dropdown for fast navigation.
    - **Dark Mode & Variants**: Multiple visual styles (`filled`, `outlined`, `soft`, `ghost`).
    - **Customizable Size & Radius**: Choose from `sm`, `md`, `lg` sizes and border radius.
    - **Min/Max & Disabled Dates**: Restrict selectable dates and disable specific days.
    - **Read-Only & Disabled Modes**: Prevent interaction when needed.
    - **Keyboard & Screen Reader Accessibility**: Full ARIA support and keyboard navigation.
    - **CVA Integration**: All variants, sizes, radius, disabled, and readOnly states managed with class-variance-authority (CVA).
    - **Internationalized Date Support**: Use `@internationalized/date` (`CalendarDate`) for locale-aware date logic.
    - **Animations**: Smooth transitions for showing/hiding the calendar.
    - **Custom Highlighted Dates**: Highlight any date with custom colors or styles using the `highlightedDates` prop (e.g., holidays, events).

    ## ACCESSIBILITY
    - Uses ARIA roles and keyboard navigation
    - Ensures color contrast for all states
    - Month/year picker is fully contained and accessible
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
    selectedDate: null,
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
    onDateChange: () => {
      /* noop */
    },
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
    onDateChange: () => {
      /* noop */
    }
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
    onDateChange: () => {
      /* noop */
    }
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
    }
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
    let calendarDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    calendarDate = startOfWeek(calendarDate, locale);
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

export const CustomSelectedAndDisabledDates: Story = {
  args: {
    selectedDate: new Date(2025, 7, 15),
    disabledDates: [new Date(2025, 7, 10), new Date(2025, 7, 12), new Date(2025, 7, 18)],
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
    // Utilidad para calcular color de texto accesible según fondo
    function getContrastText(bgColor: string): string {
      // bgColor en formato hex: #RRGGBB
      if (!bgColor) {
        return '#222';
      }
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      // YIQ formula
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? '#222' : '#fff';
    }
    // Example: highlight holidays and events
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
    // Detect dark mode using Storybook's global theme class
    let isDark = false;
    if (typeof document !== 'undefined') {
      isDark = document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark';
    }
    const bgColor = isDark ? '#18191e' : '#fff';
    const textColor = getContrastText(bgColor);
    return (
      <div
        style={{
          padding: '2rem',
          background: bgColor,
          borderRadius: '1rem',
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          color: textColor,
          boxShadow: isDark ? '0 2px 16px #0006' : '0 2px 16px #0001'
        }}
      >
        <h3 style={{ marginBottom: 0, color: isDark ? '#eab308' : '#830213', alignSelf: 'flex-start' }}>
          Highlighted Dates Example
        </h3>
        <div style={{ width: '100%' }}>
          <Calendar highlightedDates={highlightedDates} show={true} size='md' variant='filled' />
        </div>
        <div style={{ marginTop: 0, fontSize: '0.95rem', width: '100%' }}>
          <span
            style={{
              background: '#22c55e',
              color: getContrastText('#22c55e'),
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '4px',
              marginRight: '0.5rem',
              border: '1px solid #198c4c',
              textShadow: getContrastText('#22c55e') === '#fff' ? '0 1px 2px #198c4c' : 'none'
            }}
          >
            Green
          </span>
          <span
            style={{
              color: isDark ? '#fff' : '#222',
              fontWeight: 'bold',
              textShadow: isDark ? '0 1px 2px #000' : '0 1px 2px #fff'
            }}
          >
            : Event
          </span>
          <br />
          <span
            style={{
              background: '#eab308',
              color: getContrastText('#eab308'),
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '4px',
              marginRight: '0.5rem',
              border: '1px solid #b58903',
              textShadow: getContrastText('#eab308') === '#fff' ? '0 1px 2px #b58903' : 'none'
            }}
          >
            Yellow
          </span>
          <span
            style={{
              color: isDark ? '#fff' : '#222',
              fontWeight: 'bold',
              textShadow: isDark ? '0 1px 2px #000' : '0 1px 2px #fff'
            }}
          >
            : Holiday
          </span>
        </div>
      </div>
    );
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
      // fallback: listen to class changes
      const observer = new MutationObserver(handler);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
      return () => {
        window.removeEventListener('themechange', handler);
        observer.disconnect();
      };
    }, []);
    const bgColor = isDark ? '#18191e' : '#fff';
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
            background: bgColor,
            color: textColor,
            border: '1px solid #ccc'
          }}
        >
          <option value='sm' style={{ color: '#222' }}>
            Small
          </option>
          <option value='md' style={{ color: '#222' }}>
            Medium
          </option>
          <option value='lg' style={{ color: '#222' }}>
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
    const bgColor = isDark ? '#18191e' : '#fff';
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
            background: bgColor,
            color: textColor,
            border: '1px solid #ccc'
          }}
        >
          <option value='none' style={{ color: '#222' }}>
            None
          </option>
          <option value='sm' style={{ color: '#222' }}>
            Small
          </option>
          <option value='md' style={{ color: '#222' }}>
            Medium
          </option>
          <option value='lg' style={{ color: '#222' }}>
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
