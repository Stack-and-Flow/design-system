import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const switchBase = cva(
  [
    'relative inline-flex items-center cursor-pointer select-none',
    'text-text-light dark:text-text-dark',
    'transition-[color,opacity] duration-200 ease-out'
  ],
  {
    variants: {
      labelPlacement: {
        top: 'flex-col-reverse gap-0.5',
        right: 'flex-row gap-2',
        bottom: 'flex-col gap-0.5',
        left: 'flex-row-reverse gap-2'
      },
      disabled: {
        true: 'cursor-not-allowed pointer-events-none opacity-40',
        false: ''
      }
    },
    defaultVariants: {
      labelPlacement: 'right',
      disabled: false
    }
  }
);

export const switchWrapper = cva(
  [
    'relative inline-flex min-h-touch-target-min min-w-touch-target-min shrink-0 items-center justify-center',
    'cursor-pointer transition-opacity duration-200 ease-out'
  ],
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed pointer-events-none',
        false: ''
      }
    },
    defaultVariants: {
      disabled: false
    }
  }
);

export const switchTrack = cva(
  [
    'relative inline-flex items-center border p-0.5',
    'text-text-light dark:text-text-dark peer-checked:text-text-dark',
    'transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-in-out',
    'hover:bg-surface-raised-light dark:hover:bg-white-tint-heavy',
    'peer-checked:hover:bg-brand-light-darker! dark:peer-checked:hover:bg-brand-dark-darkest!',
    'active:scale-[0.98]',
    'peer-focus-visible:focus-ring',
    'peer-checked:[&>span[data-thumb=true]]:bg-white dark:peer-checked:[&>span[data-thumb=true]]:bg-white',
    'peer-checked:[&>span[data-thumb=true]>span[data-thumb-icon=true]]:text-brand-light dark:peer-checked:[&>span[data-thumb=true]>span[data-thumb-icon=true]]:text-brand-dark-dark',
    'peer-checked:[&>span[data-start-content=true]]:opacity-0 peer-checked:[&>span[data-end-content=true]]:opacity-100'
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9 peer-checked:[&>span[data-thumb=true]]:translate-x-[14px]',
        md: 'h-6 w-12 peer-checked:[&>span[data-thumb=true]]:translate-x-[22px]',
        lg: 'h-8 w-16 peer-checked:[&>span[data-thumb=true]]:translate-x-[30px]'
      },
      color: {
        default: [
          'border-border-strong-light bg-surface-raised-light dark:border-white-tint-high dark:bg-white-tint-strong',
          'peer-checked:border-brand-light-darker peer-checked:bg-brand-light-darker dark:peer-checked:border-brand-dark-darkest dark:peer-checked:bg-brand-dark-darkest'
        ],
        transparent: [
          'border border-border-strong-light bg-transparent dark:border-border-strong-dark',
          'peer-checked:border-brand-light peer-checked:bg-red-tint-subtle dark:peer-checked:border-brand-dark'
        ],
        disabled: [
          'border-border-strong-light bg-surface-raised-light dark:border-white-tint-high dark:bg-white-tint-strong',
          'peer-checked:border-brand-light-darker peer-checked:bg-brand-light-darker dark:peer-checked:border-brand-dark-darkest dark:peer-checked:bg-brand-dark-darkest'
        ]
      },
      variant: {
        default: '',
        bordered: [
          'bg-transparent dark:bg-transparent',
          'border-border-strong-light dark:border-white-tint-high',
          'hover:border-brand-light dark:hover:border-brand-dark-light',
          'peer-checked:border-brand-light! peer-checked:bg-red-tint-active! dark:peer-checked:border-brand-dark! dark:peer-checked:bg-red-tint-strong!',
          'peer-checked:hover:border-brand-light! dark:peer-checked:hover:border-brand-dark-light!'
        ],
        glass: [
          'border-white-tint-high bg-white-tint-mid backdrop-blur-sm dark:bg-white-tint-faint',
          'hover:bg-white-tint-strong dark:hover:bg-white-tint-mid',
          'peer-checked:border-red-tint-border! peer-checked:bg-red-tint-mid! dark:peer-checked:border-brand-dark! dark:peer-checked:bg-red-tint-active!',
          'peer-checked:hover:bg-red-tint-active! dark:peer-checked:hover:bg-red-tint-strong!'
        ]
      },
      emphasis: {
        default: '',
        flat: ''
      },
      rounded: {
        true: 'rounded-pill',
        false: 'rounded-md'
      }
    },
    compoundVariants: [
      {
        emphasis: 'default',
        class:
          'shadow-glow-btn-secondary-light dark:shadow-glow-btn-secondary hover:shadow-glow-btn-secondary-hover-light dark:hover:shadow-glow-btn-secondary-hover peer-checked:shadow-glow-btn-primary-light dark:peer-checked:shadow-glow-btn-primary peer-checked:hover:shadow-glow-btn-primary-hover-light dark:peer-checked:hover:shadow-glow-btn-primary-hover'
      }
    ],
    defaultVariants: {
      size: 'md',
      color: 'default',
      variant: 'default',
      emphasis: 'default',
      rounded: true
    }
  }
);

