import type { BgThemeColors } from '@/components/utils/types';
import { cva } from 'class-variance-authority';

export const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'h-px w-[4px]',
      vertical: 'w-px h-[4px]'
    },
    corner: {
      rounded: 'rounded-[4px]',
      none: 'rounded-none'
    },
    thickness: {
      xs: 'p-[0px]',
      sm: 'p-[2px]',
      md: 'p-[3px]',
      lg: 'p-[5px]'
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
type DividerThickness = 'xs' | 'sm' | 'md' | 'lg';
type DividerCorner = 'rounded' | 'none';
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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * @control select
   * @default xs
   */
  corner?: DividerCorner;

  /**
   * @control select
   * @default xs
   */
  thickness?: DividerThickness;
};
