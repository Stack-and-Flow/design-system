import { cva, type VariantProps } from 'class-variance-authority';
import type { AriaRole, ReactNode } from 'react';

export const badgeVariants = cva(
  [
    'inline-flex items-center justify-center font-semibold rounded-xs',
    'transition-[background-color,color] duration-200 ease-in-out',
    'whitespace-nowrap'
  ],
  {
    variants: {
      color: {
        primary: ['bg-brand-light text-white', 'dark:bg-brand-dark dark:text-white'],
        secondary: ['bg-surface-light text-text-light', 'dark:bg-surface-dark dark:text-text-dark'],
        success: 'bg-success-light text-white dark:bg-success dark:text-white',
        warning: 'bg-warning-light text-text-light dark:bg-warning dark:text-text-light',
        danger: 'bg-error-light text-white dark:bg-error dark:text-white'
      },
      size: {
        sm: 'text-badge-sm min-w-4-5 h-4-5 px-1.5 py-0.5 mr-1-25 mt-0.5',
        md: 'text-xs min-w-6 h-6 px-2 py-1',
        lg: 'text-sm min-w-7 h-7 px-2.5 py-1-25'
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-sm'
      },
      variant: {
        solid: '',
        flat: 'border',
        subtle: ''
      },
      placement: {
        'top-right': 'absolute top-0 right-0 translate-x-1/3 -translate-y-1/3',
        'bottom-right': 'absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3',
        'bottom-left': 'absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
        'top-left': 'absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3'
      },
      animation: {
        default: '',
        pulse: 'motion-safe:animate-pulse motion-reduce:animate-none',
        bounce: 'motion-safe:animate-bounce motion-reduce:animate-none',
        ping: 'motion-safe:animate-badgePing motion-reduce:animate-none'
      }
    },
    compoundVariants: [
      {
        variant: 'flat',
        color: 'primary',
        class: [
          'bg-red-tint-subtle border-brand-light text-brand-light',
          'dark:bg-red-tint-subtle dark:border-brand-dark dark:text-brand-dark-light'
        ]
      },
      {
        variant: 'flat',
        color: 'secondary',
        class: [
          'bg-surface-raised-light border-border-strong-light text-text-light',
          'dark:bg-surface-raised-dark dark:border-border-strong-dark dark:text-text-dark'
        ]
      },
      {
        variant: 'flat',
        color: 'success',
        class: [
          'bg-success-tint border-success-light text-success-light',
          'dark:bg-success-tint dark:border-success dark:text-success'
        ]
      },
      {
        variant: 'flat',
        color: 'warning',
        class: [
          'bg-warning-tint border-warning-light text-warning-light',
          'dark:bg-warning-tint dark:border-warning dark:text-warning'
        ]
      },
      {
        variant: 'flat',
        color: 'danger',
        class: [
          'bg-error-tint border-error-light text-error-light',
          'dark:bg-error-tint dark:border-error dark:text-error'
        ]
      },
      {
        variant: 'subtle',
        color: 'primary',
        class: ['bg-red-tint-subtle text-brand-light', 'dark:bg-red-tint-subtle dark:text-brand-dark-light']
      },
      {
        variant: 'subtle',
        color: 'secondary',
        class: ['bg-surface-light text-text-secondary-light', 'dark:bg-surface-dark dark:text-text-secondary-dark']
      },
      {
        variant: 'subtle',
        color: 'success',
        class: ['bg-success-tint text-success-light', 'dark:bg-success-tint dark:text-success']
      },
      {
        variant: 'subtle',
        color: 'warning',
        class: ['bg-warning-tint text-warning-light', 'dark:bg-warning-tint dark:text-warning']
      },
      {
        variant: 'subtle',
        color: 'danger',
        class: ['bg-error-tint text-error-light', 'dark:bg-error-tint dark:text-error']
      }
    ],
    defaultVariants: {
      color: 'primary',
      size: 'md',
      rounded: true,
      variant: 'solid',
      animation: 'default'
    }
  }
);

type BadgeVariantProps = VariantProps<typeof badgeVariants>;

export type BadgeProps = {
  /**
   * @control select
   * @default primary
   */
  color?: BadgeVariantProps['color'];
  /**
   * @control select
   * @default md
   */
  size?: BadgeVariantProps['size'];
  /**
   * @control boolean
   * @default true
   */
  rounded?: BadgeVariantProps['rounded'];
  /**
   * @control select
   * @default solid
   */
  variant?: BadgeVariantProps['variant'];
  /**
   * @control select
   * @default top-right
   */
  placement?: BadgeVariantProps['placement'];
  /**
   * @control select
   * @default default
   */
  animation?: BadgeVariantProps['animation'];
  className?: string;
  /**
   * Accessible label for icon-only, dot, or contextual badge content.
   * @control text
   */
  ariaLabel?: string;
  /**
   * Child element the badge should attach to. Without children, the badge renders inline.
   */
  children?: ReactNode;
  /**
   * ARIA role for the badge element.
   * @default status
   */
  role?: AriaRole;
  /**
   * Live region politeness for dynamic badge updates.
   * @control select
   * @default off
   */
  ariaLive?: 'off' | 'polite' | 'assertive';
  /**
   * @control text
   * @default ''
   */
  content?: string | number | ReactNode;
  /**
   * @control boolean
   * @default true
   */
  visibility?: boolean;
};
