import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

export type SelectOption = {
  key: string;
  label: string;
  disabled?: boolean;
  description?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export const selectBase = cva('relative flex flex-col gap-1.5');

export const selectTrigger = cva(
  [
    'relative inline-flex justify-between gap-2 cursor-pointer rounded-md',
    'text-text-light dark:text-text-dark',
    'motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-200 motion-safe:ease-[ease]',
    'focus-visible:outline-none focus-visible:shadow-glow-input-focus-light dark:focus-visible:shadow-glow-input-focus',
    'focus-visible:!border-brand-light/50 dark:focus-visible:!border-brand-dark/50',
    'motion-safe:active:scale-[0.98]',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none'
  ],
  {
    variants: {
      variant: {
        regular: [
          'bg-surface-light dark:bg-surface-dark',
          'border border-border-light dark:border-border-dark',
          'hover:border-border-strong-light dark:hover:border-border-strong-dark',
          'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark',
          'active:bg-surface-raised-light dark:active:bg-surface-raised-dark'
        ],
        bordered: [
          'bg-surface-raised-light dark:bg-surface-raised-dark',
          'border border-border-strong-light dark:border-border-strong-dark',
          'hover:border-border-strong-light dark:hover:border-border-strong-dark',
          'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark',
          'active:bg-surface-raised-light dark:active:bg-surface-raised-dark'
        ],
        faded: [
          'bg-transparent',
          'border border-border-light dark:border-border-dark',
          'text-text-secondary-light dark:text-text-secondary-dark',
          'hover:border-border-strong-light dark:hover:border-border-strong-dark',
          'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark',
          'active:bg-surface-raised-light dark:active:bg-surface-raised-dark'
        ],
        underlined: [
          'bg-transparent',
          'border-b border-b-border-strong-light dark:border-b-border-strong-dark',
          'hover:border-b-border-strong-light dark:hover:border-b-border-strong-dark',
          'rounded-none!'
        ]
      },
      size: {
        sm: 'h-12 px-3 fs-small',
        md: 'h-14 px-4 fs-base',
        lg: 'h-16 px-4 fs-h6'
      },
      isInvalid: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        variant: ['regular', 'bordered', 'faded'],
        isInvalid: true,
        class:
          'border-error-light dark:border-error shadow-glow-input-error-light dark:shadow-glow-input-error hover:!border-error-light dark:hover:!border-error'
      },
      {
        variant: 'underlined',
        isInvalid: true,
        class:
          'border-b-error-light dark:border-b-error shadow-glow-input-error-light dark:shadow-glow-input-error hover:!border-error-light dark:hover:!border-error'
      }
    ],
    defaultVariants: {
      variant: 'regular',
      size: 'md',
      isInvalid: false
    }
  }
);

export const selectValue = cva('flex-1 text-left truncate');

export const selectIndicator = cva('motion-safe:transition-[transform,margin-top] motion-safe:duration-200', {
  variants: {
    isOpen: {
      true: 'rotate-180',
      false: 'rotate-0'
    }
  },
  defaultVariants: {
    isOpen: false
  }
});

export const selectPopover = cva([
  'fixed z-50 overflow-auto max-h-60',
  'bg-surface-light dark:bg-surface-dark',
  'border border-border-light dark:border-border-dark',
  'rounded-md',
  'shadow-dropdown-light dark:shadow-dropdown',
  'py-1'
]);

export const selectItem = cva(
  [
    'relative flex items-center cursor-pointer',
    'motion-safe:transition-[background,color] motion-safe:duration-150 motion-safe:ease-out',
    'text-text-light dark:text-text-dark',
    'hover:bg-surface-raised-light dark:hover:bg-white-tint-mid'
  ],
  {
    variants: {
      size: {
        sm: 'px-2.5 py-2 text-sm gap-1.5',
        md: 'px-3 py-2 text-base gap-2',
        lg: 'px-4 py-2.5 text-lg gap-2'
      },
      isSelected: {
        true: 'bg-brand-light/10 dark:bg-brand-dark/10 text-brand-light dark:text-brand-dark',
        false: ''
      },
      isDisabled: {
        true: 'opacity-40 cursor-not-allowed pointer-events-none',
        false: ''
      }
    },
    compoundVariants: [
      {
        isSelected: true,
        class: 'hover:bg-brand-light/15 dark:hover:bg-brand-dark/15'
      }
    ],
    defaultVariants: {
      size: 'md',
      isSelected: false,
      isDisabled: false
    }
  }
);

export const selectLabel = cva(
  [
    'w-auto line-clamp-1 pt-0.5 text-text-light dark:text-text-dark pointer-events-none',
    'motion-safe:transition-[top,font-size,color] motion-safe:duration-200 motion-safe:ease-[ease]'
  ],
  {
    variants: {
      size: {
        sm: 'left-3 font-medium',
        md: 'left-4 font-medium',
        lg: 'left-4 font-medium'
      },
      state: {
        floatingSm: 'top-0.5 fs-xs font-semibold',
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

export const selectLoadingVariants = cva(
  'flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary-light dark:text-text-secondary-dark'
);

export const selectSpinnerVariants = cva([
  'size-5 animate-spin rounded-full border-2 border-border-light border-t-brand-light',
  'dark:border-border-dark dark:border-t-brand-dark motion-reduce:animate-none'
]);

export const selectClearButton = cva([
  'inline-flex items-center justify-center p-0.5 rounded-full shrink-0',
  'text-text-secondary-light dark:text-text-secondary-dark',
  'hover:bg-white-tint-mid dark:hover:bg-white-tint-mid',
  'focus-visible:outline-none focus-visible:shadow-glow-input-focus-light dark:focus-visible:shadow-glow-input-focus'
]);

export const selectErrorMessage = cva('text-sm text-error-light dark:text-error');

export const selectDescription = cva('text-sm text-text-secondary-light dark:text-text-secondary-dark');

export const selectPlaceholder = cva('text-text-muted-light dark:text-text-muted-dark');

export type SelectProps = VariantProps<typeof selectTrigger> & {
  /** @control object */
  options: SelectOption[];
  /** @control text */
  value?: string | null;
  /** @control text */
  defaultValue?: string | null;
  onChange?: (key: string) => void;
  onClear?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  /** @control text */
  placeholder?: string;
  /** @control text */
  label?: string;
  /** @control text */
  description?: string;
  /** @control text */
  errorMessage?: string;
  /** @control boolean @default false */
  isInvalid?: boolean;
  /** @control boolean @default false */
  isDisabled?: boolean;
  /** @control boolean @default false */
  isRequired?: boolean;
  /** @control boolean @default false */
  isLoading?: boolean;
  /** @control boolean @default false */
  isClearable?: boolean;
  /** @control text */
  name?: string;
  /** @control text */
  id?: string;
  /** @control text */
  className?: string;
  /** @control object */
  classNames?: {
    base?: string;
    trigger?: string;
    value?: string;
    indicator?: string;
    popover?: string;
    item?: string;
    clearButton?: string;
    label?: string;
    errorMessage?: string;
  };
};
