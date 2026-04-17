import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { BadgeProps } from './types';
import { useBadge } from './useBadge';

const Badge: FC<BadgeProps> = ({ ...props }) => {
  const {
    content,
    className,
    visibility,
    ariaLabel,
    children,
    badgeClass,
    showRenderBadge,
    role,
    ariaLive,
    hasChildren,
    isSquare
  } = useBadge({ ...props });

  // Square size map — matches h- values defined per size in badgeVariants
  const squareSizeMap = { sm: '!w-[18px]', md: '!w-[24px]', lg: '!w-[28px]' } as const;

  const spanClass = cn(
    badgeClass,
    // Icon or empty content: remove horizontal padding so the badge stays square
    isSquare && `!px-0 ${squareSizeMap[props.size ?? 'md']}`,
    visibility ? 'animate-badgeIn' : 'animate-badgeOut pointer-events-none',
    className
  );

  // If there are no children, render badge standalone (inline)
  if (!hasChildren) {
    return showRenderBadge ? (
      <span className={spanClass} aria-label={ariaLabel} role={role} aria-live={ariaLive}>
        {content}
      </span>
    ) : null;
  }

  // If there are children, render badge positioned relative to children
  return (
    <div className='relative inline-flex items-center justify-center'>
      {children}
      {showRenderBadge && (
        <span className={spanClass} aria-label={ariaLabel} role={role} aria-live={ariaLive}>
          {content}
        </span>
      )}
    </div>
  );
};

export default Badge;
