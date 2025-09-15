import * as React from 'react';
import type { ChipProps } from './types';
import { useChip } from './useChip';

export const Chip = React.forwardRef<HTMLElement, ChipProps>((props, ref) => {
  const { Tag, slots, isDot, hasChildren, propsBase, pieces, closable, handleClose } = useChip(props);
  const { avatar, startContent, endContent, children } = pieces;

  return (
    <Tag ref={ref as any} className={slots.base} {...propsBase}>
      {avatar && (
        <span
          className={[
            slots.avatar,
            'relative shrink-0 overflow-hidden rounded-full grid place-items-center',
            'h-[calc(var(--chip-h)-2px)] w-[calc(var(--chip-h)-2px)]',
            '[&>*]:origin-center [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-full [&>svg]:w-full',
            '[&>*]:scale-[var(--avatar-scale,1)]'
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

      {closable && (
        <button type='button' aria-label='Close' className={slots.closeButton} onClick={handleClose}>
          <span aria-hidden='true' className='relative -top-[1px] leading-none'>
            ×
          </span>
        </button>
      )}
    </Tag>
  );
});

Chip.displayName = 'Chip';
