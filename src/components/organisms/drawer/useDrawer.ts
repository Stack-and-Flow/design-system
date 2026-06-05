import type { DialogContentProps } from '@radix-ui/react-dialog';
import {
  Children,
  cloneElement,
  createContext,
  createElement,
  type FocusEvent,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState
} from 'react';
import { cn } from '@/lib/utils';
import {
  type DrawerBackdrop,
  type DrawerBodyProps,
  type DrawerCloseProps,
  type DrawerContentProps,
  type DrawerDescriptionProps,
  type DrawerFooterProps,
  type DrawerHeaderProps,
  type DrawerPlacement,
  type DrawerProps,
  type DrawerSize,
  type DrawerTitleProps,
  type DrawerTriggerElement,
  type DrawerTriggerProps,
  drawerBodyVariants,
  drawerCloseVariants,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerOverlayVariants,
  drawerPanelVariants,
  drawerTitleVariants
} from './types';

type CloseAutoFocusEvent = Parameters<NonNullable<DialogContentProps['onCloseAutoFocus']>>[0];
type PointerDownOutsideEvent = Parameters<NonNullable<DialogContentProps['onPointerDownOutside']>>[0];
type InteractOutsideEvent = Parameters<NonNullable<DialogContentProps['onInteractOutside']>>[0];
type EscapeKeyDownEvent = Parameters<NonNullable<DialogContentProps['onEscapeKeyDown']>>[0];

type DrawerRootContextValue = {
  contentId: string;
  open: boolean;
  recordTriggerElement: (element: HTMLElement | null) => void;
  setOpen: (open: boolean) => void;
  triggerElement: HTMLElement | null;
};

type DrawerRootProviderProps = {
  children: ReactNode;
  value: DrawerRootContextValue;
};

type UseDrawerRootReturn = {
  contextValue: DrawerRootContextValue;
  rootProps: {
    onOpenChange: (open: boolean) => void;
    open: boolean;
  };
};

type UseDrawerTriggerReturn =
  | {
      asChild: false;
      buttonProps: {
        'aria-controls': string | undefined;
        'aria-disabled': true | undefined;
        'aria-expanded': boolean;
        'aria-haspopup': 'dialog';
        'data-disabled': 'true' | undefined;
        className: string;
        disabled: boolean;
        onClick: (event: MouseEvent<HTMLButtonElement>) => void;
        onFocus: (event: FocusEvent<HTMLButtonElement>) => void;
        type: 'button';
      };
      child: null;
    }
  | {
      asChild: true;
      buttonProps: null;
      child: ReactElement;
    };

type UseDrawerContentReturn = {
  children: ReactNode;
  contentProps: DialogContentProps & {
    'data-backdrop': DrawerBackdrop;
    'data-block-size-utility': `max-h-drawer-${DrawerSize}`;
    'data-effective-placement': DrawerPlacement;
    'data-inline-size-utility'?: `max-w-modal-${Exclude<DrawerSize, 'full'>}` | 'max-w-full';
    'data-logical-placement':
      | `inline-${Extract<DrawerPlacement, 'start' | 'end'>}`
      | `block-${Extract<DrawerPlacement, 'top' | 'bottom'>}`;
    'data-ltr-placement': 'left' | 'right' | 'top' | 'bottom';
    'data-mobile-placement'?: 'bottom';
    'data-motion': 'placement-slide';
    'data-placement': DrawerPlacement;
    'data-placement-axis': 'inline' | 'block';
    'data-reduced-motion': 'supported';
    'data-rtl-placement': 'left' | 'right' | 'top' | 'bottom';
    'data-safe-area': 'block-end' | 'none';
    'data-size': DrawerSize;
    'data-size-mode': 'responsive-inline' | 'block';
    className: string;
    id: string;
  };
  overlayProps: {
    'data-backdrop': DrawerBackdrop;
    className: string;
  };
};

type UseDrawerSlotReturn = {
  className: string;
};

const DrawerRootContext = createContext<DrawerRootContextValue | null>(null);

const isDevelopmentRuntime = (): boolean => process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

