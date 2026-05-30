import type { PopoverContentProps as PopoverPrimitiveContentProps } from '@radix-ui/react-popover';
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
  type PopoverArrowProps,
  type PopoverBodyProps,
  type PopoverColor,
  type PopoverContentProps,
  type PopoverFooterProps,
  type PopoverHeaderProps,
  type PopoverPlacement,
  type PopoverProps,
  type PopoverRadius,
  type PopoverShadow,
  type PopoverSize,
  type PopoverTriggerProps,
  type PopoverVariant,
  popoverArrowVariants,
  popoverBodyVariants,
  popoverContentVariants,
  popoverFooterVariants,
  popoverHeaderVariants,
  popoverTriggerVariants
} from './types';

type PopoverRootContextValue = {
  contentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerElement: HTMLElement | null;
  recordTriggerElement: (element: HTMLElement | null) => void;
};

type PopoverContentContextValue = {
  bodyId: string;
  color: PopoverColor;
  headerId: string;
  radius: PopoverRadius;
  shadow: PopoverShadow;
  size: PopoverSize;
  variant: PopoverVariant;
};

type PopoverRootProviderProps = {
  children: ReactNode;
  value: PopoverRootContextValue;
};

type PopoverContentProviderProps = {
  children: ReactNode;
  value: PopoverContentContextValue;
};

type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
type PopoverAlign = 'start' | 'center' | 'end';
type PopoverTriggerElement = ReactElement<{
  'aria-controls'?: string;
  'aria-disabled'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'dialog';
  'data-disabled'?: 'true';
  className?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  role?: string;
  tabIndex?: number;
  type?: 'button';
}>;
type CloseAutoFocusEvent = Parameters<NonNullable<PopoverPrimitiveContentProps['onCloseAutoFocus']>>[0];

type UsePopoverRootReturn = {
  contextValue: PopoverRootContextValue;
  rootProps: {
    onOpenChange: (open: boolean) => void;
    open: boolean;
  };
};

