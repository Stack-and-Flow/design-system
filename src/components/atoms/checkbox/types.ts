import { cva, type VariantProps } from 'class-variance-authority';
import type { ChangeEvent, ComponentProps, ReactNode } from 'react';

export const checkboxRoot = cva('inline-flex items-start gap-2 text-text-light dark:text-text-dark', {
  variants: {
    disabled: {
      true: 'opacity-40',
      false: ''
    }
  },
  defaultVariants: {
    disabled: false
  }
});

export const checkboxHitArea = cva('relative inline-flex shrink-0 items-center justify-center', {
  variants: {
    disabled: {
      true: 'pointer-events-none cursor-not-allowed',
      false: 'cursor-pointer'
    },
    readOnly: {
      true: 'cursor-default',
      false: ''
    }
  },
  compoundVariants: [
    {
      disabled: false,
      readOnly: true,
      class: 'pointer-events-auto'
    }
  ],
  defaultVariants: {
    disabled: false,
    readOnly: false
  }
});

export const checkboxInput = cva(
  'peer absolute top-1/2 right-0 z-10 m-0 h-11 w-11 -translate-y-1/2 appearance-none rounded-xs opacity-0',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer'
      },
      readOnly: {
        true: 'cursor-default',
        false: ''
      }
    },
    defaultVariants: {
      disabled: false,
      readOnly: false
    }
  }
);

export const checkboxControl = cva(
  [
    'pointer-events-none relative inline-flex items-center justify-center border',
    'transition-[background-color,border-color,box-shadow,scale,color] duration-200 ease-out',
    'peer-hover:bg-surface-raised-light dark:peer-hover:bg-surface-raised-dark',
    'peer-active:scale-[0.98]',
    'peer-focus-visible:shadow-glow-focus-light dark:peer-focus-visible:shadow-glow-focus-dark'
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4 rounded-xs',
        md: 'h-5 w-5 rounded-xs',
        lg: 'h-6 w-6 rounded-xs'
      },
      variant: {
        default: '',
        primary: '',
        secondary: '',
        danger: ''
      },
      state: {
        unchecked: 'border-border-strong-light bg-surface-light dark:border-border-strong-dark dark:bg-surface-dark',
        checked: '',
        indeterminate: ''
      },
      invalid: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        variant: 'default',
        state: ['checked', 'indeterminate'],
        invalid: false,
        class:
          'border-brand-light bg-brand-light peer-hover:border-brand-light peer-hover:bg-brand-light dark:border-brand-dark dark:bg-brand-dark dark:peer-hover:border-brand-dark dark:peer-hover:bg-brand-dark'
      },
      {
        variant: 'primary',
        state: ['checked', 'indeterminate'],
        invalid: false,
        class:
          'border-brand-light bg-brand-light shadow-glow-btn-primary-light peer-hover:border-brand-light peer-hover:bg-brand-light dark:border-brand-dark dark:bg-brand-dark dark:shadow-glow-btn-primary dark:peer-hover:border-brand-dark dark:peer-hover:bg-brand-dark'
      },
      {
        variant: 'secondary',
        state: ['checked', 'indeterminate'],
        invalid: false,
        class:
          'border-border-strong-light bg-surface-raised-light text-brand-light dark:border-border-strong-dark dark:bg-surface-raised-dark dark:text-brand-dark-light'
      },
      {
        variant: 'danger',
        state: ['checked', 'indeterminate'],
        invalid: false,
        class:
          'border-error-light bg-error-light peer-hover:border-error-light peer-hover:bg-error-light dark:border-error dark:bg-error dark:peer-hover:border-error dark:peer-hover:bg-error'
      },
      {
        invalid: true,
        state: 'unchecked',
        class:
          'border-error-light bg-surface-light shadow-glow-input-error-light dark:border-error dark:bg-surface-dark dark:shadow-glow-input-error'
      },
      {
        invalid: true,
        state: ['checked', 'indeterminate'],
        class:
          'border-error-light bg-error-light peer-hover:border-error-light peer-hover:bg-error-light dark:border-error dark:bg-error dark:peer-hover:border-error dark:peer-hover:bg-error'
      }
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      state: 'unchecked',
      invalid: false
    }
  }
);

