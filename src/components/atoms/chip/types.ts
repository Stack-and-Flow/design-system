import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

export const chipVariants = cva(
  [
    'chip relative inline-flex max-w-full min-w-0 items-center justify-center overflow-visible',
    'font-secondary-bold whitespace-nowrap leading-none tracking-ui',
    'border transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-in-out',
    'disabled:pointer-events-none disabled:opacity-40',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40',
    'focus-visible:outline-none',
    'data-[interactive=true]:focus-visible:shadow-glow-focus-light dark:data-[interactive=true]:focus-visible:shadow-glow-focus-dark',
    'motion-safe:data-[interactive=true]:active:translate-y-px motion-safe:data-[interactive=true]:active:scale-[0.98]'
  ],
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
        info: ''
      },

      size: {
        sm: 'h-6 gap-1 px-2 text-xs',
        md: 'h-7 gap-1 px-2.5 text-sm',
        lg: 'h-8 gap-1.5 px-3 text-sm'
      },

      radiusSize: { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' },

      variant: {
        solid: 'border-transparent shadow-none',
        flat: 'border-transparent',
        bordered: 'bg-transparent',
        light: 'border-transparent bg-transparent',
        faded: '',
        dot: ''
      },

      startContent: { default: '', icon: 'mr-0.5', text: 'font-semibold' },
      endContent: { default: '', icon: 'ml-0.5', text: 'font-semibold' },

      animation: {
        default: '',
        pulse: 'motion-safe:animate-pulse motion-reduce:animate-none',
        bounce: 'motion-safe:animate-bounce motion-reduce:animate-none',
        ping: 'motion-safe:animate-badgePing motion-reduce:animate-none'
      }
    },

    compoundVariants: [
      {
        color: 'primary',
        variant: 'solid',
        class:
          'bg-brand-light text-white dark:bg-brand-dark dark:text-white data-[interactive=true]:hover:bg-brand-light-dark dark:data-[interactive=true]:hover:bg-brand-dark-light'
      },
      {
        color: 'primary',
        variant: 'flat',
        class:
          'bg-red-surface-light text-text-light dark:bg-red-surface-dark dark:text-text-dark data-[interactive=true]:hover:bg-red-tint-low'
      },
      {
        color: 'primary',
        variant: ['bordered', 'faded', 'dot'],
        class:
          'border-red-tint-border text-brand-light dark:text-brand-dark-light data-[interactive=true]:hover:border-brand-light dark:data-[interactive=true]:hover:border-brand-dark-light'
      },
      {
        color: 'primary',
        variant: ['faded', 'dot'],
        class: 'bg-red-tint-subtle data-[interactive=true]:hover:bg-red-tint-low'
      },
      {
        color: 'primary',
        variant: 'light',
        class: 'text-brand-light dark:text-brand-dark-light data-[interactive=true]:hover:bg-red-tint-subtle'
      },

      {
        color: 'secondary',
        variant: 'solid',
        class:
          'bg-surface-raised-light text-text-light dark:bg-surface-raised-dark dark:text-text-dark data-[interactive=true]:hover:bg-surface-light dark:data-[interactive=true]:hover:bg-surface-dark'
      },
      {
        color: 'secondary',
        variant: 'flat',
        class:
          'bg-surface-light text-text-secondary-light dark:bg-surface-dark dark:text-text-secondary-dark data-[interactive=true]:hover:bg-surface-raised-light dark:data-[interactive=true]:hover:bg-surface-raised-dark'
      },
      {
        color: 'secondary',
        variant: ['bordered', 'faded', 'dot'],
        class:
          'border-border-strong-light text-text-secondary-light dark:border-border-strong-dark dark:text-text-secondary-dark data-[interactive=true]:hover:border-text-secondary-light dark:data-[interactive=true]:hover:border-text-secondary-dark'
      },
      {
        color: 'secondary',
        variant: ['faded', 'dot'],
        class:
          'bg-surface-light dark:bg-surface-dark data-[interactive=true]:hover:bg-surface-raised-light dark:data-[interactive=true]:hover:bg-surface-raised-dark'
      },
      {
        color: 'secondary',
        variant: 'light',
        class:
          'text-text-secondary-light dark:text-text-secondary-dark data-[interactive=true]:hover:bg-surface-light dark:data-[interactive=true]:hover:bg-surface-dark'
      },

      {
        color: 'success',
        variant: 'solid',
        class:
          'bg-success-light text-text-light dark:bg-success dark:text-text-light data-[interactive=true]:hover:bg-success-dark dark:data-[interactive=true]:hover:bg-green-light'
      },
      {
        color: 'success',
        variant: 'flat',
        class:
          'bg-success-surface-light text-text-light dark:bg-success-surface-dark dark:text-text-dark data-[interactive=true]:hover:bg-success-tint'
      },
      {
        color: 'success',
        variant: ['bordered', 'faded', 'dot'],
        class:
          'border-success-light text-text-light dark:border-success dark:text-success data-[interactive=true]:hover:border-success-dark dark:data-[interactive=true]:hover:border-green-light'
      },
      {
        color: 'success',
        variant: ['faded', 'dot'],
        class: 'bg-success-tint data-[interactive=true]:hover:bg-success-tint'
      },
      {
        color: 'success',
        variant: 'light',
        class: 'text-text-light dark:text-success data-[interactive=true]:hover:bg-success-tint'
      },

      {
        color: 'warning',
        variant: 'solid',
        class:
          'bg-warning-light text-text-light dark:bg-warning dark:text-text-light data-[interactive=true]:hover:bg-warning-dark dark:data-[interactive=true]:hover:bg-yellow-light'
      },
      {
        color: 'warning',
        variant: 'flat',
        class:
          'bg-warning-surface-light text-text-light dark:bg-warning-surface-dark dark:text-text-dark data-[interactive=true]:hover:bg-warning-tint'
      },
      {
        color: 'warning',
        variant: ['bordered', 'faded', 'dot'],
        class:
          'border-warning-light text-text-light dark:border-warning dark:text-warning data-[interactive=true]:hover:border-warning-dark dark:data-[interactive=true]:hover:border-yellow-light'
      },
      {
        color: 'warning',
        variant: ['faded', 'dot'],
        class: 'bg-warning-tint data-[interactive=true]:hover:bg-warning-tint'
      },
      {
        color: 'warning',
        variant: 'light',
        class: 'text-text-light dark:text-warning data-[interactive=true]:hover:bg-warning-tint'
      },

      {
        color: 'danger',
        variant: 'solid',
        class:
          'bg-error-light text-white dark:bg-error dark:text-white data-[interactive=true]:hover:bg-red-700 dark:data-[interactive=true]:hover:bg-red-400'
      },
      {
        color: 'danger',
        variant: 'flat',
        class:
          'bg-error-surface-light text-text-light dark:bg-error-surface-dark dark:text-text-dark data-[interactive=true]:hover:bg-error-tint'
      },
      {
        color: 'danger',
        variant: ['bordered', 'faded', 'dot'],
        class:
          'border-error-light text-red-800 dark:border-error dark:text-error data-[interactive=true]:hover:border-red-700 dark:data-[interactive=true]:hover:border-red-400'
      },
      {
        color: 'danger',
        variant: ['faded', 'dot'],
        class: 'bg-error-tint data-[interactive=true]:hover:bg-error-tint'
      },
      {
        color: 'danger',
        variant: 'light',
        class: 'text-red-800 dark:text-error data-[interactive=true]:hover:bg-error-tint'
      },

      {
        color: 'info',
        variant: 'solid',
        class:
          'bg-info-light text-white dark:bg-info dark:text-text-light data-[interactive=true]:hover:bg-blue dark:data-[interactive=true]:hover:bg-blue-light'
      },
      {
        color: 'info',
        variant: 'flat',
        class:
          'bg-info-surface-light text-text-light dark:bg-info-surface-dark dark:text-text-dark data-[interactive=true]:hover:bg-info-tint'
      },
      {
        color: 'info',
        variant: ['bordered', 'faded', 'dot'],
        class:
          'border-info-light text-info-light dark:border-info dark:text-info data-[interactive=true]:hover:border-blue dark:data-[interactive=true]:hover:border-blue-light'
      },
      {
        color: 'info',
        variant: ['faded', 'dot'],
        class: 'bg-info-tint data-[interactive=true]:hover:bg-info-tint'
      },
      {
        color: 'info',
        variant: 'light',
        class: 'text-info-light dark:text-info data-[interactive=true]:hover:bg-info-tint'
      }
    ],

    defaultVariants: {
      color: 'primary',
      size: 'md',
      radiusSize: 'full',
      variant: 'solid',
      startContent: 'default',
      endContent: 'default',
      animation: 'default'
    }
  }
);

