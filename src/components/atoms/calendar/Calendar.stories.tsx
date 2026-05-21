import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

const selectedDate = new Date(2025, 7, 14);
const rangeStart = new Date(2025, 7, 11);
const rangeEnd = new Date(2025, 7, 18);
const disabledDates = [new Date(2025, 7, 9), new Date(2025, 7, 10), new Date(2025, 7, 19)];
const highlightedDates = [
  {
    date: new Date(2025, 7, 5),
    className: 'ring-2 ring-info ring-offset-1 ring-offset-background-light dark:ring-offset-background-dark'
  },
  {
    date: new Date(2025, 7, 22),
    className: 'ring-2 ring-success ring-offset-1 ring-offset-background-light dark:ring-offset-background-dark'
  }
];

/**
 * ## Description
 * A date-selection calendar that supports single dates, ranges, multiple visual variants, and keyboard navigation.
 *
 * ## Usage Guide
 * Use `selectedDate` with a single `Date | null` value for single-date selection or pass a tuple to enable range selection.
 * Keep consumer styling overrides inside `highlightedDates` when you need to annotate specific days.
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
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Calendar>;

/**
 * Shows the default calendar configuration using the component defaults.
 */
export const Default: Story = {
  args: {
    onDateChange: action('date-change')
  }
};

/**
 * Shows the compact size with the smallest supported interactive controls.
 */
export const Small: Story = {
  args: {
    selectedDate,
    size: 'sm',
    onDateChange: action('date-change')
  }
};

/**
 * Shows the default medium size for balanced readability and density.
 */
export const Medium: Story = {
  args: {
    selectedDate,
    size: 'md',
    onDateChange: action('date-change')
  }
};

/**
 * Shows the largest size with roomier spacing for high-emphasis scheduling surfaces.
 */
export const Large: Story = {
  args: {
    selectedDate,
    size: 'lg',
    onDateChange: action('date-change')
  }
};

/**
 * Demonstrates the disabled calendar state for non-interactive surfaces.
 */
export const Disabled: Story = {
  args: {
    selectedDate,
    disabled: true,
    onDateChange: action('date-change')
  }
};

/**
 * Demonstrates the read-only state while preserving current selection visibility.
 */
export const ReadOnly: Story = {
  args: {
    selectedDate,
    readOnly: true,
    onDateChange: action('date-change')
  }
};

/**
 * Shows the outlined presentation for low-emphasis placement.
 */
export const Outlined: Story = {
  args: {
    selectedDate,
    variant: 'outlined',
    color: 'blue',
    onDateChange: action('date-change')
  }
};

/**
 * Shows the soft presentation with a tinted range selection.
 */
export const Soft: Story = {
  args: {
    selectedDate: [rangeStart, rangeEnd],
    variant: 'soft',
    color: 'purple',
    onDateChange: action('date-change')
  }
};

/**
 * Shows the ghost presentation for very light surfaces.
 */
export const Ghost: Story = {
  args: {
    selectedDate,
    variant: 'ghost',
    color: 'teal',
    onDateChange: action('date-change')
  }
};

/**
 * Demonstrates range mode with a highlighted selection window.
 */
export const RangeSelection: Story = {
  args: {
    selectedDate: [rangeStart, rangeEnd],
    color: 'orange',
    onDateChange: action('date-change')
  }
};

/**
 * Demonstrates date constraints with disabled dates and min/max bounds.
 */
export const WithDisabledDates: Story = {
  args: {
    selectedDate,
    disabledDates,
    minDate: new Date(2025, 7, 4),
    maxDate: new Date(2025, 7, 26),
    onDateChange: action('date-change')
  }
};

/**
 * Demonstrates highlighted date annotations without changing component-owned colors.
 */
export const HighlightedDates: Story = {
  args: {
    selectedDate,
    highlightedDates,
    onDateChange: action('date-change')
  }
};

/**
 * Demonstrates multi-month browsing for denser scheduling workflows.
 */
export const MultiMonthView: Story = {
  args: {
    selectedDate,
    visibleMonths: 2,
    color: 'indigo',
    onDateChange: action('date-change')
  }
};

/**
 * Demonstrates locale-aware labels with a Sunday week start.
 */
export const SpanishLocale: Story = {
  args: {
    selectedDate,
    locale: 'es',
    firstDayOfWeek: 0,
    color: 'green',
    onDateChange: action('date-change')
  }
};