export const checkboxIndicator = cva('pointer-events-none text-white transition-opacity duration-200 ease-out', {
  variants: {
    size: {
      sm: 'h-2.5 w-2.5',
      md: 'h-3 w-3',
      lg: 'h-3.5 w-3.5'
    },
    variant: {
      default: 'text-white',
      primary: 'text-white',
      secondary: 'text-brand-light dark:text-brand-dark-light',
      danger: 'text-white'
    },
    invalid: {
      true: 'text-white',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    invalid: false
  }
});

export const checkboxLabel = cva('select-none font-medium text-text-light dark:text-text-dark', {
  variants: {
    size: {
      sm: 'fs-small',
      md: 'fs-base',
      lg: 'fs-h6'
    },
    disabled: {
      true: '',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    disabled: false
  }
});

export const checkboxDescription = cva('text-text-secondary-light dark:text-text-secondary-dark', {
  variants: {
    size: {
      sm: 'fs-small',
      md: 'fs-small',
      lg: 'fs-base'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const checkboxError = cva('text-error-light dark:text-error', {
  variants: {
    size: {
      sm: 'fs-small',
      md: 'fs-small',
      lg: 'fs-base'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

type CheckboxControlVariants = VariantProps<typeof checkboxControl>;
type CheckboxRootVariants = VariantProps<typeof checkboxRoot>;

type NativeCheckboxProps = Omit<
  ComponentProps<'input'>,
  | 'checked'
  | 'children'
  | 'className'
  | 'defaultChecked'
  | 'disabled'
  | 'onChange'
  | 'readOnly'
  | 'size'
  | 'type'
  | 'aria-describedby'
  | 'aria-label'
  | 'aria-labelledby'
>;

export type CheckboxSize = NonNullable<CheckboxControlVariants['size']>;
export type CheckboxVariant = NonNullable<CheckboxControlVariants['variant']>;
export type CheckboxVisualState = NonNullable<CheckboxControlVariants['state']>;

type CheckboxVisibleLabelProps =
  | {
      /** @control text */
      label: string;
      labelHtml?: never;
    }
  | {
      label?: never;
      /** @control text */
      labelHtml: string;
    };

type CheckboxProgrammaticNameProps =
  | {
      label?: never;
      labelHtml?: never;
      /** @control text */
      ariaLabel: string;
      'aria-label'?: string;
      ariaLabelledBy?: string | string[];
      'aria-labelledby'?: string;
    }
  | {
      label?: never;
      labelHtml?: never;
      ariaLabel?: string;
      /** @control text */
      'aria-label': string;
      ariaLabelledBy?: string | string[];
      'aria-labelledby'?: string;
    }
  | {
      label?: never;
      labelHtml?: never;
      ariaLabel?: string;
      'aria-label'?: string;
      /** @control text */
      ariaLabelledBy: string | string[];
      'aria-labelledby'?: string;
    }
  | {
      label?: never;
      labelHtml?: never;
      ariaLabel?: string;
      'aria-label'?: string;
      ariaLabelledBy?: string | string[];
      /** @control text */
      'aria-labelledby': string;
    };

type CheckboxNameProps = CheckboxVisibleLabelProps | CheckboxProgrammaticNameProps;

type CheckboxCommonProps = {
  /** @control text */
  className?: string;
  /** @control text */
  inputClassName?: string;
  /** @control text */
  controlClassName?: string;
  /** @control object */
  description?: ReactNode;
  /** @control object */
  errorMessage?: ReactNode;
  /** @control text */
  ariaLabel?: string;
  /** @control text */
  'aria-label'?: string;
  /** @control text */
  ariaLabelledBy?: string | string[];
  /** @control text */
  'aria-labelledby'?: string;
  /** @control text */
  ariaDescribedBy?: string | string[];
  /** @control text */
  'aria-describedby'?: string;
  /** @control select */
  variant?: CheckboxVariant;
  /** @control select */
  size?: CheckboxSize;
  /** @control boolean */
  checked?: boolean;
  /** @control boolean */
  defaultChecked?: boolean;
  /** @control boolean */
  indeterminate?: boolean;
  /** @control boolean */
  disabled?: boolean;
  /** @control boolean */
  readOnly?: boolean;
  /** @control boolean */
  invalid?: boolean;
  /** @control action */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
};

export type CheckboxProps = NativeCheckboxProps & CheckboxCommonProps & CheckboxNameProps;

export type CheckboxRootState = NonNullable<CheckboxRootVariants['disabled']>;
