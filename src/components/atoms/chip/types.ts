import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

export const chipVariants = cva(
  [
    'chip relative max-w-full min-w-0',
    'transition-all duration-200 ease-in-out',
    'flex items-center justify-center',
    'font-secondary-bold whitespace-nowrap leading-[1.2]',
    'disabled:pointer-events-none disabled:opacity-60',
    'focus-visible:outline-none',
    'data-[interactive=true]:focus-visible:ring-2 data-[interactive=true]:focus-visible:ring-[var(--color-accent)]',
    'dark:data-[interactive=true]:focus-visible:ring-[var(--color-text-dark)]',
    'data-[interactive=true]:focus-visible:ring-offset-2 data-[interactive=true]:focus-visible:ring-offset-[var(--surface-bg,white)]'
  ],
  {
    variants: {
      color: { primary: '', secondary: '', success: '', warning: '', danger: '' },

      // ⬇️ Añadimos la custom prop --chip-h para poder usarla en el wrapper del avatar
      size: {
        sm: [
          'h-4 px-1 gap-1 fs-small tablet:fs-small-tablet',
          '[--chip-h:theme(spacing.4)]' // 16px
        ].join(' '),
        md: [
          'h-6 px-2 gap-1 fs-base tablet:fs-base-tablet',
          '[--chip-h:theme(spacing.6)]' // 24px
        ].join(' '),
        lg: [
          'h-7 px-3 gap-2 fs-h6 tablet:fs-h6-tablet',
          '[--chip-h:theme(spacing.7)]' // 28px
        ].join(' ')
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

      startContent: { default: '', icon: 'mr-1', text: 'font-semibold' },
      endContent: { default: '', icon: 'ml-1', text: 'font-semibold' },

      animation: { default: '', pulse: 'animate-pulse', bounce: 'animate-bounce', ping: 'animate-badgePing' }
    },

    compoundVariants: [
      /* ----------------- PRIMARY ----------------- */
      {
        color: 'primary',
        variant: 'solid',
        class: [
          'bg-[var(--color-primary)] text-[var(--color-text-dark)]',
          'data-[interactive=true]:hover:bg-[var(--color-red-600)] dark:data-[interactive=true]:hover:bg-[var(--color-red-700)]',
          'data-[interactive=true]:active:translate-y-[0.5px]'
        ].join(' ')
      },
      {
        color: 'primary',
        variant: 'light',
        class:
          'text-[var(--color-primary)] data-[interactive=true]:hover:bg-[var(--color-white)] dark:data-[interactive=true]:hover:bg-[var(--color-red-200)]'
      },
      {
        color: 'primary',
        variant: 'flat',
        class:
          'bg-[var(--color-red-100)] text-[var(--color-primary)] data-[interactive=true]:hover:bg-[var(--color-red-200)]'
      },
      {
        color: 'primary',
        variant: 'faded',
        class: [
          'bg-[var(--color-gray-dark-200)] border-[var(--color-gray-light-300)]',
          'text-[var(--color-primary)] data-[interactive=true]:hover:bg-[var(--color-gray-light-200)]',
          'dark:bg-[var(--color-gray-dark-700)] dark:border-[var(--color-gray-dark-600)] dark:text-[var(--color-accent)]',
          'dark:data-[interactive=true]:hover:bg-[var(--color-gray-dark-600)]'
        ].join(' ')
      },
      {
        color: 'primary',
        variant: 'bordered',
        class:
          'text-[var(--color-primary)] border-[var(--color-primary)] data-[interactive=true]:hover:bg-[var(--color-red-100)] dark:data-[interactive=true]:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'primary',
        variant: 'shadow',
        class: [
          'bg-[var(--color-primary)] text-[var(--color-text-dark)] border border-transparent',
          'shadow-none',
          'drop-shadow-[0_10px_10px_color-mix(in_srgb,var(--color-primary)_60%,transparent)]',
          'dark:drop-shadow-[0_10px_10px_color-mix(in_srgb,var(--color-primary)_80%,transparent)]',
          'shadow-[0_1px_0_rgba(0,0,0,.04),0_4px_10px_color-mix(in_srgb,var(--chip-shadow)_34%,transparent),0_12px_22px_color-mix(in_srgb,var(--chip-shadow)_22%,transparent)]',
          'data-[interactive=true]:hover:shadow-[0_2px_0_rgba(0,0,0,.04),0_6px_14px_color-mix(in_srgb,var(--chip-shadow)_40%,transparent),0_16px_30px_color-mix(in_srgb,var(--chip-shadow)_28%,transparent)]',
          'dark:shadow-[0_1px_0_rgba(255,255,255,.05),0_4px_10px_color-mix(in_srgb,var(--chip-shadow)_26%,transparent),0_12px_24px_color-mix(in_srgb,var(--chip-shadow)_18%,transparent)]',
          'data-[interactive=true]:active:translate-y-[0.5px]'
        ].join(' ')
      },
      { color: 'primary', variant: 'dot', class: '[--chip-dot:var(--color-primary)]' },

      /* ----------------- SECONDARY ----------------- */
      {
        color: 'secondary',
        variant: 'solid',
        class: [
          'bg-[var(--color-gray-light-900)] text-[var(--color-text-dark)]',
          'data-[interactive=true]:hover:bg-[var(--color-gray-light-800)]',
          'dark:bg-[var(--color-gray-dark-200)] dark:text-[var(--color-text-light)] dark:data-[interactive=true]:hover:bg-[var(--color-gray-dark-300)]'
        ].join(' ')
      },
      {
        color: 'secondary',
        variant: 'light',
        class:
          'text-[var(--color-text-light)] data-[interactive=true]:hover:bg-[var(--color-gray-light-200)] dark:text-[var(--color-text-dark)] dark:data-[interactive=true]:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'secondary',
        variant: 'flat',
        class:
          'bg-[var(--color-gray-light-200)] text-[var(--color-text-light)] data-[interactive=true]:hover:bg-[var(--color-gray-light-300)] dark:bg-[var(--color-gray-dark-800)] dark:text-[var(--color-text-dark)] dark:data-[interactive=true]:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'secondary',
        variant: 'faded',
        class:
          'bg-[var(--color-gray-light-100)] text-[var(--color-text-light)] border-[var(--color-gray-light-300)] data-[interactive=true]:hover:bg-[var(--color-gray-light-200)] dark:bg-[var(--color-gray-dark-700)] dark:text-[var(--color-text-dark)] dark:border-[var(--color-gray-dark-600)]'
      },
      {
        color: 'secondary',
        variant: 'bordered',
        class:
          'text-[var(--color-text-light)] border-[var(--color-gray-light-400)] data-[interactive=true]:hover:bg-[var(--color-gray-light-200)] dark:text-[var(--color-text-dark)] dark:border-[var(--color-gray-dark-400)] dark:data-[interactive=true]:hover:bg-[var(--color-gray-dark-700)]'
      },
      {
        color: 'secondary',
        variant: 'shadow',
        class:
          'bg-[var(--color-gray-light-900)] text-[var(--color-text-dark)] shadow-[0_10px_22px_-6px_rgba(0,0,0,.35),0_6px_14px_rgba(0,0,0,.25)] data-[interactive=true]:hover:shadow-[0_14px_26px_-8px_rgba(0,0,0,.45),0_10px_20px_rgba(0,0,0,.30)]'
      },
      {
        color: 'secondary',
        variant: 'dot',
        class: '[--chip-dot:var(--color-gray-light-900)] dark:[--chip-dot:var(--color-gray-dark-200)]'
      }

      /* ----------------- SUCCESS / WARNING / DANGER ... (igual que tenías) */
      // ...
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

export type ChipProps = {
  children?: React.ReactNode;
  variant?: ChipVariant;
  color?: ChipColorVariants;
  size?: ChipSizeVariants;
  radius?: RadiusSize;
  animation?: Animation;
  avatar?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  as?: 'div' | 'button';
  onClick?: React.MouseEventHandler<HTMLElement>;
  isDisabled?: boolean;
  closable?: boolean;
  onClose?: () => void;
  selectable?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
  classNames?: Partial<Record<'base' | 'content' | 'dot' | 'avatar' | 'closeButton', string>>;
  ariaLabel?: string;
};
