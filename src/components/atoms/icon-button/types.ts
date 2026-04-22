import { cva, type VariantProps } from 'class-variance-authority';
import type { DynamicIconName, IconSizes } from '@/types';

export const iconButtonVariants = cva(
  [
    'link relative border cursor-pointer px-1 py-1 max-w-full',
    'active:scale-[0.98]',
    'transition-[box-shadow,background,border-color] duration-200 ease-[ease]',
    'flex items-center justify-start',
    'whitespace-nowrap line-clamp-1 ',
    'min-w-[44px] min-h-[44px]',
    'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark',
    'disabled:pointer-events-none disabled:opacity-40'
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-white',
          'bg-[image:var(--background-image-btn-primary)]',
          'border-transparent',
          'shadow-glow-btn-primary-light dark:shadow-glow-btn-primary',
          'hover:bg-[image:var(--background-image-btn-primary-hover)]',
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
        ],
        secondary: [
          'text-text-light dark:text-text-dark',
          'bg-surface-light dark:bg-surface-dark',
          'border-border-light dark:border-border-dark',
          'hover:bg-red-tint-subtle dark:hover:bg-red-tint-subtle',
          'hover:border-border-strong-light dark:hover:border-border-strong-dark',
          'hover:shadow-glow-btn-secondary-light dark:hover:shadow-glow-btn-secondary'
        ],
        outlined: [
          'text-brand-light dark:text-brand-dark',
          'border-brand-light dark:border-brand-dark',
          'bg-transparent',
          'hover:text-white dark:hover:text-white',
          'hover:bg-[image:var(--background-image-btn-primary)]',
          'hover:border-transparent',
          'hover:shadow-glow-btn-primary-light dark:hover:shadow-glow-btn-primary'
        ]
      },
      rounded: {
        true: 'rounded-pill',
        false: 'rounded-md'
      },
      shadow: {
        true: 'hover:shadow-glow-btn-secondary-light dark:hover:shadow-glow-btn-secondary',
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
