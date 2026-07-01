import { type CSSProperties, type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  type CalendarColor,
  type CalendarProps,
  type CalendarSelection,
  type CalendarVariant,
  calendarColorTones,
  calendarDayButtonVariants,
  calendarGridVariants,
  calendarHeaderVariants,
  calendarIconButtonVariants,
  calendarMonthHeadingVariants,
  calendarMonthSectionVariants,
  calendarMonthsLayoutVariants,
  calendarNavigationIconVariants,
  calendarPickerHeaderContentVariants,
  calendarPickerHeaderVariants,
  calendarPickerHeadingVariants,
  calendarPickerMetaVariants,
  calendarPickerOptionsGridVariants,
  calendarPickerOptionVariants,
  calendarPickerPanelsVariants,
  calendarPickerSectionVariants,
  calendarPickerVariants,
  calendarTriggerButtonVariants,
  calendarVariants,
  calendarWeekdayVariants,
  calendarWeekRowVariants
} from './types';

type SelectionShape = 'none' | 'single' | 'rangeStart' | 'rangeMiddle' | 'rangeEnd';

type LocalizedText = {
  backToCalendar: string;
  calendarGrid: string;
  chooseMonthAndYear: string;
  nextMonth: string;
  previousMonth: string;
  selected: string;
  selectedRange: string;
  startDate: string;
  today: string;
  unavailable: string;
  years: string;
  months: string;
};

type CalendarDayViewModel = {
  ariaLabel: string;
  buttonClassName: string;
  buttonProps: {
    'aria-current'?: 'date';
    'aria-label': string;
    'aria-disabled': boolean;
    disabled: boolean;
    onClick: () => void;
    onFocus: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
    ref: (element: HTMLButtonElement | null) => void;
    tabIndex: number;
    type: 'button';
  };
  cellProps: {
    'aria-disabled': boolean;
    'aria-selected': boolean;
    role: 'gridcell';
  };
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  key: string;
  style?: CSSProperties;
};

type CalendarMonthViewModel = {
  gridId: string;
  key: string;
  label: string;
  labelId: string;
  monthDate: Date;
  weeks: CalendarDayViewModel[][];
};

type PickerOption = {
  ariaLabel: string;
  className: string;
  key: string;
  label: string;
  props: {
    'aria-label': string;
    'aria-pressed': boolean;
    disabled: boolean;
    onClick: () => void;
    type: 'button';
  };
};

type UseCalendarReturn = {
  calendarClassName: string;
  calendarGridClassName: string;
  calendarLabel: string;
  headerClassName: string;
  headerLabel: string;
  isPickerOpen: boolean;
  isVisible: boolean;
  liveRegionLabel: string;
  monthHeadingClassName: string;
  monthPickerLabel: string;
  monthSectionClassName: string;
  months: CalendarMonthViewModel[];
  monthsLayoutClassName: string;
  navigationIconClassName: string;
  nextButtonProps: {
    'aria-label': string;
    className: string;
    disabled: boolean;
    onClick: () => void;
    type: 'button';
  };
  pickerDialogProps: {
    'aria-label': string;
    'aria-modal': 'false';
    className: string;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
    role: 'dialog';
  };
  pickerCloseButtonProps: {
    'aria-label': string;
    className: string;
    onClick: () => void;
    ref: (element: HTMLButtonElement | null) => void;
    type: 'button';
  };
  pickerHeaderClassName: string;
  pickerHeaderContentClassName: string;
  pickerHeadingClassName: string;
  pickerMetaClassName: string;
  pickerMonthOptions: PickerOption[];
  pickerOptionsGridClassName: string;
  pickerPanelsClassName: string;
  pickerSectionClassName: string;
  pickerYearOptions: PickerOption[];
  previousButtonProps: {
    'aria-label': string;
    className: string;
    disabled: boolean;
    onClick: () => void;
    type: 'button';
  };
  themeClassName: string;
  togglePickerButtonProps: {
    'aria-expanded': boolean;
    'aria-haspopup': 'dialog';
    'aria-label': string;
    className: string;
    disabled: boolean;
    onClick: () => void;
    ref: (element: HTMLButtonElement | null) => void;
    type: 'button';
  };
  weekRowClassName: string;
  weekdayClassName: string;
  weekdayHeaders: string[];
  yearsLabel: string;
};

