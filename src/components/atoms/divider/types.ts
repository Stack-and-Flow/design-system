import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

export const dividerVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: ''
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
      full: ''
    },
    corner: {
      rounded: 'rounded-xs',
      none: 'rounded-none'
    },
    thickness: {
      xs: '',
      sm: '',
      md: '',
      lg: ''
    }
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      size: 'xs',
      class: 'w-8'
    },
    {
      orientation: 'horizontal',
      size: 'sm',
      class: 'w-16'
    },
    {
      orientation: 'horizontal',
      size: 'md',
      class: 'w-32'
    },
    {
      orientation: 'horizontal',
      size: 'lg',
      class: 'w-64'
    },
    {
      orientation: 'horizontal',
      size: 'xl',
      class: 'w-96'
    },
    {
      orientation: 'horizontal',
      size: 'full',
      class: 'w-full'
    },
    {
      orientation: 'vertical',
      size: 'xs',
      class: 'h-6'
    },
    {
      orientation: 'vertical',
      size: 'sm',
      class: 'h-10'
    },
    {
      orientation: 'vertical',
      size: 'md',
      class: 'h-14'
    },
    {
      orientation: 'vertical',
      size: 'lg',
      class: 'h-20'
    },
    {
      orientation: 'vertical',
      size: 'xl',
      class: 'h-24'
    },
    {
      orientation: 'vertical',
      size: 'full',
      class: 'h-full'
    },
    {
      orientation: 'horizontal',
      thickness: 'xs',
      class: 'h-px'
    },
    {
      orientation: 'horizontal',
      thickness: 'sm',
      class: 'h-0.5'
    },
    {
      orientation: 'horizontal',
      thickness: 'md',
      class: 'h-0-75'
    },
    {
      orientation: 'horizontal',
      thickness: 'lg',
      class: 'h-1-25'
    },
    {
      orientation: 'vertical',
      thickness: 'xs',
      class: 'w-px'
    },
    {
      orientation: 'vertical',
      thickness: 'sm',
      class: 'w-0.5'
    },
    {
      orientation: 'vertical',
      thickness: 'md',
      class: 'w-0-75'
    },
    {
      orientation: 'vertical',
      thickness: 'lg',
      class: 'w-1-25'
    }
  ],
  defaultVariants: {
    orientation: 'horizontal',
    size: 'full',
    corner: 'none',
    thickness: 'xs'
  }
});

type DividerVariantProps = VariantProps<typeof dividerVariants>;
export type DividerColor =
  | 'bg-primary'
  | 'bg-brand-light'
  | 'bg-brand-dark'
  | 'bg-red-500'
  | 'bg-red-600'
  | 'bg-blue'
  | 'bg-indigo'
  | 'bg-purple'
  | 'bg-green'
  | 'bg-teal'
  | 'bg-yellow'
  | 'bg-orange'
  | 'bg-pink'
  | (string & {});

type NativeDividerProps = Omit<
  ComponentProps<'div'>,
  'aria-hidden' | 'aria-orientation' | 'children' | 'className' | 'color' | 'role'
>;

export type DividerProps = NativeDividerProps & {
  /**
   * @control select
   * @default horizontal
   */
  orientation?: NonNullable<DividerVariantProps['orientation']>;
  /**
   * @control select
   * @default bg-primary
   */
  color?: DividerColor;
  /**
   * @control select
   * @default full
   */
  size?: NonNullable<DividerVariantProps['size']>;
  /**
   * @control select
   * @default none
   */
  corner?: NonNullable<DividerVariantProps['corner']>;
  /**
   * @control select
   * @default xs
   */
  thickness?: NonNullable<DividerVariantProps['thickness']>;
  /** @control text */
  className?: string;
  /**
   * @control boolean
   * @default false
   */
  decorative?: boolean;
};
