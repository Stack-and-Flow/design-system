import { cn } from '@/lib/utils';
import type { FC } from 'react';
import { createPortal } from 'react-dom';
import type { TooltipProps } from './types';
import { useTooltip } from './useTooltip';

const Tooltip: FC<TooltipProps> = ({ ...props }) => {
  const {
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
    children,
    animationHidde,
    disabled,
    onFocus,
    onClick
  } = useTooltip(props);

  return (
    <div className='m-3'>
      <div
        ref={triggerRef}
        className='relative'
        onMouseEnter={onFocus || onClick ? undefined : showTooltip}
        onMouseLeave={onFocus || onClick ? undefined : hideTooltip}
        {...(onFocus && {
          onFocus: showTooltip,
          onBlur: hideTooltip
        })}
        onClick={!isVisible ? showClickTooltip : hideClickTooltip}
      >
        {children}

        {isVisible &&
          createPortal(
            <p
              ref={tooltipRef}
              onMouseEnter={showTooltip}
              onMouseLeave={hideTooltip}
              className={cn(tooltipClass, ` ${animationHidde ? 'animate-fadeOut duration-50  ' : ''}`)}
              style={{
                top: position.top,
                left: position.left,
                pointerEvents: disabled ? 'none' : 'auto'
              }}
            >
              {content}
            </p>,
            document.body
          )}
      </div>
    </div>
  );
};

export default Tooltip;
