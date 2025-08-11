export type CalendarVariant = 'filled' | 'outlined';
export type CalendarSize = 'sm' | 'md' | 'lg';
export type CalendarRadius = 'none' | 'sm' | 'md' | 'lg' | number;

export interface CalendarProps {
  selectedDate?: Date | null;
  onDateChange?: (date: Date) => void;
  disabledDates?: Date[];
  theme?: 'light' | 'dark';
  variant?: CalendarVariant;
  size?: CalendarSize;
  radius?: CalendarRadius;
}
