import * as React from 'react';
import Icon from '../icon/Icon';
import type { ChipProps } from './types';
import { useChip } from './useChip';

export const Chip = React.forwardRef<HTMLElement, ChipProps>((props, ref) => {
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
  const ComponentTag = componentTag;

  return (
    <ComponentTag ref={ref as any} className={slots.base} {...propsBase}>
      {splitActions ? (
        <button className={slots.actionButton} {...primaryActionProps}>
          {avatar && (
            <span
              className={[
                slots.avatar,
                'relative shrink-0 overflow-hidden rounded-full grid place-items-center',
                'h-[calc(var(--chip-h)-2px)] w-[calc(var(--chip-h)-2px)]',
                '*:origin-center [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-full [&>svg]:w-full',
                '*:scale-(--avatar-scale,1)'
              ].join(' ')}
            >
              {avatar}
            </span>
          )}

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
        </button>
      ) : (
        <>
          {avatar && (
            <span
              className={[
                slots.avatar,
                'relative shrink-0 overflow-hidden rounded-full grid place-items-center',
                'h-[calc(var(--chip-h)-2px)] w-[calc(var(--chip-h)-2px)]',
                '*:origin-center [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-full [&>svg]:w-full',
                '*:scale-(--avatar-scale,1)'
              ].join(' ')}
            >
              {avatar}
            </span>
          )}

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
    </ComponentTag>
  );
});

Chip.displayName = 'Chip';
