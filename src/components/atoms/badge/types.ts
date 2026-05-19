import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

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
        'top-right': 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2',
        'bottom-right': 'absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2',
        'bottom-left': 'absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
        'top-left': 'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2'
      },
      animation: {
        default: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        ping: 'animate-badgePing'
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
      rounded: false,
      variant: 'solid',
      placement: 'top-right'
    }
  }
);
type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeRounded = true | false;
type BadgePlacement = 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
type BadgeAnimation = 'default' | 'pulse' | 'bounce' | 'ping';
type BadgeVariants = 'solid' | 'flat' | 'subtle';

export type BadgeProps = {
  className?: string;
  ariaLabel?: string;
  children?: ReactNode;
  role?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  /**
   * @control text
   * @default ''
   */
  content?: string | number | ReactNode;
  /**
   * @control select
   * @default primary
   */
  color?: BadgeColor;
  /**
   * @control select
   * @default top-right
   */
  placement?: BadgePlacement;
  /**
   * @control select
   * @default md
   */
  size?: BadgeSize;
  /**
   * @control boolean
   * @default true
   */
  rounded?: BadgeRounded;
  /**
   * @control select
   * @default solid
   */
  variant?: BadgeVariants;
  /**
   * @control boolean
   * @default true
   */
  visibility?: boolean;
  /**
   * @control select
   * @default default
   */
  animation?: BadgeAnimation;
};
