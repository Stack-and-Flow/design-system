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

type TailwindTextThemeColor = `text-${string}`;

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
