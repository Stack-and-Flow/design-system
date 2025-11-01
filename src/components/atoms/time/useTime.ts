import * as React from 'react';
import type { TimeInputProps, TimeRange, TimeValue } from './types';

/** Normaliza a Date (o null si es inválido). */
function toDate(v: Date | string | number): Date | null {
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

// TimeInput Hook
export function useTimeInput({
  id,
  label = 'Select time',
  labelPosition = 'inside',
  variant = 'regular',
  size = 'md',
  rounded = false,
  isRequired = false,
  disabled = false,
  readOnly = false,
  isFullWidth = false,
  className,
  hint,
  description,
  showClockIcon = false,
  format = '24h',
  showUnits = ['hours', 'minutes'],
  showTimezone = false,
  timezones = [],
  defaultTimezone = 'UTC',
  timeRange,
  locale = 'en-US',
  value: controlledValue,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  ...rest
}: TimeInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const [selectedTimezone, setSelectedTimezone] = React.useState(defaultTimezone);
  const [timeValue, setTimeValue] = React.useState<TimeValue>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const secondsRef = React.useRef<HTMLInputElement>(null);
  const ampmRef = React.useRef<HTMLInputElement>(null);

  // Parse initial value
  React.useEffect(() => {
    const initialValue = controlledValue !== undefined ? controlledValue : defaultValue;
    if (initialValue) {
      const date = toDate(initialValue);
      if (date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        if (format === '12h') {
          const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          setTimeValue({
            hours: displayHours,
            minutes,
            seconds,
            ampm: hours >= 12 ? 'PM' : 'AM',
            timezone: selectedTimezone
          });
        } else {
          setTimeValue({
            hours,
            minutes,
            seconds,
            timezone: selectedTimezone
          });
        }
        setHasValue(true);
      }
    }
  }, [controlledValue, defaultValue, format, selectedTimezone]);

  // Create date from time values
  const createDate = React.useCallback(
    (timeVal: TimeValue): Date | null => {
      let hours = timeVal.hours;

      if (format === '12h' && timeVal.ampm) {
        if (timeVal.ampm === 'PM' && hours !== 12) {
          hours += 12;
        } else if (timeVal.ampm === 'AM' && hours === 12) {
          hours = 0;
        }
      }

      const date = new Date();
      date.setHours(hours, timeVal.minutes, timeVal.seconds, 0);

      return date;
    },
    [format]
  );

  // Validate time range
  const validateTime = React.useCallback(
    (timeVal: TimeValue): boolean => {
      if (!timeRange) return true;

      const date = createDate(timeVal);
      if (!date) return false;

      if (timeRange.min && date < timeRange.min) return false;
      if (timeRange.max && date > timeRange.max) return false;

      if (timeRange.minHour !== undefined && timeVal.hours < timeRange.minHour) return false;
      if (timeRange.maxHour !== undefined && timeVal.hours > timeRange.maxHour) return false;
      if (timeRange.minMinute !== undefined && timeVal.minutes < timeRange.minMinute) return false;
      if (timeRange.maxMinute !== undefined && timeVal.minutes > timeRange.maxMinute) return false;
      if (timeRange.minSecond !== undefined && timeVal.seconds < timeRange.minSecond) return false;
      if (timeRange.maxSecond !== undefined && timeVal.seconds > timeRange.maxSecond) return false;

      return true;
    },
    [timeRange, createDate]
  );

  // Update time value
  const updateTimeValue = React.useCallback(
    (newTimeValue: Partial<TimeValue>) => {
      const updatedTimeValue = { ...timeValue, ...newTimeValue };

      if (validateTime(updatedTimeValue)) {
        setTimeValue(updatedTimeValue);
        setHasValue(true);

        const date = createDate(updatedTimeValue);
        onChange?.(date, updatedTimeValue);
      }
    },
    [timeValue, validateTime, createDate, onChange]
  );

  // Check if we have any meaningful time value
  const hasTimeValue = React.useMemo(() => {
    return hasValue || timeValue.hours > 0 || timeValue.minutes > 0 || timeValue.seconds > 0;
  }, [hasValue, timeValue]);

  // Format time for display
  const formatTimeDisplay = React.useCallback(
    (timeVal: TimeValue): string => {
      if (readOnly && !hasValue) {
        // Show relative time for readOnly mode
        const date = createDate(timeVal);
        if (date) {
          const now = new Date();
          const diff = Math.round((date.getTime() - now.getTime()) / 1000);
          const abs = Math.abs(diff);

          if (abs < 60) return diff === 0 ? 'ahora' : diff > 0 ? `en ${diff} segundos` : `hace ${abs} segundos`;
          const minutes = Math.round(diff / 60);
          if (Math.abs(minutes) < 60)
            return minutes > 0 ? `en ${minutes} minutos` : `hace ${Math.abs(minutes)} minutos`;
          const hours = Math.round(minutes / 60);
          if (Math.abs(hours) < 24) return hours > 0 ? `en ${hours} horas` : `hace ${Math.abs(hours)} horas`;
          const days = Math.round(hours / 24);
          return days > 0 ? `en ${days} días` : `hace ${Math.abs(days)} días`;
        }
      }

      const parts = [];
      if (showUnits.includes('hours')) {
        const displayHours =
          format === '12h'
            ? timeVal.hours === 0
              ? 12
              : timeVal.hours > 12
                ? timeVal.hours - 12
                : timeVal.hours
            : timeVal.hours;
        parts.push(displayHours.toString().padStart(2, '0'));
      }
      if (showUnits.includes('minutes')) {
        parts.push(timeVal.minutes.toString().padStart(2, '0'));
      }
      if (showUnits.includes('seconds')) {
        parts.push(timeVal.seconds.toString().padStart(2, '0'));
      }

      let result = parts.join(':');
      if (format === '12h' && timeVal.ampm) {
        result += ` ${timeVal.ampm}`;
      }

      return result;
    },
    [readOnly, hasValue, createDate, showUnits, format]
  );

  // Event handlers
  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', 'Home', 'End'];
      const isNumberKey = /^[0-9]$/.test(e.key);
      const isAMPMKey = ['a', 'p', 'A', 'P'].includes(e.key);

      if (e.currentTarget.name === 'ampm' && isAMPMKey) {
        // Allow AM/PM input
        return onKeyDown?.(e);
      }

      if (!allowedKeys.includes(e.key) && !isNumberKey) {
        e.preventDefault();
      }

      // Handle navigation between fields
      if (e.key === 'ArrowRight' && e.currentTarget.selectionStart === e.currentTarget.value.length) {
        e.preventDefault();
        const nextField = e.currentTarget.dataset.nextField;
        if (nextField === 'minutes' && minutesRef.current) {
          minutesRef.current.focus();
        } else if (nextField === 'seconds' && secondsRef.current) {
          secondsRef.current.focus();
        } else if (nextField === 'ampm' && ampmRef.current) {
          ampmRef.current.focus();
        }
      }

      if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
        e.preventDefault();
        const prevField = e.currentTarget.dataset.prevField;
        if (prevField === 'hours' && hoursRef.current) {
          hoursRef.current.focus();
        } else if (prevField === 'minutes' && minutesRef.current) {
          minutesRef.current.focus();
        }
      }

      onKeyDown?.(e);
    },
    [onKeyDown]
  );

  const handleClockIconClick = React.useCallback(() => {
    if (!disabled && !readOnly) {
      hoursRef.current?.focus();
    }
  }, [disabled, readOnly]);

  return {
    // State
    isFocused,
    hasValue,
    hasTimeValue,
    timeValue,
    selectedTimezone,

    // Refs
    containerRef,
    hoursRef,
    minutesRef,
    secondsRef,
    ampmRef,

    // Props
    id,
    label,
    labelPosition,
    variant,
    size,
    rounded,
    isRequired,
    disabled,
    readOnly,
    isFullWidth,
    className,
    hint,
    description,
    showClockIcon,
    format,
    showUnits,
    showTimezone,
    timezones,
    locale,

    // Methods
    updateTimeValue,
    setSelectedTimezone,
    formatTimeDisplay,
    validateTime,

    // Event handlers
    handleFocus,
    handleBlur,
    handleKeyDown,
    handleClockIconClick,

    // Rest props
    ...rest
  };
}
