import type { BgThemeColors } from '@/components/utils/types';
import { cva } from 'class-variance-authority';

export const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'border-none h-px',
      vertical: 'border-none w-px'
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
    orientation: 'horizontal',
    sizeWidth: 'md',
    sizeHeight: 'md'
  }
});

type DividerOrientation = 'horizontal' | 'vertical';
type DividerWidth = 'xs' | 'sm' | 'md' | 'lg' | 'full';
type DividerHeight = 'sm' | 'md' | 'lg';
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
};
