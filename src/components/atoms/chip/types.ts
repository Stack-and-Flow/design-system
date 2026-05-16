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
        primary: [
          '[--chip-tone:var(--color-primary)] dark:[--chip-tone:var(--color-brand-dark)]',
          '[--chip-fg:var(--color-brand-light-darkest)] dark:[--chip-fg:var(--color-brand-dark)]',
          '[--chip-solid-bg:var(--color-primary)] dark:[--chip-solid-bg:var(--color-brand-dark)]',
          '[--chip-solid-fg:var(--color-text-dark)]',
          '[--chip-soft-bg:color-mix(in_srgb,var(--chip-tone)_10%,transparent)]',
          '[--chip-soft-bg-hover:color-mix(in_srgb,var(--chip-tone)_16%,transparent)]',
          '[--chip-soft-border:color-mix(in_srgb,var(--chip-tone)_28%,transparent)]',
          '[--chip-solid-hover:var(--color-primary-hover)] dark:[--chip-solid-hover:var(--color-brand-dark-light)]',
          '[--chip-dot:var(--chip-tone)]'
        ].join(' '),
        secondary: [
          '[--chip-tone:var(--color-border-strong-light)] dark:[--chip-tone:var(--color-border-strong-dark)]',
          '[--chip-fg:var(--color-text-secondary-light)] dark:[--chip-fg:var(--color-text-secondary-dark)]',
          '[--chip-solid-bg:var(--color-surface-raised-light)] dark:[--chip-solid-bg:var(--color-surface-raised-dark)]',
          '[--chip-solid-fg:var(--color-text-light)] dark:[--chip-solid-fg:var(--color-text-dark)]',
          '[--chip-soft-bg:color-mix(in_srgb,var(--chip-tone)_12%,transparent)]',
          '[--chip-soft-bg-hover:color-mix(in_srgb,var(--chip-tone)_18%,transparent)]',
          '[--chip-soft-border:color-mix(in_srgb,var(--chip-tone)_48%,transparent)]',
          '[--chip-solid-hover:var(--color-surface-light)] dark:[--chip-solid-hover:var(--color-surface-dark)]',
          '[--chip-dot:var(--color-text-secondary-light)] dark:[--chip-dot:var(--color-text-secondary-dark)]'
        ].join(' '),
        success: [
          '[--chip-tone:var(--color-green)]',
          '[--chip-fg:var(--color-green-dark)] dark:[--chip-fg:var(--color-green-light)]',
          '[--chip-solid-bg:var(--color-green)]',
          '[--chip-solid-fg:var(--color-text-light)] dark:[--chip-solid-fg:var(--color-background-dark)]',
          '[--chip-soft-bg:color-mix(in_srgb,var(--chip-tone)_11%,transparent)]',
          '[--chip-soft-bg-hover:color-mix(in_srgb,var(--chip-tone)_18%,transparent)]',
          '[--chip-soft-border:color-mix(in_srgb,var(--chip-tone)_36%,transparent)]',
          '[--chip-solid-hover:var(--color-green-dark)] dark:[--chip-solid-hover:var(--color-green-light)]',
          '[--chip-dot:var(--chip-tone)]'
        ].join(' '),
        warning: [
          '[--chip-tone:var(--color-yellow)]',
          '[--chip-fg:var(--color-yellow-dark)] dark:[--chip-fg:var(--color-yellow-light)]',
          '[--chip-solid-bg:var(--color-yellow)]',
          '[--chip-solid-fg:#1a0a00]',
          '[--chip-soft-bg:color-mix(in_srgb,var(--chip-tone)_13%,transparent)]',
          '[--chip-soft-bg-hover:color-mix(in_srgb,var(--chip-tone)_20%,transparent)]',
          '[--chip-soft-border:color-mix(in_srgb,var(--chip-tone)_42%,transparent)]',
          '[--chip-solid-hover:var(--color-yellow-light)]',
          '[--chip-dot:var(--chip-tone)]'
        ].join(' '),
        danger: [
          '[--chip-tone:var(--color-red-600)] dark:[--chip-tone:var(--color-red-500)]',
          '[--chip-fg:var(--color-red-700)] dark:[--chip-fg:var(--color-red-300)]',
          '[--chip-solid-bg:var(--color-red-600)] dark:[--chip-solid-bg:var(--color-red-500)]',
          '[--chip-solid-fg:var(--color-text-dark)]',
          '[--chip-soft-bg:color-mix(in_srgb,var(--chip-tone)_11%,transparent)]',
          '[--chip-soft-bg-hover:color-mix(in_srgb,var(--chip-tone)_18%,transparent)]',
          '[--chip-soft-border:color-mix(in_srgb,var(--chip-tone)_36%,transparent)]',
          '[--chip-solid-hover:var(--color-red-700)] dark:[--chip-solid-hover:var(--color-red-400)]',
          '[--chip-dot:var(--chip-tone)]'
        ].join(' ')
      },

      size: {
        sm: 'h-6 gap-1 px-2 text-xs',
        md: 'h-7 gap-1 px-2.5 text-sm',
        lg: 'h-8 gap-1.5 px-3 text-sm'
      },

      radiusSize: { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' },

      variant: {
        solid: [
          'border-transparent bg-[var(--chip-solid-bg)] text-[var(--chip-solid-fg)] shadow-none',
          'data-[interactive=true]:hover:bg-[var(--chip-solid-hover)]'
        ].join(' '),
        flat: [
          'border-transparent bg-[var(--chip-soft-bg)] text-[var(--chip-fg)]',
          'data-[interactive=true]:hover:bg-[var(--chip-soft-bg-hover)]'
        ].join(' '),
        shadow: [
          'border-transparent bg-[var(--chip-solid-bg)] text-[var(--chip-solid-fg)]',
          'shadow-[0_1px_2px_rgba(0,0,0,.12),0_3px_10px_color-mix(in_srgb,var(--chip-tone)_16%,transparent)]',
          'dark:shadow-[0_1px_2px_rgba(0,0,0,.28),0_3px_10px_color-mix(in_srgb,var(--chip-tone)_14%,transparent)]',
          'data-[interactive=true]:hover:bg-[var(--chip-solid-hover)]',
          'data-[interactive=true]:hover:shadow-[0_2px_4px_rgba(0,0,0,.14),0_6px_16px_color-mix(in_srgb,var(--chip-tone)_20%,transparent)]',
          'dark:data-[interactive=true]:hover:shadow-[0_2px_4px_rgba(0,0,0,.32),0_6px_16px_color-mix(in_srgb,var(--chip-tone)_18%,transparent)]'
        ].join(' '),
        bordered: [
          'border-[var(--chip-soft-border)] bg-transparent text-[var(--chip-fg)]',
          'data-[interactive=true]:hover:bg-[var(--chip-soft-bg)] data-[interactive=true]:hover:border-[var(--chip-tone)]'
        ].join(' '),
        light: [
          'border-transparent bg-transparent text-[var(--chip-fg)]',
          'data-[interactive=true]:hover:bg-[var(--chip-soft-bg)]'
        ].join(' '),
        faded: [
          'border-[var(--chip-soft-border)] bg-[var(--chip-soft-bg)] text-[var(--chip-fg)]',
          'data-[interactive=true]:hover:bg-[var(--chip-soft-bg-hover)] data-[interactive=true]:hover:border-[var(--chip-tone)]'
        ].join(' '),
        dot: [
          'border-[var(--chip-soft-border)] bg-[var(--chip-soft-bg)] text-[var(--chip-fg)]',
          'data-[interactive=true]:hover:bg-[var(--chip-soft-bg-hover)] data-[interactive=true]:hover:border-[var(--chip-tone)]'
        ].join(' ')
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
