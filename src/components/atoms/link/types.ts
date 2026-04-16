import type { DynamicIconName } from '@/components/utils/types';
import { cva } from 'class-variance-authority';

export const linkVariants = cva(
  [
    'link w-auto relative cursor-pointer',
    'flex gap-1 items-center justify-start',
    'font-[var(--font-weight-medium)] whitespace-nowrap line-clamp-1 leading-[1.2]',
    'focus-visible:outline-none focus-visible:shadow-[var(--glow-focus-dark)]'
  ],
  {
    variants: {
      variant: {
        regular: [
          'font-[var(--font-weight-bold)] transition-[color,border-color] duration-200 ease-[ease]',
          'text-[#ff4d6d] dark:text-[#ff4d6d]',
          'hover:text-[#ff8099] dark:hover:text-[#ff8099]',
          'border-b border-[rgba(255,77,109,0.4)] hover:border-[rgba(255,128,153,0.7)]',
          'no-underline'
        ],
        button: [
          'min-h-[44px]',
          'transition-[box-shadow,background,border-color] duration-[250ms] ease-[ease]',
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
          'min-h-[44px]',
          'transition-[box-shadow,background,border-color] duration-[250ms] ease-[ease]',
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
