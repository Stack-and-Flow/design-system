import type { ProgressColor } from '@atoms/progress/types';
import {
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MutableRefObject,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';
import { cn } from '@/lib/utils';
import type { IconSizes } from '@/types';
import { toastStore } from './toastStore';
import {
  type ToastProviderProps,
  type ToastProviderRuntimeConfig,
  type ToastSize,
  type ToastStatus,
  type ToastSwipeDirection,
  toastVariants,
  toastViewportVariants
} from './types';

type SwipeGestureState = {
  offset: number;
  pointerId: number;
  startX: number;
  startY: number;
};

type ToastItemViewModel = {
  action: {
    ariaLabel?: string;
    disabled?: boolean;
    label: ReactNode;
    onAction: () => void;
  } | null;
  actionButtonSize: 'sm' | 'md';
  actionClassName: string;
  className: string;
  close: () => void;
  closeButtonClassName: string;
  closeButtonSize: 'xs' | 'sm';
  contentClassName: string;
  description?: ReactNode;
  descriptionClassName: string;
  descriptionId?: string;
  dismissible: boolean;
  icon: ReactNode | null | undefined;
  iconSize: IconSizes;
  id: string;
  indicatorClassName: string;
  isLoading: boolean;
  progressClassName: string;
  progressColor: ProgressColor;
  progressValue: number;
  rootProps: {
    'aria-describedby': string | undefined;
    'aria-labelledby': string;
    'aria-modal': false;
    'data-status': ToastStatus;
    'data-swipe-direction': ToastSwipeDirection;
    'data-toast-id': string;
    onBlurCapture: (event: FocusEvent<HTMLDivElement>) => void;
    onFocusCapture: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
    role: 'alertdialog';
    tabIndex: number;
  };
  rootStyle?: CSSProperties;
  setRef: (node: HTMLDivElement | null) => void;
  showProgress: boolean;
  size: ToastSize;
  spinnerSize: string;
  status: ToastStatus;
  title: ReactNode;
  titleClassName: string;
  titleId: string;
};

type UseToastReturn = {
  children: ReactNode;
  inlineViewport: boolean;
  renderItems: ToastItemViewModel[];
  viewportProps: {
    'aria-label': string;
    className: string;
    onFocusCapture: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
    ref: MutableRefObject<HTMLDivElement | null>;
    role: 'region';
    style: CSSProperties;
    tabIndex: -1;
  } & Omit<ToastProviderProps, 'children'>;
  viewportTarget: HTMLElement | null;
};

type ToastPresentation = {
  actionButtonSize: 'sm' | 'md';
  actionClassName: string;
  closeButtonClassName: string;
  closeButtonSize: 'xs' | 'sm';
  contentClassName: string;
  descriptionClassName: string;
  iconSize: IconSizes;
  indicatorClassName: string;
  spinnerSize: string;
  titleClassName: string;
};

const TOAST_REGION_LABEL = 'Notifications';
const SWIPE_OPACITY_FALLOFF_DISTANCE = 160;

const getPrefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getViewportStyle = ({ offset, placement, safeAreas }: ToastProviderRuntimeConfig): CSSProperties => {
  const safeTop = safeAreas ? `max(${offset}px, env(safe-area-inset-top))` : `${offset}px`;
  const safeBottom = safeAreas ? `max(${offset}px, env(safe-area-inset-bottom))` : `${offset}px`;
  const safeStart = safeAreas ? `max(${offset}px, env(safe-area-inset-left))` : `${offset}px`;
  const safeEnd = safeAreas ? `max(${offset}px, env(safe-area-inset-right))` : `${offset}px`;

  return {
    gap: 0,
    top: placement.startsWith('top') ? safeTop : undefined,
    bottom: placement.startsWith('bottom') ? safeBottom : undefined,
    left: placement.endsWith('start')
      ? safeStart
      : placement === 'top' || placement === 'bottom'
        ? undefined
        : undefined,
    right: placement.endsWith('end') ? safeEnd : placement === 'top' || placement === 'bottom' ? undefined : undefined
  };
};

const getIndicatorTone = (status: ToastStatus) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'danger';
    case 'info':
      return 'info';
    default:
      return 'muted';
  }
};