const getDrawerSlotDisplayName = (child: ReactNode): string | undefined => {
  if (!isValidElement(child) || typeof child.type === 'string') {
    return undefined;
  }

  return (child.type as { displayName?: string }).displayName;
};

const hasDrawerSlot = ({ children, displayName }: { children: ReactNode; displayName: string }): boolean => {
  return Children.toArray(children).some((child) => {
    if (getDrawerSlotDisplayName(child) === displayName) {
      return true;
    }

    if (!isValidElement<{ children?: ReactNode }>(child)) {
      return false;
    }

    return hasDrawerSlot({ children: child.props.children, displayName });
  });
};

const isHtmlTag = (element: DrawerTriggerElement, tagName: string): boolean => {
  return typeof element.type === 'string' && element.type.toLowerCase() === tagName;
};

const isIntrinsicInteractiveTrigger = (element: DrawerTriggerElement): boolean => {
  return isHtmlTag(element, 'button') || isHtmlTag(element, 'a') || isHtmlTag(element, 'input');
};

type ComposableEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
};

type PreventableEvent = {
  defaultPrevented: boolean;
};

const composeEventHandlers = <TEvent extends PreventableEvent>(
  ...handlers: Array<((event: TEvent) => void) | undefined>
) => {
  const composedHandlers = handlers.filter((handler): handler is (event: TEvent) => void => Boolean(handler));

  if (composedHandlers.length === 0) {
    return undefined;
  }

  return (event: TEvent) => {
    for (const handler of composedHandlers) {
      handler(event);

      if (event.defaultPrevented) {
        return;
      }
    }
  };
};

const withComposedHandler = <TEvent extends ComposableEvent>(
  originalHandler: ((event: TEvent) => void) | undefined,
  nextHandler: (event: TEvent) => void,
  disabled = false
) => {
  return (event: TEvent) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    originalHandler?.(event);

    if (event.defaultPrevented) {
      return;
    }

    nextHandler(event);
  };
};

const withPreventableComposedHandler = <TEvent extends PreventableEvent>(
  originalHandler: ((event: TEvent) => void) | undefined,
  nextHandler: (event: TEvent) => void
) => {
  return (event: TEvent) => {
    originalHandler?.(event);

    if (event.defaultPrevented) {
      return;
    }

    nextHandler(event);
  };
};

export const DrawerRootProvider = ({ children, value }: DrawerRootProviderProps) => {
  return createElement(DrawerRootContext.Provider, { value }, children);
};

export const useDrawerRoot = ({
  defaultOpen = false,
  onOpenChange,
  open: openProp
}: DrawerProps): UseDrawerRootReturn => {
  const isControlled = typeof openProp === 'boolean';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const idBase = useId().replaceAll(':', '');
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const recordTriggerElement = useCallback((element: HTMLElement | null) => {
    setTriggerElement((currentElement) => (currentElement === element ? currentElement : element));
  }, []);

  const contextValue = useMemo(
    () => ({
      contentId: `drawer-${idBase}-content`,
      open,
      recordTriggerElement,
      setOpen,
      triggerElement
    }),
    [idBase, open, recordTriggerElement, setOpen, triggerElement]
  );

  return {
    contextValue,
    rootProps: {
      open,
      onOpenChange: setOpen
    }
  };
};

const useDrawerRootContext = (): DrawerRootContextValue => {
  const context = useContext(DrawerRootContext);

  if (!context) {
    throw new Error('Drawer compound components must be rendered inside <Drawer>.');
  }

  return context;
};