type UsePopoverTriggerReturn =
  | {
      anchorClassName: string;
      anchorRef: (element: HTMLSpanElement | null) => void;
      asChild: false;
      buttonProps: {
        'aria-controls': string;
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
      anchorClassName: string;
      anchorRef: (element: HTMLSpanElement | null) => void;
      asChild: true;
      buttonProps: null;
      child: ReactElement;
    };

type UsePopoverContentReturn = {
  contentProps: {
    'aria-describedby': string | undefined;
    'aria-label': string | undefined;
    'aria-labelledby': string | undefined;
    'aria-modal': false;
    'data-color': PopoverColor;
    'data-radius': PopoverRadius;
    'data-shadow': PopoverShadow;
    'data-size': PopoverSize;
    'data-variant': PopoverVariant;
    align: PopoverAlign;
    avoidCollisions: true;
    className: string;
    collisionPadding: number;
    id: string;
    onCloseAutoFocus: (event: CloseAutoFocusEvent) => void;
    role: 'dialog';
    side: PopoverSide;
    sideOffset: number;
  };
  contextValue: PopoverContentContextValue;
  children: ReactNode;
  needsScopedDarkPortal: boolean;
};

type UsePopoverSlotReturn = {
  className: string;
};

type UsePopoverHeaderReturn = UsePopoverSlotReturn & {
  id: string;
};

type UsePopoverBodyReturn = UsePopoverSlotReturn & {
  id: string;
};

const PopoverRootContext = createContext<PopoverRootContextValue | null>(null);
const PopoverContentContext = createContext<PopoverContentContextValue | null>(null);

const getPlacementConfig = (placement: PopoverPlacement): { align: PopoverAlign; side: PopoverSide } => {
  switch (placement) {
    case 'top-start':
      return { side: 'top', align: 'start' };
    case 'top-end':
      return { side: 'top', align: 'end' };
    case 'right-start':
      return { side: 'right', align: 'start' };
    case 'right-end':
      return { side: 'right', align: 'end' };
    case 'bottom-start':
      return { side: 'bottom', align: 'start' };
    case 'bottom-end':
      return { side: 'bottom', align: 'end' };
    case 'left-start':
      return { side: 'left', align: 'start' };
    case 'left-end':
      return { side: 'left', align: 'end' };
    case 'top':
      return { side: 'top', align: 'center' };
    case 'right':
      return { side: 'right', align: 'center' };
    case 'left':
      return { side: 'left', align: 'center' };
    default:
      return { side: 'bottom', align: 'center' };
  }
};

const getPopoverSlotDisplayName = (child: ReactNode): string | undefined => {
  if (!isValidElement(child)) {
    return undefined;
  }

  if (typeof child.type === 'string') {
    return undefined;
  }

  return (child.type as { displayName?: string }).displayName;
};

const hasPopoverSlot = ({ children, displayName }: { children: ReactNode; displayName: string }): boolean => {
  return Children.toArray(children).some((child) => {
    if (getPopoverSlotDisplayName(child) === displayName) {
      return true;
    }

    if (!isValidElement(child)) {
      return false;
    }

    return hasPopoverSlot({ children: child.props.children, displayName });
  });
};

const getMergedIds = (ids: Array<string | undefined>): string | undefined => {
  const mergedIds = ids.filter(Boolean);

  if (mergedIds.length === 0) {
    return undefined;
  }

  return mergedIds.join(' ');
};

const isHtmlTag = (element: PopoverTriggerElement, tagName: string): boolean => {
  return typeof element.type === 'string' && element.type.toLowerCase() === tagName;
};

const isIntrinsicInteractiveTrigger = (element: PopoverTriggerElement): boolean => {
  return isHtmlTag(element, 'button') || isHtmlTag(element, 'a') || isHtmlTag(element, 'input');
};

const getTriggerElementFromAnchor = (anchorElement: HTMLSpanElement | null): HTMLElement | null => {
  if (!anchorElement) {
    return null;
  }

  const directChild = anchorElement.firstElementChild;

  if (directChild instanceof HTMLElement) {
    return directChild;
  }

  return anchorElement instanceof HTMLElement ? anchorElement : null;
};

const withComposedHandler = <TEvent>(
  originalHandler: ((event: TEvent) => void) | undefined,
  nextHandler: (event: TEvent) => void
) => {
  return (event: TEvent) => {
    originalHandler?.(event);
    nextHandler(event);
  };
};

export const PopoverRootProvider = ({ children, value }: PopoverRootProviderProps) => {
  return createElement(PopoverRootContext.Provider, { value }, children);
};

export const PopoverContentProvider = ({ children, value }: PopoverContentProviderProps) => {
  return createElement(PopoverContentContext.Provider, { value }, children);
};

export const usePopoverRoot = ({
  defaultOpen = false,
  onOpenChange,
  open: openProp
}: PopoverProps): UsePopoverRootReturn => {
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
      contentId: `popover-${idBase}-content`,
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

const usePopoverRootContext = (): PopoverRootContextValue => {
  const context = useContext(PopoverRootContext);

  if (!context) {
    throw new Error('Popover compound components must be rendered inside <Popover>.');
  }

  return context;
};

const usePopoverContentContext = (): PopoverContentContextValue => {
  const context = useContext(PopoverContentContext);

  if (!context) {
    throw new Error('Popover slot components must be rendered inside <Popover.Content>.');
  }

  return context;
};

export const usePopoverTrigger = ({
  asChild = true,
  children,
  className,
  disabled = false
}: PopoverTriggerProps): UsePopoverTriggerReturn => {
  const { contentId, open, recordTriggerElement, setOpen } = usePopoverRootContext();

  const anchorRef = useCallback(
    (element: HTMLSpanElement | null) => {
      recordTriggerElement(getTriggerElementFromAnchor(element));
    },
    [recordTriggerElement]
  );

  const toggleOpen = useCallback(
    (element: HTMLElement) => {
      if (disabled) {
        return;
      }

      recordTriggerElement(element);
      setOpen(!open);
    },
    [disabled, open, recordTriggerElement, setOpen]
  );

  const handleIntrinsicClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented || disabled) {
        return;
      }

      toggleOpen(event.currentTarget);
    },
    [disabled, toggleOpen]
  );

  const handleIntrinsicFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }

      recordTriggerElement(event.currentTarget);
    },
    [disabled, recordTriggerElement]
  );

  const handleIntrinsicKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented || disabled) {
        return;
      }

      const currentTarget = event.currentTarget;
      const isButton = currentTarget.tagName === 'BUTTON';
      const isAnchor = currentTarget.tagName === 'A';

      if (event.key === ' ' && !isButton) {
        event.preventDefault();
        toggleOpen(currentTarget);
      }

      if (event.key === 'Enter' && !isButton && !isAnchor) {
        event.preventDefault();
        toggleOpen(currentTarget);
      }
    },
    [disabled, toggleOpen]
  );

  if (asChild && isValidElement(children)) {
    const triggerChild = children as PopoverTriggerElement;
    const childClassName = cn(popoverTriggerVariants(), triggerChild.props.className, className);
    const childProps: PopoverTriggerElement['props'] = {
      ...triggerChild.props,
      className: childClassName,
      'aria-controls': contentId,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      'aria-disabled': disabled || undefined,
      onClick: withComposedHandler(triggerChild.props.onClick, handleIntrinsicClick),
      onFocus: withComposedHandler(triggerChild.props.onFocus, handleIntrinsicFocus),
      onKeyDown: withComposedHandler(triggerChild.props.onKeyDown, handleIntrinsicKeyDown)
    };

    if (!isIntrinsicInteractiveTrigger(triggerChild)) {
      childProps.role = triggerChild.props.role ?? 'button';
      childProps.tabIndex = disabled ? -1 : (triggerChild.props.tabIndex ?? 0);
    }

    if (disabled) {
      childProps['data-disabled'] = 'true';
    }

    if (isHtmlTag(triggerChild, 'button')) {
      childProps.disabled = disabled;
      childProps.type = 'button';
    }

    return {
      asChild: true,
      anchorClassName: 'inline-flex',
      anchorRef,
      buttonProps: null,
      child: cloneElement(triggerChild, childProps)
    };
  }

  return {
    asChild: false,
    anchorClassName: 'inline-flex',
    anchorRef,
    child: null,
    buttonProps: {
      'aria-controls': contentId,
      'aria-disabled': disabled || undefined,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      'data-disabled': disabled ? 'true' : undefined,
      className: cn(
        popoverTriggerVariants(),
        'inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-sm',
        className
      ),
      disabled,
      onClick: handleIntrinsicClick,
      onFocus: handleIntrinsicFocus,
      type: 'button'
    }
  };
};

