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
        warning: 'bg-warning-light text-[#1a0a00] dark:bg-warning dark:text-black',
        danger: 'bg-error-light text-white dark:bg-error dark:text-white'
      },
      size: {
        sm: 'text-[10px] min-w-[18px] h-[18px] px-[6px] py-[2px] mr-[5px] mt-[2px]',
        md: 'text-xs min-w-[24px] h-[24px] px-[8px] py-[4px]',
        lg: 'text-sm min-w-[28px] h-[28px] px-[10px] py-[5px]'
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
      // flat: opaque background + colored border + colored text
      {
        variant: 'flat',
        color: 'primary',
        class: '!bg-[#ffe5eb]   border-brand-dark              text-brand-dark   dark:!bg-[#330011]'
      },
      {
        variant: 'flat',
        color: 'secondary',
        class: '!bg-[#f5f5f5] border-border-strong-dark        text-text-dark    dark:!bg-[#1a1a1a]'
      },
      {
        variant: 'flat',
        color: 'success',
        class: '!bg-[#dcfce7]  border-success                  text-success      dark:!bg-[#0a3d1f]'
      },
      {
        variant: 'flat',
        color: 'warning',
        class: '!bg-[#fef9c3]  border-warning                  text-warning      dark:!bg-[#3d3510]'
      },
      {
        variant: 'flat',
        color: 'danger',
        class: '!bg-[#fee2e2]  border-error                    text-error        dark:!bg-[#3d0f0f]'
      },
      // subtle: very soft background + no border + colored text
      {
        variant: 'subtle',
        color: 'primary',
        class: '!bg-[#fff0f3] text-brand-dark   dark:!bg-[#1a0008] dark:text-brand-light'
      },
      {
        variant: 'subtle',
        color: 'secondary',
        class: '!bg-[#fafafa] text-text-dark    dark:!bg-[#0a0a0a] dark:text-text-dark'
      },
      {
        variant: 'subtle',
        color: 'success',
        class: '!bg-[#f0fdf4] text-success      dark:!bg-[#051f0d] dark:text-success'
      },
      {
        variant: 'subtle',
        color: 'warning',
        class: '!bg-[#fefce8] text-warning      dark:!bg-[#1f1a08] dark:text-warning'
      },
      {
        variant: 'subtle',
        color: 'danger',
        class: '!bg-[#fef2f2] text-error        dark:!bg-[#1f0505] dark:text-error'
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
