import type { FC, ReactElement } from 'react';
import { cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import type { TooltipProps } from './types';
import { useTooltip } from './useTooltip';

type TriggerChildProps = {
  'aria-describedby'?: string;
};

export const Tooltip: FC<TooltipProps> = ({ ...props }) => {
  const {
    children,
    className,
    content,
    coordinates,
    describedById,
    enableClick,
    enableFocus,
    enableHover,
    hasTooltipContent,
    hideTooltip,
    isClosing,
    isPositioned,
    isVisible,
    rest,
    showTooltip,
    toggleClickTooltip,
    tooltipClass,
    tooltipId,
    tooltipRef,
    triggerRef
  } = useTooltip(props);
  const { onBlur, onClick, onFocus, onMouseEnter, onMouseLeave, ...triggerRest } = rest;

  const trigger = isValidElement<TriggerChildProps>(children)
    ? cloneElement(children as ReactElement<TriggerChildProps>, {
        'aria-describedby': [children.props['aria-describedby'], describedById].filter(Boolean).join(' ') || undefined
      })
    : children;
  const closestDarkContainer = typeof document === 'undefined' ? null : triggerRef.current?.closest('.dark');
  const needsScopedDarkPortal = Boolean(
    closestDarkContainer && closestDarkContainer.tagName !== 'HTML' && closestDarkContainer.tagName !== 'BODY'
  );
  const portalContainer = typeof document === 'undefined' ? null : document.body;

  return (
    <span
      {...triggerRest}
      ref={triggerRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);

        if (enableHover && !event.defaultPrevented) {
          showTooltip();
        }
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);

        if (enableHover && !event.defaultPrevented) {
          hideTooltip();
        }
      }}
      onFocus={(event) => {
        onFocus?.(event);

        if (enableFocus && !event.defaultPrevented) {
          showTooltip();
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);

        if (enableFocus && !event.defaultPrevented) {
          hideTooltip();
        }
      }}
      onClick={(event) => {
        onClick?.(event);

        if (enableClick && !event.defaultPrevented) {
          toggleClickTooltip();
        }
      }}
    >
      {trigger}
      {isVisible &&
        hasTooltipContent &&
        portalContainer &&
        createPortal(
          <div className={needsScopedDarkPortal ? 'dark' : undefined} style={{ display: 'contents' }}>
            <div
              ref={tooltipRef}
              id={tooltipId}
              role='tooltip'
              onMouseEnter={enableHover ? () => showTooltip(true) : undefined}
              onMouseLeave={enableHover ? () => hideTooltip() : undefined}
              className={cn(
                tooltipClass,
                isPositioned && !isClosing && 'opacity-100',
                (!isPositioned || isClosing) && 'pointer-events-none'
              )}
              style={{
                top: coordinates.top,
                left: coordinates.left
              }}
            >
              {content}
            </div>
          </div>,
          portalContainer
        )}
    </span>
  );
};
