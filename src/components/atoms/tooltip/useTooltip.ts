import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { type TooltipPosition, type TooltipProps, tooltipVariants } from './types';

type TooltipCoordinates = {
  top: number;
  left: number;
};

type ResolvedTriggerInteraction = 'hover-focus' | 'hover' | 'focus' | 'click';

export const useTooltip = ({
  content = "I'm a tooltip",
  children = null,
  position,
  placement,
  delayMs,
  delayShow,
  delayHide = 50,
  complement = 'default',
  width = 'default',
  color = 'default',
  disabled = false,
  openOnFocus = false,
  openOnClick = false,
  triggerInteraction,
  isOpen,
  onOpenChange,
  className = '',
  ...rest
}: TooltipProps) => {
  const resolvedPosition = position ?? placement ?? 'top';
  const showDelay = delayMs ?? delayShow ?? 0;
  const tooltipClass = tooltipVariants({ complement, width, color });
  const tooltipId = `tooltip-${useId().replace(/:/g, '')}`;
  const isControlled = typeof isOpen === 'boolean';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [coordinates, setCoordinates] = useState<TooltipCoordinates>({
    top: 0,
    left: 0
  });
  const [isPositioned, setIsPositioned] = useState(false);

  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isVisible = isControlled ? isOpen : uncontrolledOpen;

  const resolvedTriggerInteraction = useMemo<ResolvedTriggerInteraction>(() => {
    if (triggerInteraction) {
      return triggerInteraction;
    }

    if (openOnClick) {
      return 'click';
    }

    if (openOnFocus) {
      return 'focus';
    }

    return 'hover-focus';
  }, [openOnClick, openOnFocus, triggerInteraction]);

  const enableHover =
    !disabled && (resolvedTriggerInteraction === 'hover-focus' || resolvedTriggerInteraction === 'hover');
  const enableFocus =
    !disabled && (resolvedTriggerInteraction === 'hover-focus' || resolvedTriggerInteraction === 'focus');
  const enableClick = !disabled && resolvedTriggerInteraction === 'click';
  const hasTooltipContent = content !== null && content !== undefined && content !== false;
  const describedById = !disabled && hasTooltipContent ? tooltipId : undefined;

  const clearTimers = useCallback(() => {
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  }, []);

  const setOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const showTooltip = useCallback(
    (immediate = false) => {
      clearTimers();

      if (disabled || !hasTooltipContent) {
        return;
      }

      setIsClosing(false);

      const openTooltip = () => {
        setOpenState(true);
      };

      if (immediate || showDelay === 0) {
        openTooltip();
        return;
      }

      showTimeout.current = setTimeout(() => {
        openTooltip();
      }, showDelay);
    },
    [clearTimers, disabled, hasTooltipContent, setOpenState, showDelay]
  );

  const hideTooltip = useCallback(
    (immediate = false) => {
      clearTimers();

      const closeTooltip = () => {
        setIsClosing(true);
        hideTimeout.current = setTimeout(() => {
          setOpenState(false);
          setIsClosing(false);
        }, 150);
      };

      if (immediate || delayHide === 0) {
        closeTooltip();
        return;
      }

      hideTimeout.current = setTimeout(() => {
        closeTooltip();
      }, delayHide);
    },
    [clearTimers, delayHide, setOpenState]
  );

  const toggleClickTooltip = useCallback(() => {
    if (!enableClick || !hasTooltipContent) {
      return;
    }

    if (isVisible) {
      hideTooltip(true);
      return;
    }

    showTooltip(true);
  }, [enableClick, hasTooltipContent, hideTooltip, isVisible, showTooltip]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (disabled || !hasTooltipContent) {
      clearTimers();
      setIsClosing(false);
      setOpenState(false);
    }
  }, [clearTimers, disabled, hasTooltipContent, setOpenState]);

  useEffect(() => {
    if (!isVisible) {
      setIsPositioned(false);
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideTooltip(true);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [hideTooltip, isVisible]);

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!isVisible || !triggerRef.current || !tooltipRef.current) {
        return;
      }

      const triggerSize = triggerRef.current.getBoundingClientRect();
      const tooltipSize = tooltipRef.current.getBoundingClientRect();
      const offset = 10;
      const viewportPadding = 8;
      const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
      const maxTop = Math.max(viewportPadding, window.innerHeight - tooltipSize.height - viewportPadding);
      const maxLeft = Math.max(viewportPadding, window.innerWidth - tooltipSize.width - viewportPadding);
      const keepInViewport = (nextCoordinates: TooltipCoordinates): TooltipCoordinates => ({
        top: clamp(nextCoordinates.top, viewportPadding, maxTop),
        left: clamp(nextCoordinates.left, viewportPadding, maxLeft)
      });

      const positions: Record<TooltipPosition, () => TooltipCoordinates> = {
        top: () => ({
          top: triggerSize.top - tooltipSize.height - offset,
          left: triggerSize.left + triggerSize.width / 2 - tooltipSize.width / 2
        }),
        'top-start': () => ({
          top: triggerSize.top - tooltipSize.height - offset,
          left: triggerSize.left
        }),
        'top-end': () => ({
          top: triggerSize.top - tooltipSize.height - offset,
          left: triggerSize.right - tooltipSize.width
        }),
        bottom: () => ({
          top: triggerSize.bottom + offset,
          left: triggerSize.left + triggerSize.width / 2 - tooltipSize.width / 2
        }),
        'bottom-start': () => ({
          top: triggerSize.bottom + offset,
          left: triggerSize.left
        }),
        'bottom-end': () => ({
          top: triggerSize.bottom + offset,
          left: triggerSize.right - tooltipSize.width
        }),
        left: () => ({
          top: triggerSize.top + triggerSize.height / 2 - tooltipSize.height / 2,
          left: triggerSize.left - tooltipSize.width - offset
        }),
        'left-start': () => ({
          top: triggerSize.top,
          left: triggerSize.left - tooltipSize.width - offset
        }),
        'left-end': () => ({
          top: triggerSize.bottom - tooltipSize.height,
          left: triggerSize.left - tooltipSize.width - offset
        }),
        right: () => ({
          top: triggerSize.top + triggerSize.height / 2 - tooltipSize.height / 2,
          left: triggerSize.right + offset
        }),
        'right-start': () => ({
          top: triggerSize.top,
          left: triggerSize.right + offset
        }),
        'right-end': () => ({
          top: triggerSize.bottom - tooltipSize.height,
          left: triggerSize.right + offset
        })
      };

      setCoordinates(keepInViewport(positions[resolvedPosition]()));
      setIsPositioned(true);
    };

    if (!isVisible) {
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [content, complement, isVisible, resolvedPosition, width]);

  return {
    children,
    className,
    content,
    coordinates,
    describedById,
    disabled,
    enableClick,
    enableFocus,
    enableHover,
    hasTooltipContent,
    hideTooltip,
    isClosing,
    isPositioned,
    isVisible,
    resolvedPosition,
    rest,
    showTooltip,
    toggleClickTooltip,
    tooltipClass,
    tooltipId,
    tooltipRef,
    triggerRef
  };
};