const EMPTY_DISABLED_DATES: Date[] = [];

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const normalizeNullableDate = (date: Date | null | undefined): Date | null => (date ? startOfDay(date) : null);

const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

const createDate = (year: number, month: number, day: number): Date => {
  const safeDay = Math.min(day, getDaysInMonth(year, month));
  return new Date(year, month, safeDay);
};

const addDays = (date: Date, amount: number): Date => {
  const nextDate = startOfDay(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return startOfDay(nextDate);
};

const addMonths = (date: Date, amount: number): Date => {
  const normalizedDate = startOfDay(date);
  return createDate(normalizedDate.getFullYear(), normalizedDate.getMonth() + amount, normalizedDate.getDate());
};

const isSameDay = (left: Date | null, right: Date | null): boolean => {
  if (!left || !right) {
    return false;
  }

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isDateBefore = (left: Date, right: Date): boolean => startOfDay(left).getTime() < startOfDay(right).getTime();

const isDateAfter = (left: Date, right: Date): boolean => startOfDay(left).getTime() > startOfDay(right).getTime();

const isDateBetweenInclusive = (date: Date, start: Date, end: Date): boolean => {
  const dateTime = startOfDay(date).getTime();
  const startTime = startOfDay(start).getTime();
  const endTime = startOfDay(end).getTime();
  return dateTime >= Math.min(startTime, endTime) && dateTime <= Math.max(startTime, endTime);
};

const clampFirstDayOfWeek = (value: number | undefined): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 1;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 6) {
    return 6;
  }

  return value;
};

const resolveInitialCurrentDate = (selectedDate: CalendarSelection | undefined): Date => {
  if (Array.isArray(selectedDate)) {
    return normalizeNullableDate(selectedDate[0]) ?? normalizeNullableDate(selectedDate[1]) ?? startOfDay(new Date());
  }

  return normalizeNullableDate(selectedDate) ?? startOfDay(new Date());
};

const resolveInitialFocusedDate = (selectedDate: CalendarSelection | undefined): Date => {
  if (Array.isArray(selectedDate)) {
    return normalizeNullableDate(selectedDate[1]) ?? normalizeNullableDate(selectedDate[0]) ?? startOfDay(new Date());
  }

  return normalizeNullableDate(selectedDate) ?? startOfDay(new Date());
};

const getLocaleText = (locale: string): LocalizedText => {
  if (locale.toLowerCase().startsWith('es')) {
    return {
      previousMonth: 'Mes anterior',
      nextMonth: 'Mes siguiente',
      chooseMonthAndYear: 'Elegir mes y año',
      backToCalendar: 'Volver al calendario',
      calendarGrid: 'Calendario',
      months: 'Meses',
      years: 'Años',
      today: 'Hoy',
      selected: 'Seleccionado',
      selectedRange: 'Dentro del rango seleccionado',
      startDate: 'Fecha de inicio',
      unavailable: 'No disponible'
    };
  }

  return {
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    chooseMonthAndYear: 'Choose month and year',
    backToCalendar: 'Back to calendar',
    calendarGrid: 'Calendar',
    months: 'Months',
    years: 'Years',
    today: 'Today',
    selected: 'Selected',
    selectedRange: 'In selected range',
    startDate: 'Start date',
    unavailable: 'Unavailable'
  };
};

const buildWeekdayHeaders = (locale: string, firstDayOfWeek: number): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const baseDate = new Date(2024, 0, 7);
  const headers = Array.from({ length: 7 }, (_, index) => formatter.format(addDays(baseDate, index)));
  return [...headers.slice(firstDayOfWeek), ...headers.slice(0, firstDayOfWeek)];
};

const buildMonthLabel = (locale: string, date: Date): string =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);

const buildLongDateLabel = (locale: string, date: Date): string =>
  new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);

const getMonthOffsets = (visibleMonths: number): number[] => {
  if (visibleMonths <= 1) {
    return [0];
  }

  if (visibleMonths === 3) {
    return [-1, 0, 1];
  }

  return Array.from({ length: visibleMonths }, (_, index) => index);
};