export type RadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type Animation = 'default' | 'pulse' | 'bounce' | 'ping';

export type ChipVariant = VariantProps<typeof chipVariants>['variant'];
export type ChipColorVariants = VariantProps<typeof chipVariants>['color'];
export type ChipSizeVariants = VariantProps<typeof chipVariants>['size'];

type ChipCustomProps = {
  /** @control text */
  children?: React.ReactNode;
  /**
   * @control select
   * @default solid
   */
  variant?: ChipVariant;
  /**
   * @control select
   * @default primary
   */
  color?: ChipColorVariants;
  /**
   * @control select
   * @default md
   */
  size?: ChipSizeVariants;
  /**
   * @control select
   * @default full
   */
  radius?: RadiusSize;
  /**
   * @control select
   * @default default
   */
  animation?: Animation;
  /** @control object */
  avatar?: React.ReactNode;
  /** @control object */
  startContent?: React.ReactNode;
  /** @control object */
  endContent?: React.ReactNode;
  /**
   * Preferred root element for the chip.
   *
   * Note: when `closable` and interactive are combined, the chip is
   * rendered as a split-actions group (`div[role="group"]` with
   * two sibling buttons) to avoid nested interactive controls.
   *
   * @control select
   */
  as?: 'div' | 'button';
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @deprecated Use `disabled` instead.
   * @control boolean
   * @default false
   */
  isDisabled?: boolean;
  /**
   * @control boolean
   * @default false
   */
  closable?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLElement>) => void;
  /**
   * @control boolean
   * @default false
   */
  selectable?: boolean;
  /** @control boolean */
  selected?: boolean;
  /**
   * @control boolean
   * @default false
   */
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** @control text */
  className?: string;
  /** @control object */
  classNames?: Partial<Record<'base' | 'content' | 'dot' | 'avatar' | 'closeButton' | 'actionButton', string>>;
  /** @control text */
  ariaLabel?: string;
};

export type ChipProps = ChipCustomProps &
  Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'color' | 'onClick' | 'onClose'> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color' | 'onClick' | 'onClose' | 'disabled'>;
