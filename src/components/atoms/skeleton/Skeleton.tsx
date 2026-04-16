import { cn } from '@/lib/utils';
import type { ComponentProps, FC } from 'react';
import type { SkeletonProps } from './types';
import { useSkeleton } from './useSkeleton';

const Skeleton: FC<SkeletonProps & ComponentProps<'div'>> = ({ ...props }) => {
  const { rounded, className, width, height, ...rest } = useSkeleton(props);
  return (
    <div
      {...rest}
      data-slot='skeleton'
      className={cn('bg-[rgba(255,255,255,0.08)] animate-pulse', `rounded-${rounded}`, className)}
      style={{ width: `${width}`, height: `${height}` }}
    />
  );
};

export default Skeleton;
