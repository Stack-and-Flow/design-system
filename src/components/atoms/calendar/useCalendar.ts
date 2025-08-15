import { CalendarDate } from '@internationalized/date';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
// Utility to convert a native JS Date object to a CalendarDate
function dateToCalendarDate(date: Date): CalendarDate {
  // Converts a JS Date object to a CalendarDate (ISO calendar)
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}
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
  highlightedDates = []
}: CalendarProps & { firstDayOfWeek?: number }) => {
  // selectedDate can be Date|null or [Date|null, Date|null]
  const [currentDate, setCurrentDate] = useState(() => {
    if (Array.isArray(initialSelectedDate)) {
      return initialSelectedDate[0] ?? new Date();
    }
    return initialSelectedDate ?? new Date();
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    Array.isArray(initialSelectedDate) ? null : initialSelectedDate
  );
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>(
    Array.isArray(initialSelectedDate) ? initialSelectedDate : [null, null]
  );

  useEffect(() => {
    if (Array.isArray(initialSelectedDate)) {
      setSelectedRange(initialSelectedDate);
      if (initialSelectedDate[0]) {
        setCurrentDate(initialSelectedDate[0]);
      }
      setSelectedDate(null);
    } else {
      setSelectedDate(initialSelectedDate);
      if (initialSelectedDate) {
        setCurrentDate(initialSelectedDate);
      }
      setSelectedRange([null, null]);
    }
  }, [initialSelectedDate]);

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const getStartDayOfMonth = (year: number, month: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust so that firstDayOfWeek is 0=Sunday, 1=Monday, etc.
    return (firstDay - firstDayOfWeek + 7) % 7;
  };

  const weekdayNames = [...baseWeekdayNames.slice(firstDayOfWeek), ...baseWeekdayNames.slice(0, firstDayOfWeek)];

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
      isHighlighted?: boolean;
      highlightClassName?: string;
      highlightStyle?: React.CSSProperties;
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
      const highlight = highlightedDates.find((h) => isSameDay(h.date, date));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled,
        isInRange,
        isRangeStart,
        isRangeEnd,
        isHighlighted: !!highlight,
        highlightClassName: highlight?.className,
        highlightStyle: highlight?.style
      });
    }

    // Days from the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = isSameDay(date, today);
      let isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      let isRangeStart = false;
      let isRangeEnd = false;
      let isInRange = false;

      // Range selection logic
      if (selectedRange[0]) {
        isRangeStart = isSameDay(date, selectedRange[0]);
        // If only start is set and selectedDate is adjacent, switch style
        if (
          !selectedRange[1] &&
          isRangeStart &&
          selectedDate &&
          Math.abs((selectedDate.getTime() - selectedRange[0].getTime()) / (1000 * 60 * 60 * 24)) === 1
        ) {
          isSelected = false;
        }
      }
      if (selectedRange[1]) {
        isRangeEnd = isSameDay(date, selectedRange[1]);
        isInRange = !!(selectedRange[0] && selectedRange[1] && date >= selectedRange[0] && date <= selectedRange[1]);
      }

      const isBeforeMin = minDate ? date < new Date(minDate.setHours(0, 0, 0, 0)) : false;
      const isAfterMax = maxDate ? date > new Date(maxDate.setHours(23, 59, 59, 999)) : false;
      const isDisabled =
        disabled || readOnly || disabledDates.some((d) => isSameDay(d, date)) || isBeforeMin || isAfterMax;

      // In readOnly mode, no day should be selected
      if (readOnly) {
        isSelected = false;
        isRangeStart = false;
        isRangeEnd = false;
        isInRange = false;
      }

      const highlight = highlightedDates.find((h) => isSameDay(h.date, date));
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isDisabled,
        isInRange,
        isRangeStart,
        isRangeEnd,
        isHighlighted: !!highlight,
        highlightClassName: highlight?.className,
        highlightStyle: highlight?.style
      });
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
      const highlight = highlightedDates.find((h) => isSameDay(h.date, date));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled,
        isInRange,
        isRangeStart,
        isRangeEnd,
        isHighlighted: !!highlight,
        highlightClassName: highlight?.className,
        highlightStyle: highlight?.style
      });
    }

    return days;
  }, [currentDate, selectedDate, disabledDates, minDate, maxDate, disabled, readOnly, firstDayOfWeek]);

  const handleDayClick = (date: Date, isDisabled: boolean) => {
    if (isDisabled || disabled || readOnly) {
      return;
    }
    // If selectedDate is a range, handle range selection
    if (Array.isArray(initialSelectedDate)) {
      // First click: set start, visually mark as selected
      if (!selectedRange[0] || (selectedRange[0] && selectedRange[1])) {
        setSelectedRange([date, null]);
        onDateChange?.([date, null]);
        setSelectedDate(date); // Mark start date as selected for visual feedback
      } else if (selectedRange[0] && !selectedRange[1]) {
        if (date < selectedRange[0]) {
          setSelectedRange([date, selectedRange[0]]);
          onDateChange?.([date, selectedRange[0]]);
          setSelectedDate(date); // Mark new start date
        } else {
          setSelectedRange([selectedRange[0], date]);
          onDateChange?.([selectedRange[0], date]);
          setSelectedDate(selectedRange[0]); // Keep start visually selected
        }
      }
    } else {
      setSelectedDate(date);
      onDateChange?.(date);
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

  // Example usage: convert the current date to CalendarDate
  const currentCalendarDate = dateToCalendarDate(currentDate);

  return {
    currentDate,
    currentCalendarDate,
    selectedDate: Array.isArray(initialSelectedDate) ? null : selectedDate,
    selectedRange: Array.isArray(initialSelectedDate) ? selectedRange : [null, null],
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
    disabledDates
    // highlightedDates is not returned, only used for day decoration
  };
};
