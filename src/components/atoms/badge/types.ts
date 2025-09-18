import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const badgeVariants = cva(
  [
    'inline-flex items-center font-medium rounded-full',
    'transition-colors duration-200 ease-in-out',
    'whitespace-nowrap'
  ],
  {
    variants: {
      color: {
        primary: 'bg-primary text-text-dark dark:bg-accent dark:text-white',
        secondary: 'bg-gray-light-500 text-text-light',
        success: 'bg-green-500 text-text-light',
        warning: 'bg-yellow-500 text-text-light',
        danger: 'bg-red-500 text-text-dark'
      },
      size: {
        sm: 'text-[10px] min-w-[18px] h-[18px] px-[6px] py-[2px] mr-[5px] mt-[2px]',
        md: 'text-xs min-w-[24px] h-[24px] px-[8px] py-[4px]',
        lg: 'text-sm min-w-[28px] h-[28px] px-[10px] py-[5px]'
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md'
      },
      variant: {
        solid: '',
        flat: 'opacity-60 border border-grey-500',
        shadow: 'shadow-md shadow-gray-dark-600'
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
type BadgeVariants = 'solid' | 'flat' | 'shadow';

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
