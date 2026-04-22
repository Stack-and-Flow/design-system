import { type VariantProps, cva } from 'class-variance-authority';
import type { ChangeEvent, ReactNode } from 'react';

export const inputVariants = cva(
  ['relative overflow-hidden flex py-2 justify-between max-w-full', 'border transition-[border-color,box-shadow] duration-200 ease-[ease]'],
  {
    variants: {
      variant: {
        regular: [
          'bg-surface-light border-border-light',
          'dark:bg-surface-dark dark:border-border-dark'
        ],
        underlined: [
          'bg-transparent border-border-light',
          'dark:bg-transparent dark:border-border-dark'
        ],
        line: [
          'bg-transparent',
          'border-t-transparent',
          'border-l-transparent',
          'border-r-transparent',
          '!rounded-none',
          'border-b-border-light',
          'dark:border-b-border-dark'
        ],
        bordered: [
          'bg-surface-light border-border-strong-light',
          'dark:bg-surface-dark dark:border-border-strong-dark'
        ]
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md'
      },
      size: {
        sm: 'h-12 px-2 fs-small tablet:fs-small-tablet',
        md: 'h-14 px-4 fs-base tablet:fs-base-tablet',
        lg: 'h-16 px-4 fs-h6 tablet:fs-h6-tablet'
      },
      state: {
        default: '',
        focused: [
          'outline-none',
          'shadow-glow-focus-light dark:shadow-glow-focus-dark'
        ],
        focusedRegular: [
          'hover:bg-surface-raised-light hover:border-border-strong-light',
          'dark:hover:bg-surface-raised-dark dark:hover:border-border-strong-dark'
        ],
        focusedUnderlined: [
          'hover:border-border-strong-light',
          'dark:hover:border-border-strong-dark'
        ],
        focusedLine: [
          'hover:border-b-border-strong-light',
          'dark:hover:border-b-border-strong-dark'
        ],
        focusedBordered: [
          'hover:bg-surface-raised-light',
          'dark:hover:bg-surface-raised-dark'
        ]
      },
      focused: {
        true: [
          'outline-none',
          'shadow-glow-focus-light dark:shadow-glow-focus-dark'
        ],
        false: ''
      }
    },
    defaultVariants: {
      variant: 'regular',
      rounded: false,
      size: 'md',
      state: 'default'
    }
  }
);

export const labelVariants = cva(
  ['absolute w-auto line-clamp-1 transition-[top,font-size,color] duration-200 ease-[ease] text-text-light dark:text-text-dark pt-[2px]'],
  {
    variants: {
      size: {
        sm: 'left-2 fs-small tablet:fs-small-tablet',
        md: 'left-4 fs-base tablet:fs-base-tablet',
        lg: 'left-4 fs-h6 tablet:fs-h6-tablet'
      },
      state: {
        default: 'top-[50%] translate-y-[-50%]',
        focusedSm: 'top-1 fs-small font-semibold',
        focusedMd: 'top-1.5 fs-small font-semibold',
        focusedLg: 'top-2 fs-small font-semibold',
        hasValueSm: 'top-1 fs-small font-semibold',
        hasValueMd: 'top-1.5 fs-small font-semibold',
        hasValueLg: 'top-2 fs-small font-semibold'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default'
    }
  }
);

type InputVariant = VariantProps<typeof inputVariants>['variant'];
type InputTypeVariant = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'hidden';
type InputSize = VariantProps<typeof inputVariants>['size'];

export type InputProps = {
  /** @control text */
  id: string;
  /**
   * @control select
   * @defaultValue regular
   */
  variant?: InputVariant;
  /**
   * @control select
   * @defaultValue text
   */
  type?: InputTypeVariant;
  /**
   * @control boolean
   * @defaultValue false
   */
  rounded?: boolean;
  /** @control text */
  label?: string;
  /**
   * @control boolean
   * @defaultValue false
   */
  isRequired?: boolean;
  /**
   * @control boolean
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * @control select
   * @defaultValue md
   */
  size?: InputSize;
  /**
   * @control boolean
   * @defaultValue false
   */
  isFullWidth?: boolean;
  /** @control text */
  placeholder?: string;
  /** @control text */
  className?: string;
  /** @control object */
  hint?: { message: string; type: 'error' | 'warning' | 'success' | 'info' };
  startContent?: ReactNode;
  endContent?: ReactNode;
  onChange?: (e: ChangeEvent, value: string) => void;
};
