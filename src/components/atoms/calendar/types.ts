export interface CalendarProps {
  selectedDate?: Date | null;
  onDateChange?: (date: Date) => void;
  disabledDates?: Date[];
}
