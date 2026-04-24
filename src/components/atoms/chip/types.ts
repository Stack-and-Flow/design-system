import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

export const chipVariants = cva(
  [
    'chip relative max-w-full min-w-0',
    'transition-[transform,box-shadow] duration-200 ease-in-out',
    'flex items-center justify-center',
    'font-secondary-bold whitespace-nowrap leading-[1.2]',
    'disabled:pointer-events-none disabled:opacity-60',
    'data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed',
    'focus-visible:outline-none',
    'data-[interactive=true]:focus-visible:ring-2 data-[interactive=true]:focus-visible:ring-[var(--color-accent)]',
    'dark:data-[interactive=true]:focus-visible:ring-[var(--color-text-dark)]',
    'data-[interactive=true]:focus-visible:ring-offset-2 data-[interactive=true]:focus-visible:ring-offset-[var(--surface-bg,white)]',
    'data-[interactive=true]:active:translate-y-[1px] data-[interactive=true]:active:scale-[0.985]'
  ],
  {
    variants: {
      color: { primary: '', secondary: '', success: '', warning: '', danger: '' },

      // ⬇️ Añadimos la custom prop --chip-h para poder usarla en el wrapper del avatar
      size: {
        sm: [
          'h-5 px-1 gap-0.5 fs-small tablet:fs-small-tablet',
          '[--chip-h:theme(spacing.5)]' // 20px
        ].join(' '),
        md: [
          'h-6 px-1.5 gap-0.5 fs-base tablet:fs-base-tablet',
          '[--chip-h:theme(spacing.6)]' // 24px
        ].join(' '),
        lg: [
          'h-7 px-2 gap-1 fs-h6 tablet:fs-h6-tablet',
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
          'text-[var(--color-brand-light-darkest)] data-[interactive=true]:hover:bg-[var(--color-red-100)] dark:text-[var(--color-brand-dark)] dark:data-[interactive=true]:hover:bg-[#1a0008]'
      },
      {
        color: 'primary',
        variant: 'flat',
        class:
          'bg-[var(--color-red-100)] text-[var(--color-brand-light-darkest)] data-[interactive=true]:hover:bg-[var(--color-red-200)] dark:bg-[#2a000d] dark:text-[var(--color-brand-dark)] dark:data-[interactive=true]:hover:bg-[#330011]'
      },
      {
        color: 'primary',
        variant: 'faded',
        class: [
          'bg-[var(--color-red-100)] border-[var(--color-red-400)]',
          'text-[var(--color-brand-light-darkest)] data-[interactive=true]:hover:bg-[var(--color-red-200)]',
          'dark:bg-[#1a0008] dark:border-[var(--color-brand-dark)] dark:text-[var(--color-brand-dark)]',
          'dark:data-[interactive=true]:hover:bg-[#24000b]'
        ].join(' ')
      },
      {
        color: 'primary',
        variant: 'bordered',
        class:
          'text-[var(--color-brand-light-darkest)] border-[var(--color-brand-light-darkest)] data-[interactive=true]:hover:bg-[var(--color-red-100)] dark:text-[var(--color-brand-dark)] dark:border-[var(--color-brand-dark)] dark:data-[interactive=true]:hover:bg-[#1a0008]'
      },
      {
        color: 'primary',
        variant: 'shadow',
        class: [
          'bg-[var(--color-primary)] text-[var(--color-text-dark)] border border-transparent [--chip-shadow:var(--color-primary)]',
          'shadow-[0_1px_2px_rgba(0,0,0,.12),0_3px_8px_color-mix(in_srgb,var(--chip-shadow)_26%,transparent)]',
          'data-[interactive=true]:hover:shadow-[0_2px_4px_rgba(0,0,0,.14),0_5px_12px_color-mix(in_srgb,var(--chip-shadow)_34%,transparent)]',
          'dark:shadow-[0_1px_2px_rgba(0,0,0,.28),0_3px_9px_color-mix(in_srgb,var(--chip-shadow)_22%,transparent)]',
          'data-[interactive=true]:active:translate-y-[0.5px]'
        ].join(' ')
      },
      {
        color: 'primary',
        variant: 'dot',
        class:
          'text-[var(--color-brand-light-darkest)] border-[var(--color-red-400)] [--chip-dot:var(--color-primary)] dark:text-[var(--color-brand-dark)] dark:border-[var(--color-brand-dark)]'
      },

      /* ----------------- SECONDARY ----------------- */
      {
        color: 'secondary',
        variant: 'solid',
        class: [
          'bg-[var(--color-surface-raised-light)] text-[var(--color-text-light)]',
          'data-[interactive=true]:hover:bg-[var(--color-surface-light)]',
          'dark:bg-[var(--color-surface-raised-dark)] dark:text-[var(--color-text-dark)] dark:border-[var(--color-border-strong-dark)] dark:data-[interactive=true]:hover:bg-[var(--color-surface-dark)]'
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
        class: [
          'bg-[var(--color-surface-raised-light)] text-[var(--color-text-light)] [--chip-shadow:var(--color-surface-raised-light)]',
          'dark:bg-[var(--color-surface-raised-dark)] dark:text-[var(--color-text-dark)] dark:border-[var(--color-border-strong-dark)] dark:[--chip-shadow:var(--color-surface-raised-dark)]',
          'shadow-[0_1px_2px_rgba(0,0,0,.12),0_3px_8px_color-mix(in_srgb,var(--chip-shadow)_24%,transparent)]',
          'data-[interactive=true]:hover:shadow-[0_2px_4px_rgba(0,0,0,.14),0_5px_12px_color-mix(in_srgb,var(--chip-shadow)_32%,transparent)]'
        ].join(' ')
      },
      {
        color: 'secondary',
        variant: 'dot',
        class:
          'text-[var(--color-text-light)] border-[var(--color-gray-light-300)] [--chip-dot:var(--color-text-light)] dark:text-[var(--color-text-dark)] dark:border-[var(--color-border-strong-dark)] dark:[--chip-dot:var(--color-text-dark)]'
      },

      /* ----------------- SUCCESS ----------------- */
      {
        color: 'success',
        variant: 'solid',
        class:
          'bg-[var(--color-green)] text-[var(--color-text-light)] data-[interactive=true]:hover:bg-[var(--color-green-dark)]'
      },
      {
        color: 'success',
        variant: 'light',
        class:
          'text-[var(--color-green-dark)] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_14%,transparent)] dark:text-[var(--color-green-light)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_22%,transparent)]'
      },
      {
        color: 'success',
        variant: 'flat',
        class:
          'bg-[color-mix(in_srgb,var(--color-green)_18%,var(--color-gray-light-100))] text-[var(--color-green-dark)] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_26%,var(--color-gray-light-100))] dark:bg-[color-mix(in_srgb,var(--color-green)_22%,transparent)] dark:text-[var(--color-green-light)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_30%,transparent)]'
      },
      {
        color: 'success',
        variant: 'faded',
        class:
          'bg-[color-mix(in_srgb,var(--color-green)_10%,var(--color-gray-light-100))] text-[var(--color-green-dark)] border-[color-mix(in_srgb,var(--color-green)_32%,var(--color-gray-light-100))] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_16%,var(--color-gray-light-100))] dark:bg-[color-mix(in_srgb,var(--color-green)_16%,transparent)] dark:text-[var(--color-green-light)] dark:border-[color-mix(in_srgb,var(--color-green)_38%,transparent)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_24%,transparent)]'
      },
      {
        color: 'success',
        variant: 'bordered',
        class:
          'text-[var(--color-green-dark)] border-[color-mix(in_srgb,var(--color-green)_70%,var(--color-gray-light-100))] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_12%,transparent)] dark:text-[var(--color-green-light)] dark:border-[color-mix(in_srgb,var(--color-green)_55%,transparent)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-green)_20%,transparent)]'
      },
      {
        color: 'success',
        variant: 'shadow',
        class: [
          'bg-[var(--color-green)] text-[var(--color-text-light)] [--chip-shadow:var(--color-green)]',
          'shadow-[0_1px_2px_rgba(0,0,0,.12),0_3px_8px_color-mix(in_srgb,var(--chip-shadow)_24%,transparent)]',
          'data-[interactive=true]:hover:shadow-[0_2px_4px_rgba(0,0,0,.14),0_5px_12px_color-mix(in_srgb,var(--chip-shadow)_32%,transparent)]'
        ].join(' ')
      },
      {
        color: 'success',
        variant: 'dot',
        class:
          'text-[var(--color-green-dark)] border-[color-mix(in_srgb,var(--color-green)_36%,var(--color-gray-light-100))] [--chip-dot:var(--color-green)] dark:text-[var(--color-green-light)] dark:border-[color-mix(in_srgb,var(--color-green)_44%,transparent)]'
      },

      /* ----------------- WARNING ----------------- */
      {
        color: 'warning',
        variant: 'solid',
        class:
          'bg-[var(--color-yellow)] text-[var(--color-text-light)] data-[interactive=true]:hover:bg-[var(--color-yellow-dark)] dark:text-[var(--color-text-light)]'
      },
      {
        color: 'warning',
        variant: 'light',
        class:
          'text-[var(--color-yellow-dark)] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_16%,transparent)] dark:text-[var(--color-yellow-light)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_22%,transparent)]'
      },
      {
        color: 'warning',
        variant: 'flat',
        class:
          'bg-[color-mix(in_srgb,var(--color-yellow)_22%,var(--color-gray-light-100))] text-[var(--color-text-light)] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_30%,var(--color-gray-light-100))] dark:bg-[color-mix(in_srgb,var(--color-yellow)_20%,transparent)] dark:text-[var(--color-yellow-light)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_28%,transparent)]'
      },
      {
        color: 'warning',
        variant: 'faded',
        class:
          'bg-[color-mix(in_srgb,var(--color-yellow)_12%,var(--color-gray-light-100))] text-[var(--color-text-light)] border-[color-mix(in_srgb,var(--color-yellow)_36%,var(--color-gray-light-100))] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_18%,var(--color-gray-light-100))] dark:bg-[color-mix(in_srgb,var(--color-yellow)_14%,transparent)] dark:text-[var(--color-yellow-light)] dark:border-[color-mix(in_srgb,var(--color-yellow)_40%,transparent)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_22%,transparent)]'
      },
      {
        color: 'warning',
        variant: 'bordered',
        class:
          'text-[var(--color-text-light)] border-[color-mix(in_srgb,var(--color-yellow)_78%,var(--color-gray-light-100))] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_14%,transparent)] dark:text-[var(--color-yellow-light)] dark:border-[color-mix(in_srgb,var(--color-yellow)_58%,transparent)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-yellow)_20%,transparent)]'
      },
      {
        color: 'warning',
        variant: 'shadow',
        class: [
          'bg-[var(--color-yellow)] text-[var(--color-text-light)] [--chip-shadow:var(--color-yellow)]',
          'shadow-[0_1px_2px_rgba(0,0,0,.12),0_3px_8px_color-mix(in_srgb,var(--chip-shadow)_24%,transparent)]',
          'data-[interactive=true]:hover:shadow-[0_2px_4px_rgba(0,0,0,.14),0_5px_12px_color-mix(in_srgb,var(--chip-shadow)_32%,transparent)]'
        ].join(' ')
      },
      {
        color: 'warning',
        variant: 'dot',
        class:
          'text-[#1a0a00] border-[color-mix(in_srgb,var(--color-yellow)_52%,var(--color-gray-light-100))] [--chip-dot:var(--color-yellow)] dark:text-[var(--color-yellow-light)] dark:border-[color-mix(in_srgb,var(--color-yellow)_52%,transparent)]'
      },

      /* ----------------- DANGER ----------------- */
      {
        color: 'danger',
        variant: 'solid',
        class:
          'bg-[var(--color-red-600)] text-[var(--color-text-dark)] data-[interactive=true]:hover:bg-[var(--color-red-700)]'
      },
      {
        color: 'danger',
        variant: 'light',
        class:
          'text-[var(--color-red-700)] data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-red-600)_14%,transparent)] dark:text-[var(--color-red-300)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-red-600)_24%,transparent)]'
      },
      {
        color: 'danger',
        variant: 'flat',
        class:
          'bg-[var(--color-red-100)] text-[var(--color-red-700)] data-[interactive=true]:hover:bg-[var(--color-red-200)] dark:bg-[color-mix(in_srgb,var(--color-red-700)_34%,transparent)] dark:text-[var(--color-red-200)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-red-700)_46%,transparent)]'
      },
      {
        color: 'danger',
        variant: 'faded',
        class:
          'bg-[var(--color-red-100)] text-[var(--color-text-light)] border-[var(--color-red-400)] data-[interactive=true]:hover:bg-[var(--color-red-200)] dark:bg-[color-mix(in_srgb,var(--color-red-700)_24%,transparent)] dark:text-[var(--color-red-200)] dark:border-[color-mix(in_srgb,var(--color-red-500)_46%,transparent)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-red-700)_34%,transparent)]'
      },
      {
        color: 'danger',
        variant: 'bordered',
        class:
          'text-[var(--color-red-700)] border-[var(--color-red-500)] data-[interactive=true]:hover:bg-[var(--color-red-100)] dark:text-[var(--color-red-300)] dark:border-[var(--color-red-400)] dark:data-[interactive=true]:hover:bg-[color-mix(in_srgb,var(--color-red-700)_28%,transparent)]'
      },
      {
        color: 'danger',
        variant: 'shadow',
        class: [
          'bg-[var(--color-red-600)] text-[var(--color-text-dark)] [--chip-shadow:var(--color-red-600)]',
          'shadow-[0_1px_2px_rgba(0,0,0,.12),0_3px_8px_color-mix(in_srgb,var(--chip-shadow)_28%,transparent)]',
          'data-[interactive=true]:hover:shadow-[0_2px_4px_rgba(0,0,0,.14),0_5px_12px_color-mix(in_srgb,var(--chip-shadow)_36%,transparent)]'
        ].join(' ')
      },
      {
        color: 'danger',
        variant: 'dot',
        class:
          'text-[var(--color-red-700)] border-[var(--color-red-300)] [--chip-dot:var(--color-red-600)] dark:text-[var(--color-red-300)] dark:border-[var(--color-red-400)]'
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
  children?: React.ReactNode;
  variant?: ChipVariant;
  color?: ChipColorVariants;
  size?: ChipSizeVariants;
  radius?: RadiusSize;
  animation?: Animation;
  avatar?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  /**
   * Preferred root element for the chip.
   *
   * Note: when `closable` and interactive are combined, the chip is
   * rendered as a split-actions group (`div[role="group"]` with
   * two sibling buttons) to avoid nested interactive controls.
   */
  as?: 'div' | 'button';
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  /** @deprecated Use `disabled` instead. */
  isDisabled?: boolean;
  closable?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLElement>) => void;
  selectable?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
  classNames?: Partial<Record<'base' | 'content' | 'dot' | 'avatar' | 'closeButton' | 'actionButton', string>>;
  ariaLabel?: string;
};

export type ChipProps = ChipCustomProps &
  Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'color' | 'onClick' | 'onClose'> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color' | 'onClick' | 'onClose' | 'disabled'>;
