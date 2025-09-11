import type { BgThemeColors } from '@/components/utils/types';
import { cva } from 'class-variance-authority';

export const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'border-none pt-px',
      vertical: 'border-none pl-px'
    },
    thicknessY: {
      thin: 'w-px',
      medium: 'w-[2px]',
      thick: 'w-[4px]'
    },
    lengthX: {
      xs: 'pl-8',
      sm: 'pl-16',
      md: 'pl-32',
      lg: 'pl-64',
      full: 'pl-96'
    },
    thicknessX: {
      thin: 'h-px',
      medium: 'h-[2px]',
      thick: 'h-[4px]'
    },
    lengthY: {
      sm: 'pt-8',
      md: 'pt-16',
      lg: 'pt-32'
    },
    hover: {
      none: '',
      bright: 'transition-[filter] duration-200 ease-in hover:brightness-150',
      zoom: 'transition-[scale] duration-200 ease-in hover:scale-105'
    }
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      class: 'pt-px'
    },
    {
      orientation: 'vertical',
      class: 'pl-px'
    }
  ],
  defaultVariants: {
    orientation: 'horizontal',
    lengthX: 'md',
    lengthY: 'md',
    thicknessY: 'thin'
  }
});

type DividerOrientation = 'horizontal' | 'vertical';
type DividerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'full';
type ThicknessX = 'thin' | 'medium' | 'thick';
type DividerHeight = 'sm' | 'md' | 'lg';
type ThicknessY = 'thin' | 'medium' | 'thick';
type DividerHover = 'none' | 'bright' | 'zoom';

export type DividerProps = {
  /** Props for the Divider component */

  /**
   * @control select
   * @default vertical
   */
  orientation?: DividerOrientation;

  /**
   * @control select
   * @default bg-primary
   */
  color?: BgThemeColors;

  /**
   * @control select
   * @default lg
   */
  lengthX?: DividerWidth;

  /**
   * @control select
   * @default thin
   */
  thicknessX?: ThicknessX;

  /**
   * @control select
   * @default md
   */
  lengthY?: DividerHeight;

  /**
   * @control select
   * @default thin
   */
  thicknessY?: ThicknessY;

  /**
   * @control select
   * @default none
   */
  hover?: DividerHover;
};
