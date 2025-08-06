import type { BgThemeColors, TextThemeColors } from '@/components/utils/types';

export type DividerProps = {
  /** Props for the Divider component */

  orientation?: 'horizontal' | 'vertical';

  /**
   * @control select
   * @default sm
   */

  width?: 'sm' | 'md' | 'lg';

  /**
   * @control select
   * @default sm
   */

  height?: 'sm' | 'md' | 'lg';

  /**
   * @control select
   */

  horizontalColor?: TextThemeColors;

  /**
   * @control select
   */

  verticalColor?: BgThemeColors;
};

/* 

color?: TextThemeColors;

darkColor?: TextDarkThemeColors;

export type DividerProps = {
  /** Props for the Divider component 
  
};

import { TextThemeColors, TextDarkThemeColors } from "@/components/utils/types";


*/
