import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { DynamicIconName } from '@/types';

export const buttonVariants = cva(
  [
    'button relative cursor-pointer max-w-full overflow-hidden',
    'active:scale-[0.98]',
    'flex items-center justify-center',
    'font-semibold whitespace-nowrap line-clamp-1 leading-relaxed tracking-ui',
    'disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-light/35 dark:focus-visible:ring-brand-dark/40',
    'transition-[background,box-shadow,border-color,transform,color] duration-250 ease-out'
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-white',
          'bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-active',
          'border-0',
          'shadow-glow-btn-primary-light dark:shadow-glow-btn-primary',
          'hover:shadow-glow-btn-primary-hover-light dark:hover:shadow-glow-btn-primary-hover'
        ],
        secondary: [
          'text-brand-light dark:text-text-dark',
          'bg-red-tint-subtle hover:bg-red-tint-active active:bg-red-tint-active',
          'border-[1.5px] border-red-tint-border hover:border-brand-light dark:hover:border-brand-dark-light',
          'shadow-glow-btn-secondary-light dark:shadow-glow-btn-secondary',
          'hover:shadow-glow-btn-secondary-hover-light dark:hover:shadow-glow-btn-secondary-hover'
        ],
        outlined: [
          'text-brand-light dark:text-text-dark',
          'hover:text-text-dark',
          'bg-red-tint-subtle hover:bg-btn-primary-hover active:bg-red-tint-active',
          'border-[1.5px] border-red-tint-border hover:border-brand-light dark:hover:border-brand-dark-light',
          'shadow-glow-btn-secondary-light dark:shadow-glow-btn-secondary',
          'hover:shadow-glow-btn-secondary-hover-light dark:hover:shadow-glow-btn-secondary-hover'
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
        false: 'shadow-none hover:shadow-none'
      },
      uppercase: {
        true: 'uppercase',
        false: ''
      },
      size: {
        sm: 'px-sm h-11 fs-small',
        md: 'px-md h-11 fs-base',
        lg: 'px-lg h-12 fs-h6'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: true,
      shadow: true,
      fullWidth: false
    }
  }
);

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
type ButtonTypeVariants = 'button' | 'submit' | 'reset';
type ButtonSizeVariants = 'md' | 'sm' | 'lg';
type NativeButtonProps = Omit<ComponentProps<'button'>, 'type' | 'disabled' | 'className' | 'children' | 'aria-label'>;
type ButtonAccessibleContent =
  | {
      /** @control text */
      text: string;
      /** @control text */
      ariaLabel?: string;
      /** @control text */
      'aria-label'?: string;
    }
  | {
      /** @control text */
      text?: string;
      /** @control text */
      ariaLabel: string;
      /** @control text */
      'aria-label'?: string;
    }
  | {
      /** @control text */
      text?: string;
      /** @control text */
      ariaLabel?: string;
      /** @control text */
      'aria-label': string;
    };

export type ButtonProps = NativeButtonProps &
  ButtonAccessibleContent & {
    /**
     * @control select
     * @default primary
     */
    variant?: ButtonVariant;
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
     * @default true
     */
    rounded?: boolean;
    /**
     * @control boolean
     * @default true
     */
    shadow?: boolean;
    /**
     * @control boolean
     * @default false
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
    className?: string;
    /**
     * @control boolean
     * @default false
     */
    'aria-pressed'?: boolean;
  };
