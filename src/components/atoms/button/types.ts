import { cva, type VariantProps } from 'class-variance-authority';
import type { DynamicIconName } from '@/types';

export const buttonVariants = cva(
  [
    'button relative border cursor-pointer max-w-full',
    'button-press-feedback',
    'button-transition',
    'flex items-center justify-center',
    'font-semibold whitespace-nowrap line-clamp-1 leading-relaxed tracking-ui',
    'disabled:pointer-events-none disabled:opacity-40',
    'focus-visible:outline-none',
    'focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-white',
          'bg-btn-primary',
          'border-transparent',
          'shadow-glow-btn-primary-light dark:shadow-glow-btn-primary',
          'hover:bg-btn-primary-hover',
          'hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
        ],
        secondary: [
          'text-brand-light dark:text-text-dark',
          'bg-red-tint-subtle',
          'border-red-tint-border',
          'active:bg-red-tint-active',
          'hover:bg-red-tint-high',
          'hover:shadow-glow-btn-secondary-hover-light dark:hover:shadow-glow-btn-secondary-hover'
        ],
        outlined: [
          'text-brand-light dark:text-brand-dark',
          'border-brand-light dark:border-brand-dark',
          'bg-transparent',
          'hover:text-white dark:hover:text-white',
          'hover:bg-btn-primary',
          'hover:border-transparent',
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

type ButtonBaseProps = {
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
  className?: string;
  /**
   * @control boolean
   * @default false
   */
  'aria-pressed'?: boolean; // Nuevo prop para accesibilidad en botones de alternancia
};

type ButtonTextContentProps = {
  /** @control text */
  text: string;
  /** @control text */
  icon?: DynamicIconName;
  /** @control text */
  ariaLabel?: string;
};

type ButtonIconOnlyProps = {
  /** @control text */
  icon: DynamicIconName;
  /** @control text */
  ariaLabel: string;
  text?: never;
};

type ButtonEmptyOrAriaOnlyProps = {
  /** @control text */
  text?: undefined;
  /** @control text */
  icon?: undefined;
  /** @control text */
  ariaLabel?: string;
};

export type ButtonProps = ButtonBaseProps & (ButtonTextContentProps | ButtonIconOnlyProps | ButtonEmptyOrAriaOnlyProps);
