import { cva, type VariantProps } from 'class-variance-authority';
import type { ChangeEvent, ComponentProps, ReactNode } from 'react';

export const inputVariants = cva(
  [
    'relative flex max-w-full justify-between overflow-hidden border py-2',
    'cursor-text transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
    '[&:has(:focus-visible)]:focus-ring'
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
        sm: 'h-form-field-sm px-3 fs-small',
        md: 'h-form-field-md px-4 fs-base',
        lg: 'h-form-field-lg px-4 fs-h6'
      },
      status: {
        default: '',
        error:
          'border-error-light shadow-glow-input-error-light hover:!border-error-light dark:border-error dark:shadow-glow-input-error dark:hover:!border-error',
        warning:
          'border-warning-light shadow-glow-input-warning-light hover:!border-warning-light dark:border-warning dark:shadow-glow-input-warning dark:hover:!border-warning',
        success:
          'border-success-light shadow-glow-input-success-light hover:!border-success-light dark:border-success dark:shadow-glow-input-success dark:hover:!border-success',
        info: 'border-info-light shadow-glow-input-info-light hover:!border-info-light dark:border-info dark:shadow-glow-input-info dark:hover:!border-info'
      },
      focused: {
        true: '!border-brand-light/50 dark:!border-brand-dark/50',
        false: ''
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    compoundVariants: [
      {
        focused: true,
        status: 'error',
        class: '!border-error-light dark:!border-error'
      },
      {
        focused: true,
        status: 'warning',
        class: '!border-warning-light dark:!border-warning'
      },
      {
        focused: true,
        status: 'success',
        class: '!border-success-light dark:!border-success'
      },
      {
        focused: true,
        status: 'info',
        class: '!border-info-light dark:!border-info'
      }
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

export const labelVariants = cva(
  [
    'absolute w-auto line-clamp-1 pt-0.5 text-text-light dark:text-text-dark',
    'transition-[top,font-size,color] duration-200 ease-[ease]'
  ],
  {
    variants: {
      size: {
        sm: 'left-3 font-medium',
        md: 'left-4 font-medium',
        lg: 'left-4 font-medium'
      },
      state: {
        resting: 'top-1/2 -translate-y-1/2',
        floatingSm: 'top-0.5 fs-xs font-semibold',
        floatingMd: 'top-1.5 fs-small font-semibold',
        floatingLg: 'top-2 fs-small font-semibold'
      }
    },
    compoundVariants: [
      {
        size: 'sm',
        state: 'resting',
        class: 'fs-small'
      },
      {
        size: 'md',
        state: 'resting',
        class: 'fs-base'
      },
      {
        size: 'lg',
        state: 'resting',
        class: 'fs-h6'
      }
    ],
    defaultVariants: {
      size: 'md',
      state: 'resting'
    }
  }
);

export const nativeInputVariants = cva(
  [
    'flex-1 border-none bg-transparent font-medium outline-none',
    'text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark',
    'disabled:cursor-not-allowed'
  ],
  {
    variants: {
      hasInlineAction: {
        true: 'pr-6',
        false: ''
      }
    },
    defaultVariants: {
      hasInlineAction: false
    }
  }
);

export const inputInlineButtonVariants = cva(
  [
    'cursor-pointer rounded-sm bg-surface-light px-1 text-text-light hover:bg-surface-raised-light',
    'dark:bg-surface-dark dark:text-text-dark dark:hover:bg-surface-raised-dark',
    'focus-visible:focus-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
  ],
  {
    variants: {
      shape: {
        top: 'rounded-b-none',
        bottom: 'rounded-t-none',
        icon: 'rounded-full p-0.5'
      }
    },
    defaultVariants: {
      shape: 'icon'
    }
  }
);

export const hintMessageVariants = cva('fs-small', {
  variants: {
    tone: {
      info: 'text-info-light dark:text-info',
      warning: 'text-warning-text-light dark:text-warning',
      error: 'text-error-light dark:text-error',
      success: 'text-success-text-light dark:text-success'
    }
  },
  defaultVariants: {
    tone: 'info'
  }
});

type InputVariantProps = VariantProps<typeof inputVariants>;
type NativeInputProps = Omit<
  ComponentProps<'input'>,
  'children' | 'className' | 'disabled' | 'id' | 'onChange' | 'size' | 'type'
>;

export type InputHintType = 'error' | 'warning' | 'success' | 'info';
export type InputTypeVariant = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'hidden';
export type InputVariant = NonNullable<InputVariantProps['variant']>;
export type InputSize = NonNullable<InputVariantProps['size']>;
export type InputHint = {
  message: string;
  type: InputHintType;
};

export type InputProps = NativeInputProps & {
  /** @control text */
  id: string;
  /**
   * @control select
   * @default regular
   */
  variant?: InputVariant;
  /**
   * @control select
   * @default text
   */
  type?: InputTypeVariant;
  /**
   * @control boolean
   * @default false
   */
  rounded?: boolean;
  /**
   * @control text
   * @default ''
   */
  label?: string;
  /**
   * @control boolean
   * @default false
   */
  isRequired?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control select
   * @default md
   */
  size?: InputSize;
  /**
   * @control boolean
   * @default false
   */
  isFullWidth?: boolean;
  /** @control text */
  placeholder?: string;
  /** @control text */
  className?: string;
  /** @control object */
  hint?: InputHint;
  /** @control object */
  startContent?: ReactNode;
  /** @control object */
  endContent?: ReactNode;
  /** @control text */
  ariaDescribedBy?: string | string[];
  /** @control text */
  ariaLabelledBy?: string | string[];
  onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
};