export const switchThumb = cva(
  ['absolute left-0.5 z-10 translate-x-0 rounded-full', 'transition-all duration-300 ease-in-out'],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-7 w-7'
      },
      color: {
        default: 'bg-white dark:bg-white-tint-heavy',
        transparent: 'bg-white dark:bg-white-tint-heavy',
        disabled: 'bg-white dark:bg-white-tint-heavy'
      }
    },
    defaultVariants: {
      size: 'md',
      color: 'default'
    }
  }
);

export const switchLabel = cva('select-none', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    },
    disabled: {
      true: 'cursor-not-allowed',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    disabled: false
  }
});

export const switchStartContent = cva(
  'pointer-events-none absolute left-1.5 z-20 flex items-center justify-center text-text-secondary-light opacity-100 transition-opacity duration-300 ease-in-out dark:text-text-secondary-dark'
);

export const switchEndContent = cva(
  'pointer-events-none absolute right-2 z-20 flex items-center justify-center text-brand-light opacity-0 transition-opacity duration-300 ease-in-out dark:text-brand-dark-dark'
);

export const switchHiddenInput = cva('peer sr-only');

export const switchThumbIcon = cva(
  'flex h-full w-full items-center justify-center text-text-secondary-light transition-colors duration-300 ease-in-out dark:text-text-secondary-dark'
);

type SwitchBaseVariants = VariantProps<typeof switchBase>;
type SwitchTrackVariants = VariantProps<typeof switchTrack>;

type NativeSwitchProps = Omit<
  ComponentProps<'input'>,
  | 'aria-checked'
  | 'children'
  | 'checked'
  | 'className'
  | 'color'
  | 'defaultChecked'
  | 'onChange'
  | 'role'
  | 'size'
  | 'type'
>;

export type SwitchSize = NonNullable<SwitchTrackVariants['size']>;
export type SwitchColor = NonNullable<SwitchTrackVariants['color']>;
export type SwitchVariant = NonNullable<SwitchTrackVariants['variant']>;
export type SwitchEmphasis = NonNullable<SwitchTrackVariants['emphasis']>;
export type SwitchRounded = NonNullable<SwitchTrackVariants['rounded']>;
export type SwitchLabelPlacement = NonNullable<SwitchBaseVariants['labelPlacement']>;

type SwitchAccessibleNameProps =
  | {
      label: string;
      ariaLabel?: string;
      'aria-label'?: string;
    }
  | {
      label?: string;
      ariaLabel: string;
      'aria-label'?: string;
    }
  | {
      label?: string;
      ariaLabel?: string;
      'aria-label': string;
    };

type SwitchCommonProps = {
  /** @control text */
  className?: string;
  /**
   * @control select
   * @default md
   */
  size?: SwitchSize;
  /**
   * @control select
   * @default default
   * Legacy note: `color="disabled"` is preserved for compatibility, but `disabled` should be used for disabled semantics.
   */
  color?: SwitchColor;
  /**
   * @control select
   * @default default
   */
  variant?: SwitchVariant;
  /**
   * @control select
   * @default default
   */
  emphasis?: SwitchEmphasis;
  /**
   * @control boolean
   * @default true
   */
  rounded?: SwitchRounded;
  /**
   * @control select
   * @default right
   */
  labelPlacement?: SwitchLabelPlacement;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control boolean
   * @default false
   */
  checked?: boolean;
  /**
   * @control boolean
   * @default false
   */
  defaultChecked?: boolean;
  /** @control action */
  onChange?: (checked: boolean) => void;
  /** @control object */
  startContent?: ReactNode;
  /** @control object */
  thumbIcon?: ReactNode;
  /** @control object */
  endContent?: ReactNode;
  /** @control text */
  ariaLabel?: string;
  /** @control text */
  'aria-label'?: string;
  /**
   * @deprecated The input always uses role="switch" so semantics cannot drift.
   * @control text
   */
  role?: string;
  /**
   * @deprecated `aria-checked` is derived from the checked state so it cannot drift.
   * @control boolean
   */
  ariaChecked?: boolean;
};

export type SwitchProps = NativeSwitchProps & SwitchCommonProps & SwitchAccessibleNameProps;