export const useDrawerTrigger = ({
  asChild = false,
  children,
  className,
  disabled = false,
  onClick,
  onFocus,
  ...nativeButtonProps
}: DrawerTriggerProps): UseDrawerTriggerReturn => {
  const { contentId, open, recordTriggerElement, setOpen } = useDrawerRootContext();

  const openDrawer = useCallback(
    (element: HTMLElement) => {
      if (disabled) {
        return;
      }

      recordTriggerElement(element);
      setOpen(true);
    },
    [disabled, recordTriggerElement, setOpen]
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented || disabled) {
        return;
      }

      openDrawer(event.currentTarget);
    },
    [disabled, openDrawer]
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }

      recordTriggerElement(event.currentTarget);
    },
    [disabled, recordTriggerElement]
  );

  const handleKeyboardActivation = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      openDrawer(event.currentTarget);
    },
    [openDrawer]
  );

  if (asChild && isValidElement(children)) {
    const triggerChild = children as DrawerTriggerElement;
    const forwardedProps = nativeButtonProps as DrawerTriggerElement['props'];
    const forwardedOnClick = onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined;
    const forwardedOnFocus = onFocus as ((event: FocusEvent<HTMLElement>) => void) | undefined;
    const isIntrinsicInteractive = isIntrinsicInteractiveTrigger(triggerChild);
    const composedOnKeyDown = composeEventHandlers(triggerChild.props.onKeyDown, forwardedProps.onKeyDown);
    const childProps: DrawerTriggerElement['props'] = {
      ...forwardedProps,
      ...triggerChild.props,
      className: cn(triggerChild.props.className, className),
      'aria-controls': open ? contentId : undefined,
      'aria-disabled': disabled || undefined,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      onClick: withComposedHandler(
        composeEventHandlers(triggerChild.props.onClick, forwardedOnClick),
        handleClick,
        disabled
      ),
      onFocus: withComposedHandler(
        composeEventHandlers(triggerChild.props.onFocus, forwardedOnFocus),
        handleFocus,
        disabled
      ),
      onKeyDown: composedOnKeyDown
    };

    if (!isIntrinsicInteractive) {
      childProps.role = triggerChild.props.role ?? 'button';
      childProps.tabIndex = disabled ? -1 : (triggerChild.props.tabIndex ?? 0);
      childProps.onKeyDown = withComposedHandler(composedOnKeyDown, handleKeyboardActivation, disabled);
    }

    if (disabled) {
      childProps['data-disabled'] = 'true';

      if (!isHtmlTag(triggerChild, 'button')) {
        childProps.tabIndex = -1;
      }
    }

    if (isHtmlTag(triggerChild, 'button') || typeof triggerChild.type !== 'string') {
      childProps.disabled = disabled;
    }

    if (isHtmlTag(triggerChild, 'button')) {
      childProps.type = 'button';
    }

    return {
      asChild: true,
      buttonProps: null,
      child: cloneElement(triggerChild, childProps)
    };
  }

  return {
    asChild: false,
    child: null,
    buttonProps: {
      ...nativeButtonProps,
      'aria-controls': open ? contentId : undefined,
      'aria-disabled': disabled || undefined,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      'data-disabled': disabled ? 'true' : undefined,
      className: cn(
        'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-semibold',
        'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
        className
      ),
      disabled,
      onClick: withComposedHandler(onClick, handleClick, disabled),
      onFocus: withComposedHandler(onFocus, handleFocus, disabled),
      type: 'button'
    }
  };
};

const isInlinePlacement = (placement: DrawerPlacement): placement is Extract<DrawerPlacement, 'start' | 'end'> => {
  return placement === 'start' || placement === 'end';
};

const getPlacementAxis = (placement: DrawerPlacement): 'inline' | 'block' => {
  return isInlinePlacement(placement) ? 'inline' : 'block';
};

const getLogicalPlacement = (
  placement: DrawerPlacement
): `inline-${Extract<DrawerPlacement, 'start' | 'end'>}` | `block-${Extract<DrawerPlacement, 'top' | 'bottom'>}` => {
  return isInlinePlacement(placement) ? `inline-${placement}` : `block-${placement}`;
};

const getLtrPlacement = (placement: DrawerPlacement): 'left' | 'right' | 'top' | 'bottom' => {
  if (placement === 'start') {
    return 'left';
  }

  if (placement === 'end') {
    return 'right';
  }

  return placement;
};

const getRtlPlacement = (placement: DrawerPlacement): 'left' | 'right' | 'top' | 'bottom' => {
  if (placement === 'start') {
    return 'right';
  }

  if (placement === 'end') {
    return 'left';
  }

  return placement;
};

const getInlineSizeUtility = (size: DrawerSize): `max-w-modal-${Exclude<DrawerSize, 'full'>}` | 'max-w-full' => {
  return size === 'full' ? 'max-w-full' : `max-w-modal-${size}`;
};

