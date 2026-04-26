import { cva, type VariantProps } from 'class-variance-authority';
import type { DynamicIconName } from '@/types';

export const buttonVariants = cva(
  [
    'button relative border cursor-pointer max-w-full',
    'active:scale-[0.98]',
    'flex items-center justify-center',
    'font-semibold whitespace-nowrap line-clamp-1 leading-[1.6] tracking-[0.01em]',
    'disabled:pointer-events-none disabled:opacity-40',
    'focus-visible:outline-none',
    'focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-white',
          'bg-[image:var(--background-image-btn-primary)]',
          'border-brand-light dark:border-brand-dark',
          'shadow-glow-btn-primary-light dark:shadow-glow-btn-primary',
          'transition-all duration-250',
          'hover:bg-[image:var(--background-image-btn-primary-hover)]',
          'hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
        ],
        secondary: [
          'text-brand-light dark:text-text-dark',
          'bg-red-tint-subtle',
          'border border-transparent',
          'shadow-glow-btn-secondary-light dark:shadow-glow-btn-secondary',
          'btn-secondary-hover',
          'active:bg-[rgba(255,0,54,0.16)]',
          'transition-all duration-250',
          'hover:shadow-glow-btn-secondary-hover-light dark:hover:shadow-glow-btn-secondary-hover',
          'hover:bg-[rgba(255,0,54,0.24)]'
        ],
        outlined: [
          'text-brand-light dark:text-text-dark',
          'bg-transpartent',
          'border border-transparent',
          'shadow-glow-btn-secondary-light dark:shadow-glow-btn-secondary',
          'transition-all duration-250',
          'dark:hover:bg-brand-dark',
          'hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
        ],
        ghost: [
          'text-text-light dark:text-text-dark',
          'bg-transparent dark:bg-transparent',
          'border-transparent',
          'hover:bg-white-tint-faint',
          'hover:border-transparent',
          'dark:hover:bg-white-tint-faint'
        ],
        light: [
          'text-brand-light dark:text-brand-dark',
          'border-transparent',
          'bg-transparent',
          'hover:text-brand-light-dark',
          'dark:hover:text-brand-dark-light',
          'hover:bg-red-tint-subtle'
        ]
      },
      rounded: {
        true: 'rounded-pill',
        false: 'rounded-md'
      },
      shadow: {
        true: '',
        false: 'shadow-none hover:shadow-none'
      },
      uppercase: {
        true: 'uppercase',
        false: ''
      },
      size: {
        // 44px minimum touch target per WCAG (Rule 10)
        md: 'px-md h-11 fs-base',
        lg: 'px-lg h-12 fs-h6',
        // sm is intentionally compact — slightly below 44px minimum; use md for touch-critical UIs
        sm: 'px-sm h-9 fs-small'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: true,
      shadow: true
    }
  }
);

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
type ButtonTypeVariants = 'button' | 'submit' | 'reset';
type ButtonSizeVariants = 'md' | 'sm' | 'lg';

export type ButtonProps = {
  /**
   * @control select
   * @default primary
   */
  variant?: ButtonVariant;
  /** @control text */
  text?: string;
  /** @control text */
  icon?: DynamicIconName;
  /**
   * @control select
   * @default md
   */
  size?: ButtonSizeVariants;
  /**
   * @control select
   * @default button
   */
  type?: ButtonTypeVariants;
  /**
   * @control boolean
   * @default false
   */
  rounded?: boolean;
  /**
   * @control boolean
   * @default true
   */
  shadow?: boolean;
  /**
   * @control boolean
   * @default true
   */
  uppercase?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isLoading?: boolean;
  /** @control text */
  ariaLabel?: string;
  /** @control text */
  className?: string;
  /**
   * @control boolean
   * @default false
   */
  'aria-pressed'?: boolean; // Nuevo prop para accesibilidad en botones de alternancia
};