const getProgressColor = (status: ToastStatus): ProgressColor => {
  switch (status) {
    case 'info':
      return 'info';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'danger';
    default:
      return 'default';
  }
};

const getProgressValue = ({
  duration,
  remaining,
  startedAt
}: {
  duration: number;
  remaining: number;
  startedAt: number | null;
}) => {
  if (duration <= 0) {
    return 0;
  }

  const elapsed = startedAt ? Date.now() - startedAt : 0;
  const currentRemaining = Math.max(0, remaining - elapsed);
  return Math.max(0, Math.min(100, (currentRemaining / duration) * 100));
};

const getMotionState = (paused: boolean) => {
  return paused ? 'paused' : 'visible';
};

const getToastIdFromElement = (element: EventTarget | null) => {
  if (!(element instanceof HTMLElement)) {
    return null;
  }

  return element.closest<HTMLElement>('[data-toast-id]')?.dataset.toastId ?? null;
};

const isInteractiveToastTarget = (target: EventTarget | null, boundary: HTMLElement) => {
  if (!(target instanceof Element)) {
    return false;
  }

  const interactiveTarget = target.closest(
    'a, button, input, select, textarea, [role="button"], [role="link"], [data-toast-swipe-ignore="true"]'
  );

  return interactiveTarget !== null && boundary.contains(interactiveTarget);
};

const getToastPresentation = (size: ToastSize): ToastPresentation => {
  const closeButtonClassName =
    '-mt-1 self-start border-transparent text-text-secondary-light/80 hover:bg-surface-raised-light hover:text-text-light dark:text-text-secondary-dark/80 dark:hover:bg-white-tint-faint dark:hover:text-text-dark';

  switch (size) {
    case 'sm':
      return {
        actionButtonSize: 'sm',
        actionClassName: 'mt-2.5 flex items-center gap-2',
        closeButtonClassName,
        closeButtonSize: 'xs',
        contentClassName: 'flex items-start gap-2.5',
        descriptionClassName:
          'mt-1 break-words text-xs leading-4 text-text-secondary-light dark:text-text-secondary-dark',
        iconSize: 18,
        indicatorClassName: 'mt-0.5 flex shrink-0 items-center justify-center',
        spinnerSize: '1.125em',
        titleClassName: 'break-words text-sm font-semibold leading-5 text-text-light dark:text-text-dark'
      };
    case 'lg':
      return {
        actionButtonSize: 'md',
        actionClassName: 'mt-4 flex items-center gap-3',
        closeButtonClassName,
        closeButtonSize: 'xs',
        contentClassName: 'flex items-start gap-4',
        descriptionClassName:
          'mt-2 break-words text-base leading-6 text-text-secondary-light dark:text-text-secondary-dark',
        iconSize: 24,
        indicatorClassName: 'mt-1 flex shrink-0 items-center justify-center',
        spinnerSize: '1.5em',
        titleClassName: 'break-words text-base font-semibold leading-6 text-text-light dark:text-text-dark'
      };
    default:
      return {
        actionButtonSize: 'sm',
        actionClassName: 'mt-3 flex items-center gap-2',
        closeButtonClassName,
        closeButtonSize: 'xs',
        contentClassName: 'flex items-start gap-3',
        descriptionClassName:
          'mt-1 break-words text-sm leading-5 text-text-secondary-light dark:text-text-secondary-dark',
        iconSize: 20,
        indicatorClassName: 'mt-0.5 flex shrink-0 items-center justify-center',
        spinnerSize: '1.25em',
        titleClassName: 'break-words text-sm font-semibold leading-6 text-text-light dark:text-text-dark'
      };
  }
};

const getSwipeOffset = ({
  currentX,
  currentY,
  direction,
  startX,
  startY
}: {
  currentX: number;
  currentY: number;
  direction: ToastSwipeDirection;
  startX: number;
  startY: number;
}) => {
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;

  switch (direction) {
    case 'left': {
      const primary = -deltaX;
      return primary > 0 && primary >= Math.abs(deltaY) ? primary : 0;
    }
    case 'right': {
      const primary = deltaX;
      return primary > 0 && primary >= Math.abs(deltaY) ? primary : 0;
    }
    case 'up': {
      const primary = -deltaY;
      return primary > 0 && primary >= Math.abs(deltaX) ? primary : 0;
    }
    case 'down': {
      const primary = deltaY;
      return primary > 0 && primary >= Math.abs(deltaX) ? primary : 0;
    }
  }
};

