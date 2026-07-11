import { useCallback, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { CalendarSelection } from '../../atoms/calendar';
import {
  type DatePickerCalendarSelectionHandler,
  type DatePickerFirstDayOfWeek,
  type DatePickerOpenChangeSource,
  type DatePickerProps,
  datePickerInlineButtonVariants,
  datePickerMessageVariants,
  datePickerValueVariants,
  datePickerVariants,
  type UseDatePickerReturn
} from './types';

const DEFAULT_PLACEHOLDER = 'Select date';
const DEFAULT_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };
const GREGORIAN_LOCALE_FALLBACK = 'en-u-ca-gregory';
const MAX_VISIBLE_MONTHS = 12;

const formatAriaIds = (ids?: string | (string | undefined)[]) => {
  if (!Array.isArray(ids)) {
    return ids;
  }

  return (
    ids
      .map((id) => id?.trim())
      .filter((id): id is string => Boolean(id))
      .join(' ') || undefined
  );
};

const startOfLocalDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isValidDate = (date: Date) => Number.isFinite(date.getTime());

const serializeLocalDate = (date: Date) => {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const serializeLocalDateOrEmpty = (date: Date) => (isValidDate(date) ? serializeLocalDate(date) : '');

const isSameLocalDate = (left: Date, right: Date) => serializeLocalDate(left) === serializeLocalDate(right);

const isBeforeLocalDay = (left: Date, right: Date) =>
  startOfLocalDay(left).getTime() < startOfLocalDay(right).getTime();

const isAfterLocalDay = (left: Date, right: Date) => startOfLocalDay(left).getTime() > startOfLocalDay(right).getTime();

const sanitizeFirstDayOfWeek = (candidate?: number): DatePickerFirstDayOfWeek => {
  if (typeof candidate !== 'number' || !Number.isFinite(candidate)) {
    return 1;
  }

  const normalized = Math.floor(candidate);

  if (normalized < 0 || normalized > 6) {
    return 1;
  }

  return normalized as DatePickerFirstDayOfWeek;
};

const sanitizeVisibleMonths = (candidate?: number) => {
  if (typeof candidate !== 'number' || !Number.isFinite(candidate)) {
    return 1;
  }

  return Math.min(MAX_VISIBLE_MONTHS, Math.max(1, Math.floor(candidate)));
};

const normalizeGregorianLocaleCandidate = (candidate?: string) => {
  if (!candidate) {
    return undefined;
  }

  try {
    return new Intl.Locale(candidate, { calendar: 'gregory' }).toString();
  } catch {
    return undefined;
  }
};

const getBrowserLocaleCandidate = () => {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  return navigator.language;
};

const resolveGregorianLocale = (locale?: string) => {
  const candidates = [
    locale,
    getBrowserLocaleCandidate(),
    Intl.DateTimeFormat().resolvedOptions().locale,
    GREGORIAN_LOCALE_FALLBACK,
    'en'
  ];

  for (const candidate of candidates) {
    const normalized = normalizeGregorianLocaleCandidate(candidate);

    if (!normalized) {
      continue;
    }

    try {
      const resolved = new Intl.DateTimeFormat(normalized, { calendar: 'gregory' }).resolvedOptions();

      if (resolved.calendar === 'gregory') {
        return resolved.locale;
      }
    } catch {
      continue;
    }
  }

  return GREGORIAN_LOCALE_FALLBACK;
};

const sanitizeDateOnlyFormatOptions = (options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions => {
  if (!options) {
    return DEFAULT_FORMAT_OPTIONS;
  }

  const { calendar, dateStyle, day, era, month, weekday, year } = options;
  const sanitized: Intl.DateTimeFormatOptions = {};

  if (calendar === 'gregory') {
    sanitized.calendar = calendar;
  }

  if (dateStyle) {
    sanitized.dateStyle = dateStyle;
    return sanitized;
  }

  if (weekday) {
    sanitized.weekday = weekday;
  }

  if (era) {
    sanitized.era = era;
  }

  if (year) {
    sanitized.year = year;
  }

  if (month) {
    sanitized.month = month;
  }

  if (day) {
    sanitized.day = day;
  }

  return Object.keys(sanitized).length > 0 ? sanitized : DEFAULT_FORMAT_OPTIONS;
};

const formatDisplayDate = ({
  date,
  locale,
  options,
  placeholder
}: {
  date: Date;
  locale: string;
  options: Intl.DateTimeFormatOptions;
  placeholder: string;
}) => {
  if (!isValidDate(date)) {
    return placeholder;
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    try {
      return new Intl.DateTimeFormat(locale, DEFAULT_FORMAT_OPTIONS).format(date);
    } catch {
      return serializeLocalDateOrEmpty(date) || placeholder;
    }
  }
};

const isDateUnavailable = ({
  date,
  disabledDates,
  maxDate,
  minDate
}: {
  date: Date;
  disabledDates: Date[];
  maxDate?: Date;
  minDate?: Date;
}) => {
  if (minDate && isBeforeLocalDay(date, minDate)) {
    return true;
  }

  if (maxDate && isAfterLocalDay(date, maxDate)) {
    return true;
  }

  return disabledDates.some((disabledDate) => isSameLocalDate(disabledDate, date));
};

const isSingleDateSelection = (selection: CalendarSelection): selection is Date | null =>
  selection === null || selection instanceof Date;

export const useDatePicker = ({
  id,
  name,
  label,
  ariaLabel,
  placeholder = DEFAULT_PLACEHOLDER,
  value,
  defaultValue = null,
  onDateChange,
  open,
  defaultOpen = false,
  onOpenChange,
  minDate,
  maxDate,
  disabledDates = [],
  locale,
  formatOptions,
  description,
  firstDayOfWeek,
  visibleMonths,
  variant = 'regular',
  size = 'md',
  rounded = false,
  isFullWidth = false,
  isRequired = false,
  disabled = false,
  readOnly = false,
  isClearable = false,
  validationState = 'default',
  validationMessage,
  className,
  fieldClassName,
  popoverClassName,
  ariaDescribedBy,
  ariaLabelledBy,
  ...rootProps
}: DatePickerProps): UseDatePickerReturn => {
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [shouldRestoreFocusAfterClear, setShouldRestoreFocusAfterClear] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const selectedDate = value !== undefined ? value : internalSelectedDate;
  const requestedOpen = open !== undefined ? open : internalOpen;
  const effectiveOpen = disabled || readOnly ? false : requestedOpen;
  const sanitizedFirstDayOfWeek = sanitizeFirstDayOfWeek(firstDayOfWeek);
  const sanitizedVisibleMonths = sanitizeVisibleMonths(visibleMonths);
  const effectiveLocale = useMemo(() => resolveGregorianLocale(locale), [locale]);
  const sanitizedFormatOptions = useMemo(() => sanitizeDateOnlyFormatOptions(formatOptions), [formatOptions]);
  const externalDescribedBy = formatAriaIds(ariaDescribedBy);
  const labelId = label ? `${id}-label` : undefined;
  const baseLabelledBy = formatAriaIds(ariaLabelledBy ?? labelId);
  const triggerValueId = `${id}-value`;
  const shouldUseAriaLabel = !baseLabelledBy && Boolean(ariaLabel);
  const labelledBy = shouldUseAriaLabel ? undefined : formatAriaIds([baseLabelledBy, triggerValueId]);
  const descriptionId = description ? `${id}-description` : undefined;
  const requiredDescriptionId = isRequired ? `${id}-required` : undefined;
  const readOnlyDescriptionId = readOnly ? `${id}-readonly` : undefined;
  const validationMessageId = validationMessage ? `${id}-validation` : undefined;
  const describedBy =
    [externalDescribedBy, descriptionId, requiredDescriptionId, readOnlyDescriptionId, validationMessageId]
      .filter(Boolean)
      .join(' ') || undefined;

  const displayValue = useMemo(() => {
    if (!selectedDate) {
      return placeholder;
    }

    return formatDisplayDate({
      date: selectedDate,
      locale: effectiveLocale,
      options: sanitizedFormatOptions,
      placeholder
    });
  }, [effectiveLocale, placeholder, sanitizedFormatOptions, selectedDate]);

  const focusTrigger = useCallback(() => {
    triggerRef.current?.focus();
    setShouldRestoreFocusAfterClear(false);
  }, []);

  const requestOpenChange = useCallback(
    (nextOpen: boolean, _source: DatePickerOpenChangeSource = 'programmatic') => {
      if (disabled || readOnly) {
        return;
      }

      if (open === undefined) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [disabled, onOpenChange, open, readOnly]
  );

  const commitDateChange = useCallback(
    (nextDate: Date | null) => {
      if (disabled || readOnly) {
        return false;
      }

      if (nextDate && isDateUnavailable({ date: nextDate, disabledDates, maxDate, minDate })) {
        return false;
      }

      if (value === undefined) {
        setInternalSelectedDate(nextDate);
      }

      onDateChange?.(nextDate);
      return true;
    },
    [disabled, disabledDates, maxDate, minDate, onDateChange, readOnly, value]
  );

  const selectDate = useCallback(
    (nextDate: Date | null) => {
      const didCommit = commitDateChange(nextDate);

      if (didCommit) {
        requestOpenChange(false, 'calendar');
      }
    },
    [commitDateChange, requestOpenChange]
  );

  const clearDate = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }

    const didCommit = commitDateChange(null);

    if (didCommit) {
      setShouldRestoreFocusAfterClear(true);
      queueMicrotask(() => triggerRef.current?.focus());
    }
  }, [commitDateChange, disabled, readOnly]);

  const handleCalendarDateChange: DatePickerCalendarSelectionHandler = useCallback(
    (selection) => {
      if (!isSingleDateSelection(selection)) {
        return;
      }

      selectDate(selection);
    },
    [selectDate]
  );

  const safeSelectedDate = selectedDate && isValidDate(selectedDate) ? selectedDate : null;
  const hasSelectedDate = safeSelectedDate !== null;
  const shouldRenderClearButton = isClearable && hasSelectedDate && !disabled && !readOnly;
  const status = validationState;
  const triggerAriaLabel = shouldUseAriaLabel ? `${ariaLabel} ${displayValue}` : undefined;
  const popoverLabel = label ?? ariaLabel;
  const popoverAriaLabel = popoverLabel ? `${popoverLabel} calendar` : 'Date picker calendar';

  return {
    calendarProps: {
      autoFocusOnMount: effectiveOpen,
      disabled,
      disabledDates,
      firstDayOfWeek: sanitizedFirstDayOfWeek,
      locale: effectiveLocale,
      maxDate,
      minDate,
      onDateChange: handleCalendarDateChange,
      readOnly,
      selectedDate: safeSelectedDate,
      visibleMonths: sanitizedVisibleMonths
    },
    clearButtonProps: {
      type: 'button',
      'aria-label': 'Clear selected date',
      'aria-controls': id,
      className: datePickerInlineButtonVariants({ visibility: shouldRenderClearButton ? 'visible' : 'hidden' }),
      disabled: disabled || readOnly,
      onClick: clearDate
    },
    clearDate,
    description,
    descriptionId,
    displayValue,
    effectiveLocale,
    effectiveOpen,
    fieldClassName: cn(
      datePickerVariants({
        focused: effectiveOpen,
        fullWidth: isFullWidth,
        rounded,
        size,
        status,
        variant
      }),
      disabled && 'cursor-not-allowed opacity-40',
      fieldClassName
    ),
    firstDayOfWeek: sanitizedFirstDayOfWeek,
    focusTrigger,
    hiddenInputProps:
      name && !disabled
        ? { type: 'hidden', name, value: safeSelectedDate ? serializeLocalDate(safeSelectedDate) : '', disabled: false }
        : undefined,
    indicatorClassName: 'shrink-0 text-text-muted-light dark:text-text-muted-dark',
    isRequired,
    label,
    labelId,
    messageClassName: datePickerMessageVariants({ tone: status === 'default' ? 'info' : status }),
    popoverAriaLabel,
    popoverClassName: cn('w-fit', popoverClassName),
    readOnlyDescriptionId,
    requestOpenChange,
    rootProps,
    requiredDescriptionId,
    sanitizedFormatOptions,
    selectDate,
    selectedDate: safeSelectedDate,
    shouldRenderClearButton,
    shouldRestoreFocusAfterClear,
    triggerButtonProps: {
      ref: triggerRef,
      id,
      type: 'button',
      'aria-label': triggerAriaLabel,
      'aria-labelledby': labelledBy,
      'aria-describedby': describedBy,
      'aria-expanded': effectiveOpen,
      'aria-haspopup': 'dialog',
      'aria-invalid': status === 'error' ? true : undefined,
      'aria-disabled': disabled || readOnly ? true : undefined,
      disabled
    },
    triggerClassName: cn(
      'flex min-w-0 flex-1 items-center justify-between gap-2 border-none bg-transparent text-left outline-none',
      'disabled:cursor-not-allowed'
    ),
    triggerRef,
    triggerValueId,
    validationMessage,
    validationMessageId,
    valueClassName: datePickerValueVariants({ hasValue: hasSelectedDate }),
    visibleMonths: sanitizedVisibleMonths,
    wrapperClassName: cn('flex flex-col gap-2', isFullWidth && 'w-full', className)
  };
};
