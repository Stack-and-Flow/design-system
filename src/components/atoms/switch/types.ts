import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const switchVariants = cva(
  [
    'relative inline-flex items-center cursor-pointer',
    'transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ],
  {
    variants: {
      size: {
        sm: 'w-9 h-5',
        md: 'w-11 h-6',
        lg: 'w-14 h-7'
      },
      color: {}
    }
  }
);

type SwitchSize = 'sm' | 'md' | 'lg';
type SwitchColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type SwitchVariants = 'default' | 'bordered' | 'flat' | 'solid' | 'shadow';
type SwitchRounded = true | false;
type SwitchLabelPlacement = 'top' | 'right' | 'bottom' | 'left';
type SwitchWithIcon = true | false;
type SwitchThumbIcon = true | false;

export type SwitchProps = {
  className?: string;
  children?: ReactNode;
  label?: string;
  /**
   * @control select
   * @default md
   */
  size?: SwitchSize;
  color?: SwitchColor;
  variant?: SwitchVariants;
  labelPlacement?: SwitchLabelPlacement;
  rounded?: SwitchRounded;
  withIcon?: SwitchWithIcon;
  thumbIcon?: SwitchThumbIcon;
  checked?: boolean;
  disabled?: boolean;
};