const getBlockSizeUtility = (size: DrawerSize): `max-h-drawer-${DrawerSize}` => {
  return `max-h-drawer-${size}`;
};

const getSafeArea = (placement: DrawerPlacement): 'block-end' | 'none' => {
  return placement === 'bottom' || isInlinePlacement(placement) ? 'block-end' : 'none';
};

export const useDrawerContent = ({
  backdrop = 'opacity',
  children,
  className,
  closeOnEscape = true,
  dismissible = true,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onInteractOutside,
  onPointerDownOutside,
  placement = 'end',
  size = 'md',
  ...restProps
}: DrawerContentProps): UseDrawerContentReturn => {
  const { contentId, triggerElement } = useDrawerRootContext();

  if (isDevelopmentRuntime() && !hasDrawerSlot({ children, displayName: 'Drawer.Title' })) {
    throw new Error('Drawer.Content requires a Drawer.Title descendant for accessible dialog naming.');
  }

  const handleCloseAutoFocus = (event: CloseAutoFocusEvent) => {
    if (triggerElement?.isConnected) {
      event.preventDefault();
      triggerElement.focus();
    }
  };

  const handlePointerDownOutside = (event: PointerDownOutsideEvent) => {
    if (!dismissible) {
      event.preventDefault();
    }
  };

  const handleInteractOutside = (event: InteractOutsideEvent) => {
    if (!dismissible) {
      event.preventDefault();
    }
  };

  const handleEscapeKeyDown = (event: EscapeKeyDownEvent) => {
    if (!closeOnEscape) {
      event.preventDefault();
    }
  };

  return {
    children,
    overlayProps: {
      className: drawerOverlayVariants({ backdrop }),
      'data-backdrop': backdrop
    },
    contentProps: {
      ...restProps,
      id: contentId,
      className: cn(drawerPanelVariants({ placement, size }), className),
      onCloseAutoFocus: withPreventableComposedHandler(onCloseAutoFocus, handleCloseAutoFocus),
      onPointerDownOutside: withPreventableComposedHandler(onPointerDownOutside, handlePointerDownOutside),
      onInteractOutside: withPreventableComposedHandler(onInteractOutside, handleInteractOutside),
      onEscapeKeyDown: withPreventableComposedHandler(onEscapeKeyDown, handleEscapeKeyDown),
      'data-backdrop': backdrop,
      'data-block-size-utility': getBlockSizeUtility(size),
      'data-effective-placement': placement,
      'data-inline-size-utility': isInlinePlacement(placement) ? getInlineSizeUtility(size) : undefined,
      'data-logical-placement': getLogicalPlacement(placement),
      'data-ltr-placement': getLtrPlacement(placement),
      'data-mobile-placement': isInlinePlacement(placement) ? 'bottom' : undefined,
      'data-motion': 'placement-slide',
      'data-placement': placement,
      'data-placement-axis': getPlacementAxis(placement),
      'data-reduced-motion': 'supported',
      'data-rtl-placement': getRtlPlacement(placement),
      'data-safe-area': getSafeArea(placement),
      'data-size': size,
      'data-size-mode': isInlinePlacement(placement) ? 'responsive-inline' : 'block'
    }
  };
};

export const useDrawerHeader = ({ className }: DrawerHeaderProps): UseDrawerSlotReturn => ({
  className: cn(drawerHeaderVariants(), className)
});

export const useDrawerTitle = ({ className }: DrawerTitleProps): UseDrawerSlotReturn => ({
  className: cn(drawerTitleVariants(), className)
});

export const useDrawerDescription = ({ className }: DrawerDescriptionProps): UseDrawerSlotReturn => ({
  className: cn(drawerDescriptionVariants(), className)
});

export const useDrawerBody = ({ className }: DrawerBodyProps): UseDrawerSlotReturn => ({
  className: cn(drawerBodyVariants(), className)
});

export const useDrawerFooter = ({ className }: DrawerFooterProps): UseDrawerSlotReturn => ({
  className: cn(drawerFooterVariants(), className)
});

export const useDrawerClose = ({ className }: DrawerCloseProps): UseDrawerSlotReturn => ({
  className: cn(drawerCloseVariants(), className)
});
