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

// Abbreviated weekday names
const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const useCalendar = ({
  selectedDate: initialSelectedDate = null,
  onDateChange,
  disabledDates = []
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(initialSelectedDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialSelectedDate);

  useEffect(() => {
    setSelectedDate(initialSelectedDate);
    if (initialSelectedDate) {
      setCurrentDate(initialSelectedDate);
    }
  }, [initialSelectedDate]);

  // Checks if two dates are the same day
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  // Gets the index of the first day of the month (Monday as 0)
  const getStartDayOfMonth = (year: number, month: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

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
    }[] = [];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayIndex = getStartDayOfMonth(year, month);
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Days from the previous month
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      const isDisabled = disabledDates.some((d) => isSameDay(d, date));
      days.push({ date, isCurrentMonth: false, isToday: false, isSelected: false, isDisabled });
    }

    // Days from the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = isSameDay(date, today);
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      const isDisabled = disabledDates.some((d) => isSameDay(d, date));
      days.push({ date, isCurrentMonth: true, isToday, isSelected, isDisabled });
    }

    // Days from the next month
    const totalDaysDisplayed = days.length;
    const remainingCells = 42 - totalDaysDisplayed;

    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      const isDisabled = disabledDates.some((d) => isSameDay(d, date));
      days.push({ date, isCurrentMonth: false, isToday: false, isSelected: false, isDisabled });
    }

    return days;
  }, [currentDate, selectedDate, disabledDates]);

  const handleDayClick = (date: Date, isDisabled: boolean) => {
    if (isDisabled) {
      return;
    }
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
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
  };
};
