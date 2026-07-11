import type { ChangeEvent, ComponentProps, FocusEvent, ForwardedRef } from 'react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DynamicIconName } from '@/types';
import type { IconTone } from '../icon';
import {
  hintMessageVariants,
  nativeTextAreaVariants,
  type TextAreaHint,
  type TextAreaProps,
  textAreaLabelVariants,
  textAreaSurfaceVariants,
  textAreaWrapperVariants
} from './types';

type HintIconProps = {
  name: DynamicIconName;
  tone: IconTone;
  size: 16;
};

type TextAreaLabelState = 'floatingSm' | 'floatingMd' | 'floatingLg';

type TextAreaSurfaceProps = ComponentProps<'div'> & {
  'data-testid': string;
};

type TextAreaNativeProps = ComponentProps<'textarea'> & {
  'data-autosize'?: 'true';
  'data-full-width'?: 'true';
  'data-resize': NonNullable<TextAreaProps['resize']>;
  'data-rounded': 'true' | 'false';
  'data-size': NonNullable<TextAreaProps['size']>;
  'data-status': NonNullable<TextAreaProps['status']>;
  'data-variant': NonNullable<TextAreaProps['variant']>;
};

type UseTextAreaReturn = {
  hasHint: boolean;
  hasLabel: boolean;
  hintIconProps?: HintIconProps;
  hintMessage?: string;
  hintMessageClassName: string;
  isRequired: boolean;
  label: string;
  labelProps: ComponentProps<'label'>;
  surfaceProps: TextAreaSurfaceProps;
  textareaProps: TextAreaNativeProps;
  textareaRef: (node: HTMLTextAreaElement | null) => void;
  wrapperClassName: string;
};

const DEFAULT_MIN_ROWS = 3;
const DEFAULT_ROW_HEIGHT = 20;
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : React.useLayoutEffect;

const normalizeRows = (rows: number | undefined, fallback: number) => {
  if (rows === undefined || !Number.isFinite(rows)) {
    return fallback;
  }

  return Math.max(1, Math.floor(rows));
};