const getSwipeTransformValue = (direction: ToastSwipeDirection, offset: number) => {
  return direction === 'left' || direction === 'up' ? -offset : offset;
};

const getSwipeStyle = ({
  direction,
  motionEnabled,
  offset
}: {
  direction: ToastSwipeDirection;
  motionEnabled: boolean;
  offset: number;
}): CSSProperties | undefined => {
  if (!motionEnabled) {
    return undefined;
  }

  if (offset <= 0) {
    return undefined;
  }

  const opacity = Math.max(0.65, 1 - (offset / SWIPE_OPACITY_FALLOFF_DISTANCE) * 0.35);
  const value = getSwipeTransformValue(direction, offset);
  const transform =
    direction === 'left' || direction === 'right' ? `translate3d(${value}px, 0, 0)` : `translate3d(0, ${value}px, 0)`;

  return {
    opacity,
    touchAction: direction === 'left' || direction === 'right' ? 'pan-y' : 'pan-x',
    transform,
    willChange: 'transform, opacity'
  };
};

const getToastStackStyle = ({
  depth,
  gap,
  placement,
  stackSize
}: {
  depth: number;
  gap: number;
  placement: ToastProviderRuntimeConfig['placement'];
  stackSize: number;
}): CSSProperties => {
  const safeGap = Math.max(6, Math.min(gap, 16));
  const stackOffset = depth * safeGap;
  const isCentered = placement === 'top' || placement === 'bottom';

  return {
    bottom: placement.startsWith('bottom') ? stackOffset : undefined,
    left: placement.endsWith('start') || isCentered ? (isCentered ? '50%' : 0) : undefined,
    position: 'absolute',
    right: placement.endsWith('end') ? 0 : undefined,
    top: placement.startsWith('top') ? stackOffset : undefined,
    zIndex: stackSize - depth
  };
};