const getSelectionShape = (
  date: Date,
  isRangeMode: boolean,
  selectedSingle: Date | null,
  selectedRange: [Date | null, Date | null]
): SelectionShape => {
  if (!isRangeMode) {
    return isSameDay(date, selectedSingle) ? 'single' : 'none';
  }

  const [rangeStart, rangeEnd] = selectedRange;

  if (rangeStart && rangeEnd) {
    if (isSameDay(rangeStart, rangeEnd) && isSameDay(date, rangeStart)) {
      return 'single';
    }

    if (isSameDay(date, rangeStart)) {
      return 'rangeStart';
    }

    if (isSameDay(date, rangeEnd)) {
      return 'rangeEnd';
    }

    if (isDateBetweenInclusive(date, rangeStart, rangeEnd)) {
      return 'rangeMiddle';
    }

    return 'none';
  }

  if (rangeStart && isSameDay(date, rangeStart)) {
    return 'single';
  }

  return 'none';
};

const getColorClasses = (color: CalendarColor, variant: CalendarVariant, selectionShape: SelectionShape): string => {
  if (selectionShape === 'none') {
    return '';
  }

  const tone = calendarColorTones[color];
  const isRangeMiddle = selectionShape === 'rangeMiddle';

  switch (variant) {
    case 'outlined':
      return isRangeMiddle ? tone.outlinedRange : tone.outlinedSelected;
    case 'soft':
      return isRangeMiddle ? tone.softRange : tone.softSelected;
    case 'ghost':
      return isRangeMiddle ? tone.ghostRange : tone.ghostSelected;
    default:
      return isRangeMiddle ? tone.filledRange : tone.filledSelected;
  }
};

const isMonthOutsideRange = (monthDate: Date, minDate?: Date, maxDate?: Date): boolean => {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

  if (minDate && isDateBefore(monthEnd, minDate)) {
    return true;
  }

  if (maxDate && isDateAfter(monthStart, maxDate)) {
    return true;
  }

  return false;
};

const buildHeaderLabel = (locale: string, monthDates: Date[]): string => {
  if (monthDates.length === 1) {
    return buildMonthLabel(locale, monthDates[0]);
  }

  const first = monthDates[0];
  const last = monthDates[monthDates.length - 1];
  const firstMonth = new Intl.DateTimeFormat(locale, { month: 'long' }).format(first);
  const lastMonth = new Intl.DateTimeFormat(locale, { month: 'long' }).format(last);
  const firstYear = first.getFullYear();
  const lastYear = last.getFullYear();

  return firstYear === lastYear
    ? `${firstMonth} – ${lastMonth} ${firstYear}`
    : `${firstMonth} ${firstYear} – ${lastMonth} ${lastYear}`;
};

