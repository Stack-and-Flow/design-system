export type CalendarVariant = 'filled' | 'outlined' | 'soft' | 'ghost';
export type CalendarSize = 'sm' | 'md' | 'lg';
export type CalendarRadius = 'none' | 'sm' | 'md' | 'lg' | number;

export interface CalendarProps {
  selectedDate?: Date | null;
  onDateChange?: (date: Date) => void;
  disabledDates?: Date[];
  variant?: CalendarVariant;
  size?: CalendarSize;
  radius?: CalendarRadius;
  show?: boolean; // Controls visibility of the calendar
  maxDate?: Date;
  minDate?: Date;
  /**
   * If true, disables all interaction and selection in the calendar.
   */
  disabled?: boolean;
  /**
   * If true, makes the calendar read-only (dates are visible but cannot be selected).
   */
  readOnly?: boolean;
}
