import * as React from 'react';
import Icon from '../icon/Icon';
import type { ChipProps } from './types';
import { useChip } from './useChip';

type ChipElement = HTMLDivElement | HTMLButtonElement;

export const Chip = React.forwardRef<ChipElement, ChipProps>((props, ref) => {
  const {
    componentTag,
    slots,
    splitActions,
    isDot,
    hasChildren,
    propsBase,
    primaryActionProps,
    pieces,
    closable,
    isDisabled,
    handleClose,
    closeIconSize,
    closeButtonAriaLabel
  } = useChip(props);
  const { avatar, startContent, endContent, children } = pieces;

  const content = (
    <>
      {avatar && <span className={slots.avatar}>{avatar}</span>}

      {startContent && (
        <span className='inline-flex items-center shrink-0 ltr:mr-0.5 rtl:ml-0.5 [&_svg]:align-middle'>
          {startContent}
        </span>
      )}

      {isDot && <span className={slots.dot} aria-hidden='true' />}

      {hasChildren && <span className={slots.content}>{children}</span>}

      {endContent && (
        <span className='inline-flex items-center shrink-0 ltr:ml-0.5 rtl:mr-0.5 [&_svg]:align-middle'>
          {endContent}
        </span>
      )}
    </>
  );

  return (
    <>
      {componentTag === 'button' ? (
        // The forwarded ref targets either a div or button depending on hook output.
        // This narrowing is required because JSX ref props cannot express the runtime branch union directly.
        <button ref={ref as React.Ref<HTMLButtonElement>} className={slots.base} {...propsBase}>
          {content}
          {closable && (
            <button
              type='button'
              aria-label={closeButtonAriaLabel}
              className={slots.closeButton}
              onClick={handleClose}
              disabled={isDisabled}
            >
              <Icon name='x' size={closeIconSize} className='pointer-events-none text-inherit dark:text-inherit' />
            </button>
          )}
        </button>
      ) : (
        // Same rationale as above: the forwarded ref is narrowed to the concrete rendered element for this branch.
        <div ref={ref as React.Ref<HTMLDivElement>} className={slots.base} {...propsBase}>
          {splitActions ? (
            <button className={slots.actionButton} {...primaryActionProps}>
              {content}
            </button>
          ) : (
            content
          )}

          {closable && (
            <button
              type='button'
              aria-label={closeButtonAriaLabel}
              className={slots.closeButton}
              onClick={handleClose}
              disabled={isDisabled}
            >
              <Icon name='x' size={closeIconSize} className='pointer-events-none text-inherit dark:text-inherit' />
            </button>
          )}
        </div>
      )}
    </>
  );
});

Chip.displayName = 'Chip';
