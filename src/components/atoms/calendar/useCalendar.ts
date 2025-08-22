import { CalendarDate } from '@internationalized/date';
// import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
// Utility to convert a native JS Date object to a CalendarDate
function dateToCalendarDate(date: Date): CalendarDate {
  // Converts a JS Date object to a CalendarDate (ISO calendar)
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}
import type { CalendarProps } from './types';

// Month names by locale
const monthNamesByLocale: Record<string, string[]> = {
  en: [
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
  ],
  es: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]
};

// Abbreviated weekday names (starting from Sunday)
const weekdayNamesByLocale: Record<string, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
};

export const useCalendar = ({
  selectedDate: initialSelectedDate = null,
  onDateChange,
  disabledDates = [],
  minDate,
  maxDate,
  disabled = false,
  readOnly = false,
  firstDayOfWeek = 1, // Monday by default
  highlightedDates = [],
  locale = 'en'
}: CalendarProps & { firstDayOfWeek?: number; locale?: string }) => {
  // Groups days into weeks of 7 days
  const groupDaysIntoWeeks = (days: any[]) => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

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

  // Compare only year, month, day (ignore time)
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const getStartDayOfMonth = (year: number, month: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust so that firstDayOfWeek is 0=Sunday, 1=Monday, etc.
    return (firstDay - firstDayOfWeek + 7) % 7;
  };

  const baseWeekdayNames = weekdayNamesByLocale[locale] || weekdayNamesByLocale['en'];
  const weekdayNames = [...baseWeekdayNames.slice(firstDayOfWeek), ...baseWeekdayNames.slice(0, firstDayOfWeek)];

  // Memoized month names by locale
  const monthNames = useMemo(() => {
    return monthNamesByLocale[locale] || monthNamesByLocale['en'];
  }, [locale]);

  // Normalize disabledDates to ignore time
  const normalizedDisabledDates = useMemo(() => {
    // Normalize disabledDates to local midnight, ignoring timezone
    return disabledDates.map((d) => {
      // Always use local date, not UTC, to avoid timezone issues from Storybook controls
      const localDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      localDate.setHours(0, 0, 0, 0);
      return localDate;
    });
  }, [disabledDates]);

  // Memoize previous month days
  const prevMonthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDayIndex = getStartDayOfMonth(year, month);
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      date.setHours(0, 0, 0, 0);
      const isBeforeMin = minDate ? date < new Date(minDate.setHours(0, 0, 0, 0)) : false;
      const isAfterMax = maxDate ? date > new Date(maxDate.setHours(23, 59, 59, 999)) : false;
      const isDisabled =
        disabled || readOnly || normalizedDisabledDates.some((d) => isSameDay(d, date)) || isBeforeMin || isAfterMax;
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
  }, [currentDate, normalizedDisabledDates, minDate, maxDate, disabled, readOnly, selectedRange, highlightedDates]);

  // Memoize current month days
  const currentMonthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      const isToday = isSameDay(date, today);
      let isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      let isRangeStart = false;
      let isRangeEnd = false;
      let isInRange = false;
      if (selectedRange[0]) {
        isRangeStart = isSameDay(date, selectedRange[0]);
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
        disabled || readOnly || normalizedDisabledDates.some((d) => isSameDay(d, date)) || isBeforeMin || isAfterMax;
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
    return days;
  }, [currentDate, selectedDate, disabledDates, minDate, maxDate, disabled, readOnly, selectedRange, highlightedDates]);

  // Memoize next month days
  const nextMonthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDayIndex = getStartDayOfMonth(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysDisplayed = startDayIndex + daysInMonth;
    const remainingCells = 42 - totalDaysDisplayed;
    const days = [];
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      date.setHours(0, 0, 0, 0);
      const isBeforeMin = minDate ? date < new Date(minDate.setHours(0, 0, 0, 0)) : false;
      const isAfterMax = maxDate ? date > new Date(maxDate.setHours(23, 59, 59, 999)) : false;
      const isDisabled =
        disabled || readOnly || normalizedDisabledDates.some((d) => isSameDay(d, date)) || isBeforeMin || isAfterMax;
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
  }, [currentDate, disabledDates, minDate, maxDate, disabled, readOnly, selectedRange, highlightedDates]);

  // Concatenate all days
  const daysInCalendar = useMemo(() => {
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [prevMonthDays, currentMonthDays, nextMonthDays]);

  // Memoize weeks
  const weeks = useMemo(() => groupDaysIntoWeeks(daysInCalendar), [daysInCalendar]);

  const handleDayClick = (date: Date, isDisabled: boolean) => {
    // Defensive: always check normalizedDisabledDates
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    const isActuallyDisabled =
      isDisabled || disabled || readOnly || normalizedDisabledDates.some((d) => isSameDay(d, normalizedDate));
    if (isActuallyDisabled) {
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

  // weeks is now memoized above
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
