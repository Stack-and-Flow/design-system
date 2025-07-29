import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';
import type { JSX } from 'react';

export const breadcrumbVariants = cva('flex items-center gap-1 text-sm font-medium transition-colors', {
  variants: {
    variant: {
      solid: [
        'p-3',
        'rounded',
        'rounded-xl',
        'bg-[#282828]',
        'opacity-70',
        'border-secondary',
        'dark:hover:bg-accent',
        'dark:hover:shadow-secondary'
      ],
      bordered: [
        'text-text-light',
        'bg-transparent',
        'border-transparent',
        'hover:bg-gray-light-600',
        'hover:border-gray-light-600',
        'hover:shadow-transparent',
        'dark:text-text-dark',
        'dark:border-transparent',
        'dark:hover:bg-gray-dark-400',
        'dark:hover:border-gray-dark-400',
        'dark:hover:shadow-gray-900'
      ],
      light: [
        'text-secondary',
        'border-transparent',
        'bg-transparent',
        'hover:text-text-dark',
        'dark:text-text-dark',
        'hover:border-accent',
        'hover:bg-accent',
        'hover:shadow-secondary'
      ]
    },
    rounded: {
      true: 'rounded-full',
      false: 'rounded-md'
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
    variant: 'solid',
    size: 'md'
  }
});

type BreadCrumbVariants = VariantProps<typeof breadcrumbVariants>['variant'];
type SeparatorVariants = DynamicIconName | '/' | '|' | '>';
type BreadcrumbSizeVariants = 'md' | 'sm' | 'lg';

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
  variant: BreadCrumbVariants;

  /** @control text*/
  separator: SeparatorVariants;

  /**
   * @control select
   * @default md
   */
  size: BreadcrumbSizeVariants;

  /**
   * @control boolean
   * @default false
   */
  rounded: boolean;

  /**
   * @control boolean
   * @default false
   */
  shadow: boolean;

  /**
   * @control boolean
   * @default false
   */
  hideSeparator: boolean;

  /** @control text*/
  className?: string;

  /** @control text*/
  startContent: DynamicIconName | undefined;

  /** @control text*/
  endContent: DynamicIconName | undefined;

  /** @control text*/
  maxItem?: number;

  /** @control text*/
  itemsBeforeCollapse?: number;

  /** @control text*/
  itemsAfterCollapse?: number;

  /** @control text*/
  iconCollapse?: DynamicIconName;

  collapseElement?: JSX.Element;
};
