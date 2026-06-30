import type { ComponentProps, CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, RefCallback } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  type TabsActivationMode,
  type TabsColor,
  type TabsItem,
  type TabsPlacement,
  type TabsProps,
  type TabsRadius,
  type TabsSize,
  type TabsVariant,
  tabsCursorVariants,
  tabsListVariants,
  tabsPanelVariants,
  tabsRootVariants,
  tabsTabContentVariants,
  tabsTabVariants,
  tabsTabWrapperVariants
} from './types';

type PreparedTabItem = TabsItem & {
  disabled: boolean;
  itemDisabled: boolean;
  panelId: string;
  selected: boolean;
  tabId: string;
  tabIndex: number;
};

type TabsSharedTabProps = {
  id: string;
  role: 'tab';
  tabIndex: number;
  'aria-controls': string;
  'aria-disabled'?: true;
  'aria-selected': boolean;
  'data-disabled': boolean;
  'data-selected': boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onMouseDown: (event: MouseEvent<HTMLElement>) => void;
};

type UseTabsReturn = {
  cursorClassName: string;
  cursorStyle: CSSProperties | undefined;
  getButtonTabProps: (item: PreparedTabItem) => TabsSharedTabProps & ComponentProps<'button'>;
  getPanelProps: (item: PreparedTabItem) => ComponentProps<'div'>;
  items: PreparedTabItem[];
  listClassName: string;
  panelClassName: string;
  panelContainerClassName: string;
  registerPanelRef: (key: string) => RefCallback<HTMLDivElement>;
  renderPanelsFirst: boolean;
  rootProps: ComponentProps<'div'>;
  shouldRenderCursor: boolean;
  tabContentClassName: string;
  tabListProps: ComponentProps<'div'>;
  tabWrapperClassName: string;
  getTabClassName: (item: PreparedTabItem) => string;
};

const underlinedCursorThickness = 2;

const tabsVariantValues = ['solid', 'bordered', 'light', 'underlined'] as const satisfies readonly TabsVariant[];
const tabsColorValues = ['primary', 'success', 'warning', 'info', 'error'] as const satisfies readonly TabsColor[];
const tabsSizeValues = ['sm', 'md', 'lg'] as const satisfies readonly TabsSize[];
const tabsRadiusValues = ['none', 'sm', 'md', 'lg', 'full'] as const satisfies readonly TabsRadius[];
const tabsPlacementValues = ['top', 'bottom', 'left', 'right'] as const satisfies readonly TabsPlacement[];
const tabsActivationModeValues = ['automatic', 'manual'] as const satisfies readonly TabsActivationMode[];

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(',');

const selectedTextColorClasses: Record<TabsColor, string> = {
  primary: 'text-brand-light dark:text-brand-dark',
  success: 'text-success-text-light dark:text-success',
  warning: 'text-warning-text-light dark:text-warning',
  info: 'text-info-light dark:text-info',
  error: 'text-error-light dark:text-error'
};

const selectedTextOnFilledCursorColorClasses: Record<TabsColor, string> = {
  primary: 'text-white dark:text-white',
  success: 'text-text-light dark:text-background-dark',
  warning: 'text-text-light dark:text-background-dark',
  info: 'text-white dark:text-white',
  error: 'text-white dark:text-white'
};

const lightHoverColorClasses: Record<TabsColor, string> = {
  primary: 'hover:bg-red-tint-subtle dark:hover:bg-red-tint-low',
  success: 'hover:bg-success-tint',
  warning: 'hover:bg-warning-tint',
  info: 'hover:bg-info-tint',
  error: 'hover:bg-error-tint'
};

