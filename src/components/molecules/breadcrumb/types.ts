import type { IconSizes } from '@/components/atoms/icon-button';
import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

/**
 * CVA configuration for the Breadcrumb component.
 * Controls base styles, variants, and compound variants.
 */
export const breadcrumbBase = cva(
  'flex flex-row items-center gap-2 overflow-hidden max-w-full font-sans whitespace-nowrap border-2 transition-all duration-200',
  {
    variants: {
      size: {
        xs: 'text-xs px-1 py-0.5',
        sm: 'text-sm px-2 py-1',
        md: 'text-md px-2 py-1.5',
        lg: 'text-lg px-3 py-2',
        xl: 'text-xl px-4 py-2.5'
      },
      rounded: {
        xs: 'rounded-xs',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
        none: 'rounded-none'
      },
      variant: {
        regular: [
          'bg-gray-light-500',
          'border-gray-light-500',
          'dark:bg-gray-dark-600',
          'dark:text-white',
          'dark:border-gray-dark-600'
        ],
        underlined: [
          'bg-transparent',
          'border-gray-light-500',
          'dark:bg-transparent',
          'dark:text-white',
          'dark:border-gray-dark-600'
        ],
        line: [
          'bg-transparent',
          'border-t-transparent',
          'border-l-transparent',
          'border-r-transparent',
          '!rounded-none',
          'border-b-gray-light-500',
          'dark:text-white',
          'dark:border-b-gray-dark-600'
        ],
        bordered: [
          'bg-gray-light-500',
          'border-gray-light-600',
          'dark:text-white',
          'dark:bg-gray-dark-600',
          'dark:border-gray-dark-500'
        ]
      },
      state: {
        default: '',
        hovered: ''
      },
      hovered: {
        true: '',
        false: ''
      }
    },
    defaultVariants: {
      size: 'md',
      rounded: 'md',
      variant: 'regular',
      state: 'default',
      hovered: false
    },
    compoundVariants: [
      {
        variant: 'regular',
        hovered: true,
        class:
          'bg-gray-light-400 border-gray-light-400 dark:text-white dark:bg-gray-dark-500 dark:border-gray-dark-500 dark:text-white dark:hover:text-white'
      },
      {
        variant: 'bordered',
        hovered: true,
        class: 'border-secondary dark:border-secondary dark:text-white dark:text-white dark:hover:text-white'
      },
      {
        variant: 'underlined',
        hovered: true,
        class: 'border-secondary dark:border-secondary dark:text-white dark:text-white dark:hover:text-white'
      }
    ]
  }
);

/**
 * Breadcrumb component variants generated from CVA.
 */
export type BreadcrumbVariants = VariantProps<typeof breadcrumbBase>;

/**
 * Individual breadcrumb item.
 */
export interface BreadcrumbItem {
  title: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  disabled?: boolean;
  icon?: DynamicIconName;
}

/**
 * Props for the Breadcrumb component.
 */
export interface BreadcrumbProps extends BreadcrumbVariants {
  'aria-label'?: string;
  containerClassName?: string;
  collapsedElement?: ReactNode;
  endContent?: DynamicIconName | ReactNode;
  hideSeparator?: boolean;
  iconCollapse?: DynamicIconName | ReactNode;
  iconSizes?: IconSizes;
  items: BreadcrumbItem[];
  itemsAfterCollapse?: number;
  itemsBeforeCollapse?: number;
  linkClassName?: string;
  maxItem?: number;
  onCollapsedClick?: (hiddenItems: BreadcrumbItem[]) => void;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  separator?: ReactNode;
  separatorClassName?: string;
  showTooltip?: boolean;
  startContent?: DynamicIconName | ReactNode;
  textClassName?: string;
}

/**
 * Processed breadcrumb item for internal rendering.
 */
export interface ProcessedBreadcrumbItem {
  item: BreadcrumbItem | ReactNode;
  isLast: boolean;
}
