import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

export const avatarVariants = cva(
  [
    'relative inline-flex shrink-0 overflow-hidden items-center justify-center',
    'bg-surface-raised-light dark:bg-surface-raised-dark',
    'border border-border-strong-light dark:border-border-strong-dark',
    'text-text-light dark:text-text-dark font-semibold leading-none',
    'data-[interactive=true]:cursor-pointer',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
    'data-[interactive=true]:transition-[box-shadow,transform] data-[interactive=true]:duration-200 data-[interactive=true]:ease-out',
    'data-[interactive=true]:hover:scale-110 data-[interactive=true]:active:scale-100',
    'data-[interactive=true]:focus-visible:focus-ring',
    ''
  ],
  {
    variants: {
      size: {
        sm: 'size-8 text-xs data-[interactive=true]:min-h-11 data-[interactive=true]:min-w-11',
        md: 'size-10 text-sm data-[interactive=true]:min-h-11 data-[interactive=true]:min-w-11',
        lg: 'size-12 text-base',
        xl: 'size-14 text-lg',
        '2xl': 'size-16 text-xl',
        '3xl': 'size-20 text-2xl'
      },
      rounded: {
        none: 'rounded-none',
        xs: 'rounded-xs',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
      }
    },
    defaultVariants: {
      size: 'md',
      rounded: 'md'
    }
  }
);

type AvatarVariantProps = VariantProps<typeof avatarVariants>;
type NativeButtonProps = Omit<ComponentProps<'button'>, 'className' | 'children'>;

export type AvatarProps = NativeButtonProps & {
  /**
   * @control text
   * @default undefined
   */
  src?: string;
  /**
   * @control text
   * @default Avatar
   */
  alt?: string;
  /**
   * @control select
   * @default md
   */
  size?: NonNullable<AvatarVariantProps['size']>;
  /**
   * @control select
   * @default md
   */
  rounded?: NonNullable<AvatarVariantProps['rounded']>;
  /** @control text */
  className?: string;
};
