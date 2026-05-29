import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { hintMessageVariants as inputHintMessageVariants } from '@/components/atoms/input/types';

export type SelectOption = {
  key: string;
  label: string;
  disabled?: boolean;
  description?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type SelectHint = {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
};

/** Re-exported from Input for consistency — avoids API drift. */
export const hintMessageVariants = inputHintMessageVariants;

export const selectBase = cva('relative flex max-w-full flex-col gap-2', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-56'
    }
  },
  defaultVariants: {
    fullWidth: false
  }
});

const selectLineVariantClasses = [
  'bg-transparent border-t-transparent border-l-transparent border-r-transparent rounded-none!',
  'border-b-border-light hover:border-b-border-strong-light',
  'dark:border-b-border-dark dark:hover:border-b-border-strong-dark'
];

export const selectTrigger = cva(
  [
    'relative flex w-full max-w-full justify-between overflow-hidden border py-2 cursor-pointer rounded-md',
    'text-text-light dark:text-text-dark',
    'transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
    'focus-within:outline-none focus-within:!border-brand-light/50 focus-within:shadow-glow-input-focus-light',
    'dark:focus-within:!border-brand-dark/50 dark:focus-within:shadow-glow-input-focus'
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
        faded: selectLineVariantClasses,
        line: selectLineVariantClasses,
        underlined: [
          'bg-transparent border-border-light hover:border-border-strong-light',
          'dark:border-border-dark dark:hover:border-border-strong-dark'
        ]
      },
      size: {
        sm: 'h-12 px-3 fs-small gap-2',
        md: 'h-14 px-4 fs-base gap-3',
        lg: 'h-16 px-4 fs-h6 gap-3'
      },
      status: {
        default: '',
        error:
          'border-error-light shadow-glow-input-error-light hover:!border-error-light focus-within:!border-error-light dark:border-error dark:shadow-glow-input-error dark:hover:!border-error dark:focus-within:!border-error',
        warning:
          'border-warning-light shadow-glow-input-warning-light hover:!border-warning-light focus-within:!border-warning-light dark:border-warning dark:shadow-glow-input-warning dark:hover:!border-warning dark:focus-within:!border-warning',
        success:
          'border-success-light shadow-glow-input-success-light hover:!border-success-light focus-within:!border-success-light dark:border-success dark:shadow-glow-input-success dark:hover:!border-success dark:focus-within:!border-success',
        info: ''
      }
    },
    compoundVariants: [
      {
        variant: 'underlined',
        status: 'error',
        class:
          'border-b-error-light dark:border-b-error shadow-glow-input-error-light dark:shadow-glow-input-error hover:!border-error-light dark:hover:!border-error'
      },
      {
        variant: 'underlined',
        status: 'warning',
        class:
          'border-b-warning-light dark:border-b-warning shadow-glow-input-warning-light dark:shadow-glow-input-warning hover:!border-warning-light dark:hover:!border-warning'
      },
      {
        variant: 'underlined',
        status: 'success',
        class:
          'border-b-success-light dark:border-b-success shadow-glow-input-success-light dark:shadow-glow-input-success hover:!border-success-light dark:hover:!border-success'
      }
    ],
    defaultVariants: {
      variant: 'regular',
      size: 'md',
      status: 'default'
    }
  }
);

export const selectContent = cva('flex min-w-0 flex-1', {
  variants: {
    hasLabel: {
      true: 'items-end',
      false: 'items-center'
    }
  },
  defaultVariants: {
    hasLabel: false
  }
});

export const selectNativeTrigger = cva([
  'flex min-w-0 w-full flex-1 items-end border-none bg-transparent p-0 text-left outline-none font-medium',
  'text-text-light dark:text-text-dark disabled:cursor-not-allowed'
]);

export const selectValue = cva('block min-w-0 flex-1 text-left truncate');

export const selectActionGroup = cva('flex shrink-0 items-center self-stretch', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-1.5'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const selectIndicator = cva(
  'grid size-5 shrink-0 place-items-center text-brand-light dark:text-brand-dark origin-center leading-none transition-transform duration-300 ease-out',
  {
    variants: {
      isOpen: {
        true: 'rotate-90',
        false: 'rotate-0'
      }
    },
    defaultVariants: {
      isOpen: false
    }
  }
);

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

export const selectLoadingVariants = cva(
  'flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary-light dark:text-text-secondary-dark'
);

export const selectSpinnerVariants = cva([
  'size-5 animate-spin rounded-full border-2 border-border-light border-t-brand-light',
  'dark:border-border-dark dark:border-t-brand-dark motion-reduce:animate-none'
]);

export const selectClearButton = cva([
  'inline-flex items-center justify-center p-0.5 rounded-full shrink-0',
  'border-none bg-transparent cursor-pointer',
  'text-text-secondary-light dark:text-text-secondary-dark',
  'hover:bg-white-tint-mid dark:hover:bg-white-tint-mid',
  'focus-visible:outline-none focus-visible:shadow-glow-input-focus-light dark:focus-visible:shadow-glow-input-focus'
]);

/** @deprecated Use hintMessageVariants with hint pattern instead. */
export const selectErrorMessage = cva('text-sm text-error-light dark:text-error');

export const selectDescription = cva('text-sm text-text-secondary-light dark:text-text-secondary-dark');

export const selectPlaceholder = cva('text-text-secondary-light dark:text-text-secondary-dark');

type NativeSelectTriggerProps = Omit<
  ComponentProps<'button'>,
  'children' | 'className' | 'defaultValue' | 'disabled' | 'onChange' | 'value'
>;

export type SelectProps = NativeSelectTriggerProps &
  VariantProps<typeof selectTrigger> & {
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
    /**
     * @control text
     * @deprecated Use `hint` instead. `errorMessage` maps to `hint: { message: errorMessage, type: 'error' }`.
     */
    errorMessage?: string;
    /**
     * @control boolean @default false
     * @deprecated Use `hint` instead. `isInvalid` maps to `status: 'error'`.
     */
    isInvalid?: boolean;
    /** @control boolean @default false */
    isDisabled?: boolean;
    /** @control boolean @default false */
    isRequired?: boolean;
    /** @control boolean @default false */
    isLoading?: boolean;
    /** @control boolean @default false */
    isClearable?: boolean;
    /** @control boolean @default false */
    isFullWidth?: boolean;
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
      container?: string;
      value?: string;
      indicator?: string;
      popover?: string;
      item?: string;
      clearButton?: string;
      label?: string;
      errorMessage?: string;
      hint?: string;
    };
    /** @control object */
    hint?: SelectHint;
  };