export const useCalendar = ({
  color = 'default',
  selectedDate,
  onDateChange,
  autoFocusOnMount = false,
  disabledDates = EMPTY_DISABLED_DATES,
  variant = 'filled',
  size = 'md',
  radius = 'md',
  show = true,
  maxDate,
  minDate,
  disabled = false,
  readOnly = false,
  firstDayOfWeek = 1,
  theme = 'light',
  highlightedDates = [],
  locale = 'en',
  visibleMonths = 1
}: CalendarProps): UseCalendarReturn => {
  const normalizedMinDate = useMemo(() => normalizeNullableDate(minDate), [minDate]);
  const normalizedMaxDate = useMemo(() => normalizeNullableDate(maxDate), [maxDate]);
  const normalizedDisabledDates = useMemo(
    () => new Set(disabledDates.map((date) => toDateKey(startOfDay(date)))),
    [disabledDates]
  );
  const normalizedHighlightedDates = useMemo(
    () =>
      new Map(
        highlightedDates.map((entry) => [
          toDateKey(startOfDay(entry.date)),
          { className: entry.className, style: entry.style }
        ])
      ),
    [highlightedDates]
  );
  const localizedText = useMemo(() => getLocaleText(locale), [locale]);
  const weekdayHeaders = useMemo(
    () => buildWeekdayHeaders(locale, clampFirstDayOfWeek(firstDayOfWeek)),
    [firstDayOfWeek, locale]
  );
  const monthOffsets = useMemo(() => getMonthOffsets(Math.max(1, visibleMonths)), [visibleMonths]);
  const isRangeMode = Array.isArray(selectedDate);
  const baseId = useId();

  const isDateUnavailable = (date: Date): boolean => {
    const normalizedDate = startOfDay(date);
    const dateKey = toDateKey(normalizedDate);

    if (disabled || readOnly) {
      return true;
    }

    if (normalizedMinDate && isDateBefore(normalizedDate, normalizedMinDate)) {
      return true;
    }

    if (normalizedMaxDate && isDateAfter(normalizedDate, normalizedMaxDate)) {
      return true;
    }

    return normalizedDisabledDates.has(dateKey);
  };

  const findEnabledDateFrom = (targetDate: Date, step: 1 | -1): Date | null => {
    let nextDate = startOfDay(targetDate);

    for (let attempt = 0; attempt < 366; attempt += 1) {
      if (!isDateUnavailable(nextDate)) {
        return nextDate;
      }

      nextDate = addDays(nextDate, step);
    }

    return null;
  };

  const resolveEnabledDate = (preferredDate: Date): Date => {
    const normalizedPreferredDate = startOfDay(preferredDate);

    if (!isDateUnavailable(normalizedPreferredDate)) {
      return normalizedPreferredDate;
    }

    const boundedStartDate =
      normalizedMinDate && isDateBefore(normalizedPreferredDate, normalizedMinDate)
        ? normalizedMinDate
        : normalizedPreferredDate;
    const forwardDate = findEnabledDateFrom(boundedStartDate, 1);

    if (forwardDate) {
      return forwardDate;
    }

    const boundedEndDate =
      normalizedMaxDate && isDateAfter(normalizedPreferredDate, normalizedMaxDate)
        ? normalizedMaxDate
        : normalizedPreferredDate;
    const backwardDate = findEnabledDateFrom(boundedEndDate, -1);

    return backwardDate ?? normalizedPreferredDate;
  };

  const initialCurrentDate = resolveEnabledDate(resolveInitialCurrentDate(selectedDate));
  const initialFocusedDate = resolveEnabledDate(resolveInitialFocusedDate(selectedDate));

  const [currentDate, setCurrentDate] = useState<Date>(() => initialCurrentDate);
  const [focusedDate, setFocusedDate] = useState<Date>(() => initialFocusedDate);
  const [selectedSingle, setSelectedSingle] = useState<Date | null>(() =>
    Array.isArray(selectedDate) ? null : normalizeNullableDate(selectedDate)
  );
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>(() =>
    Array.isArray(selectedDate)
      ? [normalizeNullableDate(selectedDate[0]), normalizeNullableDate(selectedDate[1])]
      : [null, null]
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusKeyRef = useRef<string | null>(null);
  const hasAutoFocusAttemptedOnMountRef = useRef(false);
  const pickerCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const togglePickerButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (Array.isArray(selectedDate)) {
      const nextRange: [Date | null, Date | null] = [
        normalizeNullableDate(selectedDate[0]),
        normalizeNullableDate(selectedDate[1])
      ];
      setSelectedRange(nextRange);
      setSelectedSingle(null);

      const nextCurrentDate = resolveEnabledDate(nextRange[0] ?? nextRange[1] ?? focusedDate);
      setCurrentDate(nextCurrentDate);
      setFocusedDate(resolveEnabledDate(nextRange[1] ?? nextCurrentDate));
      return;
    }

    const nextSelectedDate = normalizeNullableDate(selectedDate);
    setSelectedSingle(nextSelectedDate);
    setSelectedRange([null, null]);

    const nextFocusedDate = resolveEnabledDate(nextSelectedDate ?? focusedDate);
    setCurrentDate(nextFocusedDate);
    setFocusedDate(nextFocusedDate);
  }, [selectedDate, normalizedMaxDate, normalizedMinDate, normalizedDisabledDates, disabled, readOnly]);

  const isDateDisabled = (date: Date): boolean => isDateUnavailable(date);

  const updateSelection = (date: Date) => {
    const normalizedDate = startOfDay(date);

    if (isRangeMode) {
      const [rangeStart, rangeEnd] = selectedRange;

      if (!rangeStart || rangeEnd) {
        const nextRange: [Date | null, Date | null] = [normalizedDate, null];
        setSelectedRange(nextRange);
        onDateChange?.(nextRange);
        return;
      }

      const nextRange: [Date | null, Date | null] = isDateBefore(normalizedDate, rangeStart)
        ? [normalizedDate, rangeStart]
        : [rangeStart, normalizedDate];

      setSelectedRange(nextRange);
      onDateChange?.(nextRange);
      return;
    }

    setSelectedSingle(normalizedDate);
    onDateChange?.(normalizedDate);
  };

  const alignCurrentDateToFocus = (nextFocusedDate: Date) => {
    const enabledDate = resolveEnabledDate(nextFocusedDate);
    setCurrentDate(enabledDate);
    setFocusedDate(enabledDate);
    pendingFocusKeyRef.current = toDateKey(enabledDate);
  };

  const goToPreviousMonth = () => {
    const previousMonthDate = addMonths(currentDate, -1);
    alignCurrentDateToFocus(previousMonthDate);
  };

  const goToNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    alignCurrentDateToFocus(nextMonthDate);
  };

  const closePicker = () => {
    setIsPickerOpen(false);
    togglePickerButtonRef.current?.focus();
  };

  const findNextEnabledDate = (targetDate: Date, step: 1 | -1): Date | null => {
    let nextDate = startOfDay(targetDate);

    for (let attempt = 0; attempt < 366; attempt += 1) {
      if (!isDateDisabled(nextDate)) {
        return nextDate;
      }

      nextDate = addDays(nextDate, step);
    }

    return null;
  };

  const handleDayKeyDown = (date: Date, isDisabledDate: boolean) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabledDate) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      updateSelection(date);
      return;
    }

    let nextFocusedDate: Date | null = null;
    let searchStep: 1 | -1 = 1;

    switch (event.key) {
      case 'ArrowRight':
        nextFocusedDate = addDays(date, 1);
        searchStep = 1;
        break;
      case 'ArrowLeft':
        nextFocusedDate = addDays(date, -1);
        searchStep = -1;
        break;
      case 'ArrowDown':
        nextFocusedDate = addDays(date, 7);
        searchStep = 1;
        break;
      case 'ArrowUp':
        nextFocusedDate = addDays(date, -7);
        searchStep = -1;
        break;
      case 'Home':
        nextFocusedDate = addDays(date, -((date.getDay() - clampFirstDayOfWeek(firstDayOfWeek) + 7) % 7));
        searchStep = 1;
        break;
      case 'End':
        nextFocusedDate = addDays(date, 6 - ((date.getDay() - clampFirstDayOfWeek(firstDayOfWeek) + 7) % 7));
        searchStep = -1;
        break;
      case 'PageUp':
        nextFocusedDate = addMonths(date, event.shiftKey ? -12 : -1);
        searchStep = -1;
        break;
      case 'PageDown':
        nextFocusedDate = addMonths(date, event.shiftKey ? 12 : 1);
        searchStep = 1;
        break;
      default:
        break;
    }

    if (!nextFocusedDate) {
      return;
    }

    event.preventDefault();

    const enabledFocusedDate = isDateDisabled(nextFocusedDate)
      ? findNextEnabledDate(nextFocusedDate, searchStep)
      : nextFocusedDate;

    if (!enabledFocusedDate) {
      return;
    }

    alignCurrentDateToFocus(enabledFocusedDate);
  };

  const monthDates = useMemo(
    () => monthOffsets.map((offset) => new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)),
    [currentDate, monthOffsets]
  );

  const enabledDateKeys = useMemo(() => {
    const keys: string[] = [];

    for (const monthDate of monthDates) {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const monthStartOffset = (new Date(year, month, 1).getDay() - clampFirstDayOfWeek(firstDayOfWeek) + 7) % 7;
      const gridStartDate = new Date(year, month, 1 - monthStartOffset);

      for (let index = 0; index < 42; index += 1) {
        const date = addDays(gridStartDate, index);
        if (!isDateDisabled(date)) {
          keys.push(toDateKey(date));
        }
      }
    }

    return keys;
  }, [firstDayOfWeek, monthDates, normalizedDisabledDates, normalizedMaxDate, normalizedMinDate, disabled, readOnly]);

  const effectiveFocusedDate = useMemo(() => {
    if (enabledDateKeys.includes(toDateKey(focusedDate))) {
      return focusedDate;
    }

    const firstEnabledDateKey = enabledDateKeys[0];
    if (!firstEnabledDateKey) {
      return focusedDate;
    }

    const [year, month, day] = firstEnabledDateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [enabledDateKeys, focusedDate]);

  const months = useMemo<CalendarMonthViewModel[]>(() => {
    return monthDates.map((monthDate, monthIndex) => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const monthStartOffset = (new Date(year, month, 1).getDay() - clampFirstDayOfWeek(firstDayOfWeek) + 7) % 7;
      const gridStartDate = new Date(year, month, 1 - monthStartOffset);
      const label = buildMonthLabel(locale, monthDate);
      const labelId = `${baseId}-month-label-${monthIndex}`;
      const gridId = `${baseId}-grid-${monthIndex}`;
      const weeks: CalendarDayViewModel[][] = [];

      for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
        const week: CalendarDayViewModel[] = [];

        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
          const date = addDays(gridStartDate, weekIndex * 7 + dayIndex);
          const dateKey = toDateKey(date);
          const selectionShape = getSelectionShape(date, isRangeMode, selectedSingle, selectedRange);
          const isCurrentMonth = date.getMonth() === month;
          const isDisabledDate = isDateDisabled(date);
          const isToday = isSameDay(date, startOfDay(new Date()));
          const highlight = normalizedHighlightedDates.get(dateKey);
          const isSelected = selectionShape !== 'none';
          const ariaLabelParts = [buildLongDateLabel(locale, date)];

          if (isToday) {
            ariaLabelParts.push(localizedText.today);
          }

          if (selectionShape === 'single') {
            ariaLabelParts.push(localizedText.selected);
          }

          if (selectionShape === 'rangeStart') {
            ariaLabelParts.push(localizedText.startDate);
          }

          if (selectionShape === 'rangeMiddle' || selectionShape === 'rangeEnd') {
            ariaLabelParts.push(localizedText.selectedRange);
          }

          if (isDisabledDate) {
            ariaLabelParts.push(localizedText.unavailable);
          }

          const ariaLabel = ariaLabelParts.join('. ');
          const buttonClassName = cn(
            calendarDayButtonVariants({
              variant,
              size,
              radius,
              currentMonth: isCurrentMonth,
              interactive: !isDisabledDate,
              disabled: isDisabledDate,
              today: isToday,
              selectionShape
            }),
            getColorClasses(color, variant, selectionShape),
            selectionShape === 'none' && highlight?.className
          );

          week.push({
            key: dateKey,
            date,
            dayNumber: date.getDate(),
            ariaLabel,
            isCurrentMonth,
            buttonClassName,
            style: highlight?.style,
            cellProps: {
              role: 'gridcell',
              'aria-selected': isSelected,
              'aria-disabled': isDisabledDate
            },
            buttonProps: {
              type: 'button',
              disabled: isDisabledDate,
              'aria-disabled': isDisabledDate,
              'aria-label': ariaLabel,
              'aria-current': isToday ? 'date' : undefined,
              tabIndex: !isDisabledDate && isCurrentMonth && isSameDay(date, effectiveFocusedDate) ? 0 : -1,
              onClick: () => updateSelection(date),
              onFocus: () => setFocusedDate(date),
              onKeyDown: handleDayKeyDown(date, isDisabledDate),
              ref: (element) => {
                if (!isCurrentMonth) {
                  return;
                }

                if (element) {
                  dayButtonRefs.current.set(dateKey, element);
                  return;
                }

                dayButtonRefs.current.delete(dateKey);
              }
            }
          });
        }

        weeks.push(week);
      }

      return {
        key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        monthDate,
        label,
        labelId,
        gridId,
        weeks
      };
    });
  }, [
    baseId,
    color,
    effectiveFocusedDate,
    firstDayOfWeek,
    isRangeMode,
    locale,
    localizedText.selected,
    localizedText.selectedRange,
    localizedText.startDate,
    localizedText.today,
    localizedText.unavailable,
    monthDates,
    normalizedHighlightedDates,
    radius,
    selectedRange,
    selectedSingle,
    size,
    variant,
    disabled,
    readOnly,
    normalizedDisabledDates,
    normalizedMaxDate,
    normalizedMinDate
  ]);

  useEffect(() => {
    if (!pendingFocusKeyRef.current) {
      return;
    }

    const nextFocusedElement = dayButtonRefs.current.get(pendingFocusKeyRef.current);
    nextFocusedElement?.focus();
    pendingFocusKeyRef.current = null;
  }, [months]);

  useEffect(() => {
    if (hasAutoFocusAttemptedOnMountRef.current) {
      return;
    }

    hasAutoFocusAttemptedOnMountRef.current = true;

    if (!autoFocusOnMount || !show || disabled || readOnly || isPickerOpen) {
      return;
    }

    const focusedElement = dayButtonRefs.current.get(toDateKey(effectiveFocusedDate));

    if (!focusedElement || focusedElement.disabled) {
      return;
    }

    focusedElement.focus();
  }, [autoFocusOnMount, disabled, effectiveFocusedDate, isPickerOpen, readOnly, show]);

  const headerLabel = useMemo(() => buildHeaderLabel(locale, monthDates), [locale, monthDates]);
  const calendarLabel = `${localizedText.calendarGrid}: ${headerLabel}`;

  const pickerYears = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const lowerBound = normalizedMinDate?.getFullYear() ?? currentYear - 6;
    const upperBound = normalizedMaxDate?.getFullYear() ?? currentYear + 6;
    const startYear = Math.max(lowerBound, currentYear - 5);
    const endYear = Math.min(upperBound, startYear + 11);
    const adjustedStartYear = Math.max(lowerBound, endYear - 11);

    return Array.from({ length: endYear - adjustedStartYear + 1 }, (_, index) => adjustedStartYear + index);
  }, [currentDate, normalizedMaxDate, normalizedMinDate]);

  const pickerMonthOptions = useMemo<PickerOption[]>(() => {
    const tone = calendarColorTones[color];

    return Array.from({ length: 12 }, (_, monthIndex) => {
      const monthDate = new Date(currentDate.getFullYear(), monthIndex, 1);
      const selected = currentDate.getMonth() === monthIndex;
      const monthDisabled = isMonthOutsideRange(
        monthDate,
        normalizedMinDate ?? undefined,
        normalizedMaxDate ?? undefined
      );
      const label = new Intl.DateTimeFormat(locale, { month: 'long' }).format(monthDate);

      return {
        key: `${monthIndex}`,
        label,
        ariaLabel: label,
        className: cn(
          calendarPickerOptionVariants({ size, selected, disabled: monthDisabled }),
          selected ? tone.pickerSelected : tone.pickerHover
        ),
        props: {
          type: 'button',
          disabled: monthDisabled,
          'aria-pressed': selected,
          'aria-label': label,
          onClick: () => {
            const nextDate = createDate(currentDate.getFullYear(), monthIndex, currentDate.getDate());
            alignCurrentDateToFocus(nextDate);
            setIsPickerOpen(false);
          }
        }
      };
    });
  }, [color, currentDate, locale, normalizedMaxDate, normalizedMinDate, size]);

  const pickerYearOptions = useMemo<PickerOption[]>(() => {
    const tone = calendarColorTones[color];

    return pickerYears.map((year) => {
      const selected = currentDate.getFullYear() === year;
      const monthDate = new Date(year, currentDate.getMonth(), 1);
      const yearDisabled = isMonthOutsideRange(
        monthDate,
        normalizedMinDate ?? undefined,
        normalizedMaxDate ?? undefined
      );

      return {
        key: `${year}`,
        label: `${year}`,
        ariaLabel: `${year}`,
        className: cn(
          calendarPickerOptionVariants({ size, selected, disabled: yearDisabled }),
          selected ? tone.pickerSelected : tone.pickerHover
        ),
        props: {
          type: 'button',
          disabled: yearDisabled,
          'aria-pressed': selected,
          'aria-label': `${year}`,
          onClick: () => {
            const nextDate = createDate(year, currentDate.getMonth(), currentDate.getDate());
            alignCurrentDateToFocus(nextDate);
            setIsPickerOpen(false);
          }
        }
      };
    });
  }, [color, currentDate, normalizedMaxDate, normalizedMinDate, pickerYears, size]);

  useEffect(() => {
    if (isPickerOpen) {
      pickerCloseButtonRef.current?.focus();
    }
  }, [isPickerOpen]);

  const handlePickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    closePicker();
  };

  const monthPickerLabel = localizedText.months;
  const yearsLabel = localizedText.years;
  const isNavigationDisabled = disabled || readOnly;

  return {
    isVisible: show,
    themeClassName: theme === 'dark' ? 'dark' : '',
    calendarClassName: calendarVariants({ variant, size, radius, disabled, readOnly }),
    calendarGridClassName: calendarGridVariants({ size }),
    calendarLabel,
    headerClassName: calendarHeaderVariants({ size }),
    headerLabel,
    liveRegionLabel: headerLabel,
    monthHeadingClassName: calendarMonthHeadingVariants({ size }),
    monthPickerLabel,
    monthSectionClassName: calendarMonthSectionVariants({ size }),
    monthsLayoutClassName: calendarMonthsLayoutVariants({ size }),
    navigationIconClassName: calendarNavigationIconVariants({ size }),
    yearsLabel,
    weekRowClassName: calendarWeekRowVariants({ size }),
    weekdayClassName: calendarWeekdayVariants({ size }),
    weekdayHeaders,
    months,
    isPickerOpen,
    pickerDialogProps: {
      role: 'dialog',
      'aria-modal': 'false',
      'aria-label': localizedText.chooseMonthAndYear,
      className: calendarPickerVariants({ size }),
      onKeyDown: handlePickerKeyDown
    },
    pickerHeaderClassName: calendarPickerHeaderVariants({ size }),
    pickerHeaderContentClassName: calendarPickerHeaderContentVariants({ size }),
    pickerHeadingClassName: calendarPickerHeadingVariants({ size }),
    pickerMetaClassName: calendarPickerMetaVariants({ size }),
    pickerOptionsGridClassName: calendarPickerOptionsGridVariants({ size }),
    pickerPanelsClassName: calendarPickerPanelsVariants({ size }),
    pickerSectionClassName: calendarPickerSectionVariants({ size }),
    previousButtonProps: {
      type: 'button',
      disabled: isNavigationDisabled,
      'aria-label': localizedText.previousMonth,
      className: calendarIconButtonVariants({ size, disabled: isNavigationDisabled }),
      onClick: goToPreviousMonth
    },
    nextButtonProps: {
      type: 'button',
      disabled: isNavigationDisabled,
      'aria-label': localizedText.nextMonth,
      className: calendarIconButtonVariants({ size, disabled: isNavigationDisabled }),
      onClick: goToNextMonth
    },
    togglePickerButtonProps: {
      type: 'button',
      disabled: isNavigationDisabled,
      'aria-expanded': isPickerOpen,
      'aria-haspopup': 'dialog',
      'aria-label': localizedText.chooseMonthAndYear,
      className: calendarTriggerButtonVariants({ size, disabled: isNavigationDisabled }),
      onClick: () => {
        if (isNavigationDisabled) {
          return;
        }

        if (isPickerOpen) {
          closePicker();
          return;
        }

        setIsPickerOpen(true);
      },
      ref: (element) => {
        togglePickerButtonRef.current = element;
      }
    },
    pickerCloseButtonProps: {
      type: 'button',
      'aria-label': localizedText.backToCalendar,
      className: calendarTriggerButtonVariants({ size, disabled: false }),
      onClick: closePicker,
      ref: (element) => {
        pickerCloseButtonRef.current = element;
      }
    },
    pickerMonthOptions,
    pickerYearOptions
  };
};
