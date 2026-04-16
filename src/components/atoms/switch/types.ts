import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const switchBase = cva(
  [
    'relative inline-flex items-center cursor-pointer',
    'transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
    'disabled:cursor-not-allowed disabled:opacity-30'
  ],
  {
    variants: {
      labelPlacement: {
        top: 'flex-col-reverse gap-2',
        right: 'flex-row gap-2',
        bottom: 'flex-col gap-2',
        left: 'flex-row-reverse gap-2'
      }
    },
    defaultVariants: {
      labelPlacement: 'right'
    }
  }
);

export const switchWrapper = cva(
  [
    'flex-shrink-0 relative inline-flex cursor-pointer',
    'bg-gray-400 dark:bg-gray-800 flex items-center justify-center gap-6'
  ],
  {
    variants: {
      size: {
        sm: 'w-9 h-5',
        md: 'w-12 h-6',
        lg: 'w-16 h-8'
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-lg'
      },
      disabled: {
        true: 'opacity-30 cursor-not-allowed'
      }
    },
    defaultVariants: {
      size: 'md',
      rounded: true
    }
  }
);

export const switchTrack = cva(['relative w-full h-full p-0.5 flex items-center transition-colors duration-300'], {
  variants: {
    size: {
      sm: 'w-8 h-2 p-0.5 peer-checked:[&>span[data-thumb]]:translate-x-4',
      md: 'w-10 h-3 p-0.5 peer-checked:[&>span[data-thumb]]:translate-x-5.5',
      lg: 'w-12 h-4 p-0.5 peer-checked:[&>span[data-thumb]]:translate-x-8'
    },
    color: {
      default: [
        'bg-[var(--color-border-dark)]',
        'peer-checked:bg-[var(--color-brand-light)] dark:peer-checked:bg-[var(--color-brand-dark)]'
      ],
      disabled: [
        'bg-[var(--color-border-dark)] opacity-50',
        'peer-checked:bg-[var(--color-brand-light)]'
      ],
      transparent: 'bg-transparent border border-[var(--color-border-dark)] peer-checked:border-[var(--color-brand-dark)]'
    },
    variant: {
      default: '',
      bordered: 'border',
      glass:
        'bg-white/30 backdrop-blur-md border border-white/30 shadow-md peer-checked:bg-[var(--color-brand-light)]/70 border-[var(--color-brand-light)]/50 dark:peer-checked:bg-[var(--color-brand-dark)]/60',
      shadow: 'bg-transparent shadow-gray-500 shadow-md peer-checked:shadow-[var(--color-brand-dark)]/90'
    },
    rounded: {
      true: 'rounded-full',
      false: 'rounded-md'
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
    rounded: true
  }
});

export const switchThumb = cva(['absolute rounded-full transition-transform duration-300 left-1 top-0.8 z-10'], {
  variants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    },
    color: {
      default: 'bg-white',
      disabled: 'bg-white opacity-70',
      transparent: 'bg-white'
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'default'
  }
});

export const switchLabel = cva(['select-none'], {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg'
    },
    disabled: {
      true: 'opacity-30 cursor-not-allowed'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
export const switchStartContent = cva(
  'absolute left-1.5 flex items-center justify-center pointer-events-none transition-opacity duration-300 opacity-100 peer-checked:opacity-0'
);
export const switchEndContent = cva(
  'absolute right-2 flex items-center justify-center pointer-events-none transition-opacity duration-300 opacity-100 peer-checked:opacity-0'
);
export const switchHiddenInput = cva('sr-only peer');
export const switchThumbIcon = cva('flex items-center justify-center w-full h-full');

type SwitchSize = 'sm' | 'md' | 'lg';
type SwitchColor = 'default' | 'disabled' | 'transparent';
type SwitchVariants = 'default' | 'bordered' | 'glass' | 'shadow';
type SwitchRounded = true | false;
type SwitchLabelPlacement = 'top' | 'right' | 'bottom' | 'left';

export type SwitchProps = {
  className?: string;
  children?: ReactNode;
  label?: string;
  /**
   * @control select
   * @default md
   */
  size?: SwitchSize;
  /**
   * @control select
   * @default default
   */
  color?: SwitchColor;
  /**
   * @control select
   * @default default
   */
  variant?: SwitchVariants;
  /**
   * @control switch
   * @default true
   */
  rounded?: SwitchRounded;
  /**
   * @control select
   * @default right
   */
  labelPlacement?: SwitchLabelPlacement;
  /**
   * @control select
   * @default false
   */
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  startContent?: ReactNode;
  thumbIcon?: ReactNode;
  endContent?: ReactNode;
  role?: string;
  ariaLabel?: string;
  ariaChecked?: boolean;
  tabIndex?: string | number;
};
