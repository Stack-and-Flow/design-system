import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'button relative border cursor-pointer max-w-full',
    'active:scale-[0.98]',
    'flex items-center justify-center',
    'font-[var(--font-weight-semibold)] whitespace-nowrap line-clamp-1 leading-[1.6] tracking-[0.01em]',
    'disabled:pointer-events-none disabled:opacity-40',
    'focus-visible:outline-none',
    'focus-visible:shadow-[var(--glow-focus-dark)]',
    'dark:focus-visible:shadow-[var(--glow-focus-dark)]'
  ],
  {
    variants: {
      variant: {
        primary: [
          // Gradiente rojo + glow neon — identidad visual Stack-and-Flow
          'text-white',
          'bg-[image:var(--gradient-btn-primary)]',
          'border-transparent',
          'shadow-[var(--glow-btn-primary)]',
          'transition-[box-shadow,background] duration-[250ms] ease-[ease]',
          'hover:bg-[image:var(--gradient-btn-primary-hover)]',
          'hover:shadow-[var(--glow-btn-primary-hover)]',
          'active:shadow-[var(--glow-btn-primary)]'
        ],
        ghost: [
          // Transparente con hover en superficie sutil
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'bg-transparent dark:bg-transparent',
          'border-transparent',
          'transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
          'hover:bg-[var(--color-white-tint-faint)]',
          'hover:border-transparent',
          'dark:hover:bg-[var(--color-white-tint-faint)]'
        ],
        light: [
          // Solo texto de color de marca, sin fondo ni borde
          'text-[var(--color-brand-light)] dark:text-[var(--color-brand-dark)]',
          'border-transparent',
          'bg-transparent',
          'transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
          'hover:text-[var(--color-brand-light-dark)]',
          'dark:hover:text-[var(--color-brand-dark-light)]',
          'hover:bg-[var(--color-red-tint-subtle)]'
        ],
        secondary: [
          // Fondo con tint rojo sutil + borde degradado via ::before pseudo-element
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'bg-[var(--color-red-tint-subtle)]',
          'border border-transparent',
          'overflow-visible isolate',
          'before:absolute before:inset-[-1.5px] before:rounded-[inherit] before:z-[-1]',
          'before:bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,0,54,0.55)_40%,rgba(255,0,54,0.15)_100%)]',
          'transition-[box-shadow,background] duration-[250ms] ease-[ease]',
          // Always-on base glow — identity of secondary button
          'shadow-[var(--glow-btn-secondary)]',
          'hover:bg-[var(--color-red-tint-low)]',
          'hover:shadow-[var(--glow-btn-secondary-hover)] dark:hover:shadow-[var(--glow-btn-secondary-hover)]',
          'active:bg-[rgba(255,0,54,0.16)]'
        ],
        outlined: [
          // Borde de marca, relleno transparente, hover va a rojo
          'text-[var(--color-brand-light)] dark:text-[var(--color-brand-dark)]',
          'border-[var(--color-brand-light)] dark:border-[var(--color-brand-dark)]',
          'bg-transparent',
          'transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
          'hover:text-white dark:hover:text-white',
          'hover:bg-[image:var(--gradient-btn-primary)]',
          'hover:border-transparent',
          'hover:shadow-[var(--glow-btn-primary)]'
        ]
      },
      rounded: {
        true: 'rounded-[var(--radius-pill)]',
        false: 'rounded-[var(--radius-md)]'
      },
      shadow: {
        true: 'hover:shadow-[var(--glow-btn-secondary)]',
        false: ''
      },
      uppercase: {
        true: 'uppercase',
        false: ''
      },
      size: {
        // 44px minimum touch target per WCAG (Rule 10)
        md: 'px-md h-11 fs-base tablet:fs-base-tablet',
        lg: 'px-lg h-12 fs-h6 tablet:fs-h6-tablet',
        // sm is intentionally compact — slightly below 44px minimum; use md for touch-critical UIs
        sm: 'px-sm h-9 fs-small tablet:fs-small-tablet'
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
