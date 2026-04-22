import { cva } from 'class-variance-authority';
import type { DynamicIconName } from '@/types';

export const linkVariants = cva(
  [
    'link w-auto relative cursor-pointer',
    'flex gap-1 items-center justify-start',
    'font-medium whitespace-nowrap line-clamp-1 leading-[1.2]',
    'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'
  ],
  {
    variants: {
      variant: {
        regular: [
          'font-bold transition-[color,border-color] duration-200 ease-[ease]',
          'text-brand-dark-lighter dark:text-brand-dark-lighter',
          'hover:text-brand-dark-lightest dark:hover:text-brand-dark-lightest',
          'border-b border-[rgba(255,77,109,0.4)] hover:border-[rgba(255,128,153,0.7)]',
          'no-underline'
        ],
        button: [
          'min-h-[44px]',
          'transition-[box-shadow,background,border-color] duration-[250ms] ease-[ease]',
          'px-4 py-2',
          'rounded-md',
          'border',
          'text-white',
          'bg-[image:var(--background-image-btn-primary)]',
          'border-transparent',
          'shadow-glow-btn-primary-light dark:shadow-glow-btn-primary',
          'hover:bg-[image:var(--background-image-btn-primary-hover)]',
          'hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
        ],
        outlined: [
          'min-h-[44px]',
          'transition-[box-shadow,background,border-color] duration-[250ms] ease-[ease]',
          'px-4 py-2',
          'rounded-md',
          'border',
          'text-brand-light dark:text-brand-dark',
          'border-brand-light dark:border-brand-dark',
          'bg-transparent',
          'hover:text-white dark:hover:text-white',
          'hover:bg-[image:var(--background-image-btn-primary)]',
          'hover:border-transparent',
          'hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
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
