import { useEffect, useMemo, useState } from 'react';
import type { CalendarProps } from './types';

// Month names in English
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Abbreviated weekday names (starting from Sunday)
const baseWeekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const useCalendar = ({
  selectedDate: initialSelectedDate = null,
  onDateChange,
  disabledDates = [],
  minDate,
  maxDate,
  disabled = false,
  readOnly = false,
  firstDayOfWeek = 1, // Monday by default
  range,
  onRangeChange
}: CalendarProps & { firstDayOfWeek?: number }) => {
  const [currentDate, setCurrentDate] = useState(initialSelectedDate || (range?.[0] ?? new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialSelectedDate);
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>(range ?? [null, null]);

  useEffect(() => {
    setSelectedDate(initialSelectedDate);
    if (initialSelectedDate) {
      setCurrentDate(initialSelectedDate);
    }
    if (range) {
      setSelectedRange(range);
      if (range[0]) {
        setCurrentDate(range[0]);
      }
    }
  }, [initialSelectedDate, range]);

  // Checks if two dates are the same day
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  // Gets the index of the first day of the month (customizable)
  const getStartDayOfMonth = (year: number, month: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust so that firstDayOfWeek is 0=Sunday, 1=Monday, etc.
    return (firstDay - firstDayOfWeek + 7) % 7;
  };

  // Rotate weekday names according to firstDayOfWeek
  const weekdayNames = [...baseWeekdayNames.slice(firstDayOfWeek), ...baseWeekdayNames.slice(0, firstDayOfWeek)];

  // Generates the array of days for the calendar
  const daysInCalendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const days: {
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      isDisabled: boolean;
      isInRange: boolean;
      isRangeStart: boolean;
      isRangeEnd: boolean;
    }[] = [];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayIndex = getStartDayOfMonth(year, month);
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Days from the previous month
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      const isBeforeMin = minDate ? date < new Date(minDate.setHours(0, 0, 0, 0)) : false;
      const isAfterMax = maxDate ? date > new Date(maxDate.setHours(23, 59, 59, 999)) : false;
      const isDisabled =
        disabled || readOnly || disabledDates.some((d) => isSameDay(d, date)) || isBeforeMin || isAfterMax;
      const isInRange = !!(
        selectedRange[0] &&
        selectedRange[1] &&
        date >= selectedRange[0] &&
        date <= selectedRange[1]
      );
      const isRangeStart = !!(selectedRange[0] && isSameDay(date, selectedRange[0]));
      const isRangeEnd = !!(selectedRange[1] && isSameDay(date, selectedRange[1]));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled,
        isInRange,
        isRangeStart,
        isRangeEnd
      });
    }

    // Days from the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = isSameDay(date, today);
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      const isBeforeMin = minDate ? date < new Date(minDate.setHours(0, 0, 0, 0)) : false;
      const isAfterMax = maxDate ? date > new Date(maxDate.setHours(23, 59, 59, 999)) : false;
      const isDisabled =
        disabled || readOnly || disabledDates.some((d) => isSameDay(d, date)) || isBeforeMin || isAfterMax;
      const isInRange = !!(
        selectedRange[0] &&
        selectedRange[1] &&
        date >= selectedRange[0] &&
        date <= selectedRange[1]
      );
      const isRangeStart = !!(selectedRange[0] && isSameDay(date, selectedRange[0]));
      const isRangeEnd = !!(selectedRange[1] && isSameDay(date, selectedRange[1]));
      days.push({ date, isCurrentMonth: true, isToday, isSelected, isDisabled, isInRange, isRangeStart, isRangeEnd });
    }

    // Days from the next month
    const totalDaysDisplayed = days.length;
    const remainingCells = 42 - totalDaysDisplayed;

    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      const isBeforeMin = minDate ? date < new Date(minDate.setHours(0, 0, 0, 0)) : false;
      const isAfterMax = maxDate ? date > new Date(maxDate.setHours(23, 59, 59, 999)) : false;
      const isDisabled =
        disabled || readOnly || disabledDates.some((d) => isSameDay(d, date)) || isBeforeMin || isAfterMax;
      const isInRange = !!(
        selectedRange[0] &&
        selectedRange[1] &&
        date >= selectedRange[0] &&
        date <= selectedRange[1]
      );
      const isRangeStart = !!(selectedRange[0] && isSameDay(date, selectedRange[0]));
      const isRangeEnd = !!(selectedRange[1] && isSameDay(date, selectedRange[1]));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled,
        isInRange,
        isRangeStart,
        isRangeEnd
      });
    }

    return days;
  }, [currentDate, selectedDate, disabledDates, minDate, maxDate, disabled, readOnly, firstDayOfWeek]);

  const handleDayClick = (date: Date, isDisabled: boolean) => {
    if (isDisabled || disabled || readOnly) {
      return;
    }
    if (onRangeChange) {
      // Range selection logic: first click sets start, second click sets end, third click resets
      if (!selectedRange[0] || (selectedRange[0] && selectedRange[1])) {
        setSelectedRange([date, null]);
        onRangeChange([date, null]);
      } else if (selectedRange[0] && !selectedRange[1]) {
        if (date < selectedRange[0]) {
          setSelectedRange([date, selectedRange[0]]);
          onRangeChange([date, selectedRange[0]]);
        } else {
          setSelectedRange([selectedRange[0], date]);
          onRangeChange([selectedRange[0], date]);
        }
      }
    } else {
      setSelectedDate(date);
      if (onDateChange) {
        onDateChange(date);
      }
    }
  };

  const goToPrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Groups days into weeks of 7 days
  const groupDaysIntoWeeks = (days: typeof daysInCalendar) => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  const weeks = groupDaysIntoWeeks(daysInCalendar);
  const monthYearLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return {
    currentDate,
    selectedDate,
    selectedRange,
    daysInCalendar,
    weeks,
    monthNames,
    weekdayNames,
    monthYearLabel,
    isSameDay,
    getStartDayOfMonth,
    groupDaysIntoWeeks,
    handleDayClick,
    goToPrevMonth,
    goToNextMonth,
    onDateChange,
    onRangeChange,
    disabledDates
  };
};
