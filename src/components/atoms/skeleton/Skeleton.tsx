import type { FC } from 'react';
import type { SkeletonProps } from './types';
import { useSkeleton } from './useSkeleton';

export const Skeleton: FC<SkeletonProps> = (props) => {
  const { className, ariaHidden, ...rest } = useSkeleton(props);

  return <div {...rest} data-slot='skeleton' className={className} aria-hidden={ariaHidden} />;
};
