import { CalendarDate } from '@internationalized/date';
import { useMemo, useState } from 'react';
import type { CalendarProps } from './types';

// Utility to convert a native JS Date object to a CalendarDate
function dateToCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

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

      const isDisabled = disabled || readOnly || !isDateInRange(date) || isDateDisabled(date);
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
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);

      const isToday = isSameDay(date, new Date());
      let isSelected = !!(selectedDate && isSameDay(date, selectedDate));
      let isRangeStart = false;
      let isRangeEnd = false;
      let isInRange = false;

      if (Array.isArray(initialSelectedDate)) {
        isSelected = !!(
          (selectedRange[0] && isSameDay(date, selectedRange[0])) ||
          (selectedRange[1] && isSameDay(date, selectedRange[1]))
        );
        isRangeStart = !!(selectedRange[0] && isSameDay(date, selectedRange[0]));
        isRangeEnd = !!(selectedRange[1] && isSameDay(date, selectedRange[1]));
        isInRange = !!(selectedRange[0] && selectedRange[1] && date >= selectedRange[0] && date <= selectedRange[1]);
      }

      const isDisabled = disabled || readOnly || !isDateInRange(date) || isDateDisabled(date);

      if (readOnly) {
        isSelected = false;
        isRangeStart = false;
        isRangeEnd = false;
        isInRange = false;
      }

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

      const isDisabled = disabled || readOnly || !isDateInRange(date) || isDateDisabled(date);
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
    for (let i = 0; i < visibleMonths; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthDayData = getMonthDays(monthDate);
      datas.push({
        monthDate,
        weeks: monthDayData.weeks,
        label: monthDayData.label
      });
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
    const isActuallyDisabled = isDisabled || disabled || readOnly || !isDateInRange(date) || isDateDisabled(date);

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
