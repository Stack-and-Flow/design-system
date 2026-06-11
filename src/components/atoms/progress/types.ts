import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

export const progressVariants = cva('relative w-full overflow-hidden', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    },
    color: {
      default: 'bg-red-tint-subtle dark:bg-red-tint-low',
      primary: 'bg-red-tint-low dark:bg-red-tint-active',
      secondary: 'bg-border-light dark:bg-surface-raised-dark',
      info: 'bg-info-tint',
      success: 'bg-success-tint',
      warning: 'bg-warning-tint',
      danger: 'bg-error-tint'
    }
  },
  defaultVariants: {
    size: 'md',
    rounded: 'full',
    color: 'default'
  }
});

export const progressIndicatorVariants = cva('h-full origin-left', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    },
    color: {
      default: 'bg-brand-light dark:bg-brand-dark',
      primary: 'bg-brand-light-dark dark:bg-brand-dark-light',
      secondary: 'bg-text-secondary-light dark:bg-border-strong-dark',
      info: 'bg-info-light dark:bg-info',
      success: 'bg-success-light dark:bg-success',
      warning: 'bg-warning-light dark:bg-warning',
      danger: 'bg-error-light dark:bg-error'
    }
  },
  defaultVariants: {
    rounded: 'full',
    color: 'default'
  }
});

type ProgressTrackVariantProps = VariantProps<typeof progressVariants>;
type ProgressIndicatorVariantProps = VariantProps<typeof progressIndicatorVariants>;
type NativeProgressProps = Omit<
  ComponentProps<'div'>,
  'aria-valuemax' | 'aria-valuemin' | 'aria-valuenow' | 'children' | 'className' | 'color' | 'role'
>;

export type ProgressSize = NonNullable<ProgressTrackVariantProps['size']>;
export type ProgressColor = NonNullable<ProgressIndicatorVariantProps['color']>;
export type ProgressRounded = NonNullable<ProgressTrackVariantProps['rounded']>;

export type ProgressProps = NativeProgressProps & {
  /**
   * @control number
   * @default 0
   */
  value?: number;

  /**
   * @control number
   * @default 0
   */
  minValue?: number;

  /**
   * @control number
   * @default 100
   */
  maxValue?: number;

  /**
   * @control boolean
   * @default false
   */
  isIndeterminate?: boolean;

  /**
   * @control text
   */
  label?: string;

  /**
   * @control boolean
   * @default false
   */
  showValueLabel?: boolean;

  /**
   * @control select
   * @default md
   */
  size?: ProgressSize;

  /**
   * @control select
   * @default default
   */
  color?: ProgressColor;

  /**
   * @control select
   * @default full
   */
  rounded?: ProgressRounded;

  /**
   * @control text
   */
  className?: string;
};
