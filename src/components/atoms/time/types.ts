import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const timeVariants = cva(
  [
    'relative flex max-w-full justify-between overflow-hidden border py-2',
    'cursor-text transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
    'focus-within:outline-none'
  ],
  {
    variants: {
      variant: {
        regular: [
          'bg-surface-light border-border-light hover:bg-surface-raised-light hover:border-border-strong-light',
          'dark:bg-surface-dark dark:border-border-dark dark:hover:bg-surface-raised-dark dark:hover:border-border-strong-dark'
        ],
        underlined: [
          'bg-transparent border-border-light hover:border-border-strong-light',
          'dark:border-border-dark dark:hover:border-border-strong-dark'
        ],
        line: [
          'bg-transparent border-t-transparent border-l-transparent border-r-transparent rounded-none!',
          'border-b-border-light hover:border-b-border-strong-light',
          'dark:border-b-border-dark dark:hover:border-b-border-strong-dark'
        ],
        bordered: [
          'bg-surface-light border-border-strong-light hover:bg-surface-raised-light',
          'dark:bg-surface-dark dark:border-border-strong-dark dark:hover:bg-surface-raised-dark'
        ]
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md'
      },
      size: {
        sm: 'h-12 px-3 fs-small',
        md: 'h-14 px-4 fs-base',
        lg: 'h-16 px-4 fs-h6'
      },
      status: {
        default: '',
        error:
          'border-error-light shadow-glow-input-error-light hover:!border-error-light dark:border-error dark:shadow-glow-input-error dark:hover:!border-error',
        warning:
          'border-warning-light shadow-glow-input-warning-light hover:!border-warning-light dark:border-warning dark:shadow-glow-input-warning dark:hover:!border-warning',
        success:
          'border-success-light shadow-glow-input-success-light hover:!border-success-light dark:border-success dark:shadow-glow-input-success dark:hover:!border-success',
        info: ''
      },
      focused: {
        true: '!border-brand-light/50 shadow-glow-input-focus-light dark:!border-brand-dark/50 dark:shadow-glow-input-focus',
        false: ''
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    compoundVariants: [
      { focused: true, status: 'error', class: '!border-error-light dark:!border-error' },
      { focused: true, status: 'warning', class: '!border-warning-light dark:!border-warning' },
      { focused: true, status: 'success', class: '!border-success-light dark:!border-success' }
    ],
    defaultVariants: {
      variant: 'regular',
      rounded: false,
      size: 'md',
      status: 'default',
      focused: false,
      fullWidth: false
    }
  }
);

export const timeStepButtonVariants = cva(
  [
    'cursor-pointer rounded-sm bg-surface-light px-1 text-text-light hover:bg-surface-raised-light',
    'dark:bg-surface-dark dark:text-text-dark dark:hover:bg-surface-raised-dark',
    'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
  ],
  {
    variants: {
      shape: {
        top: 'rounded-b-none',
        bottom: 'rounded-t-none'
      }
    },
    defaultVariants: { shape: 'top' }
  }
);

export const labelVariants = cva(
  ['absolute w-auto line-clamp-1 pt-0.5 text-text-light dark:text-text-dark font-semibold'],
  {
    variants: {
      size: {
        sm: 'left-3 top-0.5 fs-xs',
        md: 'left-4 top-1.5 fs-small',
        lg: 'left-4 top-2 fs-small'
      }
    },
    defaultVariants: { size: 'md' }
  }
);

export const hintMessageVariants = cva('fs-small', {
  variants: {
    tone: {
      info: 'text-text-secondary-light dark:text-text-secondary-dark',
      warning: 'text-warning-light dark:text-warning',
      error: 'text-error-light dark:text-error',
      success: 'text-success-light dark:text-success'
    }
  },
  defaultVariants: { tone: 'info' }
});

export type TimeVariant = VariantProps<typeof timeVariants>['variant'];
export type TimeSize = VariantProps<typeof timeVariants>['size'];
export type TimeGranularity = 'minute' | 'second';
export type TimeHourCycle = 12 | 24;
export type TimeHintType = 'error' | 'warning' | 'success' | 'info';

export type TimeHint = {
  message: string;
  type: TimeHintType;
};

export type TimeSegments = {
  hour: string;
  minute: string;
  second?: string;
  dayPeriod?: 'AM' | 'PM';
};

export type TimeProps = {
  /** @control text */
  id: string;
  /** @control text */
  label?: string;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isRequired?: boolean;
  /**
   * @control boolean
   * @default false
   */
  rounded?: boolean;
  /**
   * @control select
   * @default regular
   */
  variant?: TimeVariant;
  /**
   * @control select
   * @default md
   */
  size?: TimeSize;
  /**
   * @control select
   * @default minute
   */
  granularity?: TimeGranularity;
  /**
   * @control radio
   * @default 24
   */
  hourCycle?: TimeHourCycle;
  /** @control text */
  name?: string;
  /**
   * @control boolean
   * @default false
   */
  isFullWidth?: boolean;
  /** @control text */
  className?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  /**
   * @control boolean
   * @default false
   */
  showSteppers?: boolean;
  /**
   * @control boolean
   * @default false
   */
  showClockIcon?: boolean;
  /** @control object */
  hint?: TimeHint;
  onChange?: (value: TimeSegments | null) => void;
};

export type TimeComponentProps = TimeProps &
  Omit<ComponentProps<'div'>, 'id' | 'onChange' | 'size'> & {
    ariaDescribedBy?: string | string[];
    ariaLabelledBy?: string | string[];
  };
