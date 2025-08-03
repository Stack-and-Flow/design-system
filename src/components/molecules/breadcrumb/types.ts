import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';
import type { JSX } from 'react';

export const breadcrumbVariants = cva('flex items-center gap-1 text-sm font-medium transition-colors', {
  variants: {
    variant: {
      outline: '',
      bordered: ['rounded', 'rounded-xl', 'border-2', 'border-solid']
    },
    rounded: {
      true: 'rounded-full',
      false: 'rounded-md'
    },
    bgColor: {
      none: '',
      primary: 'bg-secondary dark:bg-primary',
      secondary: 'bg-gray-dark-400 dark:bg-gray-dark-400'
    },
    shadow: {
      true: 'hover:shadow-custom-sm',
      false: ''
    },
    size: {
      md: 'px-md h-10 fs-base tablet:fs-base-tablet',
      lg: 'px-lg h-12 fs-h6 tablet:fs-h6-tablet',
      sm: 'px-sm h-8 fs-small tablet:fs-small-tablet'
    }
  },
  defaultVariants: {
    variant: null,
    size: 'md'
  }
});

type BreadCrumbVariants = VariantProps<typeof breadcrumbVariants>['variant'];
type BgColor = NonNullable<VariantProps<typeof breadcrumbVariants>['bgColor']>;
type BreadcrumbSizeVariants = NonNullable<VariantProps<typeof breadcrumbVariants>['size']>;
type SeparatorVariants = DynamicIconName | '/' | '|' | '>';

export type BreadcrumbItem = {
  title: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top' | undefined;
};

export type BreadcrumbProps = {
  /** Props for the Breadcrumb component */
  items: BreadcrumbItem[];

  /**
   * @control select
   * @default solid
   */
  variant?: BreadCrumbVariants;

  /**
   * @control select
   * @default default
   */
  bgColor?: BgColor;

  /**
   * @control boolean
   * @default false
   */
  rounded?: boolean;

  /** @control text*/
  colorText?: string;

  /**
   * @control select
   * @default md
   */
  size?: BreadcrumbSizeVariants;

  /** @control text*/
  separator?: SeparatorVariants;

  /**
   * @control boolean
   * @default false
   */
  hideSeparator?: boolean;

  /** @control text*/
  startContent?: DynamicIconName | undefined;

  /** @control text*/
  endContent?: DynamicIconName | undefined;

  /** @control text*/
  maxItem: number;

  /** @control text*/
  itemsBeforeCollapse: number;

  /** @control text*/
  itemsAfterCollapse: number;

  /** @control text*/
  iconCollapse?: DynamicIconName;

  collapsedElement?: JSX.Element;

  /**
   * @control boolean
   * @default false
   */
  shadow?: boolean;

  /** @control text*/
  className?: string;
};
