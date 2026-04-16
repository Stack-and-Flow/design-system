import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';

export const iconButtonVariants = cva(
  [
    'link relative border cursor-pointer px-1 py-1 max-w-full',
    'active:scale-[0.98]',
    'transition-[box-shadow,background,border-color] duration-200 ease-[ease]',
    'flex items-center justify-start',
    'whitespace-nowrap line-clamp-1 ',
    'min-w-[44px] min-h-[44px]',
    'focus-visible:outline-none focus-visible:shadow-[var(--glow-focus-dark)]',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-white',
          'bg-[image:var(--gradient-btn-primary)]',
          'border-transparent',
          'shadow-[var(--glow-btn-primary)]',
          'hover:bg-[image:var(--gradient-btn-primary-hover)]',
          'hover:shadow-[var(--glow-btn-primary-hover)]'
        ],
        ghost: [
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'bg-transparent dark:bg-transparent',
          'border-transparent',
          'hover:bg-[var(--color-white-tint-faint)]',
          'hover:border-transparent',
          'dark:hover:bg-[var(--color-white-tint-faint)]'
        ],
        light: [
          'text-[var(--color-brand-light)] dark:text-[var(--color-brand-dark)]',
          'border-transparent',
          'bg-transparent',
          'hover:text-[var(--color-brand-light-dark)]',
          'dark:hover:text-[var(--color-brand-dark-light)]',
          'hover:bg-[var(--color-red-tint-subtle)]'
        ],
        secondary: [
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]',
          'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]',
          'hover:bg-[var(--color-red-tint-subtle)] dark:hover:bg-[var(--color-red-tint-subtle)]',
          'hover:border-[var(--color-border-strong-light)] dark:hover:border-[var(--color-border-strong-dark)]',
          'hover:shadow-[var(--glow-btn-secondary)] dark:hover:shadow-[var(--glow-btn-secondary)]'
        ],
        outlined: [
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
      }
    },
    defaultVariants: {
      variant: 'primary',
      rounded: false,
      shadow: false
    }
  }
);

type IconButtonVariant = VariantProps<typeof iconButtonVariants>['variant'];
export type IconSizes = 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40;

export type IconButtonProps = {
  /**
   * @control select
   * @default primary
   */
  variant?: IconButtonVariant;
  /** @control text */
  icon?: DynamicIconName;
  /**
   * @control text
   * @default 20
   */
  size?: IconSizes;
  /**
   * @control boolean
   * @default false
   */
  rounded?: boolean;
  /**
   * @control boolean
   * @default false
   */
  shadow?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /** @control text */
  title?: string;
  /** @control text */
  className?: string;
  /**
   * @control boolean
   * @default false
   */
  'aria-pressed'?: boolean;
};
