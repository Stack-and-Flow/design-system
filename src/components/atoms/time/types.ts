import type { HTMLAttributes } from 'react';

// TimeInput Component Types
export type TimeFormat = '12h' | '24h';
export type TimeUnit = 'hours' | 'minutes' | 'seconds';
export type LabelPosition = 'inside' | 'outside' | 'outside-left';
export type InputVariant = 'regular' | 'underlined' | 'line' | 'bordered';
export type InputSize = 'sm' | 'md' | 'lg';

export interface TimeRange {
  min?: Date;
  max?: Date;
  minHour?: number;
  maxHour?: number;
  minMinute?: number;
  maxMinute?: number;
  minSecond?: number;
  maxSecond?: number;
}

export interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
  ampm?: 'AM' | 'PM';
  timezone?: string;
}

export interface TimeInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> {
  /** Unique identifier for the input */
  id: string;

  /** Label text for the input */
  label?: string;

  /** Position of the label */
  labelPosition?: LabelPosition;

  /** Input variant style */
  variant?: InputVariant;

  /** Input size */
  size?: InputSize;

  /** Whether the input is rounded */
  rounded?: boolean;

  /** Whether the input is required */
  isRequired?: boolean;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether the input is read-only */
  readOnly?: boolean;

  /** Whether the input takes full width */
  isFullWidth?: boolean;

  /** Custom CSS class */
  className?: string;

  /** Error message and type */
  hint?: { message: string; type: 'error' | 'warning' | 'success' | 'info' };

  /** Description text below the input */
  description?: string;

  /** Whether to show clock icon */
  showClockIcon?: boolean;

  /** Time format (12h or 24h) */
  format?: TimeFormat;

  /** Which time units to show */
  showUnits?: TimeUnit[];

  /** Whether to show timezone selector */
  showTimezone?: boolean;

  /** Available timezones */
  timezones?: string[];

  /** Default timezone */
  defaultTimezone?: string;

  /** Time range constraints */
  timeRange?: TimeRange;

  /** Locale for formatting */
  locale?: string;

  /** Controlled value */
  value?: Date | string | null;

  /** Default value for uncontrolled mode */
  defaultValue?: Date | string | null;

  /** Change handler */
  onChange?: (newValue: Date | null, timeValue: TimeValue) => void;

  /** Blur handler */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;

  /** Focus handler */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;

  /** Key down handler */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}
