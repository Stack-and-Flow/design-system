import type { FC } from 'react';
import type { BadgeProps } from './types';
import { useBadge } from './useBadge';

export const Badge: FC<BadgeProps> = ({ ...props }) => {
  const { content, children, badgeProps, hasChildren, shouldRenderBadge } = useBadge({ ...props });

  if (!hasChildren) {
    return shouldRenderBadge ? <span {...badgeProps}>{content}</span> : null;
  }

  return (
    <div className='relative inline-flex items-center justify-center'>
      {children}
      {shouldRenderBadge && <span {...badgeProps}>{content}</span>}
    </div>
  );
};
