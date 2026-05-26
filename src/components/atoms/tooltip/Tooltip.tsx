import type { FC, ReactElement } from 'react';
import { cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import type { TooltipProps } from './types';
import { useTooltip } from './useTooltip';

type TriggerChildProps = {
  'aria-describedby'?: string;
};

const Tooltip: FC<TooltipProps> = ({ ...props }) => {
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
      {...rest}
      ref={triggerRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={enableHover ? () => showTooltip() : undefined}
      onMouseLeave={enableHover ? () => hideTooltip() : undefined}
      onFocus={enableFocus ? () => showTooltip() : undefined}
      onBlur={enableFocus ? () => hideTooltip() : undefined}
      onClick={enableClick ? toggleClickTooltip : undefined}
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
              className={cn(tooltipClass, !isPositioned && 'invisible', isClosing && 'animate-fadeOut duration-200')}
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

export default Tooltip;
