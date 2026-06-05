import type { ComponentProps, KeyboardEvent } from 'react';
import { Children, useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DynamicIconName } from '@/types';
import type { AlertProps } from './types';
import { alertVariants, defaultAlertIcons } from './types';

const EXIT_DURATION_MS = 200;

const hasContent = (node: AlertProps['children']) => {
  return Children.toArray(node).some((child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0;
    }

    return child !== null && child !== undefined;
  });
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  return prefersReducedMotion;
};

type UseAlertReturn = {
  shouldRender: boolean;
  dismissible: boolean;
  closeButtonAriaLabel: string;
  rootClassName: string;
  innerClassName: string;
  contentClassName: string;
  startContentClassName: string;
  iconClassName: string;
  textContentClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  subtitleClassName: string;
  bodyClassName: string;
  endContentClassName: string;
  closeButtonClassName: string;
  titleId?: string;
  descriptionId?: string;
  hasTitle: boolean;
  hasSubtitle: boolean;
  hasBody: boolean;
  hasStartContent: boolean;
  hasEndContent: boolean;
  showDefaultIcon: boolean;
  resolvedIconName: DynamicIconName;
  handleDismiss: () => void;
  handleCloseKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  rootProps: ComponentProps<'div'> & {
    'aria-describedby': string | undefined;
    'aria-labelledby': string | undefined;
    'data-state': 'open' | 'closed';
    role: 'alert';
  };
  pieces: {
    title: AlertProps['title'];
    subtitle: AlertProps['subtitle'];
    children: AlertProps['children'];
    startContent: AlertProps['startContent'];
    endContent: AlertProps['endContent'];
  };
};

export const useAlert = (props: AlertProps): UseAlertReturn => {
  const {
    title,
    subtitle,
    children,
    variant = 'solid',
    color = 'primary',
    rounded = true,
    dismissible = false,
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    closeButtonAriaLabel = 'Dismiss alert',
    iconName,
    startContent,
    endContent,
    className,
    ...rest
  } = props;

  const prefersReducedMotion = usePrefersReducedMotion();
  const isControlled = typeof openProp === 'boolean';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const [isPresent, setIsPresent] = useState(open);
  const [isVisible, setIsVisible] = useState(open);
  const exitTimeoutRef = useRef<number | null>(null);
  const enterFrameRef = useRef<number | null>(null);
  const idBase = useId().replaceAll(':', '');

  const clearPendingExit = useCallback(() => {
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
  }, []);

  const clearPendingEnterFrame = useCallback(() => {
    if (enterFrameRef.current !== null) {
      window.cancelAnimationFrame(enterFrameRef.current);
      enterFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    clearPendingExit();
    clearPendingEnterFrame();

    if (open) {
      if (!isPresent) {
        setIsPresent(true);
        if (prefersReducedMotion) {
          setIsVisible(true);
          return;
        }

        setIsVisible(false);
        enterFrameRef.current = window.requestAnimationFrame(() => {
          setIsVisible(true);
          enterFrameRef.current = null;
        });
        return;
      }

      setIsVisible(true);
      return;
    }

    if (!isPresent) {
      return;
    }

    if (prefersReducedMotion) {
      setIsVisible(false);
      setIsPresent(false);
      return;
    }

    setIsVisible(false);
    exitTimeoutRef.current = window.setTimeout(() => {
      setIsPresent(false);
      exitTimeoutRef.current = null;
    }, EXIT_DURATION_MS);

    return () => {
      clearPendingExit();
      clearPendingEnterFrame();
    };
  }, [clearPendingEnterFrame, clearPendingExit, isPresent, open, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      clearPendingExit();
      clearPendingEnterFrame();
    };
  }, [clearPendingEnterFrame, clearPendingExit]);

  const requestOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const hasTitle = hasContent(title);
  const hasSubtitle = hasContent(subtitle);
  const hasBody = hasContent(children);
  const hasTextContent = hasTitle || hasSubtitle || hasBody;
  const hasStartContent = hasContent(startContent);
  const hasEndContent = hasContent(endContent);
  const resolvedIconName = iconName ?? defaultAlertIcons[color];
  const showDefaultIcon = !hasStartContent;
  const titleId = hasTitle ? `alert-${idBase}-title` : undefined;
  const descriptionId = hasSubtitle || hasBody ? `alert-${idBase}-description` : undefined;

  const closeButtonHoverClassName = 'hover:bg-surface-raised-light dark:hover:bg-white-tint-faint';
  const defaultIconClassName = (() => {
    switch (color) {
      case 'success':
        return 'text-success-light dark:text-success';
      case 'warning':
        return 'text-warning-light dark:text-warning';
      case 'danger':
        return 'text-error-light dark:text-error';
      default:
        return 'text-text-secondary-light dark:text-text-secondary-dark';
    }
  })();

  const rootClassName = cn(
    alertVariants({ variant, color, rounded }),
    isVisible ? '[grid-template-rows:1fr] opacity-100' : 'pointer-events-none [grid-template-rows:0fr] opacity-0',
    className
  );

  const handleDismiss = useCallback(() => {
    requestOpenChange(false);
  }, [requestOpenChange]);

  const handleCloseKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === ' ' || event.key === 'Space' || event.key === 'Spacebar') {
        event.preventDefault();
        handleDismiss();
      }
    },
    [handleDismiss]
  );

  return {
    shouldRender: hasTextContent && isPresent,
    dismissible,
    closeButtonAriaLabel,
    rootClassName,
    innerClassName: 'min-h-0 overflow-hidden',
    contentClassName: cn('flex items-start gap-3 px-4', hasSubtitle || hasBody ? 'py-4' : 'py-3'),
    startContentClassName: 'mt-0.5 flex shrink-0 items-center justify-center text-current',
    iconClassName: defaultIconClassName,
    textContentClassName: 'min-w-0 flex-1',
    titleClassName: 'font-bold text-sm leading-6',
    descriptionClassName: cn('min-w-0 text-sm leading-6', hasTitle && 'mt-1', (hasSubtitle || hasBody) && 'space-y-2'),
    subtitleClassName: 'opacity-80',
    bodyClassName: 'opacity-90',
    endContentClassName: 'flex shrink-0 items-start gap-2 self-start',
    closeButtonClassName: cn(
      '-mt-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent text-current/70',
      'transition-[background-color,color,box-shadow] duration-200 ease-out',
      'hover:text-current focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark',
      closeButtonHoverClassName
    ),
    titleId,
    descriptionId,
    hasTitle,
    hasSubtitle,
    hasBody,
    hasStartContent,
    hasEndContent,
    showDefaultIcon,
    resolvedIconName,
    handleDismiss,
    handleCloseKeyDown,
    rootProps: {
      ...rest,
      role: 'alert',
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
      'data-state': isVisible ? 'open' : 'closed'
    },
    pieces: {
      title,
      subtitle,
      children,
      startContent,
      endContent
    }
  };
};