export const useToast = ({
  children,
  placement = 'bottom',
  offset = 16,
  gap = 12,
  maxVisible = 3,
  queueStrategy = 'fifo',
  portalContainer,
  safeAreas = true,
  pauseOnWindowBlur = true,
  defaultDuration = 5000,
  motion = 'default',
  swipeDirection,
  swipeThreshold = 50,
  className,
  ...rest
}: ToastProviderProps): UseToastReturn => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const toastRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousVisibleIdsRef = useRef<string[]>([]);
  const lastFocusedToastIdRef = useRef<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion);
  const [swipeStateById, setSwipeStateById] = useState<Record<string, SwipeGestureState>>({});
  const [ticker, setTicker] = useState(0);
  const isMotionEnabled = motion === 'default' && !prefersReducedMotion;

  const snapshot = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);

  useEffect(() => {
    toastStore.setConfig({
      placement,
      offset,
      gap,
      maxVisible,
      queueStrategy,
      portalContainer: portalContainer ?? null,
      safeAreas,
      pauseOnWindowBlur,
      defaultDuration,
      motion: prefersReducedMotion ? 'none' : motion,
      swipeDirection,
      swipeThreshold,
      className
    });
  }, [
    className,
    defaultDuration,
    gap,
    maxVisible,
    motion,
    offset,
    pauseOnWindowBlur,
    placement,
    prefersReducedMotion,
    portalContainer,
    queueStrategy,
    safeAreas,
    swipeDirection,
    swipeThreshold
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);

      return () => {
        mediaQuery.removeEventListener('change', updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  useEffect(() => {
    const hasActiveTimers = snapshot.visibleToasts.some((toastItem) => toastItem.duration > 0 && !toastItem.paused);

    if (!hasActiveTimers) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTicker((current) => current + 1);
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [snapshot.visibleToasts]);

  useEffect(() => {
    if (typeof window === 'undefined' || !pauseOnWindowBlur) {
      return;
    }

    const handleBlur = () => {
      toastStore.pauseForWindowBlur();
    };

    const handleFocus = () => {
      toastStore.resumeFromWindowBlur();
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pauseOnWindowBlur]);

  const handleSwipeStateChange = (toastId: string, nextSwipeState: SwipeGestureState | null) => {
    setSwipeStateById((current) => {
      if (!nextSwipeState) {
        if (!(toastId in current)) {
          return current;
        }

        const { [toastId]: _removed, ...restSwipeState } = current;
        return restSwipeState;
      }

      const currentToastSwipeState = current[toastId];
      if (
        currentToastSwipeState?.pointerId === nextSwipeState.pointerId &&
        currentToastSwipeState.startX === nextSwipeState.startX &&
        currentToastSwipeState.startY === nextSwipeState.startY &&
        currentToastSwipeState.offset === nextSwipeState.offset
      ) {
        return current;
      }

      return {
        ...current,
        [toastId]: nextSwipeState
      };
    });
  };

  const finishSwipe = (
    toastId: string,
    pointerId: number,
    clientX: number,
    clientY: number,
    shouldEvaluateDismissal: boolean
  ) => {
    const activeSwipeState = swipeStateById[toastId];
    if (!activeSwipeState || activeSwipeState.pointerId !== pointerId) {
      return;
    }

    const toastItem = snapshot.visibleToasts.find((item) => item.id === toastId);
    handleSwipeStateChange(toastId, null);

    if (!toastItem) {
      return;
    }

    const offset = shouldEvaluateDismissal
      ? getSwipeOffset({
          currentX: clientX,
          currentY: clientY,
          direction: toastItem.swipeDirection,
          startX: activeSwipeState.startX,
          startY: activeSwipeState.startY
        })
      : activeSwipeState.offset;

    if (shouldEvaluateDismissal && toastItem.dismissible && offset >= toastItem.swipeThreshold) {
      toastStore.closeToast(toastItem.id);
      return;
    }

    toastStore.resumeToast(toastItem.id, 'swipe');
  };

  useEffect(() => {
    const activeSwipeEntries = Object.entries(swipeStateById);
    if (activeSwipeEntries.length === 0 || typeof document === 'undefined') {
      return;
    }

    const handlePointerUp = (event: globalThis.PointerEvent) => {
      for (const [toastId, swipeState] of activeSwipeEntries) {
        if (swipeState.pointerId === event.pointerId) {
          finishSwipe(toastId, event.pointerId, event.clientX, event.clientY, true);
        }
      }
    };

    const handlePointerCancel = (event: globalThis.PointerEvent) => {
      for (const [toastId, swipeState] of activeSwipeEntries) {
        if (swipeState.pointerId === event.pointerId) {
          finishSwipe(toastId, event.pointerId, event.clientX, event.clientY, false);
        }
      }
    };

    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [swipeStateById, snapshot.visibleToasts]);

  const renderItems = useMemo(() => {
    return [...snapshot.visibleToasts]
      .sort((left, right) => right.order - left.order)
      .map((toastItem) => {
        const titleId = `${toastItem.id}-title`;
        const descriptionId = toastItem.description ? `${toastItem.id}-description` : undefined;
        const paused = toastItem.paused;
        const presentation = getToastPresentation(toastItem.size);
        const swipeState = swipeStateById[toastItem.id];
        const swipeStyle = getSwipeStyle({
          direction: toastItem.swipeDirection,
          motionEnabled: isMotionEnabled,
          offset: swipeState?.offset ?? 0
        });
        const rootClassName = cn(
          toastVariants({
            status: toastItem.status,
            variant: toastItem.variant,
            size: toastItem.size,
            placement: snapshot.config.placement,
            motionState:
              toastItem.motionState === 'entering' || toastItem.motionState === 'closing'
                ? toastItem.motionState
                : getMotionState(paused)
          }),
          toastItem.className
        );

        return {
          id: toastItem.id,
          title: toastItem.title,
          description: toastItem.description,
          icon: toastItem.icon,
          status: toastItem.status,
          dismissible: toastItem.dismissible,
          isLoading: toastItem.status === 'loading',
          action: toastItem.action
            ? {
                label: toastItem.action.label,
                onAction: toastItem.action.onAction,
                ariaLabel: toastItem.action.ariaLabel,
                disabled: toastItem.action.disabled
              }
            : null,
          actionButtonSize: presentation.actionButtonSize,
          actionClassName: presentation.actionClassName,
          className: rootClassName,
          close: () => {
            toastStore.closeToast(toastItem.id);
          },
          closeButtonClassName: presentation.closeButtonClassName,
          closeButtonSize: presentation.closeButtonSize,
          contentClassName: presentation.contentClassName,
          titleClassName: presentation.titleClassName,
          descriptionClassName: presentation.descriptionClassName,
          iconSize: presentation.iconSize,
          indicatorClassName: presentation.indicatorClassName,
          spinnerSize: presentation.spinnerSize,
          titleId,
          descriptionId,
          showProgress: toastItem.progress && toastItem.duration > 0,
          size: toastItem.size,
          progressClassName:
            'absolute inset-x-0 bottom-0 [&>div]:rounded-none [&>div>div]:transition-none motion-reduce:[&>div>div]:transition-none',
          progressColor: getProgressColor(toastItem.status),
          progressValue: getProgressValue({
            duration: toastItem.duration,
            remaining: toastItem.remaining,
            startedAt: toastItem.startedAt
          }),
          rootStyle: swipeStyle,
          setRef: (node: HTMLDivElement | null) => {
            toastRefs.current[toastItem.id] = node;
          },
          rootProps: {
            role: 'alertdialog',
            'aria-modal': false,
            'aria-labelledby': titleId,
            'aria-describedby': descriptionId,
            'data-toast-id': toastItem.id,
            'data-status': toastItem.status,
            'data-swipe-direction': toastItem.swipeDirection,
            tabIndex: toastItem.dismissible || toastItem.action ? -1 : 0,
            onMouseEnter: () => {
              if (toastItem.pauseOnHover) {
                toastStore.pauseToast(toastItem.id, 'hover');
              }
            },
            onMouseLeave: () => {
              if (toastItem.pauseOnHover) {
                toastStore.resumeToast(toastItem.id, 'hover');
              }
            },
            onFocusCapture: () => {
              lastFocusedToastIdRef.current = toastItem.id;
              if (toastItem.pauseOnFocusWithin) {
                toastStore.pauseToast(toastItem.id, 'focus-within');
              }
            },
            onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
              const nextTarget = event.relatedTarget;
              if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
                return;
              }

              if (toastItem.pauseOnFocusWithin) {
                toastStore.resumeToast(toastItem.id, 'focus-within');
              }
            },
            onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
              if (
                !toastItem.dismissible ||
                event.button !== 0 ||
                isInteractiveToastTarget(event.target, event.currentTarget)
              ) {
                return;
              }

              event.currentTarget.setPointerCapture?.(event.pointerId);
              toastStore.pauseToast(toastItem.id, 'swipe');
              handleSwipeStateChange(toastItem.id, {
                offset: 0,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY
              });
            },
            onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
              const activeSwipeState = swipeStateById[toastItem.id];
              if (!activeSwipeState || activeSwipeState.pointerId !== event.pointerId) {
                return;
              }

              const offset = getSwipeOffset({
                currentX: event.clientX,
                currentY: event.clientY,
                direction: toastItem.swipeDirection,
                startX: activeSwipeState.startX,
                startY: activeSwipeState.startY
              });

              handleSwipeStateChange(toastItem.id, {
                ...activeSwipeState,
                offset
              });
            },
            onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
              const activeSwipeState = swipeStateById[toastItem.id];
              if (!activeSwipeState || activeSwipeState.pointerId !== event.pointerId) {
                return;
              }

              event.stopPropagation();
              event.currentTarget.releasePointerCapture?.(event.pointerId);
              finishSwipe(toastItem.id, event.pointerId, event.clientX, event.clientY, true);
            },
            onPointerCancel: (event: PointerEvent<HTMLDivElement>) => {
              const activeSwipeState = swipeStateById[toastItem.id];
              if (!activeSwipeState || activeSwipeState.pointerId !== event.pointerId) {
                return;
              }

              event.stopPropagation();
              event.currentTarget.releasePointerCapture?.(event.pointerId);
              finishSwipe(toastItem.id, event.pointerId, event.clientX, event.clientY, false);
            },
            onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => {
              const activeSwipeState = swipeStateById[toastItem.id];
              if (!activeSwipeState || activeSwipeState.pointerId !== event.pointerId) {
                return;
              }

              finishSwipe(toastItem.id, event.pointerId, event.clientX, event.clientY, false);
            }
          }
        } satisfies ToastItemViewModel;
      })
      .map((toastItem, index, stack) => {
        const scaleClassName = index === 0 ? '' : index === 1 ? 'scale-95' : 'scale-90';
        const placementClassName = placement === 'top' || placement === 'bottom' ? '-translate-x-1/2' : '';

        return {
          ...toastItem,
          className: cn(toastItem.className, placementClassName, scaleClassName, index > 0 && 'origin-center'),
          rootStyle: {
            ...toastItem.rootStyle,
            ...getToastStackStyle({
              depth: index,
              gap,
              placement,
              stackSize: stack.length
            })
          }
        };
      });
  }, [gap, motion, placement, snapshot.config.motion, snapshot.visibleToasts, swipeStateById, ticker]);

  useEffect(() => {
    const currentIds = new Set(renderItems.map((toastItem) => toastItem.id));
    setSwipeStateById((current) => {
      const staleIds = Object.keys(current).filter((toastId) => !currentIds.has(toastId));
      if (staleIds.length === 0) {
        return current;
      }

      const nextSwipeState = { ...current };
      for (const toastId of staleIds) {
        delete nextSwipeState[toastId];
      }

      return nextSwipeState;
    });
  }, [renderItems]);

  useEffect(() => {
    const currentIds = renderItems.map((toastItem) => toastItem.id);
    const removedFocusedToastId =
      lastFocusedToastIdRef.current &&
      previousVisibleIdsRef.current.includes(lastFocusedToastIdRef.current) &&
      !currentIds.includes(lastFocusedToastIdRef.current)
        ? lastFocusedToastIdRef.current
        : null;

    if (removedFocusedToastId) {
      const previousIndex = previousVisibleIdsRef.current.indexOf(removedFocusedToastId);
      const nextToastId = currentIds[previousIndex] ?? currentIds[previousIndex - 1] ?? currentIds[0] ?? null;

      queueMicrotask(() => {
        if (nextToastId) {
          toastRefs.current[nextToastId]?.focus();
          lastFocusedToastIdRef.current = nextToastId;
          return;
        }

        previousFocusRef.current?.focus();
        lastFocusedToastIdRef.current = null;
      });
    }

    previousVisibleIdsRef.current = currentIds;
  }, [renderItems]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'f6') {
        return;
      }

      const viewportElement = viewportRef.current;
      if (!viewportElement) {
        return;
      }

      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const isInsideViewport = activeElement ? viewportElement.contains(activeElement) : false;

      if (event.shiftKey) {
        if (!isInsideViewport) {
          return;
        }

        event.preventDefault();
        previousFocusRef.current?.focus();
        return;
      }

      if (isInsideViewport) {
        return;
      }

      event.preventDefault();
      previousFocusRef.current = activeElement;

      const frontmostToast = renderItems[0]?.id;
      if (frontmostToast) {
        toastRefs.current[frontmostToast]?.focus();
        lastFocusedToastIdRef.current = frontmostToast;
        return;
      }

      viewportElement.focus();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [renderItems]);

  const viewportProps = {
    ...rest,
    ref: viewportRef,
    role: 'region' as const,
    tabIndex: -1 as const,
    'aria-label': TOAST_REGION_LABEL,
    className: cn(toastViewportVariants({ placement }), className),
    style: getViewportStyle({
      ...snapshot.config,
      placement,
      offset,
      gap,
      safeAreas
    }),
    onFocusCapture: () => {
      const activeToastId = getToastIdFromElement(document.activeElement);
      if (activeToastId) {
        lastFocusedToastIdRef.current = activeToastId;
      }
    },
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Escape') {
        return;
      }

      const activeToastId =
        getToastIdFromElement(event.target) ?? renderItems.find((toastItem) => toastItem.dismissible)?.id ?? null;
      if (!activeToastId) {
        return;
      }

      const activeToast = renderItems.find((toastItem) => toastItem.id === activeToastId);
      if (!activeToast?.dismissible) {
        return;
      }

      event.preventDefault();
      toastStore.closeToast(activeToastId);
    }
  };

  const viewportTarget = portalContainer ?? (typeof document === 'undefined' ? null : document.body);

  return {
    children,
    inlineViewport: typeof document === 'undefined' || viewportTarget === null,
    viewportTarget,
    viewportProps,
    renderItems
  };
};

export const getToastIndicatorTone = getIndicatorTone;
