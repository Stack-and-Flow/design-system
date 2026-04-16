import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'button relative overflow-hidden border cursor-pointer max-w-full',
    'transition-all duration-200 ease-in-out',
    'flex items-center justify-center',
    'font-[var(--font-weight-semibold)] whitespace-nowrap line-clamp-1 leading-[1.2]',
    'disabled:pointer-events-none disabled:opacity-60',
    'focus-visible:outline-offset-2 focus-visible:outline-2',
    'focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)]'
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
          'hover:bg-[image:var(--gradient-btn-primary-hover)]',
          'hover:shadow-[var(--glow-btn-primary-hover)]'
        ],
        ghost: [
          // Transparente con hover en superficie sutil
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'bg-transparent dark:bg-transparent',
          'border-transparent',
          'hover:bg-[var(--color-white-tint-faint)]',
          'hover:border-transparent',
          'dark:hover:bg-[var(--color-white-tint-faint)]'
        ],
        light: [
          // Solo texto de color de marca, sin fondo ni borde
          'text-[var(--color-brand-light)] dark:text-[var(--color-brand-dark)]',
          'border-transparent',
          'bg-transparent',
          'hover:text-[var(--color-brand-light-dark)]',
          'dark:hover:text-[var(--color-brand-dark-light)]',
          'hover:bg-[var(--color-red-tint-subtle)]'
        ],
        secondary: [
          // Superficie neutra con tint rojo sutil en hover
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]',
          'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]',
          'hover:bg-[var(--color-red-tint-subtle)] dark:hover:bg-[var(--color-red-tint-subtle)]',
          'hover:border-[var(--color-border-strong-light)] dark:hover:border-[var(--color-border-strong-dark)]',
          'hover:shadow-[var(--glow-btn-secondary)] dark:hover:shadow-[var(--glow-btn-secondary)]'
        ],
        outlined: [
          // Borde de marca, relleno transparente, hover va a rojo
          'text-[var(--color-brand-light)] dark:text-[var(--color-brand-dark)]',
          'border-[var(--color-brand-light)] dark:border-[var(--color-brand-dark)]',
          'bg-transparent',
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
        md: 'px-md h-10 fs-base tablet:fs-base-tablet',
        lg: 'px-lg h-12 fs-h6 tablet:fs-h6-tablet',
        sm: 'px-sm h-8 fs-small tablet:fs-small-tablet'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: false,
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
