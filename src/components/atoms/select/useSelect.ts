import type { ComponentProps, CSSProperties, KeyboardEvent, MouseEvent, RefObject } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { SelectOption, SelectProps } from './types';
import {
  selectBase,
  selectClearButton,
  selectErrorMessage,
  selectIndicator,
  selectItem,
  selectLabel,
  selectPopover,
  selectTrigger,
  selectValue
} from './types';

const getFloatingLabelState = ({ size }: { size: NonNullable<SelectProps['size']> }) => {
  if (size === 'sm') {
    return 'floatingSm';
  }

  if (size === 'lg') {
    return 'floatingLg';
  }

  return 'floatingMd';
};

type UseSelectReturn = {
  isOpen: boolean;
  focusedIndex: number;
  selectedOption: SelectOption | undefined;
  searchQuery: string;
  hasValue: boolean;
  showClearButton: boolean;
  isLoading: boolean;
  isRequired: boolean;
  isInvalid: boolean;
  label: string | undefined;
  description: string | undefined;
  errorMessage: string | undefined;
  options: SelectOption[];
  placeholder: string | undefined;
  triggerRef: RefObject<HTMLButtonElement>;
  popoverRef: RefObject<HTMLDivElement>;
  handleTriggerClick: () => void;
  handleItemSelect: (option: SelectOption) => void;
  handleClear: (e: MouseEvent<HTMLElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  triggerClassName: string;
  popoverClassName: string;
  valueClassName: string;
  indicatorClassName: string;
  clearButtonClassName: string;
  labelClassName: string;
  errorMessageClassName: string;
  baseClassName: string;
  getOptionClassName: (option: SelectOption, index: number) => string;
  popoverStyle: CSSProperties;
  triggerProps: ComponentProps<'button'>;
  popoverProps: ComponentProps<'div'>;
  getOptionProps: (option: SelectOption, index: number) => ComponentProps<'div'>;
  labelProps: ComponentProps<'label'>;
  descriptionProps: ComponentProps<'div'>;
  errorMessageProps: ComponentProps<'div'>;
  hiddenInputProps: ComponentProps<'input'>;
};

export const useSelect = (props: SelectProps): UseSelectReturn => {
  const {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    onClear,
    onOpenChange,
    placeholder,
    label,
    description,
    errorMessage,
    isInvalid = false,
    isDisabled = false,
    isRequired = false,
    isLoading = false,
    isClearable = false,
    name,
    id: idProp,
    className,
    classNames,
    variant = 'regular',
    size = 'md',
    ...rest
  } = props;

  const resolvedSize = (size ?? 'md') as NonNullable<typeof size>;

  const generatedId = useId().replaceAll(':', '');
  const id = idProp ?? `select-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const skipNextClickRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});

  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : internalValue;
  const selectedOption = options.find((opt) => opt.key === selectedValue);
  const hasValue = selectedValue != null && selectedValue !== '';
  const showClearButton = isClearable && hasValue && !isDisabled && !isLoading;

  const effectiveDisabled = isDisabled;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleMouseDown = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) {
        return;
      }
      if (triggerRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
      setFocusedIndex(-1);
      setSearchQuery('');
      onOpenChange?.(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }
      const rect = trigger.getBoundingClientRect();
      setPopoverStyle({
        position: 'fixed',
        left: rect.left,
        top: rect.bottom + 4,
        minWidth: trigger.offsetWidth
      });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const getEnabledIndices = useCallback(
    () => options.map((opt, i) => (opt.disabled ? -1 : i)).filter((i) => i >= 0),
    [options]
  );

  const openPopover = useCallback(() => {
    if (effectiveDisabled) {
      return;
    }
    setIsOpen(true);
    onOpenChange?.(true);

    const enabled = getEnabledIndices();
    const selectedIdx = selectedOption ? options.findIndex((o) => o.key === selectedOption.key) : -1;
    const initialIndex = selectedIdx >= 0 && !options[selectedIdx]?.disabled ? selectedIdx : (enabled[0] ?? 0);
    setFocusedIndex(initialIndex);
  }, [effectiveDisabled, getEnabledIndices, onOpenChange, options, selectedOption]);

  const closePopover = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    setSearchQuery('');
    onOpenChange?.(false);
    triggerRef.current?.focus();
  }, [onOpenChange]);

  const handleTriggerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    },
    [isOpen, closePopover, openPopover]
  );

  const handleTriggerClick = useCallback(() => {
    if (skipNextClickRef.current) {
      skipNextClickRef.current = false;
    }
  }, []);

  const handleItemSelect = useCallback(
    (option: SelectOption) => {
      if (option.disabled || isLoading || effectiveDisabled) {
        return;
      }
      if (!isControlled) {
        setInternalValue(option.key);
      }
      onChange?.(option.key);
      closePopover();
    },
    [closePopover, effectiveDisabled, isControlled, isLoading, onChange]
  );

  const handleClear = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (isLoading || effectiveDisabled) {
        return;
      }
      if (!isControlled) {
        setInternalValue(null);
      }
      onClear?.();
      onChange?.('');
      triggerRef.current?.focus();
    },
    [effectiveDisabled, isControlled, isLoading, onChange, onClear]
  );

  const handleTypeAhead = useCallback(
    (char: string) => {
      const newQuery = (searchQuery + char.toLowerCase()).slice(0, 20);
      setSearchQuery(newQuery);

      const enabled = getEnabledIndices();
      const currentPos = enabled.indexOf(focusedIndex);
      const startFrom = currentPos >= 0 ? currentPos : -1;

      for (let i = 0; i < enabled.length; i++) {
        const idx = enabled[(startFrom + 1 + i) % enabled.length];
        if (idx === undefined) {
          continue;
        }
        const opt = options[idx];
        if (opt?.label.toLowerCase().startsWith(newQuery)) {
          setFocusedIndex(idx);
          break;
        }
      }

      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => setSearchQuery(''), 500);
    },
    [focusedIndex, getEnabledIndices, options, searchQuery]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      const enabled = getEnabledIndices();

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (!isOpen) {
            openPopover();
            return;
          }
          const currentPos = enabled.indexOf(focusedIndex);
          const nextPos = currentPos >= 0 ? (currentPos + 1) % enabled.length : 0;
          setFocusedIndex(enabled[nextPos] ?? 0);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (!isOpen) {
            openPopover();
            return;
          }
          const currentPos = enabled.indexOf(focusedIndex);
          const prevPos = currentPos >= 0 ? (currentPos - 1 + enabled.length) % enabled.length : enabled.length - 1;
          setFocusedIndex(enabled[prevPos] ?? 0);
          break;
        }
        case 'Home': {
          e.preventDefault();
          if (!isOpen) {
            openPopover();
          }
          setFocusedIndex(enabled[0] ?? 0);
          break;
        }
        case 'End': {
          e.preventDefault();
          if (!isOpen) {
            openPopover();
          }
          setFocusedIndex(enabled[enabled.length - 1] ?? 0);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (!isOpen) {
            openPopover();
          } else if (focusedIndex >= 0 && options[focusedIndex] && !options[focusedIndex].disabled) {
            handleItemSelect(options[focusedIndex]);
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          if (isOpen) {
            closePopover();
          }
          break;
        }
        case 'Tab': {
          if (isOpen) {
            closePopover();
          }
          break;
        }
        default: {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            handleTypeAhead(e.key);
          }
          break;
        }
      }
    },
    [closePopover, focusedIndex, getEnabledIndices, handleItemSelect, handleTypeAhead, isOpen, openPopover, options]
  );

  const baseClassName = cn(selectBase(), className, classNames?.base);
  const triggerClassName = cn(
    selectTrigger({ variant, size: resolvedSize, isInvalid }),
    label ? 'flex-col' : 'items-center',
    classNames?.trigger
  );
  const valueClassName = cn(selectValue(), classNames?.value);
  const indicatorClassName = cn(selectIndicator({ isOpen }), classNames?.indicator);
  const popoverClassName = cn(selectPopover(), classNames?.popover);
  const labelClassName = cn(
    selectLabel({ size: resolvedSize, state: getFloatingLabelState({ size: resolvedSize }) }),
    'relative left-auto top-auto translate-y-0',
    classNames?.label
  );
  const errorMessageClassName = cn(selectErrorMessage(), classNames?.errorMessage);
  const clearButtonClassName = cn(selectClearButton(), classNames?.clearButton);

  const getOptionClassName = useCallback(
    (option: SelectOption, _index: number) => {
      const isSelected = option.key === selectedValue;
      const isItemDisabled = !!option.disabled;
      return cn(selectItem({ size: resolvedSize, isSelected, isDisabled: isItemDisabled }), classNames?.item);
    },
    [classNames?.item, selectedValue, resolvedSize]
  );

  const triggerProps: ComponentProps<'button'> = {
    ...rest,
    ref: triggerRef,
    type: 'button',
    role: 'combobox',
    id,
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? `${id}-listbox` : undefined,
    'aria-invalid': isInvalid,
    'aria-required': isRequired || undefined,
    'aria-describedby':
      [description ? `${id}-description` : null, errorMessage ? `${id}-error` : null].filter(Boolean).join(' ') ||
      undefined,
    'aria-labelledby': label ? `${id}-label` : undefined,
    disabled: effectiveDisabled,
    'aria-disabled': effectiveDisabled || undefined,
    onMouseDown: handleTriggerMouseDown,
    onClick: handleTriggerClick,
    onKeyDown: handleKeyDown
  };

  const popoverProps: ComponentProps<'div'> = {
    ref: popoverRef,
    role: 'listbox',
    id: `${id}-listbox`,
    'aria-label': label ?? 'Select options'
  };

  const getOptionProps = useCallback(
    (option: SelectOption, index: number): ComponentProps<'div'> => {
      const isSelected = option.key === selectedValue;
      const isFocused = index === focusedIndex;

      return {
        role: 'option',
        id: `${id}-option-${option.key}`,
        'aria-selected': isSelected,
        'data-focused': isFocused ? 'true' : undefined,
        'data-disabled': option.disabled ? 'true' : undefined,
        onClick: () => handleItemSelect(option)
      } as ComponentProps<'div'>;
    },
    [focusedIndex, handleItemSelect, id, selectedValue]
  );

  const labelProps: ComponentProps<'label'> = {
    htmlFor: id,
    id: `${id}-label`
  };

  const descriptionProps: ComponentProps<'div'> = {
    id: `${id}-description`
  };

  const errorMessageProps: ComponentProps<'div'> = {
    id: `${id}-error`
  };

  const hiddenInputProps: ComponentProps<'input'> = {
    type: 'hidden',
    name,
    value: selectedValue ?? ''
  };

  return {
    isOpen,
    focusedIndex,
    selectedOption,
    searchQuery,
    hasValue,
    showClearButton,
    isLoading,
    isRequired,
    isInvalid,
    label,
    description,
    errorMessage,
    options,
    placeholder,
    triggerRef,
    popoverRef,
    handleTriggerClick,
    handleItemSelect,
    handleClear,
    handleKeyDown,
    triggerClassName,
    popoverClassName,
    valueClassName,
    indicatorClassName,
    clearButtonClassName,
    labelClassName,
    errorMessageClassName,
    baseClassName,
    getOptionClassName,
    triggerProps,
    popoverProps,
    popoverStyle,
    getOptionProps,
    labelProps,
    descriptionProps,
    errorMessageProps,
    hiddenInputProps
  };
};
