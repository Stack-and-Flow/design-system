import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

export const chipVariants = cva(
  [
    'chip relative max-w-full min-w-0',
    'transition-all duration-200 ease-in-out',
    'flex items-center justify-center gap-2',
    'font-secondary-bold whitespace-nowrap leading-[1.2]',
    'disabled:pointer-events-none disabled:opacity-60',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:focus-visible:ring-[var(--color-text-dark)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg,white)]'
  ],
  {
    variants: {
      color: { primary: '', secondary: '', success: '', warning: '', danger: '' },
      size: {
        sm: 'px-sm h-8 fs-small tablet:fs-small-tablet',
        md: 'px-md h-10 fs-base tablet:fs-base-tablet',
        lg: 'px-lg h-12 fs-h6 tablet:fs-h6-tablet'
      },
      radiusSize: { none: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' },
      variant: {
        solid: 'border border-transparent',
        light: 'bg-transparent border border-transparent',
        flat: 'border border-transparent',
        faded: 'border',
        bordered: 'bg-transparent border',
        shadow: 'border border-transparent',
        dot: 'bg-transparent border'
      },

      startContent: { default: '', icon: 'mr-2', text: 'font-semibold' },
      endContent: { default: '', icon: 'ml-2', text: 'font-semibold' },
      animation: { default: '', pulse: 'animate-pulse', bounce: 'animate-bounce', ping: 'animate-badgePing' }
    },

    compoundVariants: [
      /* ----------------- PRIMARY ----------------- */
      {
        color: 'primary',
        variant: 'solid',
        class:
          'bg-[var(--color-primary)] text-[var(--color-text-dark)] hover:bg-[var(--color-red-600)] dark:hover:bg-[var(--color-red-700)] active:translate-y-[0.5px]'
      },
      {
        color: 'primary',
        variant: 'light',
        class: 'text-[var(--color-primary)] hover:bg-[var(--color-white)] dark:hover:bg-[var(--color-red-200)]'
      },
      {
        color: 'primary',
        variant: 'flat',
        class: 'bg-[var(--color-red-100)] text-[var(--color-primary)] hover:bg-[var(--color-red-200)]'
      },
      {
        color: 'primary',
        variant: 'faded',
        class: [
          'bg-[var(--color-gray-dark-200)] border-[var(--color-gray-light-300)]',
          'text-[var(--color-primary)] hover:bg-[var(--color-gray-light-200)]',
          'dark:bg-[var(--color-gray-dark-700)] dark:border-[var(--color-gray-dark-600)] dark:text-[var(--color-accent)]',
          'dark:hover:bg-[var(--color-gray-dark-600)]'
        ].join(' ')
      },
      {
        color: 'primary',
        variant: 'bordered',
        class:
          'text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-[var(--color-red-100)] dark:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'primary',
        variant: 'shadow',
        class: [
          'bg-[var(--color-primary)] text-[var(--color-text-dark)] border border-transparent',
          'shadow-none',
          'drop-shadow-[0_16px_16px_color-mix(in_srgb,var(--color-primary)_70%,transparent)]',
          'dark:drop-shadow-[0_16px_16px_color-mix(in_srgb,var(--color-primary)_70%,transparent)]',
          'active:translate-y-[0.5px]',
          'hover:bg-[var(--color-red-600)] dark:hover:bg-[var(--color-red-700)]'
        ].join(' ')
      },
      {
        color: 'primary',
        variant: 'dot',
        class: '[--chip-dot:var(--color-primary)]'
      },

      /* ----------------- SECONDARY ----------------- */
      {
        color: 'secondary',
        variant: 'solid',
        class:
          'bg-[var(--color-gray-light-900)] text-[var(--color-text-dark)] hover:bg-[var(--color-gray-light-800)] dark:bg-[var(--color-gray-dark-200)] dark:text-[var(--color-text-light)] dark:hover:bg-[var(--color-gray-dark-300)]'
      },
      {
        color: 'secondary',
        variant: 'light',
        class:
          'text-[var(--color-text-light)] hover:bg-[var(--color-gray-light-200)] dark:text-[var(--color-text-dark)] dark:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'secondary',
        variant: 'flat',
        class:
          'bg-[var(--color-gray-light-200)] text-[var(--color-text-light)] hover:bg-[var(--color-gray-light-300)] dark:bg-[var(--color-gray-dark-800)] dark:text-[var(--color-text-dark)] dark:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'secondary',
        variant: 'faded',
        class:
          'bg-[var(--color-gray-light-100)] text-[var(--color-text-light)] border-[var(--color-gray-light-300)] hover:bg-[var(--color-gray-light-200)] dark:bg-[var(--color-gray-dark-700)] dark:text-[var(--color-text-dark)] dark:border-[var(--color-gray-dark-600)]'
      },
      {
        color: 'secondary',
        variant: 'bordered',
        class:
          'text-[var(--color-text-light)] border-[var(--color-gray-light-400)] hover:bg-[var(--color-gray-light-200)] dark:text-[var(--color-text-dark)] dark:border-[var(--color-gray-dark-400)] dark:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'secondary',
        variant: 'shadow',
        class:
          'bg-[var(--color-gray-light-900)] text-[var(--color-text-dark)] shadow-[0_10px_22px_-6px_rgba(0,0,0,.35),0_6px_14px_rgba(0,0,0,.25)] hover:shadow-[0_14px_26px_-8px_rgba(0,0,0,.45),0_10px_20px_rgba(0,0,0,.30)]'
      },
      {
        color: 'secondary',
        variant: 'dot',
        class: '[--chip-dot:var(--color-gray-light-900)] dark:[--chip-dot:var(--color-gray-dark-200)]'
      },

      /* ----------------- SUCCESS ----------------- */
      {
        color: 'success',
        variant: 'solid',
        class:
          'bg-[var(--color-green,#22c55e)] text-[var(--color-text-light)] hover:bg-[var(--color-green-dark,#16a34a)]'
      },
      {
        color: 'success',
        variant: 'light',
        class: 'text-[var(--color-green)] hover:bg-[color-mix(in_srgb,var(--color-green)_15%,transparent)]'
      },
      {
        color: 'success',
        variant: 'flat',
        class:
          'bg-[color-mix(in_srgb,var(--color-green)_15%,transparent)] text-[var(--color-green)] hover:bg-[color-mix(in_srgb,var(--color-green)_22%,transparent)]'
      },
      {
        color: 'success',
        variant: 'faded',
        class:
          'bg-[var(--color-gray-light-100)] text-[var(--color-green)] border-[var(--color-gray-light-300)] hover:bg-[var(--color-gray-light-200)] dark:bg-[var(--color-gray-dark-700)] dark:border-[var(--color-gray-dark-600)]'
      },
      {
        color: 'success',
        variant: 'bordered',
        class:
          'text-[var(--color-green)] border-[var(--color-green)] hover:bg-[color-mix(in_srgb,var(--color-green)_12%,transparent)]'
      },
      {
        color: 'success',
        variant: 'shadow',
        class:
          'bg-[var(--color-green,#22c55e)] text-[var(--color-text-light)] shadow-[0_10px_22px_-6px_rgba(34,197,94,.45),0_6px_14px_rgba(34,197,94,.30)] hover:shadow-[0_14px_26px_-8px_rgba(34,197,94,.55),0_10px_20px_rgba(34,197,94,.35)]'
      },
      { color: 'success', variant: 'dot', class: '[--chip-dot:var(--color-green)]' },

      /* ----------------- WARNING ----------------- */
      {
        color: 'warning',
        variant: 'solid',
        class: 'bg-[var(--color-yellow)] text-[var(--color-text-light)] hover:bg-[var(--color-yellow-dark)]'
      },
      {
        color: 'warning',
        variant: 'light',
        class: 'text-[var(--color-yellow)] hover:bg-[color-mix(in_srgb,var(--color-yellow)_18%,transparent)]'
      },
      {
        color: 'warning',
        variant: 'flat',
        class:
          'bg-[var(--color-yellow-light)] text-[var(--color-yellow-dark)] hover:bg-[color-mix(in_srgb,var(--color-yellow)_30%,transparent)]'
      },
      {
        color: 'warning',
        variant: 'faded',
        class:
          'bg-[var(--color-gray-light-100)] text-[var(--color-yellow-dark)] border-[var(--color-gray-light-300)] hover:bg-[var(--color-gray-light-200)] dark:bg-[var(--color-gray-dark-700)] dark:border-[var(--color-gray-dark-600)]'
      },
      {
        color: 'warning',
        variant: 'bordered',
        class:
          'text-[var(--color-yellow-dark)] border-[var(--color-yellow)] hover:bg-[color-mix(in_srgb,var(--color-yellow)_15%,transparent)]'
      },
      {
        color: 'warning',
        variant: 'shadow',
        class:
          'bg-[var(--color-yellow)] text-black shadow-[0_10px_22px_-6px_rgba(234,179,8,.45),0_6px_14px_rgba(234,179,8,.30)] hover:shadow-[0_14px_26px_-8px_rgba(234,179,8,.55),0_10px_20px_rgba(234,179,8,.35)]'
      },
      { color: 'warning', variant: 'dot', class: '[--chip-dot:var(--color-yellow)]' },

      /* ----------------- DANGER ----------------- */
      {
        color: 'danger',
        variant: 'solid',
        class: 'bg-[var(--color-accent)] text-[var(--color-text-dark)] hover:bg-[var(--color-red-700)]'
      },
      { color: 'danger', variant: 'light', class: 'text-[var(--color-accent)] hover:bg-[var(--color-red-100)]' },
      {
        color: 'danger',
        variant: 'flat',
        class: 'bg-[var(--color-accent)] text-[var(--color-red-600)] hover:bg-[var(--color-red-200)]'
      },
      {
        color: 'danger',
        variant: 'faded',
        class:
          'bg-[var(--color-accent)] text-[var(--color-red-600)] border-[var(--color-gray-light-300)] hover:bg-[var(--color-gray-light-200)] dark:bg-[var(--color-gray-dark-700)] dark:border-[var(--color-gray-dark-600)]'
      },
      {
        color: 'danger',
        variant: 'bordered',
        class: 'text-[var(--color-accent)] border-[var(--color-red-600)] hover:bg-[var(--color-red-100)]'
      },
      {
        color: 'danger',
        variant: 'shadow',
        class:
          'bg-[var(--color-accent)] text-[var(--color-text-dark)] shadow-[0_10px_22px_-6px_rgba(220,38,38,.45),0_6px_14px_rgba(220,38,38,.30)] hover:shadow-[0_14px_26px_-8px_rgba(220,38,38,.55),0_10px_20px_rgba(220,38,38,.35)]'
      },
      { color: 'danger', variant: 'dot', class: '[--chip-dot:var(--color-accent)]' },

      // ---------- DOT: defaults ----------
      {
        variant: 'dot',
        class: [
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'border-[var(--color-gray-light-600,#9CA3AF)]',
          'dark:border-[var(--color-gray-dark-600,#4B5563)]',
          '[--chip-dot:var(--color-primary)]'
        ].join(' ')
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

type RadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'full';
type Animation = 'default' | 'pulse' | 'bounce' | 'ping';

type ChipVariant = VariantProps<typeof chipVariants>['variant'];
type ChipColorVariants = VariantProps<typeof chipVariants>['color'];
type ChipSizeVariants = VariantProps<typeof chipVariants>['size'];

export type ChipProps = {
  children?: React.ReactNode;
  /** @control text
   * @default primary
   */
  variant?: ChipVariant;
  /**
   * @control text
   * @default primary
   */
  color?: ChipColorVariants;
  /**
   * @control text
   * @default md
   */
  size?: ChipSizeVariants;
  /**
   * @control text
   * @default full
   */
  radius?: RadiusSize;
  /**
   * @control text
   * @default default
   */
  animation?: Animation;
  /** @control text
   * @default default
   */
  avatar?: React.ReactNode;
  /**
   * @control text
   * @default default
   */
  startContent?: React.ReactNode;
  /**
   * @control text
   * @default default
   */
  endContent?: React.ReactNode;
  /**
   * @control text
   * @default div
   */
  as?: 'div' | 'button';
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * @control text
   * @default false
   */
  isDisabled?: boolean;
  /**
   * @control boolean
   * @default false
   */
  closable?: boolean;
  onClose?: () => void;
  /**
   * @control text
   * @default false
   */
  selectable?: boolean;
  /**
   * @control text
   * @default false
   */
  selected?: boolean;
  /**
   * @control boolean
   * @default false
   */
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /**
   * @control text
   */
  className?: string;
  /**
   * @control text
   */
  classNames?: Partial<Record<'base' | 'content' | 'dot' | 'avatar' | 'closeButton', string>>;
  ariaLabel?: string;
};