const cursorToneClasses: Record<TabsColor, Record<'solid' | 'bordered' | 'light' | 'underlined', string>> = {
  primary: {
    solid: 'border-brand-light bg-brand-light dark:border-brand-dark-darker dark:bg-brand-dark-darker',
    bordered: 'border-brand-light bg-brand-light dark:border-brand-dark-darker dark:bg-brand-dark-darker',
    light: 'bg-brand-light dark:bg-brand-dark-darker',
    underlined: 'bg-brand-light dark:bg-brand-dark'
  },
  success: {
    solid: 'border-success-light bg-success-light dark:border-success dark:bg-success',
    bordered: 'border-success-light bg-success-light dark:border-success dark:bg-success',
    light: 'bg-success-light dark:bg-success',
    underlined: 'bg-success-light dark:bg-success'
  },
  warning: {
    solid: 'border-warning-light bg-warning-light dark:border-warning dark:bg-warning',
    bordered: 'border-warning-light bg-warning-light dark:border-warning dark:bg-warning',
    light: 'bg-warning-light dark:bg-warning',
    underlined: 'bg-warning-light dark:bg-warning'
  },
  info: {
    solid: 'border-info-light bg-info-light dark:border-blue-dark dark:bg-blue-dark',
    bordered: 'border-info-light bg-info-light dark:border-blue-dark dark:bg-blue-dark',
    light: 'bg-info-light dark:bg-blue-dark',
    underlined: 'bg-info-light dark:bg-info'
  },
  error: {
    solid: 'border-error-light bg-error-light dark:border-brand-dark-darker dark:bg-brand-dark-darker',
    bordered: 'border-error-light bg-error-light dark:border-brand-dark-darker dark:bg-brand-dark-darker',
    light: 'bg-error-light dark:bg-brand-dark-darker',
    underlined: 'bg-error-light dark:bg-error'
  }
};

const normalizeIdSegment = (value: string) => value.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'tab';

const isOneOf = <Value extends string>(value: unknown, values: readonly Value[]): value is Value => {
  return typeof value === 'string' && values.includes(value as Value);
};

const normalizeVisualProp = <Value extends string>(value: unknown, values: readonly Value[], fallback: Value) => {
  if (isOneOf(value, values)) {
    return value;
  }

  return fallback;
};

const isPlainLeftClick = (
  event: Pick<MouseEvent<HTMLElement>, 'altKey' | 'button' | 'ctrlKey' | 'metaKey' | 'shiftKey'>
) => {
  return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
};

const shouldOpenKeyboardActivationInNewTab = (
  event: Pick<KeyboardEvent<HTMLElement>, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>,
  item: TabsItem
) => {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || item.target === '_blank';
};

const getInitialSelectedKey = ({
  defaultValue,
  firstEnabledKey,
  itemsByKey
}: {
  defaultValue?: string;
  firstEnabledKey: string | null;
  itemsByKey: Map<string, { disabled: boolean }>;
}) => {
  if (defaultValue) {
    const match = itemsByKey.get(defaultValue);
    if (match && !match.disabled) {
      return defaultValue;
    }
  }

  return firstEnabledKey;
};

