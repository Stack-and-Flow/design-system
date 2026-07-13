import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { cn } from '@/lib/utils';
import type { DynamicIconName } from '@/types';
import type { IconTone } from '../icon';
import {
  hintMessageVariants,
  labelVariants,
  type TimeComponentProps,
  type TimeHintType,
  type TimeSegments,
  timeStepButtonVariants,
  timeVariants
} from './types';

type HintIconProps = {
  name: DynamicIconName;
  tone: IconTone;
  size: 16;
};

const formatAriaIds = (ids?: string | string[]) => (Array.isArray(ids) ? ids.join(' ') : ids);

const getHintIconProps = (type?: TimeHintType): HintIconProps | undefined => {
  switch (type) {
    case 'error':
      return { name: 'circle-alert', tone: 'danger', size: 16 };
    case 'warning':
      return { name: 'triangle-alert', tone: 'warning', size: 16 };
    case 'success':
      return { name: 'circle-check', tone: 'success', size: 16 };
    case 'info':
      return { name: 'info', tone: 'muted', size: 16 };
    default:
      return undefined;
  }
};

const getAdornmentSizeClassName = (size: NonNullable<TimeComponentProps['size']>) =>
  size === 'lg' ? 'fs-base' : 'fs-small';

const getContentGapClassName = (size: NonNullable<TimeComponentProps['size']>) => (size === 'sm' ? 'gap-2' : 'gap-3');

