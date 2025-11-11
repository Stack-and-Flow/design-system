import { useLayoutEffect, useRef, useState } from 'react';
import { type TooltipProps, tooltipVariants } from './types';

export const useTooltip = ({
  content = 'I`m a tooltip',
  children = null,
  placement = 'top',
  delayShow,
  delayHide = 50,
  complement = 'default',
  width = 'default',
  color = 'default',
  disabled,
  onFocus,
  onClick
}: TooltipProps) => {
  const tooltipClass = tooltipVariants({ complement, width, color });
  const [isVisible, setIsVisible] = useState(false);
  const [animationHidde, setAnimationHide] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0
  });

  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearShow = () => {
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
  };

  const clearHide = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  const showTooltip = () => {
    clearShow();
    clearHide();
    setAnimationHide(false);
    showTimeout.current = setTimeout(() => {
      setIsVisible(true);
    }, delayShow);
  };

  const showClickTooltip = () => {
    setIsVisible(true);
    setAnimationHide(false);
  };

  const hideClickTooltip = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
    setAnimationHide(true);
  };
  const hideTooltip = () => {
    clearShow();
    clearHide();
    hideTimeout.current = setTimeout(() => {
      hideTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      setAnimationHide(true);
    }, delayHide);
  };

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!isVisible || !triggerRef.current || !tooltipRef.current) {
        return;
      }

      const triggerSize = triggerRef.current.getBoundingClientRect();
      const tooltipSize = tooltipRef.current.getBoundingClientRect();
      const offset = 10;

      const positionTooltip: Record<NonNullable<TooltipProps['placement']>, () => { top: number; left: number }> = {
        top: () => {
          return {
            top: triggerSize.top + window.scrollY - tooltipSize.height - offset,
            left: triggerSize.left + window.scrollX + triggerSize.width / 2 - tooltipSize.width / 2
          };
        },
        'top-start': () => ({
          top: triggerSize.top + window.scrollY - tooltipSize.height - offset,
          left: triggerSize.left + window.scrollX
        }),
        'top-end': () => ({
          top: triggerSize.top + window.scrollY - tooltipSize.height - offset,
          left: triggerSize.right + window.scrollX - tooltipSize.width
        }),
        bottom: () => {
          // Lógica de cálculo para 'bottom'
          return {
            top: triggerSize.bottom + window.scrollY + offset,
            left: triggerSize.left + window.scrollX + triggerSize.width / 2 - tooltipSize.width / 2
          };
        },

        'bottom-start': () => ({
          top: triggerSize.bottom + window.scrollY + offset,
          left: triggerSize.left + window.scrollX
        }),
        'bottom-end': () => ({
          top: triggerSize.bottom + window.scrollY + offset,
          left: triggerSize.right + window.scrollX - tooltipSize.width
        }),
        left: () => {
          // Lógica de cálculo para 'left'
          return {
            top: triggerSize.top + window.scrollY + triggerSize.height / 2 - tooltipSize.height / 2,
            left: triggerSize.left + window.scrollX - tooltipSize.width - offset
          };
        },
        'left-start': () => ({
          top: triggerSize.top + window.scrollY,
          left: triggerSize.left + window.scrollX - tooltipSize.width - offset
        }),
        'left-end': () => ({
          top: triggerSize.bottom + window.scrollY - tooltipSize.height,
          left: triggerSize.left + window.scrollX - tooltipSize.width - offset
        }),
        right: () => {
          // Lógica de cálculo para 'right'
          return {
            top: triggerSize.top + window.scrollY + triggerSize.height / 2 - tooltipSize.height / 2,
            left: triggerSize.right + window.scrollX + offset
          };
        },
        'right-start': () => ({
          top: triggerSize.top + window.scrollY,
          left: triggerSize.right + window.scrollX + offset
        }),
        'right-end': () => ({
          top: triggerSize.bottom + window.scrollY - tooltipSize.height,
          left: triggerSize.right + window.scrollX + offset
        })
      };

      const calcFunction = positionTooltip[placement];

      setPosition(calcFunction());
    };

    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible]);

  return {
    content,
    tooltipClass,
    showTooltip,
    showClickTooltip,
    hideTooltip,
    hideClickTooltip,
    isVisible,
    triggerRef,
    tooltipRef,
    position,
    placement,
    children,
    animationHidde,
    complement,
    width,
    disabled,
    onFocus,
    onClick
  };
};
