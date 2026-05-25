import type { ChangeEvent, ComponentProps, FocusEvent, KeyboardEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { useRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils';
import type { DynamicIconName } from '@/types';
import type { IconTone } from '../icon';
import {
  hintMessageVariants,
  type InputHintType,
  type InputProps,
  inputInlineButtonVariants,
  inputVariants,
  labelVariants,
  nativeInputVariants
} from './types';

type InputValue = ComponentProps<'input'>['value'] | ComponentProps<'input'>['defaultValue'];

type HintIconProps = {
  name: DynamicIconName;
  tone: IconTone;
  size: 16;
};

type UseInputReturn = {
  adornmentClassName: string;
  containerProps: ComponentProps<'div'>;
  contentClassName: string;
  decrementButtonProps: ComponentProps<'button'>;
  endContent: InputProps['endContent'];
  hasHint: boolean;
  hasLabel: boolean;
  hintIconProps?: HintIconProps;
  hintMessage?: string;
  hintMessageClassName: string;
  inputProps: ComponentProps<'input'>;
  isRequired: boolean;
  label: string;
  labelProps: ComponentProps<'label'>;
  passwordButtonProps: ComponentProps<'button'>;
  passwordIconName: DynamicIconName;
  shouldRenderNumberControls: boolean;
  shouldRenderPasswordToggle: boolean;
  showPassword: boolean;
  startContent: InputProps['startContent'];
  stepButtonGroupClassName: string;
  toggleButtonGroupClassName: string;
  incrementButtonProps: ComponentProps<'button'>;
  wrapperClassName: string;
};

const formatAriaIds = (ids?: string | string[]) => (Array.isArray(ids) ? ids.join(' ') : ids);

const hasInputValue = (value: InputValue) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && String(value).length > 0;
};

const getFloatingLabelState = ({
  hasFloatingLabel,
  size
}: {
  hasFloatingLabel: boolean;
  size: NonNullable<InputProps['size']>;
}) => {
  if (!hasFloatingLabel) {
    return 'resting';
  }

  if (size === 'sm') {
    return 'floatingSm';
  }

  if (size === 'lg') {
    return 'floatingLg';
  }

  return 'floatingMd';
};

const getContentGapClassName = (size: NonNullable<InputProps['size']>) => (size === 'sm' ? 'gap-2' : 'gap-3');

const getAdornmentSizeClassName = (size: NonNullable<InputProps['size']>) => (size === 'lg' ? 'fs-base' : 'fs-small');

const getHintIconProps = (type?: InputHintType): HintIconProps | undefined => {
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

const dispatchNativeInputEvents = (input: HTMLInputElement) => {
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

const parseNumberAttribute = (value: string) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const clampNumberValue = (value: number, min?: number, max?: number) =>
  Math.min(Math.max(value, min ?? value), max ?? value);

const stepNumberValueManually = (input: HTMLInputElement, direction: 'up' | 'down') => {
  const currentValue = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : 0;
  const nextValue = currentValue + (direction === 'up' ? 1 : -1);

  input.value = String(clampNumberValue(nextValue, parseNumberAttribute(input.min), parseNumberAttribute(input.max)));
};

const canTypeLeadingSign = (input: HTMLInputElement, key: string) => {
  if (!['+', '-'].includes(key)) {
    return false;
  }

  if (input.type === 'tel' && key !== '+') {
    return false;
  }

  const selectionStart = input.selectionStart;

  if (selectionStart === null) {
    return false;
  }

  const selectionEnd = input.selectionEnd ?? selectionStart;
  const hasLeadingSign = /^[+-]/.test(input.value);
  const replacesLeadingSign = selectionStart === 0 && selectionEnd > 0 && hasLeadingSign;

  return selectionStart === 0 && (!hasLeadingSign || replacesLeadingSign);
};

export const useInput = ({
  rounded = false,
  size = 'md',
  label = '',
  placeholder,
  id,
  type = 'text',
  variant = 'regular',
  className,
  startContent,
  endContent,
  isFullWidth = false,
  isRequired = false,
  required = false,
  hint,
  onFocus,
  onBlur,
  onKeyDown,
  onChange,
  value,
  defaultValue,
  disabled = false,
  ariaDescribedBy,
  ariaLabelledBy,
  'aria-describedby': nativeAriaDescribedBy,
  'aria-labelledby': nativeAriaLabelledBy,
  'aria-label': nativeAriaLabel,
  'aria-invalid': nativeAriaInvalid,
  ...props
}: InputProps): UseInputReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(() => hasInputValue(value ?? defaultValue));
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useRipple(containerRef);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const requiredState = isRequired || required;
  const currentHasValue = value === undefined ? hasValue : hasInputValue(value);
  const hasAdornment = Boolean(startContent || endContent);
  const hasFloatingLabel = isFocused || currentHasValue || Boolean(placeholder) || (Boolean(label) && hasAdornment);
  const labelledBy = formatAriaIds(ariaLabelledBy ?? nativeAriaLabelledBy ?? (label ? `${id}-label` : undefined));
  const externalDescribedBy = formatAriaIds(ariaDescribedBy ?? nativeAriaDescribedBy);
  const hintDescribedBy = hint?.message ? `${id}-hint` : undefined;
  const describedBy = [externalDescribedBy, hintDescribedBy].filter(Boolean).join(' ') || undefined;
  const hasInlineAction = type === 'number' || type === 'password';

  const containerClassName = cn(
    inputVariants({
      size,
      rounded,
      variant,
      status: hint?.type ?? 'default',
      focused: isFocused,
      fullWidth: isFullWidth
    }),
    label ? 'items-end' : 'items-center',
    disabled && 'pointer-events-none cursor-not-allowed opacity-40',
    className
  );

  const labelClassName = labelVariants({
    size,
    state: getFloatingLabelState({ hasFloatingLabel, size })
  });

  const handleContainerClick = () => {
    if (type === 'number' || type === 'password') {
      return;
    }

    inputRef.current?.focus();
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(hasInputValue(event.target.value));
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (type === 'tel') {
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', 'Home', 'End'];
      const isNumberKey = /^[0-9]$/.test(event.key);
      const isAllowedSign = canTypeLeadingSign(event.currentTarget, event.key);

      if (!allowedKeys.includes(event.key) && !isNumberKey && !isAllowedSign) {
        event.preventDefault();
      }
    }

    onKeyDown?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasValue(hasInputValue(event.target.value));
    onChange?.(event, event.target.value);
  };

  const stepNumberValue = (direction: 'up' | 'down') => {
    const input = inputRef.current;

    if (!input || disabled) {
      return;
    }

    if (input.step === 'any') {
      stepNumberValueManually(input, direction);
    } else if (direction === 'up') {
      input.stepUp();
    } else {
      input.stepDown();
    }

    setHasValue(hasInputValue(input.value));
    dispatchNativeInputEvents(input);
  };

  const hintIconProps = useMemo(() => getHintIconProps(hint?.type), [hint?.type]);

  return {
    adornmentClassName: cn(
      'flex shrink-0 items-center font-medium text-text-secondary-light dark:text-text-secondary-dark',
      getAdornmentSizeClassName(size)
    ),
    containerProps: {
      ref: containerRef,
      className: containerClassName,
      onClick: handleContainerClick
    },
    contentClassName: cn(
      'flex w-full items-center justify-between',
      getContentGapClassName(size),
      label && startContent && 'translate-y-2',
      hasInlineAction && endContent && 'pr-8'
    ),
    decrementButtonProps: {
      type: 'button',
      'aria-label': 'Decrease value',
      'aria-controls': id,
      className: inputInlineButtonVariants({ shape: 'bottom' }),
      disabled,
      onClick: () => stepNumberValue('down')
    },
    endContent,
    hasHint: Boolean(hint?.message),
    hasLabel: Boolean(label),
    hintIconProps,
    hintMessage: hint?.message,
    hintMessageClassName: hintMessageVariants({ tone: hint?.type ?? 'info' }),
    inputProps: {
      ...props,
      ref: inputRef,
      id,
      type: inputType,
      placeholder,
      disabled,
      'aria-disabled': disabled ? true : undefined,
      'aria-invalid': hint?.type === 'error' ? true : nativeAriaInvalid,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      'aria-label': nativeAriaLabel ?? (!labelledBy ? placeholder : undefined),
      className: nativeInputVariants({ hasInlineAction }),
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onChange: handleChange,
      required: requiredState,
      'aria-required': requiredState ? true : undefined,
      value,
      defaultValue
    },
    incrementButtonProps: {
      type: 'button',
      'aria-label': 'Increase value',
      'aria-controls': id,
      className: inputInlineButtonVariants({ shape: 'top' }),
      disabled,
      onClick: () => stepNumberValue('up')
    },
    isRequired: requiredState,
    label,
    labelProps: {
      id: `${id}-label`,
      htmlFor: id,
      className: labelClassName
    },
    passwordButtonProps: {
      type: 'button',
      'aria-label': showPassword ? 'Hide password' : 'Show password',
      'aria-controls': id,
      'aria-pressed': showPassword,
      className: inputInlineButtonVariants({ shape: 'icon' }),
      disabled,
      onClick: () => setShowPassword((current) => !current)
    },
    passwordIconName: showPassword ? 'eye-off' : 'eye',
    shouldRenderNumberControls: type === 'number',
    shouldRenderPasswordToggle: type === 'password',
    showPassword,
    startContent,
    stepButtonGroupClassName: 'absolute right-2 top-0 bottom-0 z-10 flex flex-col items-center justify-center gap-0.5',
    toggleButtonGroupClassName: 'absolute right-2 top-0 bottom-0 z-10 flex flex-col items-center justify-center',
    wrapperClassName: cn('flex flex-col gap-2', isFullWidth && 'w-full', type === 'hidden' && 'hidden')
  };
};
