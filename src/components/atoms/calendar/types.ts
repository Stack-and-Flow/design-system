import type React from 'react';
export type CalendarVariant = 'filled' | 'outlined' | 'soft' | 'ghost';
export type CalendarSize = 'sm' | 'md' | 'lg';
export type CalendarRadius = 'none' | 'sm' | 'md' | 'lg';

export interface CalendarProps {
  color?:
    | 'default'
    | 'orange'
    | 'orange-light'
    | 'orange-dark'
    | 'yellow'
    | 'yellow-light'
    | 'yellow-dark'
    | 'green'
    | 'green-light'
    | 'green-dark'
    | 'teal'
    | 'teal-light'
    | 'teal-dark'
    | 'blue'
    | 'blue-light'
    | 'blue-dark'
    | 'indigo'
    | 'indigo-light'
    | 'indigo-dark'
    | 'purple'
    | 'purple-light'
    | 'purple-dark'
    | 'pink'
    | 'pink-light'
    | 'pink-dark';
  selectedDate?: Date | null | [Date | null, Date | null];
  onDateChange?: (date: Date | null | [Date | null, Date | null]) => void;
  disabledDates?: Date[];
  variant?: CalendarVariant;
  size?: CalendarSize;
  radius?: CalendarRadius;
  show?: boolean;
  maxDate?: Date;
  minDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  firstDayOfWeek?: number;
  theme?: 'light' | 'dark';
  /** Array of highlighted dates with custom styles or classes. */
  highlightedDates?: { date: Date; className?: string; style?: React.CSSProperties }[];
  /** Locale code for weekday and month names (e.g., 'en', 'es'). */
  locale?: string;
  /** Number of visible months (1 for single, 2+ for multi-month view). */
  visibleMonths?: number;
}
