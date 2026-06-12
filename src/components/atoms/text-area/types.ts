import { cva, type VariantProps } from 'class-variance-authority';
import type { ChangeEvent, ComponentProps } from 'react';
import { hintMessageVariants as inputHintMessageVariants } from '@/components/atoms/input/types';

/** Re-exported from Input for consistency — avoids API drift. */
export const hintMessageVariants = inputHintMessageVariants;

export const textAreaWrapperVariants = cva('flex max-w-full flex-col gap-2', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-auto'
    }
  },
  defaultVariants: {
    fullWidth: false
  }
});

export const textAreaSurfaceVariants = cva(
  [
    'relative flex max-w-full overflow-hidden border cursor-text',
    'transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
    'focus-within:outline-none'
  ],
  {
    variants: {
      variant: {
        regular: [
          'bg-surface-light border-border-light hover:bg-surface-raised-light hover:border-border-strong-light',
          'dark:bg-surface-dark dark:border-border-dark dark:hover:bg-surface-raised-dark dark:hover:border-border-strong-dark'
        ],
        bordered: [
          'bg-surface-light border-border-strong-light hover:bg-surface-raised-light',
          'dark:bg-surface-dark dark:border-border-strong-dark dark:hover:bg-surface-raised-dark'
        ],
        underlined: [
          'bg-transparent border-border-light hover:border-border-strong-light',
          'dark:border-border-dark dark:hover:border-border-strong-dark'
        ],
        line: [
          'bg-transparent border-t-transparent border-l-transparent border-r-transparent rounded-none!',
          'border-b-border-light hover:border-b-border-strong-light',
          'dark:border-b-border-dark dark:hover:border-b-border-strong-dark'
        ]
      },
      rounded: {
        true: 'rounded-lg',
        false: 'rounded-md'
      },
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-4 py-3'
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
        true: '!border-brand-light/50 shadow-glow-input-focus-light dark:!border-brand-dark/50 dark:shadow-glow-input-focus',
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

export const textAreaLabelVariants = cva(
  [
    'absolute z-10 w-auto line-clamp-1 pt-0.5 text-text-light dark:text-text-dark',
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
        floatingSm: 'top-1 fs-xs font-semibold',
        floatingMd: 'top-1.5 fs-small font-semibold',
        floatingLg: 'top-2 fs-small font-semibold'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'floatingMd'
    }
  }
);

export const nativeTextAreaVariants = cva(
  [
    'min-h-full w-full flex-1 border-none bg-transparent p-0 font-medium outline-none',
    'text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark',
    'disabled:cursor-not-allowed'
  ],
  {
    variants: {
      size: {
        sm: 'fs-small leading-relaxed',
        md: 'fs-base leading-relaxed',
        lg: 'fs-h6 leading-relaxed'
      },
      hasFloatingLabel: {
        true: 'pt-5',
        false: ''
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize'
      }
    },
    defaultVariants: {
      size: 'md',
      hasFloatingLabel: false,
      resize: 'vertical'
    }
  }
);

type TextAreaVariantProps = VariantProps<typeof textAreaSurfaceVariants>;
type NativeTextAreaProps = Omit<
  ComponentProps<'textarea'>,
  'children' | 'className' | 'disabled' | 'id' | 'onChange' | 'readOnly' | 'size'
>;

export type TextAreaVariant = NonNullable<TextAreaVariantProps['variant']>;
export type TextAreaSize = NonNullable<TextAreaVariantProps['size']>;
export type TextAreaStatus = NonNullable<TextAreaVariantProps['status']>;
export type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export type TextAreaHint = {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
};

export type TextAreaProps = NativeTextAreaProps & {
  /** @control text */
  id: string;
  /** @control text */
  value?: string;
  /** @control text */
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>, value: string) => void;
  onValueChange?: (value: string) => void;
  /**
   * @control text
   * @default ''
   */
  label?: string;
  /** @control text */
  placeholder?: string;
  /**
   * @control select
   * @default regular
   */
  variant?: TextAreaVariant;
  /**
   * @control select
   * @default md
   */
  size?: TextAreaSize;
  /**
   * @control boolean
   * @default false
   */
  rounded?: boolean;
  /**
   * Defaults to the resolved hint type when a hint is present.
   * @control select
   * @default default
   */
  status?: TextAreaStatus;
  /** @control object */
  hint?: TextAreaHint;
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
   * @control boolean
   * @default false
   */
  readOnly?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * @control boolean
   * @default false
   */
  autosize?: boolean;
  /**
   * @control number
   * @default 3
   */
  minRows?: number;
  /** @control number */
  maxRows?: number;
  /**
   * Defaults to `none` when autosize is enabled.
   * @control select
   * @default vertical
   */
  resize?: TextAreaResize;
  /** @control text */
  ariaDescribedBy?: string | string[];
  /** @control text */
  ariaLabelledBy?: string | string[];
  /** @control text */
  className?: string;
};
