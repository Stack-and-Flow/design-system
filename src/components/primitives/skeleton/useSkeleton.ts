import { cn } from '@/lib/utils';
import { type SkeletonProps, skeletonVariants } from './types';

type UseSkeletonReturn = Omit<SkeletonProps, 'size' | 'rounded' | 'className' | 'ariaHidden'> & {
  className: string;
  ariaHidden: boolean;
};

export const useSkeleton = ({
  size = 'text',
  rounded = 'md',
  className,
  ariaHidden = true,
  ...rest
}: SkeletonProps): UseSkeletonReturn => {
  return {
    className: cn(skeletonVariants({ size, rounded }), className),
    ariaHidden,
    ...rest
  };
};