export const useTabs = ({
  items,
  value,
  defaultValue,
  onValueChange,
  variant: variantProp = 'solid',
  color: colorProp = 'primary',
  size: sizeProp = 'md',
  radius: radiusProp = 'md',
  placement: placementProp = 'top',
  fullWidth = false,
  disabledKeys,
  isDisabled = false,
  activationMode: activationModeProp = 'automatic',
  shouldSelectOnPressUp = true,
  disableAnimation = false,
  disableCursorAnimation = false,
  destroyInactiveTabPanel = false,
  classNames = {},
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: TabsProps): UseTabsReturn => {
  const generatedId = useId().replaceAll(':', '');
  const rootId = id ?? `tabs-${generatedId}`;
  const listId = `${rootId}-tablist`;
  const variant = normalizeVisualProp(variantProp, tabsVariantValues, 'solid');
  const color = normalizeVisualProp(colorProp, tabsColorValues, 'primary');
  const size = normalizeVisualProp(sizeProp, tabsSizeValues, 'md');
  const radius = normalizeVisualProp(radiusProp, tabsRadiusValues, 'md');
  const placement = normalizeVisualProp(placementProp, tabsPlacementValues, 'top');
  const activationMode = normalizeVisualProp(activationModeProp, tabsActivationModeValues, 'automatic');
  const orientation = placement === 'left' || placement === 'right' ? 'vertical' : 'horizontal';
  const isManualActivation = activationMode === 'manual';
  const renderPanelsFirst = placement === 'bottom' || placement === 'right';
  const disabledKeySet = useMemo(() => new Set(disabledKeys ?? []), [disabledKeys]);
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef(new Map<string, HTMLElement | null>());
  const panelRefs = useRef(new Map<string, HTMLDivElement | null>());
  const warningStateRef = useRef({
    missingAccessibleName: false,
    invalidControlledValue: null as string | null,
    disabledControlledValue: null as string | null,
    invalidVisualProps: new Set<string>()
  });
  const [cursorStyle, setCursorStyle] = useState<CSSProperties>();
  const [panelNeedsTabStop, setPanelNeedsTabStop] = useState<Record<string, boolean>>({});

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) => {
        const itemDisabled = item.disabled === true || disabledKeySet.has(item.key);
        const idSegment = `${index}-${normalizeIdSegment(item.key)}`;

        return {
          ...item,
          disabled: isDisabled || itemDisabled,
          itemDisabled,
          panelId: `${rootId}-panel-${idSegment}`,
          tabId: `${rootId}-tab-${idSegment}`
        };
      }),
    [disabledKeySet, isDisabled, items, rootId]
  );

  const itemsByKey = useMemo(
    () => new Map(normalizedItems.map((item) => [item.key, { disabled: item.itemDisabled }])),
    [normalizedItems]
  );
  const enabledItems = useMemo(() => normalizedItems.filter((item) => !item.itemDisabled), [normalizedItems]);
  const firstEnabledKey = enabledItems[0]?.key ?? null;
  const [uncontrolledSelectedKey, setUncontrolledSelectedKey] = useState<string | null>(() =>
    getInitialSelectedKey({ defaultValue, firstEnabledKey, itemsByKey })
  );
  const [focusedKey, setFocusedKey] = useState<string | null>(() => {
    return getInitialSelectedKey({ defaultValue, firstEnabledKey, itemsByKey });
  });

  const controlledSelectedKey = useMemo(() => {
    if (value === undefined) {
      return undefined;
    }

    const match = itemsByKey.get(value);
    if (!match || match.disabled) {
      return firstEnabledKey;
    }

    return value;
  }, [firstEnabledKey, itemsByKey, value]);

  const selectedKey = value !== undefined ? (controlledSelectedKey ?? null) : uncontrolledSelectedKey;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const invalidProps = [
      { name: 'variant', value: variantProp, values: tabsVariantValues, fallback: 'solid' },
      { name: 'color', value: colorProp, values: tabsColorValues, fallback: 'primary' },
      { name: 'size', value: sizeProp, values: tabsSizeValues, fallback: 'md' },
      { name: 'radius', value: radiusProp, values: tabsRadiusValues, fallback: 'md' },
      { name: 'placement', value: placementProp, values: tabsPlacementValues, fallback: 'top' },
      { name: 'activationMode', value: activationModeProp, values: tabsActivationModeValues, fallback: 'automatic' }
    ].filter((prop) => !isOneOf(prop.value, prop.values));

    for (const prop of invalidProps) {
      const warningKey = `${prop.name}:${String(prop.value)}`;
      if (!warningStateRef.current.invalidVisualProps.has(warningKey)) {
        console.warn(`[Tabs] Invalid ${prop.name} \`${String(prop.value)}\`; falling back to \`${prop.fallback}\`.`);
        warningStateRef.current.invalidVisualProps.add(warningKey);
      }
    }
  }, [activationModeProp, colorProp, placementProp, radiusProp, sizeProp, variantProp]);

  useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const warnings = warningStateRef.current;
    const match = itemsByKey.get(value);

    if (!match) {
      if (warnings.invalidControlledValue !== value) {
        console.warn(`[Tabs] Controlled value \`${value}\` does not match any item key.`);
        warnings.invalidControlledValue = value;
      }
      return;
    }

    if (match.disabled) {
      if (warnings.disabledControlledValue !== value) {
        console.warn(`[Tabs] Controlled value \`${value}\` points to a disabled tab.`);
        warnings.disabledControlledValue = value;
      }
    }
  }, [itemsByKey, value]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    if (!ariaLabel && !ariaLabelledBy && !warningStateRef.current.missingAccessibleName) {
      console.warn('[Tabs] Provide `aria-label` or `aria-labelledby` so the tablist has an accessible name.');
      warningStateRef.current.missingAccessibleName = true;
    }
  }, [ariaLabel, ariaLabelledBy]);

  useEffect(() => {
    if (value !== undefined) {
      return;
    }

    if (selectedKey && itemsByKey.get(selectedKey)?.disabled === false) {
      return;
    }

    setUncontrolledSelectedKey(firstEnabledKey);
  }, [firstEnabledKey, itemsByKey, selectedKey, value]);

  useEffect(() => {
    if (focusedKey && itemsByKey.get(focusedKey)?.disabled === false) {
      return;
    }

    setFocusedKey(selectedKey ?? firstEnabledKey);
  }, [firstEnabledKey, focusedKey, itemsByKey, selectedKey]);

  useEffect(() => {
    if (!isManualActivation && selectedKey) {
      setFocusedKey(selectedKey);
    }
  }, [isManualActivation, selectedKey]);

  const selectKey = useCallback(
    (nextKey: string) => {
      const match = itemsByKey.get(nextKey);
      if (isDisabled || !match || match.disabled || nextKey === selectedKey) {
        return;
      }

      if (value === undefined) {
        setUncontrolledSelectedKey(nextKey);
      }

      onValueChange?.(nextKey);
    },
    [isDisabled, itemsByKey, onValueChange, selectedKey, value]
  );

  const moveFocus = useCallback(
    (currentKey: string, direction: 'next' | 'previous' | 'first' | 'last') => {
      if (enabledItems.length === 0) {
        return;
      }

      const currentIndex = enabledItems.findIndex((item) => item.key === currentKey);
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex = (() => {
        switch (direction) {
          case 'first':
            return 0;
          case 'last':
            return enabledItems.length - 1;
          case 'previous':
            return (safeIndex - 1 + enabledItems.length) % enabledItems.length;
          default:
            return (safeIndex + 1) % enabledItems.length;
        }
      })();
      const nextItem = enabledItems[nextIndex];

      if (!nextItem) {
        return;
      }

      setFocusedKey(nextItem.key);
      tabRefs.current.get(nextItem.key)?.focus();

      if (!isManualActivation) {
        selectKey(nextItem.key);
      }
    },
    [enabledItems, isManualActivation, selectKey]
  );

  const handleTabFocus = useCallback((key: string) => {
    setFocusedKey(key);
  }, []);

  const navigateToItemHref = useCallback((item: TabsItem, openInNewTab: boolean) => {
    if (!item.href || typeof document === 'undefined') {
      return;
    }

    const link = document.createElement('a');
    link.href = item.href;
    link.target = openInNewTab ? '_blank' : (item.target ?? '_self');
    link.rel = item.rel ?? (link.target === '_blank' ? 'noopener noreferrer' : '');

    if (item.download !== undefined) {
      link.download = typeof item.download === 'string' ? item.download : '';
    }
    if (item.ping) {
      link.ping = item.ping;
    }
    if (item.referrerPolicy) {
      link.referrerPolicy = item.referrerPolicy;
    }

    link.style.display = 'none';
    document.body.append(link);
    link.click();
    link.remove();
  }, []);

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, item: PreparedTabItem) => {
      switch (event.key) {
        case 'ArrowRight':
          if (orientation !== 'horizontal') {
            return;
          }
          event.preventDefault();
          moveFocus(item.key, 'next');
          break;
        case 'ArrowLeft':
          if (orientation !== 'horizontal') {
            return;
          }
          event.preventDefault();
          moveFocus(item.key, 'previous');
          break;
        case 'ArrowDown':
          if (orientation !== 'vertical') {
            return;
          }
          event.preventDefault();
          moveFocus(item.key, 'next');
          break;
        case 'ArrowUp':
          if (orientation !== 'vertical') {
            return;
          }
          event.preventDefault();
          moveFocus(item.key, 'previous');
          break;
        case 'Home':
          event.preventDefault();
          moveFocus(item.key, 'first');
          break;
        case 'End':
          event.preventDefault();
          moveFocus(item.key, 'last');
          break;
        case 'Enter':
          event.preventDefault();
          if (item.disabled) {
            return;
          }
          setFocusedKey(item.key);
          selectKey(item.key);
          if (item.href) {
            navigateToItemHref(item, shouldOpenKeyboardActivationInNewTab(event, item));
          }
          break;
        case ' ': {
          event.preventDefault();
          if (item.disabled) {
            return;
          }
          setFocusedKey(item.key);
          selectKey(item.key);
          if (item.href) {
            navigateToItemHref(item, shouldOpenKeyboardActivationInNewTab(event, item));
          }
          break;
        }
      }
    },
    [moveFocus, navigateToItemHref, orientation, selectKey]
  );

  const handleTabMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>, item: PreparedTabItem) => {
      if (item.disabled || shouldSelectOnPressUp || !isPlainLeftClick(event)) {
        return;
      }

      setFocusedKey(item.key);
      selectKey(item.key);
    },
    [selectKey, shouldSelectOnPressUp]
  );

  const handleTabClick = useCallback(
    (event: MouseEvent<HTMLElement>, item: PreparedTabItem) => {
      if (item.disabled) {
        event.preventDefault();
        return;
      }

      if (event.detail === 0) {
        return;
      }

      const plainLeftClick = isPlainLeftClick(event);
      const openInNewTab = !plainLeftClick || item.target === '_blank';

      if (plainLeftClick && shouldSelectOnPressUp) {
        setFocusedKey(item.key);
        selectKey(item.key);
      }

      if (item.href) {
        navigateToItemHref(item, openInNewTab);
      }
    },
    [navigateToItemHref, selectKey, shouldSelectOnPressUp]
  );

  const registerTabRef = useCallback((key: string): RefCallback<HTMLElement> => {
    return (node) => {
      tabRefs.current.set(key, node);
    };
  }, []);

  const registerPanelRef = useCallback((key: string): RefCallback<HTMLDivElement> => {
    return (node) => {
      panelRefs.current.set(key, node);
    };
  }, []);

  const updateCursorStyle = useCallback(() => {
    const selectedElement = selectedKey ? tabRefs.current.get(selectedKey) : null;
    const tabListElement = tabListRef.current;

    if (!selectedElement || !tabListElement) {
      setCursorStyle(undefined);
      return;
    }

    const selectedRect = selectedElement.getBoundingClientRect();
    const listRect = tabListElement.getBoundingClientRect();
    const selectedLeft = selectedRect.left - listRect.left - tabListElement.clientLeft + tabListElement.scrollLeft;
    const selectedTop = selectedRect.top - listRect.top - tabListElement.clientTop + tabListElement.scrollTop;
    const selectedWidth = selectedRect.width;
    const selectedHeight = selectedRect.height;

    const nextStyle: CSSProperties = {
      left: 0,
      top: 0,
      width: selectedWidth,
      height: variant === 'underlined' ? underlinedCursorThickness : selectedHeight,
      transform:
        variant === 'underlined'
          ? `translate(${selectedLeft}px, ${selectedTop + selectedHeight - underlinedCursorThickness}px)`
          : `translate(${selectedLeft}px, ${selectedTop}px)`
    };

    if (orientation === 'vertical' && variant === 'underlined') {
      nextStyle.width = underlinedCursorThickness;
      nextStyle.height = selectedHeight;
      nextStyle.transform =
        placement === 'right'
          ? `translate(${selectedLeft + selectedWidth - underlinedCursorThickness}px, ${selectedTop}px)`
          : `translate(${selectedLeft}px, ${selectedTop}px)`;
    }

    setCursorStyle(nextStyle);
  }, [orientation, placement, selectedKey, variant]);

  useLayoutEffect(() => {
    updateCursorStyle();

    if (typeof window === 'undefined') {
      return undefined;
    }

    const selectedElement = selectedKey ? tabRefs.current.get(selectedKey) : null;
    const tabListElement = tabListRef.current;
    const animationFrame = window.requestAnimationFrame(updateCursorStyle);
    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateCursorStyle);

      if (selectedElement) {
        resizeObserver.observe(selectedElement);
      }
      if (tabListElement) {
        resizeObserver.observe(tabListElement);
      }
    }

    window.addEventListener('resize', updateCursorStyle);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateCursorStyle);
    };
  }, [fullWidth, items, selectedKey, size, updateCursorStyle]);

  useLayoutEffect(() => {
    if (!selectedKey) {
      return;
    }

    const panel = panelRefs.current.get(selectedKey);
    if (!panel) {
      return;
    }

    const hasFocusableChild = panel.querySelector(focusableSelector) !== null;
    setPanelNeedsTabStop((current) => {
      if (current[selectedKey] === !hasFocusableChild) {
        return current;
      }

      return {
        ...current,
        [selectedKey]: !hasFocusableChild
      };
    });
  }, [destroyInactiveTabPanel, items, selectedKey]);

  const preparedItems = useMemo(
    () =>
      normalizedItems.map((item) => ({
        ...item,
        selected: item.key === selectedKey,
        tabIndex: item.key === focusedKey && !item.disabled ? 0 : -1
      })),
    [focusedKey, normalizedItems, selectedKey]
  );

  const rootProps = {
    ...props,
    id: rootId,
    className: cn(tabsRootVariants({ placement, fullWidth }), classNames.base, className)
  } satisfies ComponentProps<'div'>;

  const listClassName = cn(
    tabsListVariants({ variant, placement, fullWidth }),
    fullWidth && orientation === 'vertical' && 'min-w-56',
    disableAnimation && 'transition-none',
    classNames.tabList
  );

  const tabWrapperClassName = cn(tabsTabWrapperVariants({ placement, fullWidth }), classNames.tabWrapper);
  const tabContentClassName = cn(tabsTabContentVariants(), classNames.tabContent);
  const panelClassName = cn(tabsPanelVariants({ size }), disableAnimation && 'transition-none', classNames.panel);
  const cursorClassName = cn(
    tabsCursorVariants({
      variant,
      radius: variant === 'underlined' ? 'full' : radius,
      animated: !disableAnimation && !disableCursorAnimation
    }),
    cursorToneClasses[color][variant],
    classNames.cursor
  );

  const getTabClassName = (item: PreparedTabItem) => {
    return cn(
      tabsTabVariants({
        variant,
        placement,
        size,
        radius: variant === 'underlined' ? 'none' : radius,
        selected: item.selected,
        disabled: item.disabled,
        withIcon: item.icon !== undefined
      }),
      item.selected &&
        (variant === 'underlined' ? selectedTextColorClasses[color] : selectedTextOnFilledCursorColorClasses[color]),
      variant !== 'solid' && !item.selected && lightHoverColorClasses[color],
      disableAnimation && 'transition-none',
      classNames.tab
    );
  };

  const panelContainerClassName = cn('min-w-0 flex-1');

  const tabListProps: ComponentProps<'div'> & {
    'data-orientation': typeof orientation;
    'data-placement': typeof placement;
  } = {
    id: listId,
    ref: tabListRef,
    role: 'tablist',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-orientation': orientation,
    'data-orientation': orientation,
    'data-placement': placement
  };

  const getSharedTabProps = (item: PreparedTabItem): TabsSharedTabProps => ({
    id: item.tabId,
    role: 'tab',
    tabIndex: item.tabIndex,
    'aria-controls': item.panelId,
    'aria-disabled': item.disabled ? true : undefined,
    'aria-selected': item.selected,
    'data-disabled': item.disabled,
    'data-selected': item.selected,
    onClick: (event) => handleTabClick(event, item),
    onFocus: () => handleTabFocus(item.key),
    onKeyDown: (event) => handleTabKeyDown(event, item),
    onMouseDown: (event) => handleTabMouseDown(event, item)
  });

  const getButtonTabProps = (item: PreparedTabItem) => ({
    ...getSharedTabProps(item),
    ref: registerTabRef(item.key) as RefCallback<HTMLButtonElement>,
    type: 'button' as const,
    disabled: item.disabled,
    'aria-label': item.titleValue,
    'data-href': item.href
  });

  const getPanelProps = (item: PreparedTabItem) => ({
    id: item.panelId,
    role: 'tabpanel',
    'aria-labelledby': item.tabId,
    hidden: !item.selected,
    tabIndex: item.selected && panelNeedsTabStop[item.key] ? 0 : undefined
  });

  return {
    cursorClassName,
    cursorStyle,
    getButtonTabProps,
    getPanelProps,
    items: preparedItems,
    listClassName,
    panelClassName,
    panelContainerClassName,
    registerPanelRef,
    renderPanelsFirst,
    rootProps,
    shouldRenderCursor: selectedKey !== null,
    tabContentClassName,
    tabListProps,
    tabWrapperClassName,
    getTabClassName
  };
};
