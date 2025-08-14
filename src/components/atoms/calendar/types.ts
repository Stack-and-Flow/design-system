export type CalendarVariant = 'filled' | 'outlined' | 'soft' | 'ghost';
export type CalendarSize = 'sm' | 'md' | 'lg';
export type CalendarRadius = 'none' | 'sm' | 'md' | 'lg';

export interface CalendarProps {
  /** Unique id for ARIA labeling (accessibility) */
  id?: string;
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
  // Eliminado: range y onRangeChange. Usar selectedDate y onDateChange para ambos modos.
}
