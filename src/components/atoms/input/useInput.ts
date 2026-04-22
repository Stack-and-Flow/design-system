import type { VariantProps } from 'class-variance-authority';
import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { useRipple } from '@/hooks/useRipple';
import type { InputProps, inputVariants } from './types';

export const useInput = ({
  rounded = false,
  size = 'md',
  label,
  placeholder,
  id,
  type = 'text',
  variant = 'regular',
  className,
  startContent,
  endContent,
  isFullWidth = false,
  isRequired = false,
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
  ...props
}: Omit<VariantProps<typeof inputVariants>, 'state' | 'focused'> &
  InputProps &
  Omit<ComponentProps<'input'>, 'size' | 'id'> & {
    ariaDescribedBy?: string | string[];
    ariaLabelledBy?: string | string[];
  }) => {
  const formatAriaIds = (ids?: string | string[]) => (Array.isArray(ids) ? ids.join(' ') : ids);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLInputElement>(null);

  useRipple(containerRef);

  useEffect(() => {
    if (ref.current) {
      ref.current.type = showPassword ? 'text' : 'password';
    }
  }, [showPassword]);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    onBlur?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['number', 'tel'].includes(type)) {
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', 'Home', 'End', '.'];
      const isNumberKey = /^[0-9]$/.test(e.key);

      if (!allowedKeys.includes(e.key) && !isNumberKey) {
        e.preventDefault();
      }
      if (e.key === '.' && e.currentTarget.value.includes('.')) {
        e.preventDefault();
      }
    }
    onKeyDown?.(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    onChange?.(e, e.target.value);
  };

  return {
    containerRef,
    size,
    rounded,
    variant,
    isFocused,
    type,
    isFullWidth,
    label,
    hint,
    disabled,
    className,
    ref,
    id,
    hasValue,
    placeholder,
    startContent,
    endContent,
    isRequired,
    formatAriaIds,
    ariaDescribedBy,
    ariaLabelledBy,
    handleBlur,
    handleChange,
    handleFocus,
    handleKeyDown,
    showPassword,
    value,
    defaultValue,
    setHasValue,
    setShowPassword,
    ...props
  };
};
