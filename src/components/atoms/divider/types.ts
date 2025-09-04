import { cva } from 'class-variance-authority';

export const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'border-t-2 h-1',
      vertical: 'border-l-2 w-1'
    },
    color: {
      primary: 'bg-red-600 border border-red-600',
      secondary: 'bg-slate-600 border border-slate-600',
      success: 'bg-lime-700 border border-lime-700',
      warning: 'bg-yellow-700 border border-yellow-700'
    },
    sizeWidth: {
      xs: 'w-8',
      sm: 'w-16',
      md: 'w-32',
      lg: 'w-96',
      full: 'w-2xl'
    },
    sizeHeight: {
      sm: 'h-8',
      md: 'h-16',
      lg: 'h-32'
    },
    hover: {
      none: '',
      bright: 'transition-[filter] duration-200 ease-in hover:brightness-150',
      zoom: 'transition-[scale] duration-200 ease-in hover:scale-105'
    },
    animation: {
      none: '',
      kitt: false,
      border: 'animate-[border_1s_infinite]'
    }
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      class: 'h-1'
    },
    {
      orientation: 'vertical',
      class: 'w-1'
    }
  ],
  defaultVariants: {
    orientation: 'horizontal',
    color: 'primary',
    sizeWidth: 'md',
    sizeHeight: 'md'
  }
});

type DividerOrientation = 'horizontal' | 'vertical';
type DividerColor = 'primary' | 'secondary' | 'success' | 'warning';
type DividerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'full';
type DividerHeight = 'sm' | 'md' | 'lg';
type DividerHover = 'none' | 'bright' | 'zoom';
type DividerAnimation = 'none' | 'kitt' | 'border';

export type DividerProps = {
  /** Props for the Divider component */

  /**
   * @control select
   * @default vertical
   */
  orientation?: DividerOrientation;

  /**
   * @control select
   * @default primary
   */
  color?: DividerColor;

  /**
   * @control select
   * @default lg
   */
  sizeWidth?: DividerWidth;

  /**
   * @control select
   * @default md
   */
  sizeHeight?: DividerHeight;

  /**
   * @control select
   * @default none
   */
  hover?: DividerHover;

  /**
   * @control select
   * @default none
   */
  animation?: DividerAnimation;
};