export const usePopoverContent = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
  color = 'neutral',
  offset = 8,
  placement = 'bottom',
  radius = 'lg',
  shadow = 'md',
  size = 'md',
  variant = 'default'
}: PopoverContentProps): UsePopoverContentReturn => {
  const { contentId, triggerElement } = usePopoverRootContext();
  const idBase = useId().replaceAll(':', '');
  const hasHeader = hasPopoverSlot({ children, displayName: 'Popover.Header' });
  const hasBody = hasPopoverSlot({ children, displayName: 'Popover.Body' });
  const { align, side } = getPlacementConfig(placement);
  const headerId = `popover-${idBase}-header`;
  const bodyId = `popover-${idBase}-body`;
  const labelledBy = ariaLabelledBy ?? (hasHeader ? headerId : undefined);
  const describedBy = getMergedIds([hasBody ? bodyId : undefined, ariaDescribedBy]);
  const closestDarkContainer = typeof document === 'undefined' ? null : triggerElement?.closest('.dark');
  const needsScopedDarkPortal = Boolean(
    closestDarkContainer && closestDarkContainer.tagName !== 'HTML' && closestDarkContainer.tagName !== 'BODY'
  );

  if (!labelledBy && !ariaLabel) {
    throw new Error('Popover.Content requires Popover.Header, ariaLabel, or ariaLabelledBy for accessible naming.');
  }

  return {
    children,
    needsScopedDarkPortal,
    contextValue: {
      bodyId,
      color,
      headerId,
      radius,
      shadow,
      size,
      variant
    },
    contentProps: {
      id: contentId,
      role: 'dialog',
      'aria-modal': false,
      'aria-describedby': describedBy,
      'aria-label': labelledBy ? undefined : ariaLabel,
      'aria-labelledby': labelledBy,
      side,
      align,
      sideOffset: offset,
      avoidCollisions: true,
      collisionPadding: 8,
      className: cn(popoverContentVariants({ color, radius, shadow, size, variant }), className),
      onCloseAutoFocus: (event) => {
        if (triggerElement) {
          event.preventDefault();
          triggerElement.focus();
        }
      },
      'data-color': color,
      'data-radius': radius,
      'data-shadow': shadow,
      'data-size': size,
      'data-variant': variant
    }
  };
};

export const usePopoverHeader = ({ className }: PopoverHeaderProps): UsePopoverHeaderReturn => {
  const { color, headerId, size } = usePopoverContentContext();

  return {
    className: cn(popoverHeaderVariants({ color, size }), className),
    id: headerId
  };
};

export const usePopoverBody = ({ className }: PopoverBodyProps): UsePopoverBodyReturn => {
  const { bodyId, size } = usePopoverContentContext();

  return {
    className: cn(popoverBodyVariants({ size }), className),
    id: bodyId
  };
};

export const usePopoverFooter = ({ className }: PopoverFooterProps): UsePopoverSlotReturn => {
  const { size } = usePopoverContentContext();

  return {
    className: cn(popoverFooterVariants({ size }), className)
  };
};

export const usePopoverArrow = ({ className }: PopoverArrowProps): UsePopoverSlotReturn => {
  const { color, variant } = usePopoverContentContext();

  return {
    className: cn(popoverArrowVariants({ color, variant }), className)
  };
};
