import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { DynamicIconName, IconSizes } from '@/types';

export const iconButtonVariants = cva(
  [
    'relative overflow-hidden border cursor-pointer px-1 py-1 max-w-full',
    'active:scale-[0.98]',
    'transition-[box-shadow,background,border-color,transform,color] duration-250 ease-out',
    'inline-flex shrink-0 items-center justify-center',
    'whitespace-nowrap',
    'min-w-11 min-h-11',
    'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-light/35 dark:focus-visible:ring-brand-dark/40',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
  ],
  {
    variants: {
      variant: {
        primary: ['text-white', 'bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-active', 'border-0'],
        secondary: [
          'text-brand-light dark:text-text-dark',
          'bg-red-tint-subtle hover:bg-red-tint-active active:bg-red-tint-active',
          'border border-red-tint-border hover:border-brand-light dark:hover:border-brand-dark-light'
        ],
        outlined: [
          'text-brand-light dark:text-text-dark',
          'hover:text-text-dark',
          'bg-red-tint-subtle hover:bg-btn-primary-hover active:bg-red-tint-active',
          'border border-red-tint-border hover:border-brand-light dark:hover:border-brand-dark-light'
        ],
        ghost: [
          'text-text-light dark:text-text-dark',
          'bg-transparent',
          'border border-transparent',
          'hover:bg-black-tint-low dark:hover:bg-white-tint-faint'
        ],
        light: [
          'text-brand-light dark:text-brand-dark',
          'border border-transparent bg-transparent',
          'hover:text-brand-light-dark dark:hover:text-brand-dark-light',
          'hover:bg-red-tint-subtle'
        ]
      },
      rounded: {
        true: 'rounded-pill',
        false: 'rounded-md'
      },
      shadow: {
        true: '',
        false: ''
      },
      size: {
        sm: 'h-11 w-11',
        md: 'h-12 w-12',
        lg: 'h-14 w-14'
      }
    },
    compoundVariants: [
      {
        variant: 'primary',
        shadow: true,
        class:
          'shadow-glow-btn-primary-light dark:shadow-glow-btn-primary hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
      },
      {
        variant: ['secondary', 'outlined'],
        shadow: true,
        class:
          'shadow-glow-btn-secondary-light dark:shadow-glow-btn-secondary hover:shadow-glow-btn-secondary-hover-light dark:hover:shadow-glow-btn-secondary-hover'
      }
    ],
    defaultVariants: {
      variant: 'primary',
      rounded: true,
      shadow: true,
      size: 'md'
    }
  }
);

type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;
export type IconButtonSize = NonNullable<IconButtonVariantProps['size']>;
type NativeButtonType = 'button' | 'submit' | 'reset';
type NativeIconButtonProps = Omit<
  ComponentProps<'button'>,
  'aria-label' | 'aria-pressed' | 'children' | 'className' | 'disabled' | 'title' | 'type'
>;
type IconButtonAccessibleName =
  | {
      /** @control text */
      title: string;
      /** @control text */
      ariaLabel?: string;
      /** @control text */
      'aria-label'?: string;
    }
  | {
      /** @control text */
      title?: string;
      /** @control text */
      ariaLabel: string;
      /** @control text */
      'aria-label'?: string;
    }
  | {
      /** @control text */
      title?: string;
      /** @control text */
      ariaLabel?: string;
      /** @control text */
      'aria-label': string;
    };

export type IconButtonProps = NativeIconButtonProps &
  IconButtonAccessibleName & {
    /**
     * @control select
     * @default primary
     */
    variant?: IconButtonVariantProps['variant'];
    /** @control text */
    icon?: DynamicIconName;
    /**
     * @control select
     * @default md
     */
    size?: IconButtonSize | IconSizes;
    /**
     * @control select
     * @default button
     */
    type?: NativeButtonType;
    /**
     * @control boolean
     * @default true
     */
    rounded?: IconButtonVariantProps['rounded'];
    /**
     * @control boolean
     * @default true
     */
    shadow?: IconButtonVariantProps['shadow'];
    /**
     * @control boolean
     * @default false
     */
    disabled?: boolean;
    /** @control text */
    className?: string;
    /**
     * @control boolean
     * @default false
     */
    'aria-pressed'?: boolean;
  };