const parseMetric = (value: string, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatAriaIds = (...ids: (string | string[] | undefined)[]) => {
  const uniqueIds = new Set<string>();

  for (const id of ids) {
    const parts = Array.isArray(id) ? id : id?.split(/\s+/);

    for (const part of parts ?? []) {
      if (part) {
        uniqueIds.add(part);
      }
    }
  }

  return Array.from(uniqueIds).join(' ') || undefined;
};

const getFloatingLabelState = (size: NonNullable<TextAreaProps['size']>): TextAreaLabelState => {
  if (size === 'sm') {
    return 'floatingSm';
  }

  if (size === 'lg') {
    return 'floatingLg';
  }

  return 'floatingMd';
};

const getHintIconProps = (type?: TextAreaHint['type']): HintIconProps | undefined => {
  switch (type) {
    case 'error':
      return { name: 'circle-alert', tone: 'danger', size: 16 };
    case 'warning':
      return { name: 'triangle-alert', tone: 'warning', size: 16 };
    case 'success':
      return { name: 'circle-check', tone: 'success', size: 16 };
    case 'info':
      return { name: 'info', tone: 'info', size: 16 };
    default:
      return undefined;
  }
};

const assignForwardedRef = (ref: ForwardedRef<HTMLTextAreaElement> | undefined, node: HTMLTextAreaElement | null) => {
  if (!ref) {
    return;
  }

  if (typeof ref === 'function') {
    ref(node);
    return;
  }

  ref.current = node;
};

const autosizeTextArea = (textarea: HTMLTextAreaElement, minRows: number, maxRows?: number) => {
  const styles = window.getComputedStyle(textarea);
  const rowHeight = parseMetric(styles.lineHeight, DEFAULT_ROW_HEIGHT);
  const boxOffset =
    parseMetric(styles.paddingTop) +
    parseMetric(styles.paddingBottom) +
    parseMetric(styles.borderTopWidth) +
    parseMetric(styles.borderBottomWidth);
  const minHeight = rowHeight * minRows + boxOffset;
  const resolvedMaxRows = maxRows === undefined ? undefined : Math.max(minRows, normalizeRows(maxRows, minRows));
  const maxHeight = resolvedMaxRows === undefined ? undefined : rowHeight * resolvedMaxRows + boxOffset;

  textarea.style.height = 'auto';

  const unclampedHeight = Math.max(textarea.scrollHeight, minHeight);
  const clampedHeight = maxHeight === undefined ? unclampedHeight : Math.min(unclampedHeight, maxHeight);

  textarea.style.height = `${clampedHeight}px`;
  textarea.style.overflowY = maxHeight !== undefined && unclampedHeight > maxHeight ? 'auto' : 'hidden';
};

export const useTextArea = (
  {
    rounded = false,
    size = 'md',
    label = '',
    placeholder,
    id,
    variant = 'regular',
    className,
    isFullWidth = false,
    isRequired = false,
    required = false,
    hint,
    status,
    onFocus,
    onBlur,
    onChange,
    onValueChange,
    value,
    defaultValue,
    disabled = false,
    readOnly = false,
    autosize = false,
    minRows = DEFAULT_MIN_ROWS,
    maxRows,
    resize,
    rows,
    ariaDescribedBy,
    ariaLabelledBy,
    'aria-describedby': nativeAriaDescribedBy,
    'aria-labelledby': nativeAriaLabelledBy,
    'aria-label': nativeAriaLabel,
    'aria-invalid': nativeAriaInvalid,
    'aria-required': nativeAriaRequired,
    ...props
  }: TextAreaProps,
  forwardedRef?: ForwardedRef<HTMLTextAreaElement>
): UseTextAreaReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaElementRef = useRef<HTMLTextAreaElement | null>(null);
  const autosizeStyleRef = useRef<{ height: string; overflowY: string } | null>(null);

  const normalizedMinRows = normalizeRows(minRows, DEFAULT_MIN_ROWS);
  const normalizedMaxRows = maxRows === undefined ? undefined : normalizeRows(maxRows, normalizedMinRows);
  const requiredState = isRequired || required;
  const effectiveStatus = status ?? hint?.type ?? 'default';
  const hasLabel = Boolean(label);
  const hasFloatingLabelOffset = hasLabel;
  const effectiveResize = resize ?? (autosize ? 'none' : 'vertical');
  const resolvedRows = autosize ? undefined : (rows ?? normalizedMinRows);
  const hintDescribedBy = hint?.message ? `${id}-hint` : undefined;
  const labelledBy = formatAriaIds(ariaLabelledBy ?? nativeAriaLabelledBy ?? (label ? `${id}-label` : undefined));
  const describedBy = formatAriaIds(nativeAriaDescribedBy, ariaDescribedBy, hintDescribedBy);
  const isInvalid = effectiveStatus === 'error' || hint?.type === 'error';

  const runAutosize = useCallback(() => {
    const textarea = textareaElementRef.current;

    if (!textarea) {
      return;
    }

    if (!autosize) {
      const autosizeStyle = autosizeStyleRef.current;

      if (autosizeStyle) {
        if (textarea.style.height === autosizeStyle.height) {
          textarea.style.height = '';
        }

        if (textarea.style.overflowY === autosizeStyle.overflowY) {
          textarea.style.overflowY = '';
        }

        autosizeStyleRef.current = null;
      }

      return;
    }

    autosizeTextArea(textarea, normalizedMinRows, normalizedMaxRows);
    autosizeStyleRef.current = { height: textarea.style.height, overflowY: textarea.style.overflowY };
  }, [autosize, normalizedMaxRows, normalizedMinRows]);

  useIsomorphicLayoutEffect(() => {
    runAutosize();
  }, [hasFloatingLabelOffset, runAutosize, size, value]);

  useIsomorphicLayoutEffect(() => {
    if (!autosize || typeof ResizeObserver === 'undefined') {
      return;
    }

    const textarea = textareaElementRef.current;

    if (!textarea) {
      return;
    }

    const observedWidths = new WeakMap<Element, number>();
    const observer = new ResizeObserver((entries) => {
      let shouldAutosize = false;

      for (const entry of entries) {
        const previousWidth = observedWidths.get(entry.target);
        const nextWidth = entry.contentRect.width;

        observedWidths.set(entry.target, nextWidth);

        if (previousWidth !== undefined && previousWidth !== nextWidth) {
          shouldAutosize = true;
        }
      }

      if (shouldAutosize) {
        runAutosize();
      }
    });

    observer.observe(textarea);

    if (textarea.parentElement) {
      observer.observe(textarea.parentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [autosize, runAutosize]);

  const textareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaElementRef.current = node;
      assignForwardedRef(forwardedRef, node);
    },
    [forwardedRef]
  );

  const handleSurfaceClick = () => {
    if (disabled) {
      return;
    }

    textareaElementRef.current?.focus();
  };

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;

    onChange?.(event, nextValue);
    onValueChange?.(nextValue);

    if (autosize) {
      autosizeTextArea(event.currentTarget, normalizedMinRows, normalizedMaxRows);
      autosizeStyleRef.current = {
        height: event.currentTarget.style.height,
        overflowY: event.currentTarget.style.overflowY
      };
    }
  };

  const surfaceClassName = cn(
    textAreaSurfaceVariants({
      size,
      rounded,
      variant,
      status: effectiveStatus,
      focused: isFocused,
      fullWidth: isFullWidth
    }),
    disabled && 'pointer-events-none cursor-not-allowed opacity-40',
    className
  );

  const labelClassName = textAreaLabelVariants({
    size,
    state: getFloatingLabelState(size)
  });

  const hintIconProps = useMemo(() => getHintIconProps(hint?.type), [hint?.type]);

  return {
    hasHint: Boolean(hint?.message),
    hasLabel,
    hintIconProps,
    hintMessage: hint?.message,
    hintMessageClassName: hintMessageVariants({ tone: hint?.type ?? 'info' }),
    isRequired: requiredState,
    label,
    labelProps: {
      id: `${id}-label`,
      htmlFor: id,
      className: labelClassName
    },
    surfaceProps: {
      className: surfaceClassName,
      onClick: handleSurfaceClick,
      'data-testid': `${id}-surface`
    },
    textareaProps: {
      ...props,
      id,
      placeholder,
      disabled,
      readOnly,
      rows: resolvedRows,
      'aria-disabled': disabled ? true : undefined,
      'aria-invalid': isInvalid ? 'true' : nativeAriaInvalid,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      'aria-label': nativeAriaLabel ?? (!labelledBy ? placeholder : undefined),
      required: requiredState,
      'aria-required': requiredState ? true : nativeAriaRequired,
      className: nativeTextAreaVariants({ size, hasFloatingLabel: hasFloatingLabelOffset, resize: effectiveResize }),
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
      value,
      defaultValue,
      'data-autosize': autosize ? 'true' : undefined,
      'data-full-width': isFullWidth ? 'true' : undefined,
      'data-resize': effectiveResize,
      'data-rounded': rounded ? 'true' : 'false',
      'data-size': size,
      'data-status': effectiveStatus,
      'data-variant': variant
    },
    textareaRef,
    wrapperClassName: textAreaWrapperVariants({ fullWidth: isFullWidth })
  };
};
