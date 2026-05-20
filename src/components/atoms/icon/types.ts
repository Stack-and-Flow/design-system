import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { DynamicIconName, IconSizes, TextDarkThemeColors, TextThemeColors } from '@/types';

export const iconVariants = cva('shrink-0', {
  variants: {
    tone: {
      brand: 'text-brand-light dark:text-brand-dark',
      default: 'text-text-light dark:text-text-dark',
      muted: 'text-text-secondary-light dark:text-text-secondary-dark',
      success: 'text-success-light dark:text-success',
      warning: 'text-warning-light dark:text-warning',
      danger: 'text-error-light dark:text-error',
      info: 'text-info-light dark:text-info'
    }
  },
  defaultVariants: {
    tone: 'brand'
  }
});

type IconVariantProps = VariantProps<typeof iconVariants>;
type NativeIconProps = Omit<
  ComponentProps<'svg'>,
  'aria-hidden' | 'aria-label' | 'children' | 'className' | 'color' | 'name' | 'role' | 'size' | 'title'
>;

export type IconTone = NonNullable<IconVariantProps['tone']>;

type TailwindTextThemeColor =
  | 'text-brand-light'
  | 'text-brand-dark'
  | 'text-primary'
  | 'text-text-light'
  | 'text-text-dark'
  | 'text-text-secondary-light'
  | 'text-text-secondary-dark'
  | 'text-text-tertiary-light'
  | 'text-text-tertiary-dark'
  | 'text-text-muted-light'
  | 'text-text-muted-dark'
  | 'text-text-disabled-light'
  | 'text-text-disabled-dark'
  | 'text-red-100'
  | 'text-red-200'
  | 'text-red-300'
  | 'text-red-400'
  | 'text-red-500'
  | 'text-red-600'
  | 'text-red-700'
  | 'text-red-800'
  | 'text-red-900'
  | 'text-success'
  | 'text-success-light'
  | 'text-warning'
  | 'text-warning-light'
  | 'text-error'
  | 'text-error-light'
  | 'text-info'
  | 'text-info-light'
  | 'text-yellow'
  | 'text-yellow-light'
  | 'text-yellow-dark'
  | 'text-green'
  | 'text-green-light'
  | 'text-green-dark'
  | 'text-teal'
  | 'text-teal-light'
  | 'text-teal-dark'
  | 'text-blue'
  | 'text-blue-light'
  | 'text-blue-dark'
  | 'text-indigo'
  | 'text-indigo-light'
  | 'text-indigo-dark'
  | 'text-purple'
  | 'text-purple-light'
  | 'text-purple-dark'
  | 'text-pink'
  | 'text-pink-light'
  | 'text-pink-dark'
  | 'text-orange'
  | 'text-orange-light'
  | 'text-orange-dark'
  | 'text-amber'
  | 'text-white'
  | 'text-black';

export type IconTextColor = TextThemeColors | TailwindTextThemeColor;
export type IconTextDarkColor = TextDarkThemeColors | `dark:${TailwindTextThemeColor}`;

export type IconProps = NativeIconProps & {
  /** @control select */
  name: DynamicIconName;
  /**
   * @control select
   * @default brand
   */
  tone?: IconTone;
  /** @control select */
  color?: IconTextColor;
  /** @control select */
  colorDark?: IconTextDarkColor;
  /**
   * @control select
   * @default 24
   */
  size?: IconSizes;
  /** @control text */
  className?: string;
  /**
   * @control boolean
   * @default false
   */
  decorative?: boolean;
  /** @control text */
  title?: string;
  /** @control text */
  'aria-label'?: string;
};
