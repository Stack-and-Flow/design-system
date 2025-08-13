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
  show?: boolean;
  maxDate?: Date;
  minDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  firstDayOfWeek?: number;
  theme?: 'light' | 'dark';
}
