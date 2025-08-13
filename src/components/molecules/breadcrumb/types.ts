import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const BREADCRUMB_VARIANTS = ['regular', 'underlined', 'bordered'] as const;
export const BREADCRUMB_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const BREADCRUMB_ROUNDED = ['xs', 'sm', 'md', 'lg', 'xl', 'full', 'none'] as const;
export const BREADCRUMB_BG_COLORS = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'transparent'
] as const;

export const breadcrumbVariants = cva(
  'w-full max-w-full box-border overflow-hidden flex flex-row gap-2 items-center p-2 font-mono whitespace-pre-wrap text-justify',
  {
    variants: {
      variant: {
        regular: [
          'bg-gray-light-500',
          'border border-gray-light-500',
          'dark:bg-gray-dark-600',
          'dark:border border-gray-dark-600'
        ],
        underlined: [
          'bg-transparent',
          'border border-2 border-gray-light-500',
          'dark:bg-transparent',
          'dark:border border-gray-dark-600'
        ],
        bordered: [
          'bg-gray-light-500',
          'border border-2 border-gray-light-600',
          'dark:bg-gray-dark-600',
          'dark:border border-gray-dark-500'
        ]
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
      bgColor: {
        default: '',
        primary:
          'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 border-blue-600 dark:border-blue-700',
        secondary:
          'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600',
        success:
          'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 border-green-600 dark:border-green-700',
        warning:
          'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 border-amber-500 dark:border-amber-600',
        error: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 border-red-600 dark:border-red-700',
        transparent: 'bg-transparent'
      },
      size: {
        xs: 'text-xs px-1 py-1',
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-2 py-2',
        lg: 'text-base px-3 py-2',
        xl: 'text-lg px-4 py-3'
      }
    },
    defaultVariants: {
      variant: 'regular',
      rounded: 'md',
      bgColor: 'default',
      size: 'md'
    }
  }
);

export type BreadCrumbVariants = VariantProps<typeof breadcrumbVariants>;
type IconSizes = 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40;

export interface BreadcrumbItem {
  title: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface BreadcrumbProps extends BreadCrumbVariants {
  items: BreadcrumbItem[];
  variant?: (typeof BREADCRUMB_VARIANTS)[number];
  bgColor?: (typeof BREADCRUMB_BG_COLORS)[number];
  rounded?: (typeof BREADCRUMB_ROUNDED)[number];
  colorText?: string;
  size?: (typeof BREADCRUMB_SIZES)[number];
  separator?: ReactNode;
  hideSeparator?: boolean;
  iconSizes?: IconSizes;
  startContent?: DynamicIconName;
  endContent?: DynamicIconName;
  maxItem?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  iconCollapse?: DynamicIconName;
  collapsedElement?: ReactNode;
  className?: string;
  'aria-label'?: string;
  separatorClassName?: string;
  itemClassName?: string;
  containerClassName?: string;
}
