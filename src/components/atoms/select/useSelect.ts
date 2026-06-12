import type { ComponentProps, CSSProperties, KeyboardEvent, MouseEvent, RefObject } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DynamicIconName } from '@/types';
import type { IconTone } from '../icon';
import type { SelectHint, SelectOption, SelectProps } from './types';
import {
  hintMessageVariants,
  selectActionGroup,
  selectBase,
  selectClearButton,
  selectContent,
  selectIndicator,
  selectItem,
  selectLabel,
  selectNativeTrigger,
  selectPopover,
  selectTrigger,
  selectValue
} from './types';

type HintIconProps = {
  name: DynamicIconName;
  tone: IconTone;
  size: 16;
};

const getHintIconProps = (type?: SelectHint['type']): HintIconProps | undefined => {
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

const getFloatingLabelState = ({
  hasFloatingLabel,
  size
}: {
  hasFloatingLabel: boolean;
  size: NonNullable<SelectProps['size']>;
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

type UseSelectReturn = {
  isOpen: boolean;
  focusedIndex: number;
  selectedOption: SelectOption | undefined;
  searchQuery: string;
  hasValue: boolean;
  showClearButton: boolean;
  isLoading: boolean;
  isRequired: boolean;
  clearAriaLabel: string;
  loadingLabel: string;
  label: string | undefined;
  description: string | undefined;
  options: SelectOption[];
  placeholder: string | undefined;
  triggerRef: RefObject<HTMLButtonElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  handleItemSelect: (option: SelectOption) => void;
  handleClear: (e: MouseEvent<HTMLElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  triggerClassName: string;
  popoverClassName: string;
  contentClassName: string;
  nativeTriggerClassName: string;
  valueClassName: string;
  actionGroupClassName: string;
  indicatorClassName: string;
  clearButtonClassName: string;
  labelClassName: string;
  baseClassName: string;
  getOptionClassName: (option: SelectOption, index: number) => string;
  popoverStyle: CSSProperties;
  triggerProps: ComponentProps<'button'>;
  popoverProps: ComponentProps<'div'>;
  getOptionProps: (option: SelectOption, index: number) => ComponentProps<'div'>;
  labelProps: ComponentProps<'label'>;
  descriptionProps: ComponentProps<'div'>;
  hiddenInputProps: ComponentProps<'input'>;
  containerProps: ComponentProps<'div'>;
  hasHint: boolean;
  hintIconProps?: HintIconProps;
  hintMessage?: string;
  hintMessageClassName: string;
  effectiveHint?: SelectHint;
  needsScopedDarkPortal: boolean;
  portalContainer: HTMLElement | null;
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
    isFullWidth = false,
    ariaLabel,
    clearAriaLabel = 'Clear selection',
    loadingLabel = 'Loading options...',
    name,
    id: idProp,
    className,
    classNames,
    variant = 'regular',
    size = 'md',
    hint,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onMouseDown: onMouseDownProp,
    'aria-describedby': ariaDescribedByProp,
    'aria-label': nativeAriaLabel,
    ...rest
  } = props;

  const resolvedSize = (size ?? 'md') as NonNullable<typeof size>;
  const deprecationWarningsRef = useRef({ errorMessage: false, isInvalid: false, faded: false });

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const warned = deprecationWarningsRef.current;

    if (errorMessage !== undefined && !warned.errorMessage) {
      console.warn(
        '[Select] `errorMessage` is deprecated. Use `hint={{ message: errorMessage, type: "error" }}` instead.'
      );
      warned.errorMessage = true;
    }
    if (isInvalid && !warned.isInvalid) {
      console.warn('[Select] `isInvalid` is deprecated. Use `hint={{ type: "error" }}` instead.');
      warned.isInvalid = true;
    }
    if (variant === 'faded' && !warned.faded) {
      console.warn('[Select] `variant="faded"` is deprecated. Use `variant="line"` instead.');
      warned.faded = true;
    }
  }, [errorMessage, isInvalid, variant]);

  const resolvedVariant = variant;
  const effectiveHint = hint ?? (errorMessage ? { message: errorMessage, type: 'error' as const } : undefined);
  const status = effectiveHint?.type ?? (isInvalid ? 'error' : 'default');

  const generatedId = useId().replaceAll(':', '');
  const id = idProp ?? `select-${generatedId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});

  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : internalValue;
  const selectedOption = options.find((opt) => opt.key === selectedValue);
  const hasValue = selectedValue != null;
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
      if (containerRef.current?.contains(target)) {
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
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const rect = container.getBoundingClientRect();
      setPopoverStyle({
        position: 'fixed',
        left: rect.left,
        top: rect.bottom + 4,
        width: rect.width
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
    triggerRef.current?.focus();
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

  const handleContainerClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (effectiveDisabled || e.defaultPrevented) {
        return;
      }
      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    },
    [effectiveDisabled, isOpen, closePopover, openPopover]
  );

  const handleTriggerMouseDown = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onMouseDownProp?.(e);
      if (e.defaultPrevented) {
        return;
      }
      triggerRef.current?.focus();
      e.preventDefault();
    },
    [onMouseDownProp]
  );

  const handleTriggerClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(e);
    },
    [onClickProp]
  );

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
      triggerRef.current?.focus();
    },
    [effectiveDisabled, isControlled, isLoading, onClear]
  );

  const handleTypeAhead = useCallback(
    (char: string) => {
      const normalizedChar = char.toLowerCase();
      const newQuery = (searchQuery + normalizedChar).slice(0, 20);

      const enabled = getEnabledIndices();
      const currentPos = enabled.indexOf(focusedIndex);
      const startFrom = currentPos >= 0 ? currentPos : -1;

      const findMatchingIndex = (query: string) => {
        for (let i = 0; i < enabled.length; i++) {
          const idx = enabled[(startFrom + 1 + i) % enabled.length];
          if (idx === undefined) {
            continue;
          }
          const opt = options[idx];
          if (opt?.label.toLowerCase().startsWith(query)) {
            return idx;
          }
        }
        return undefined;
      };

      let matchedQuery = newQuery;
      let matchedIndex = findMatchingIndex(newQuery);
      if (matchedIndex === undefined && newQuery !== normalizedChar) {
        matchedQuery = normalizedChar;
        matchedIndex = findMatchingIndex(normalizedChar);
      }

      if (matchedIndex === undefined) {
        setSearchQuery('');
      } else {
        setSearchQuery(matchedQuery);
        setFocusedIndex(matchedIndex);
      }

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => setSearchQuery(''), 500);
    },
    [focusedIndex, getEnabledIndices, options, searchQuery]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDownProp?.(e);
      if (e.defaultPrevented) {
        return;
      }

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
            const lastEnabled = enabled[enabled.length - 1] ?? 0;
            setFocusedIndex(lastEnabled);
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
    [
      closePopover,
      focusedIndex,
      getEnabledIndices,
      handleItemSelect,
      handleTypeAhead,
      isOpen,
      onKeyDownProp,
      openPopover,
      options
    ]
  );

  const hasFloatingLabel = Boolean(label) && (isOpen || hasValue || Boolean(placeholder));
  const activeDescendantId =
    isOpen && focusedIndex >= 0 && options[focusedIndex] ? `${id}-option-${options[focusedIndex].key}` : undefined;

  useEffect(() => {
    if (!activeDescendantId) {
      return;
    }

    const activeOption = document.getElementById(activeDescendantId);
    if (typeof activeOption?.scrollIntoView === 'function') {
      activeOption.scrollIntoView({ block: 'nearest' });
    }
  }, [activeDescendantId]);

  const baseClassName = cn(selectBase({ fullWidth: isFullWidth }), className, classNames?.base);
  const triggerClassName = cn(
    selectTrigger({ variant: resolvedVariant, size: resolvedSize, status }),
    label ? 'items-end' : 'items-center',
    effectiveDisabled && 'pointer-events-none cursor-not-allowed opacity-40',
    classNames?.container,
    classNames?.trigger
  );
  const contentClassName = selectContent({ hasLabel: Boolean(label) });
  const nativeTriggerClassName = selectNativeTrigger();
  const valueClassName = cn(selectValue(), classNames?.value);
  const actionGroupClassName = selectActionGroup({ size: resolvedSize });
  const indicatorClassName = cn(selectIndicator({ isOpen }), classNames?.indicator);
  const popoverClassName = cn(selectPopover(), classNames?.popover);
  const labelClassName = cn(
    selectLabel({
      size: resolvedSize,
      state: getFloatingLabelState({ hasFloatingLabel, size: resolvedSize })
    }),
    classNames?.label
  );
  const clearButtonClassName = cn(selectClearButton(), classNames?.clearButton);

  const getOptionClassName = useCallback(
    (option: SelectOption, _index: number) => {
      const isSelected = option.key === selectedValue;
      const isItemDisabled = !!option.disabled;
      return cn(selectItem({ size: resolvedSize, isSelected, isDisabled: isItemDisabled }), classNames?.item);
    },
    [classNames?.item, selectedValue, resolvedSize]
  );

  const explicitAriaLabel = ariaLabel ?? nativeAriaLabel;

  const triggerProps: ComponentProps<'button'> = {
    ...rest,
    ref: triggerRef,
    type: 'button',
    role: 'combobox',
    id,
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? `${id}-listbox` : undefined,
    'aria-activedescendant': activeDescendantId,
    'aria-invalid': effectiveHint?.type === 'error' || isInvalid || undefined,
    'aria-required': isRequired || undefined,
    'aria-describedby':
      [ariaDescribedByProp, description ? `${id}-description` : null, effectiveHint?.message ? `${id}-hint` : null]
        .filter(Boolean)
        .join(' ') || undefined,
    'aria-label': label ? undefined : explicitAriaLabel,
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
    'aria-label': label ?? explicitAriaLabel
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
        'aria-disabled': option.disabled ? 'true' : undefined,
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

  const hiddenInputProps: ComponentProps<'input'> = {
    type: 'hidden',
    name,
    value: selectedValue ?? ''
  };

  const containerProps: ComponentProps<'div'> = {
    ref: containerRef,
    onClick: handleContainerClick
  };

  const hintIconProps = useMemo(() => getHintIconProps(effectiveHint?.type), [effectiveHint?.type]);
  const hasHint = Boolean(effectiveHint?.message);
  const hintMessage = effectiveHint?.message;
  const hintMessageClassName = cn(
    hintMessageVariants({ tone: effectiveHint?.type ?? 'info' }),
    classNames?.hint,
    effectiveHint?.type === 'error' && classNames?.errorMessage
  );
  const closestDarkContainer = typeof document === 'undefined' ? null : containerRef.current?.closest('.dark');
  const needsScopedDarkPortal = Boolean(
    closestDarkContainer && closestDarkContainer.tagName !== 'HTML' && closestDarkContainer.tagName !== 'BODY'
  );
  const portalContainer = typeof document === 'undefined' ? null : document.body;

  return {
    isOpen,
    focusedIndex,
    selectedOption,
    searchQuery,
    hasValue,
    showClearButton,
    isLoading,
    isRequired,
    clearAriaLabel,
    loadingLabel,
    label,
    description,
    options,
    placeholder,
    triggerRef,
    popoverRef,
    handleItemSelect,
    handleClear,
    handleKeyDown,
    triggerClassName,
    popoverClassName,
    contentClassName,
    nativeTriggerClassName,
    valueClassName,
    actionGroupClassName,
    indicatorClassName,
    clearButtonClassName,
    labelClassName,
    baseClassName,
    getOptionClassName,
    triggerProps,
    popoverProps,
    popoverStyle,
    getOptionProps,
    labelProps,
    descriptionProps,
    hiddenInputProps,
    containerProps,
    hasHint,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    effectiveHint,
    needsScopedDarkPortal,
    portalContainer
  };
};