export const useTime = ({
  size = 'md',
  label,
  id,
  variant = 'regular',
  rounded = false,
  className,
  startContent,
  endContent,
  showSteppers = false,
  showClockIcon = false,
  isFullWidth = false,
  isRequired = false,
  hint,
  disabled = false,
  granularity = 'minute',
  hourCycle = 24,
  name,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  ariaDescribedBy,
  ariaLabelledBy,
  ...props
}: TimeComponentProps) => {
  const [segments, setSegments] = useState<TimeSegments>({
    hour: '',
    minute: '',
    second: granularity === 'second' ? '' : undefined,
    dayPeriod: hourCycle === 12 ? 'AM' : undefined
  });

  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const dayPeriodRef = useRef<HTMLInputElement>(null);

  const getRefForSegment = (segmentName: string): RefObject<HTMLInputElement | null> => {
    switch (segmentName) {
      case 'hour':
        return hourRef;
      case 'minute':
        return minuteRef;
      case 'second':
        return secondRef;
      case 'dayPeriod':
        return dayPeriodRef;
      default:
        return hourRef;
    }
  };

  const getSegmentOrder = (): string[] => {
    const order = ['hour', 'minute'];
    if (granularity === 'second') {
      order.push('second');
    }
    if (hourCycle === 12) {
      order.push('dayPeriod');
    }
    return order;
  };

  const focusSegment = (segmentName: string): void => {
    const ref = getRefForSegment(segmentName);
    ref.current?.focus();
    ref.current?.select();
  };

  const focusNextSegment = (current: string): void => {
    const order = getSegmentOrder();
    const idx = order.indexOf(current);
    focusSegment(order[(idx + 1) % order.length]);
  };

  const focusPrevSegment = (current: string): void => {
    const order = getSegmentOrder();
    const idx = order.indexOf(current);
    focusSegment(order[(idx - 1 + order.length) % order.length]);
  };

  const getMaxValue = (segmentName: string): number => {
    if (segmentName === 'hour') {
      return hourCycle === 12 ? 12 : 23;
    }
    if (segmentName === 'dayPeriod') {
      return 1;
    }
    return 59;
  };

  const getMinValue = (segmentName: string): number => (segmentName === 'hour' && hourCycle === 12 ? 1 : 0);

  const toggleDayPeriod = (current?: string): 'AM' | 'PM' => (current === 'PM' ? 'AM' : 'PM');

  const clampSegments = (prev: TimeSegments, segmentName: string, value: string): TimeSegments => {
    const next = { ...prev, [segmentName]: value };

    if (segmentName === 'dayPeriod') {
      const upper = value.toUpperCase();
      next.dayPeriod = upper === 'AM' || upper === 'PM' ? upper : 'AM';
    }
    if (segmentName === 'hour') {
      const max = hourCycle === 12 ? 12 : 23;
      const min = hourCycle === 12 ? 1 : 0;
      const parsed = parseInt(next.hour, 10);
      if (!Number.isNaN(parsed)) {
        if (parsed > max) {
          next.hour = String(max);
        } else if (parsed < min && !(hourCycle === 12 && value === '0')) {
          next.hour = String(min);
        }
      }
    }
    if (segmentName === 'minute') {
      const parsed = parseInt(value, 10);
      if (parsed > 59) {
        next.minute = '59';
      } else if (parsed < 0) {
        next.minute = '0';
      }
    }
    if (segmentName === 'second' && next.second !== undefined) {
      const parsed = parseInt(value, 10);
      if (parsed > 59) {
        next.second = '59';
      } else if (parsed < 0) {
        next.second = '0';
      }
    }
    return next;
  };

  const normalizeSegmentsForChange = (next: TimeSegments, segmentName: string): TimeSegments => {
    if (segmentName !== 'hour' || next.hour === '') {
      return next;
    }

    const parsed = parseInt(next.hour, 10);
    if (Number.isNaN(parsed)) {
      return next;
    }

    const min = getMinValue('hour');
    const max = getMaxValue('hour');

    if (parsed < min) {
      return { ...next, hour: String(min) };
    }
    if (parsed > max) {
      return { ...next, hour: String(max) };
    }

    return next;
  };

  const updateSegment = (segmentName: string, value: string): void => {
    const next = clampSegments(segments, segmentName, value);
    setSegments(next);
    onChange?.(normalizeSegmentsForChange(next, segmentName));
  };

  const handleSegmentFocus = (segmentName: string, e: FocusEvent<HTMLInputElement>): void => {
    setActiveSegment(segmentName);
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleSegmentBlur = (e: FocusEvent<HTMLInputElement>): void => {
    if (activeSegment) {
      const segmentName = activeSegment;
      const min = getMinValue(segmentName);
      const max = getMaxValue(segmentName);
      const currentVal = segments[segmentName as keyof TimeSegments];
      if (currentVal !== undefined && segmentName !== 'dayPeriod') {
        const parsed = parseInt(currentVal, 10);
        if (!Number.isNaN(parsed) && currentVal !== '') {
          if (parsed < min) {
            updateSegment(segmentName, String(min));
          } else if (parsed > max) {
            updateSegment(segmentName, String(max));
          }
        }
      }
    }

    const related = e.relatedTarget as HTMLElement | null;
    if (related && containerRef.current?.contains(related)) {
      return;
    }
    setActiveSegment(null);
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleSegmentKeyDown = (segmentName: string, e: KeyboardEvent<HTMLInputElement>): void => {
    const max = getMaxValue(segmentName);
    const min = getMinValue(segmentName);
    const current = parseInt((segments[segmentName as keyof TimeSegments] as string) || '0', 10) || min;

    if (segmentName === 'dayPeriod' && (e.key === 'a' || e.key === 'A' || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      updateSegment(segmentName, e.key.toUpperCase() === 'A' ? 'AM' : 'PM');
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (segmentName === 'dayPeriod') {
        updateSegment(segmentName, toggleDayPeriod(segments.dayPeriod));
      } else if (e.key === 'ArrowUp') {
        updateSegment(segmentName, String(current >= max ? min : current + 1));
      } else {
        updateSegment(segmentName, String(current <= min ? max : current - 1));
      }
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusNextSegment(segmentName);
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusPrevSegment(segmentName);
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      updateSegment(segmentName, '');
      return;
    }
    onKeyDown?.(e);
  };

  const handleSegmentInput = (segmentName: string, value: string): void => {
    if (segmentName === 'dayPeriod') {
      const upper = value.toUpperCase();
      if (upper.includes('P')) {
        updateSegment(segmentName, 'PM');
      } else if (upper.includes('A')) {
        updateSegment(segmentName, 'AM');
      }
      return;
    }
    if (!/^\d*$/.test(value)) {
      return;
    }

    const sanitized = value.slice(0, 2);
    updateSegment(segmentName, sanitized);
    if (sanitized.length === 2) {
      const max = getMaxValue(segmentName);
      if (parseInt(sanitized, 10) <= max) {
        requestAnimationFrame(() => focusNextSegment(segmentName));
      }
    }
  };

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement;
    const isSegmentInput = [hourRef, minuteRef, secondRef, dayPeriodRef].some((ref) => ref.current === target);
    if (isSegmentInput || !target.closest('[data-time-wrapper]')) {
      return;
    }
    hourRef.current?.focus();
  };

  const stepActiveSegment = (direction: 'up' | 'down'): void => {
    const target = activeSegment ?? getSegmentOrder()[0];
    if (target === 'dayPeriod') {
      updateSegment(target, toggleDayPeriod(segments.dayPeriod));
      requestAnimationFrame(() => getRefForSegment(target).current?.focus());
      return;
    }
    const max = getMaxValue(target);
    const min = getMinValue(target);
    const current = parseInt((segments[target as keyof TimeSegments] as string) || '0', 10);
    const next = direction === 'up' ? (current >= max ? min : current + 1) : current <= min ? max : current - 1;
    updateSegment(target, String(next));
    requestAnimationFrame(() => getRefForSegment(target).current?.focus());
  };

  const getPlaceholder = (segmentName: string): string => {
    if (segmentName === 'hour') {
      return hourCycle === 12 ? '12' : '00';
    }
    if (segmentName === 'dayPeriod') {
      return 'AM';
    }
    return '00';
  };

  const getLabelForSegment = (segmentName: string): string => {
    switch (segmentName) {
      case 'hour':
        return 'Hours';
      case 'minute':
        return 'Minutes';
      case 'second':
        return 'Seconds';
      case 'dayPeriod':
        return 'AM or PM';
      default:
        return '';
    }
  };

  const getSegmentDisplayValue = (segmentName: string): string =>
    (segments[segmentName as keyof TimeSegments] as string | undefined) ?? '';

  const getSegmentAriaValueNow = (segmentName: string): number | undefined => {
    if (segmentName === 'dayPeriod') {
      return getSegmentDisplayValue(segmentName).toUpperCase() === 'PM' ? 1 : 0;
    }

    const value = getSegmentDisplayValue(segmentName);
    if (value === '') {
      return undefined;
    }

    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return undefined;
    }

    const min = getMinValue(segmentName);
    const max = getMaxValue(segmentName);

    if (parsed < min) {
      return min;
    }
    if (parsed > max) {
      return max;
    }

    return parsed;
  };

  useEffect(() => {
    if (granularity === 'second' && segments.second === undefined) {
      setSegments((prev) => ({ ...prev, second: '' }));
    }
    if (granularity === 'minute' && segments.second !== undefined) {
      setSegments((prev) => {
        const { second: _second, ...rest } = prev;
        return rest as TimeSegments;
      });
    }
  }, [granularity]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hourCycle === 12 && segments.dayPeriod === undefined) {
      setSegments((prev) => ({ ...prev, dayPeriod: 'AM' }));
    }
    if (hourCycle === 24 && segments.dayPeriod !== undefined) {
      setSegments((prev) => {
        const { dayPeriod: _dayPeriod, ...rest } = prev;
        return rest as TimeSegments;
      });
    }
  }, [hourCycle]); // eslint-disable-line react-hooks/exhaustive-deps

  // Only use external labelledBy — label-derived ID goes on the group, not individual segments
  const labelledBy = formatAriaIds(ariaLabelledBy);
  const describedBy =
    [formatAriaIds(ariaDescribedBy), hint?.message ? `${id}-hint` : undefined].filter(Boolean).join(' ') || undefined;

  const hasLabel = Boolean(label);

  const containerClassName = cn(
    timeVariants({
      size,
      rounded,
      variant,
      status: hint?.type ?? 'default',
      focused: isFocused,
      fullWidth: isFullWidth
    }),
    hasLabel ? 'items-end' : 'items-center',
    disabled && 'pointer-events-none cursor-not-allowed opacity-40',
    className
  );

  const hintIconProps = useMemo(() => getHintIconProps(hint?.type), [hint?.type]);

  return {
    containerRef,
    containerClassName,
    wrapperClassName: cn('flex flex-col gap-2', isFullWidth && 'w-full'),
    labelClassName: cn(labelVariants({ size }), disabled && 'opacity-40'),
    adornmentClassName: cn(
      'flex shrink-0 items-center font-medium text-text-secondary-light dark:text-text-secondary-dark',
      getAdornmentSizeClassName(size ?? 'md')
    ),
    contentClassName: cn(
      'flex w-full items-center justify-between',
      getContentGapClassName(size ?? 'md'),
      showSteppers && 'pr-6'
    ),
    stepButtonGroupClassName: 'absolute right-2 top-0 bottom-0 z-10 flex flex-col items-center justify-center gap-0.5',
    hasLabel,
    label,
    id,
    size,
    disabled,
    isRequired,
    startContent,
    endContent,
    granularity,
    hourCycle,
    name,
    segments,
    activeSegment,
    hourRef,
    minuteRef,
    secondRef,
    dayPeriodRef,
    describedBy,
    labelledBy,
    isInvalid: hint?.type === 'error',
    hasHint: Boolean(hint?.message),
    hintIconProps,
    hintMessage: hint?.message,
    hintMessageClassName: hintMessageVariants({ tone: hint?.type ?? 'info' }),
    handleContainerClick,
    handleSegmentFocus,
    handleSegmentBlur,
    handleSegmentKeyDown,
    handleSegmentInput,
    getPlaceholder,
    getLabelForSegment,
    getSegmentDisplayValue,
    getSegmentAriaValueNow,
    getMinValue,
    getMaxValue,
    incrementButtonProps: {
      type: 'button' as const,
      'aria-label': 'Increase value',
      className: timeStepButtonVariants({ shape: 'top' }),
      disabled,
      onClick: () => stepActiveSegment('up')
    },
    decrementButtonProps: {
      type: 'button' as const,
      'aria-label': 'Decrease value',
      className: timeStepButtonVariants({ shape: 'bottom' }),
      disabled,
      onClick: () => stepActiveSegment('down')
    },
    showSteppers,
    showClockIcon,
    ...props
  };
};
