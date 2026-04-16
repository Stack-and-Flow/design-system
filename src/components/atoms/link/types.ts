import type { DynamicIconName } from '@/components/utils/types';
import { cva } from 'class-variance-authority';

export const linkVariants = cva(
  [
    'link w-auto relative overflow-hidden cursor-pointer',
    'transition-all duration-200 ease-in-out',
    'flex gap-1 items-center justify-start',
    'font-[var(--font-weight-medium)] whitespace-nowrap line-clamp-1 leading-[1.2]',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)]'
  ],
  {
    variants: {
      variant: {
        regular: [
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'hover:text-[var(--color-brand-light)] dark:hover:text-[var(--color-brand-dark)]',
          'underline-offset-2 underline'
        ],
        button: [
          'px-4 py-2',
          'rounded-[var(--radius-md)]',
          'border',
          'text-white',
          'bg-[image:var(--gradient-btn-primary)]',
          'border-transparent',
          'shadow-[var(--glow-btn-primary)]',
          'hover:bg-[image:var(--gradient-btn-primary-hover)]',
          'hover:shadow-[var(--glow-btn-primary-hover)]'
        ],
        outlined: [
          'px-4 py-2',
          'rounded-[var(--radius-md)]',
          'border',
          'text-[var(--color-brand-light)] dark:text-[var(--color-brand-dark)]',
          'border-[var(--color-brand-light)] dark:border-[var(--color-brand-dark)]',
          'bg-transparent',
          'hover:text-white dark:hover:text-white',
          'hover:bg-[image:var(--gradient-btn-primary)]',
          'hover:border-transparent',
          'hover:shadow-[var(--glow-btn-primary)]'
        ]
      },
      size: {
        md: 'px-md fs-base tablet:fs-base-tablet',
        lg: 'px-lg fs-h6 tablet:fs-h6-tablet',
        sm: 'px-sm fs-small tablet:fs-small-tablet'
      }
    },
    defaultVariants: {
      variant: 'regular',
      size: 'md'
    }
  }
);

type ButtonVariants = 'regular' | 'button' | 'outlined';
type TargetVariants = '_blank' | '_self' | '_parent' | '_top';
type LinkSizes = 'sm' | 'md' | 'lg';

export type LinkProps = {
  /**
   * @control select
   * @default regular
   * */
  variant?: ButtonVariants;
  /** @control text */
  href?: string;
  /**
   * @control text
   * @default _blank
   * */
  target?: TargetVariants;
  /**
   * @control select
   * @default md
   * */
  size: LinkSizes;
  /** @control text */
  icon?: DynamicIconName;
  /** @control text */
  title?: string;
  /** @control text */
  className?: string;
  /** @control text */
  children: string;
};
