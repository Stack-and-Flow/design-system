import type { DynamicIconName, IconSizes, TextDarkThemeColors, TextThemeColors } from '@/types';

export type IconProps = {
  /** @control select*/
  name: DynamicIconName;
  /**
   * @control select
   * @default text-color-brand-light
   * */
  color?: TextThemeColors;
  /**
   * @control select
   * @default dark:text-color-brand-dark
   */
  colorDark?: TextDarkThemeColors;
  /**
   * @control select
   * @default 24
   * */
  size?: IconSizes;
  /** @control text */
  className?: string;
};
