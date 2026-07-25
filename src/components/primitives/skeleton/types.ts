import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import type { ThemeRounded } from '@/types';

export const skeletonVariants = cva('block shrink-0 bg-border-strong-light animate-pulse dark:bg-border-strong-dark', {
  variants: {
    size: {
      text: 'h-4 w-24',
      title: 'h-8 w-30',
      avatar: 'h-12 w-12',
      thumbnail: 'h-30 w-30',
      card: 'h-30 w-full'
    },
    rounded: {
      none: 'rounded-none',
      xs: 'rounded-xs',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-pill'
    }
  },
  defaultVariants: {
    size: 'text',
    rounded: 'md'
  }
});

export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
export type SkeletonSize = NonNullable<SkeletonVariantProps['size']>;
export type SkeletonRounded = NonNullable<ThemeRounded>;

type NativeSkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'aria-hidden'>;

export type SkeletonProps = Omit<SkeletonVariantProps, 'size' | 'rounded'> &
  NativeSkeletonProps & {
    /**
     * @control select
     * @default text
     */
    size?: SkeletonSize;
    /**
     * @control select
     * @default md
     */
    rounded?: SkeletonRounded;
    /** @control text */
    className?: string;
    /**
     * @control boolean
     * @default true
     */
    ariaHidden?: boolean;
  };
