import { CalendarDate } from '@internationalized/date';
import { useMemo, useState } from 'react';
import type { CalendarProps } from './types';

// Utility to convert a native JS Date object to a CalendarDate
function dateToCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

// Utility to lighten a hex color for hover effects
// Converts hex to RGB, increases brightness, and returns hex
export function lightenColor(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  // Parse hex to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Increase brightness by percent (0-100)
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.round(r * factor));
  const newG = Math.min(255, Math.round(g * factor));
  const newB = Math.min(255, Math.round(b * factor));
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Month names by locale
// Color palette mapping for Calendar color prop
export const calendarColorPalette: Record<string, string> = {
  default: '#e11d48', // current color (red)
  orange: '#f97316',
  'orange-light': '#fda65c',
  'orange-dark': '#d94e08',
  yellow: '#eab308',
  'yellow-light': '#fde047',
  'yellow-dark': '#b58903',
  green: '#22c55e',
  'green-light': '#5ee78b',
  'green-dark': '#138a3d',
  teal: '#14b8a6',
  'teal-light': '#40dfcb',
  'teal-dark': '#0a7f74',
  blue: '#3b82f6',
  'blue-light': '#7bb0fa',
  'blue-dark': '#1e4ed8',
  indigo: '#6366f1',
  'indigo-light': '#9ca3fa',
  'indigo-dark': '#4338ca',
  purple: '#8b5cf6',
  'purple-light': '#c4b5fd',
  'purple-dark': '#6d28d9',
  pink: '#ec4899',
  'pink-light': '#fda4cf',
  'pink-dark': '#be185d'
};

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
  disabledDates = [], // Make sure this has a default value
  minDate,
  maxDate,
  disabled = false,
  readOnly = false,
  firstDayOfWeek = 1,
  highlightedDates = [],
  locale = 'en',
  visibleMonths = 1
}: CalendarProps & { firstDayOfWeek?: number; locale?: string; visibleMonths?: number }) => {
  // Helper function to normalize date to local midnight (ignore time and timezone)
  const normalizeDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Helper function to check if a date is disabled
  const isDateDisabled = (date: Date): boolean => {
    const normalizedDate = normalizeDate(date);
    return disabledDates.some((disabledDate) => {
      const normalizedDisabledDate = normalizeDate(disabledDate);
      return normalizedDate === normalizedDisabledDate;
    });
  };

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

  // Compare only year, month, day (ignore time)
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const getStartDayOfMonth = (year: number, month: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    return (firstDay - firstDayOfWeek + 7) % 7;
  };

  const baseWeekdayNames = weekdayNamesByLocale[locale] || weekdayNamesByLocale['en'];
  const weekdayNames = [...baseWeekdayNames.slice(firstDayOfWeek), ...baseWeekdayNames.slice(0, firstDayOfWeek)];

  // Memoized month names by locale
  const monthNames = useMemo(() => {
    return monthNamesByLocale[locale] || monthNamesByLocale['en'];
  }, [locale]);

  // Helper function to check if date is in min/max range
  const isDateInRange = (date: Date): boolean => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (dateOnly < minDateOnly) {
        return false;
      }
    }

    if (maxDate) {
      const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (dateOnly > maxDateOnly) {
        return false;
      }
    }

    return true;
  };

  // Function to compute days for a specific month
  const getMonthDays = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    // Prev month days
    const startDayIndex = getStartDayOfMonth(year, month);
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const prevDays = [];
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      date.setHours(0, 0, 0, 0);

      const isDisabled = disabled || !isDateInRange(date) || isDateDisabled(date);
      const isInRange = !!(
        selectedRange[0] &&
        selectedRange[1] &&
        date >= selectedRange[0] &&
        date <= selectedRange[1]
      );
      const isRangeStart = !!(selectedRange[0] && isSameDay(date, selectedRange[0]));
      const isRangeEnd = !!(selectedRange[1] && isSameDay(date, selectedRange[1]));
      const highlight = highlightedDates.find((h) => isSameDay(h.date, date));

      prevDays.push({
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

    // Current month days
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);

      const isToday = isSameDay(date, today);
      const isSelected = !!(selectedDate && isSameDay(date, selectedDate));
      const isDisabled = disabled || !isDateInRange(date) || isDateDisabled(date);
      const isInRange = !!(
        selectedRange[0] &&
        selectedRange[1] &&
        date >= selectedRange[0] &&
        date <= selectedRange[1]
      );
      const isRangeStart = !!(selectedRange[0] && isSameDay(date, selectedRange[0]));
      const isRangeEnd = !!(selectedRange[1] && isSameDay(date, selectedRange[1]));
      const highlight = highlightedDates.find((h) => isSameDay(h.date, date));

      currDays.push({
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

    // Next month days
    const totalDaysDisplayed = startDayIndex + daysInMonth;
    const remainingCells = 42 - totalDaysDisplayed; // 6 weeks
    const nextDays = [];
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      date.setHours(0, 0, 0, 0);

      const isDisabled = disabled || !isDateInRange(date) || isDateDisabled(date);
      const isInRange = !!(
        selectedRange[0] &&
        selectedRange[1] &&
        date >= selectedRange[0] &&
        date <= selectedRange[1]
      );
      const isRangeStart = !!(selectedRange[0] && isSameDay(date, selectedRange[0]));
      const isRangeEnd = !!(selectedRange[1] && isSameDay(date, selectedRange[1]));
      const highlight = highlightedDates.find((h) => isSameDay(h.date, date));

      nextDays.push({
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

    const daysInCalendar = [...prevDays, ...currDays, ...nextDays];
    const weeks = groupDaysIntoWeeks(daysInCalendar);

    return { weeks, daysInCalendar, label: `${monthNames[month]} ${year}` };
  };

  // Compute month datas for visible months
  const monthDatas = useMemo(() => {
    const datas = [];
    if (visibleMonths === 1) {
      // Current month only
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthDayData = getMonthDays(monthDate);
      datas.push({
        monthDate,
        weeks: monthDayData.weeks,
        label: monthDayData.label
      });
    } else if (visibleMonths === 2) {
      // Current and next month
      for (let i = 0; i < 2; i++) {
        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthDayData = getMonthDays(monthDate);
        datas.push({
          monthDate,
          weeks: monthDayData.weeks,
          label: monthDayData.label
        });
      }
    } else if (visibleMonths === 3) {
      // Previous, current, and next month
      for (let i = -1; i <= 1; i++) {
        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthDayData = getMonthDays(monthDate);
        datas.push({
          monthDate,
          weeks: monthDayData.weeks,
          label: monthDayData.label
        });
      }
    }
    return datas;
  }, [
    currentDate,
    visibleMonths,
    selectedDate,
    selectedRange,
    disabledDates,
    minDate,
    maxDate,
    disabled,
    readOnly,
    highlightedDates,
    firstDayOfWeek,
    locale
  ]);

  const handleDayClick = (date: Date, isDisabled: boolean) => {
    // Check if date is actually disabled
    const isActuallyDisabled = isDisabled || readOnly || !isDateInRange(date) || isDateDisabled(date);

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

  // Example usage: convert the current date to CalendarDate
  const currentCalendarDate = dateToCalendarDate(currentDate);

  return {
    monthDatas,
    weekdayNames,
    monthNames,
    currentDate,
    setCurrentDate,
    currentCalendarDate,
    selectedDate: Array.isArray(initialSelectedDate) ? null : selectedDate,
    selectedRange: Array.isArray(initialSelectedDate) ? selectedRange : [null, null],
    isSameDay,
    getStartDayOfMonth,
    groupDaysIntoWeeks,
    handleDayClick,
    goToPrevMonth,
    goToNextMonth,
    onDateChange,
    disabledDates
  };
};
