import * as React from 'react';
import type { ChipProps } from './types';
import { useChip } from './useChip';

export const Chip = React.forwardRef<HTMLElement, ChipProps>((props, ref) => {
  const { Tag, slots, isDot, hasChildren, propsBase, pieces, closable, handleClose } = useChip(props);
  const { avatar, startContent, endContent, children } = pieces;

  return (
    <Tag ref={ref as any} className={slots.base} {...propsBase}>
      {avatar && <span className={slots.avatar}>{avatar}</span>}

      {startContent && (
        <span className='inline-flex items-center shrink-0 ltr:mr-2 rtl:ml-2 [&_svg]:align-middle'>{startContent}</span>
      )}

      {isDot && <span className={slots.dot} aria-hidden='true' />}

      {hasChildren && <span className={slots.content}>{children}</span>}

      {endContent && (
        <span className='inline-flex items-center shrink-0 ltr:ml-2 rtl:mr-2 [&_svg]:align-middle'>{endContent}</span>
      )}

      {closable && (
        <button type='button' aria-label='Close' className={slots.closeButton} onClick={handleClose}>
          ×
        </button>
      )}
    </Tag>
  );
});
Chip.displayName = 'Chip';
