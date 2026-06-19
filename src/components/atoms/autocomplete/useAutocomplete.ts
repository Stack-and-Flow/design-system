import type { ComponentProps, CSSProperties, MouseEvent, RefObject } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DynamicIconName } from '@/types';
import type { IconTone } from '../icon';
import type { AutocompleteHint, AutocompleteOption, AutocompleteProps } from './types';
import {
  autocompleteEmptyMessage,
  autocompleteFilterContainer,
  autocompleteSearchInput,
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

type CloseReason = 'escape' | 'selection' | 'outside' | 'tab' | 'toggle';

type AutocompleteOptionProps = ComponentProps<'div'> & Record<`data-${string}`, string | undefined>;

type UseAutocompleteReturn = {
  isOpen: boolean;
  activeOptionKey: string | null;
  filteredOptions: AutocompleteOption[];
  selectedOption: AutocompleteOption | undefined;
  hasValue: boolean;
  showClearButton: boolean;
  isLoading: boolean;
  isRequired: boolean;
  clearAriaLabel: string;
  loadingLabel: string;
  emptyMessage: string;
  label: string | undefined;
  description: string | undefined;
  placeholder: string | undefined;
  searchPlaceholder: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  searchQuery: string;
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
  searchInputClassName: string;
  emptyMessageClassName: string;
  filterContainerClassName: string;
  getOptionClassName: (option: AutocompleteOption) => string;
  popoverStyle: CSSProperties;
  triggerProps: ComponentProps<'button'>;
  searchInputProps: ComponentProps<'input'>;
  getOptionProps: (option: AutocompleteOption) => AutocompleteOptionProps;
  labelProps: ComponentProps<'label'>;
  descriptionProps: ComponentProps<'div'>;
  hiddenInputProps: ComponentProps<'input'>;
  containerProps: ComponentProps<'div'>;
  handleClear: (e: MouseEvent<HTMLElement>) => void;
  hasHint: boolean;
  hintIconProps?: HintIconProps;
  hintMessage?: string;
  hintMessageClassName: string;
  needsScopedDarkPortal: boolean;
  portalContainer: HTMLElement | null;
  listboxAriaLabel: string;
};

const getHintIconProps = (type?: AutocompleteHint['type']): HintIconProps | undefined => {
  switch (type) {
    case 'error': {
      return { name: 'circle-alert', tone: 'danger', size: 16 };
    }
    case 'warning': {
      return { name: 'triangle-alert', tone: 'warning', size: 16 };
    }
    case 'success': {
      return { name: 'circle-check', tone: 'success', size: 16 };
    }
    case 'info': {
      return { name: 'info', tone: 'muted', size: 16 };
    }
    default: {
      return undefined;
    }
  }
};

const getFloatingLabelState = ({
  hasFloatingLabel,
  size
}: {
  hasFloatingLabel: boolean;
  size: NonNullable<AutocompleteProps['size']>;
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

const defaultFilterFn = (option: AutocompleteOption, query: string) => {
  return option.label.toLowerCase().includes(query.toLowerCase());
};

export const useAutocomplete = (props: AutocompleteProps): UseAutocompleteReturn => {
  const {
    options,
    value: valueProp,
    defaultValue = null,
    onChange,
    onClear,
    onOpenChange,
    filterFn = defaultFilterFn,
    placeholder,
    searchPlaceholder = 'Search...',
    searchAriaLabel = 'Search options',
    listboxAriaLabel = 'Options',
    emptyMessage = 'No results found.',
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
        '[Autocomplete] `errorMessage` is deprecated. Use `hint={{ message: errorMessage, type: "error" }}` instead.'
      );
      warned.errorMessage = true;
    }

    if (isInvalid && !warned.isInvalid) {
      console.warn('[Autocomplete] `isInvalid` is deprecated. Use `hint={{ type: "error" }}` instead.');
      warned.isInvalid = true;
    }

    if (variant === 'faded' && !warned.faded) {
      console.warn('[Autocomplete] `variant="faded"` is deprecated. Use `variant="line"` instead.');
      warned.faded = true;
    }
  }, [errorMessage, isInvalid, variant]);

  const effectiveHint = hint ?? (errorMessage ? { message: errorMessage, type: 'error' as const } : undefined);
  const status = effectiveHint?.type ?? (isInvalid ? 'error' : 'default');
  const generatedId = useId().replaceAll(':', '');
  const id = idProp ?? `autocomplete-${generatedId}`;

  const triggerContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const [activeOptionKey, setActiveOptionKey] = useState<string | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  const [needsScopedDarkPortal, setNeedsScopedDarkPortal] = useState(false);

  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : internalValue;
  const selectedOption = options.find((option) => option.key === selectedValue);
  const hasValue = selectedValue != null;
  const showClearButton = isClearable && hasValue && !isDisabled && !isLoading;
  const effectiveDisabled = isDisabled;
  const resolvedVariant = variant;
  const explicitAriaLabel = ariaLabel ?? nativeAriaLabel;

  const filteredOptions = useMemo(() => {
    return options.filter((option) => filterFn(option, searchQuery));
  }, [filterFn, options, searchQuery]);

  const enabledFilteredOptions = useMemo(() => {
    return filteredOptions.filter((option) => !option.disabled);
  }, [filteredOptions]);

  const activeOption = useMemo(() => {
    if (!activeOptionKey) {
      return undefined;
    }

    return filteredOptions.find((option) => option.key === activeOptionKey);
  }, [activeOptionKey, filteredOptions]);

  const activeDescendantId = activeOption ? `${id}-option-${activeOption.key}` : undefined;

  const closePopover = useCallback(
    (reason: CloseReason) => {
      setSearchQuery('');
      setActiveOptionKey(null);
      onOpenChange?.(false);
      setIsOpen(false);

      if (reason === 'outside') {
        setTimeout(() => {
          triggerRef.current?.focus();
        }, 0);
      } else if (reason !== 'tab') {
        triggerRef.current?.focus();
      }
    },
    [onOpenChange]
  );

  const openPopover = useCallback(() => {
    if (effectiveDisabled) {
      return;
    }

    setIsOpen(true);
    setSearchQuery('');
    setActiveOptionKey(null);
    onOpenChange?.(true);
  }, [effectiveDisabled, onOpenChange]);

  useEffect(() => {
    if (!isOpen || isLoading) {
      return;
    }

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [isLoading, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const maintainFocus = () => {
      if (document.activeElement !== searchInputRef.current && popoverRef.current?.contains(document.activeElement)) {
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('focusin', maintainFocus);
    return () => document.removeEventListener('focusin', maintainFocus);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const container = triggerContainerRef.current;
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleMouseDown = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;

      if (popoverRef.current?.contains(target) || triggerContainerRef.current?.contains(target)) {
        return;
      }

      closePopover('outside');
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [closePopover, isOpen]);

  useEffect(() => {
    if (!activeDescendantId) {
      return;
    }

    const element = document.getElementById(activeDescendantId);
    if (typeof element?.scrollIntoView === 'function') {
      element.scrollIntoView({ block: 'nearest' });
    }
  }, [activeDescendantId]);

  useEffect(() => {
    if (!activeOptionKey) {
      return;
    }

    const stillEnabledAndVisible = enabledFilteredOptions.some((option) => option.key === activeOptionKey);
    if (!stillEnabledAndVisible) {
      setActiveOptionKey(null);
    }
  }, [activeOptionKey, enabledFilteredOptions]);

  // Compute dark portal scope after mount (ref is null on first render)
  useEffect(() => {
    const el = triggerContainerRef.current?.closest('.dark');
    setNeedsScopedDarkPortal(Boolean(el && el.tagName !== 'HTML' && el.tagName !== 'BODY'));
  }, []);

  // Dev warning: trigger must have an accessible name
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    if (!label && !explicitAriaLabel) {
      console.warn(
        '[Autocomplete] Provide either `label`, `ariaLabel`, or `aria-label` so the trigger button has an accessible name.'
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectOption = useCallback(
    (option: AutocompleteOption) => {
      if (option.disabled || isLoading || effectiveDisabled) {
        return;
      }

      if (!isControlled) {
        setInternalValue(option.key);
      }

      onChange?.(option.key);
      closePopover('selection');
    },
    [closePopover, effectiveDisabled, isControlled, isLoading, onChange]
  );

  const handleClear = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();

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

  const moveToBoundaryOption = useCallback(
    (boundary: 'first' | 'last') => {
      const option =
        boundary === 'first' ? enabledFilteredOptions[0] : enabledFilteredOptions[enabledFilteredOptions.length - 1];

      if (!option) {
        return;
      }

      setActiveOptionKey(option.key);
    },
    [enabledFilteredOptions]
  );

  const moveActiveOption = useCallback(
    (direction: 'next' | 'previous') => {
      if (enabledFilteredOptions.length === 0) {
        return;
      }

      if (!activeOptionKey) {
        const fallbackOption =
          direction === 'next' ? enabledFilteredOptions[0] : enabledFilteredOptions[enabledFilteredOptions.length - 1];
        setActiveOptionKey(fallbackOption?.key ?? null);
        return;
      }

      const currentIndex = enabledFilteredOptions.findIndex((option) => option.key === activeOptionKey);
      if (currentIndex < 0) {
        const fallbackOption =
          direction === 'next' ? enabledFilteredOptions[0] : enabledFilteredOptions[enabledFilteredOptions.length - 1];
        setActiveOptionKey(fallbackOption?.key ?? null);
        return;
      }

      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % enabledFilteredOptions.length
          : (currentIndex - 1 + enabledFilteredOptions.length) % enabledFilteredOptions.length;

      setActiveOptionKey(enabledFilteredOptions[nextIndex]?.key ?? null);
    },
    [activeOptionKey, enabledFilteredOptions]
  );

  const handleTriggerMouseDown = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onMouseDownProp?.(event);

      if (event.defaultPrevented) {
        return;
      }

      triggerRef.current?.focus();
      event.preventDefault();
    },
    [onMouseDownProp]
  );

  const handleTriggerClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event);
    },
    [onClickProp]
  );

  const handleContainerClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (effectiveDisabled || event.defaultPrevented) {
        return;
      }

      if (isOpen) {
        closePopover('toggle');
      } else {
        openPopover();
      }
    },
    [closePopover, effectiveDisabled, isOpen, openPopover]
  );

  const handleSearchChange: NonNullable<ComponentProps<'input'>['onChange']> = useCallback((event) => {
    setSearchQuery(event.target.value);
    setActiveOptionKey(null);
  }, []);

  const handleSearchKeyDown: NonNullable<ComponentProps<'input'>['onKeyDown']> = useCallback(
    (event) => {
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          moveActiveOption('next');
          break;
        }
        case 'ArrowUp': {
          if (!activeOptionKey) {
            return;
          }

          event.preventDefault();

          const currentIndex = enabledFilteredOptions.findIndex((option) => option.key === activeOptionKey);
          if (currentIndex === 0) {
            setActiveOptionKey(null);
            return;
          }

          moveActiveOption('previous');
          break;
        }
        case 'Enter': {
          if (activeOptionKey) {
            event.preventDefault();
            const option = enabledFilteredOptions.find((item) => item.key === activeOptionKey);
            if (option) {
              selectOption(option);
            }
            return;
          }

          if (enabledFilteredOptions.length === 1) {
            event.preventDefault();
            const [onlyOption] = enabledFilteredOptions;
            if (onlyOption) {
              selectOption(onlyOption);
            }
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          closePopover('escape');
          break;
        }
        case 'Tab': {
          event.preventDefault();
          // Use document-level focusable query instead of fragile sibling traversal
          const triggerEl = triggerRef.current;
          if (triggerEl) {
            const allFocusable = Array.from(
              document.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
              )
            );
            const triggerIndex = allFocusable.indexOf(triggerEl);
            if (triggerIndex !== -1) {
              const nextIndex = event.shiftKey ? triggerIndex - 1 : triggerIndex + 1;
              allFocusable[nextIndex]?.focus();
            }
          }
          closePopover('tab');
          break;
        }
        case 'Home': {
          event.preventDefault();
          moveToBoundaryOption('first');
          break;
        }
        case 'End': {
          event.preventDefault();
          moveToBoundaryOption('last');
          break;
        }
        default: {
          break;
        }
      }
    },
    [activeOptionKey, closePopover, enabledFilteredOptions, moveActiveOption, moveToBoundaryOption, selectOption]
  );

  const hasFloatingLabel = Boolean(label) && (isOpen || hasValue || Boolean(placeholder));
  const portalContainer = typeof document === 'undefined' ? null : document.body;

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
  const popoverClassName = cn(selectPopover(), 'overflow-hidden flex flex-col', classNames?.popover);
  const labelClassName = cn(
    selectLabel({
      size: resolvedSize,
      state: getFloatingLabelState({ hasFloatingLabel, size: resolvedSize })
    }),
    classNames?.label
  );
  const clearButtonClassName = cn(selectClearButton(), classNames?.clearButton);
  const searchInputClassName = cn(
    autocompleteSearchInput({ size: resolvedSize }),
    'placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark',
    classNames?.searchInput
  );
  const emptyMessageClassName = cn(autocompleteEmptyMessage(), classNames?.emptyMessage);
  const filterContainerClassName = autocompleteFilterContainer();

  const getOptionClassName = useCallback(
    (option: AutocompleteOption) => {
      return cn(
        selectItem({
          size: resolvedSize,
          isSelected: option.key === selectedValue,
          isDisabled: Boolean(option.disabled)
        }),
        classNames?.item
      );
    },
    [classNames?.item, resolvedSize, selectedValue]
  );

  const triggerProps: ComponentProps<'button'> = {
    ...rest,
    ref: triggerRef,
    type: 'button',
    id,
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen,
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
    onClick: handleTriggerClick
  };

  const searchInputProps: ComponentProps<'input'> = {
    ref: searchInputRef,
    type: 'text',
    role: 'combobox',
    value: searchQuery,
    placeholder: searchPlaceholder,
    'aria-label': searchAriaLabel,
    'aria-expanded': true,
    'aria-controls': `${id}-listbox`,
    'aria-activedescendant': activeDescendantId,
    'aria-autocomplete': 'list',
    onChange: handleSearchChange,
    onKeyDown: handleSearchKeyDown
  };

  const getOptionProps = useCallback(
    (option: AutocompleteOption): AutocompleteOptionProps => {
      return {
        role: 'option',
        id: `${id}-option-${option.key}`,
        'aria-selected': option.key === selectedValue,
        'aria-disabled': option.disabled ? 'true' : undefined,
        'data-disabled': option.disabled ? 'true' : undefined,
        'data-focused': option.key === activeOptionKey ? 'true' : undefined,
        onClick: () => selectOption(option)
      };
    },
    [activeOptionKey, id, selectOption, selectedValue]
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
    ref: triggerContainerRef,
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

  return {
    isOpen,
    activeOptionKey,
    filteredOptions,
    selectedOption,
    hasValue,
    showClearButton,
    isLoading,
    isRequired,
    clearAriaLabel,
    loadingLabel,
    emptyMessage,
    label,
    description,
    placeholder,
    searchPlaceholder,
    triggerRef,
    searchInputRef,
    popoverRef,
    searchQuery,
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
    searchInputClassName,
    emptyMessageClassName,
    filterContainerClassName,
    getOptionClassName,
    popoverStyle,
    triggerProps,
    searchInputProps,
    getOptionProps,
    labelProps,
    descriptionProps,
    hiddenInputProps,
    containerProps,
    handleClear,
    hasHint,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    needsScopedDarkPortal,
    portalContainer,
    listboxAriaLabel
  };
};
