import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { BadgeProps } from './types';
import { useBadge } from './useBadge';

const Badge: FC<BadgeProps> = ({ ...props }) => {
  const { content, className, visibility, ariaLabel, children, badgeClass, showRenderBadge, role, ariaLive } = useBadge(
    { ...props }
  );

  return (
    <div className='relative inline-flex items-center justify-center'>
      {children}
      {showRenderBadge && (
        <span
          className={cn(badgeClass, visibility ? 'animate-badgeIn' : 'animate-badgeOut', className)}
          aria-label={ariaLabel}
          role={role}
          aria-live={ariaLive}
        >
          {content}
        </span>
      )}
    </div>
  );
};

export default Badge;
