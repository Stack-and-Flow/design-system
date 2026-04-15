import type { DynamicIconName } from '@/components/utils/types';
import { cva } from 'class-variance-authority';

export const linkVariants = cva(
  [
    'link w-auto relative overflow-hidden cursor-pointer',
    'transition-all duration-200 ease-in-out',
    'flex gap-1 items-center justify-start',
    'font-secondary whitespace-nowrap line-clamp-1 leading-[1.2]',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'dark:focus-visible:outline-white focus-visible:outline-accent'
  ],
  {
    variants: {
      variant: {
        regular: [
          'hover:text-secondary',
          'text-text-light',
          'dark:text-text-dark',
          'dark:hover:text-accent',
          'underline-offset-2 underline'
        ],
        button: [
          'px-4 py-2',
          'rounded-md',
          'border-2',
          'text-text-dark',
          'bg-secondary',
          'border-secondary',
          'hover:border-accent',
          'hover:bg-accent',
          'hover:shadow-secondary',
          'dark:hover:bg-accent',
          'dark:hover:shadow-secondary',
          'hover:shadow-custom-md'
        ],
        outlined: [
          'px-4 py-2',
          'rounded-md',
          'border-2',
          'text-secondary',
          'border-secondary',
          'hover:text-text-dark',
          'bg-transparent',
          'hover:border-accent',
          'hover:bg-accent',
          'hover:shadow-secondary',
          'dark:hover:bg-accent',
          'dark:transparent',
          'dark:text-text-dark',
          'dark:hover:shadow-secondary',
          'hover:shadow-custom-sm'
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
