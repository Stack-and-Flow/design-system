import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const switchBase = cva(
  [
    'relative inline-flex items-center cursor-pointer gap-2',
    'transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'text-gray-dark-900 dark:text-gray-light-300',
    'disabled:cursor-not-allowed disabled:opacity-30'
  ],
  {
    variants: {
      labelPlacement: {
        top: 'flex-col-reverse gap-4',
        right: 'flex-row gap-4',
        bottom: 'flex-col gap-4',
        left: 'flex-row-reverse gap-4'
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
        md: 'w-12 h-8',
        lg: 'w-16 h-10'
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
      sm: 'w-8 h-4 p-0.5 peer-checked:[&>span]:translate-x-4.5',
      md: 'w-10 h-5 p-0.5 peer-checked:[&>span]:translate-x-5.5',
      lg: 'w-12 h-6 p-0.5 peer-checked:[&>span]:translate-x-8'
    },
    color: {
      default: 'bg-transparent-300 peer-checked:bg-blue-500',
      primary: 'bg-transparent-300 peer-checked:bg-primary',
      success: 'bg-transparent-300 peer-checked:bg-green-500',
      warning: 'bg-transparent-300 peer-checked:bg-yellow-500',
      danger: 'bg-transparent-300 peer-checked:bg-red-500',
      disabled: 'bg-transparent-300 peer-checked:bg-blue-500 opacity-30'
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
      md: 'h-4.5 w-4.5',
      lg: 'h-6 w-6'
    },
    variant: {
      default: 'bg-white shadow-md',
      flat: 'bg-gray-200 dark:bg-white-600',
      glass: 'bg-white/50 backdrop-blur-md shadow-inner',
      shadow: 'bg-white drop-shadow-lg drop-shadow-white',
      neon: 'bg-gray-light-100 shadow-[0_0_10px_#ec4899]'
    }
  },
  defaultVariants: {
    size: 'md',
    variant: 'default'
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
  'mr-1 flex items-center justify-center transition-opacity duration-300 pointer-events-none text-white/90 peer-checked:opacity-0'
);
export const switchEndContent = cva(
  'ml-1 flex items-center justify-center transition-opacity duration-300 pointer-events-none text-white/90 opacity-0 peer-checked:opacity-100'
);
export const switchHiddenInput = cva('sr-only peer');
export const switchThumbIcon = cva('flex items-center justify-center w-full h-full');

type SwitchSize = 'sm' | 'md' | 'lg';
type SwitchColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'disabled';
type SwitchVariants = 'default' | 'flat' | 'shadow' | 'neon' | 'glass';
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
   * @default secondary
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
