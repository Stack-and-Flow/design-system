import type { BgThemeColors } from '@/components/utils/types';
import { cva } from 'class-variance-authority';

export const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'h-px w-[4px]',
      vertical: 'w-px h-[4px]'
    },
    lengthX: {
      xs: 'w-8',
      sm: 'w-16',
      md: 'w-32',
      lg: 'w-64',
      xl: 'w-96'
    },
    lengthY: {
      xs: 'h-8',
      sm: 'h-16',
      md: 'h-32'
    },
    thickness: {
      xs: 'p-[0px]',
      sm: 'p-[2px]',
      md: 'p-[3px]',
      lg: 'p-[5px]'
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
      class: 'h-px'
    },
    {
      orientation: 'vertical',
      class: 'w-px'
    }
  ],
  defaultVariants: {
    orientation: 'horizontal'
  }
});

type DividerOrientation = 'horizontal' | 'vertical';
type DividerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type DividerHeight = 'xs' | 'sm' | 'md';
type DividerThickness = 'xs' | 'sm' | 'md' | 'lg';
type DividerHover = 'none' | 'bright' | 'zoom';

export type DividerProps = {
  /** Props for the Divider component */

  /**
   * @control select
   * @default horizontal
   */
  orientation?: DividerOrientation;

  /**
   * @control select
   * @default bg-primary
   */
  color?: BgThemeColors;

  /**
   * @control select
   * @default xs
   */
  lengthX?: DividerWidth;

  /**
   * @control select
   * @default xs
   */
  lengthY?: DividerHeight;

  /**
   * @control select
   * @default xs
   */
  thickness?: DividerThickness;

  /**
   * @control select
   * @default none
   */
  hover?: DividerHover;
};
