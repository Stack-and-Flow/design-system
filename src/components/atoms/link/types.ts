import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import type { DynamicIconName } from '@/types';

export const linkVariants = cva(
  [
    'link relative w-auto cursor-pointer font-medium leading-normal',
    'focus-visible:focus-ring',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40'
  ],
  {
    variants: {
      variant: {
        regular: [
          'inline border-b font-bold no-underline',
          'border-brand-light/60 text-brand-light dark:border-brand-dark-dark dark:text-brand-dark-dark',
          'transition-[color,border-color] duration-200 ease-[ease]',
          'hover:border-brand-light-dark/80 hover:text-brand-light-dark dark:hover:border-brand-dark-light dark:hover:text-brand-dark-light',
          '[&>svg]:mr-1 [&>svg]:inline-block [&>svg]:align-middle'
        ],
        button: [
          'inline-flex items-center justify-center whitespace-nowrap rounded-pill border border-transparent font-semibold tracking-ui text-white no-underline',
          'bg-btn-primary',
          'transition-[box-shadow,background,transform] duration-250 ease-[ease]',
          'hover:bg-btn-primary-hover hover:text-white',
          'motion-safe:active:scale-[0.98]'
        ],
        outlined: [
          'inline-flex items-center justify-center whitespace-nowrap rounded-pill border font-semibold tracking-ui no-underline',
          'border-red-tint-border bg-red-tint-subtle text-brand-light dark:text-text-dark',
          'transition-[box-shadow,background,border-color,transform] duration-250 ease-[ease]',
          'hover:border-brand-light/80 hover:bg-red-tint-low hover:text-brand-light-darkest',
          'dark:hover:border-brand-dark-light dark:hover:bg-red-tint-active dark:hover:text-text-dark',
          'motion-safe:active:scale-[0.98]'
        ]
      },
      size: {
        xs: 'fs-xs',
        sm: 'fs-small',
        md: 'fs-base',
        lg: 'fs-h5'
      },
      emphasis: {
        default: '',
        flat: ''
      }
    },
    compoundVariants: [
      { variant: ['button', 'outlined'], size: 'xs', class: 'h-control-xs gap-0-75 px-2' },
      { variant: ['button', 'outlined'], size: 'sm', class: 'h-control-sm gap-1 px-sm' },
      { variant: ['button', 'outlined'], size: 'md', class: 'h-control-md gap-1.5 px-md' },
      { variant: ['button', 'outlined'], size: 'lg', class: 'h-control-lg gap-2 px-lg' },
      {
        variant: 'button',
        emphasis: 'default',
        class:
          'shadow-glow-btn-primary-light dark:shadow-glow-btn-primary hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
      },
      {
        variant: 'outlined',
        emphasis: 'default',
        class:
          'shadow-glow-btn-secondary-light dark:shadow-glow-btn-secondary hover:shadow-glow-btn-secondary-hover-light dark:hover:shadow-glow-btn-secondary-hover'
      }
    ],
    defaultVariants: {
      variant: 'regular',
      size: 'md',
      emphasis: 'default'
    }
  }
);

export type LinkVariant = 'regular' | 'button' | 'outlined';
export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';
export type LinkSize = 'xs' | 'sm' | 'md' | 'lg';
export type LinkEmphasis = NonNullable<VariantProps<typeof linkVariants>['emphasis']>;

export type LinkProps = Omit<ComponentProps<'a'>, 'children' | 'disabled' | 'target'> &
  VariantProps<typeof linkVariants> & {
    /**
     * @control text
     */
    children: ReactNode;
    /**
     * @control select
     * @default regular
     */
    variant?: LinkVariant;
    /**
     * @control select
     * @default md
     */
    size?: LinkSize;
    /**
     * @control select
     * @default _blank
     */
    target?: LinkTarget;
    /**
     * @control text
     */
    icon?: DynamicIconName;
    /**
     * @control select
     * @default default
     */
    emphasis?: LinkEmphasis;
    /**
     * @deprecated Use `emphasis="flat"` instead.
     * @control boolean
     * @default true
     */
    shadow?: boolean;
    /**
     * @control boolean
     * @default false
     */
    disabled?: boolean;
  };
