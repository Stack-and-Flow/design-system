import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

// Constants
export const BREADCRUMB_VARIANTS = ['regular', 'underlined', 'bordered', 'line'] as const;
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

export const BREADCRUMB_TEXT_COLORS = {
  red: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300',
  blue: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
  indigo: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300',
  green: 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300',
  yellow: 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300',
  purple: 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300',
  pink: 'text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300',
  gray: 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
} as const;

const createColorConfig = (light: string, dark: string, hover: string, separator: string) => ({
  light,
  dark,
  hover,
  separator
});

export const ACCESSIBLE_TEXT_COLORS: Record<
  NonNullable<BreadcrumbProps['bgColor']>,
  ReturnType<typeof createColorConfig>
> = {
  default: createColorConfig(
    'text-gray-700 hover:text-gray-900',
    'dark:text-gray-300 dark:hover:text-white',
    'hover:text-gray-900 dark:hover:text-white',
    'text-gray-500 dark:text-gray-400'
  ),
  primary: createColorConfig('text-white', 'dark:text-white', 'hover:text-blue-50', 'text-blue-100 dark:text-blue-200'),
  secondary: createColorConfig(
    'text-gray-700',
    'dark:text-gray-300',
    'hover:text-gray-900 dark:hover:text-white',
    'text-gray-500 dark:text-gray-400'
  ),
  success: createColorConfig(
    'text-white',
    'dark:text-white',
    'hover:text-green-50',
    'text-green-100 dark:text-green-200'
  ),
  warning: createColorConfig(
    'text-white',
    'dark:text-white',
    'hover:text-amber-50',
    'text-amber-100 dark:text-amber-200'
  ),
  error: createColorConfig('text-white', 'dark:text-white', 'hover:text-red-50', 'text-red-100 dark:text-red-200'),
  transparent: createColorConfig(
    'text-gray-700',
    'dark:text-gray-300',
    'hover:text-gray-900 dark:hover:text-white',
    'text-gray-500 dark:text-gray-400'
  )
};

export const ACCESSIBLE_BORDER_COLORS: Record<NonNullable<BreadcrumbProps['bgColor']>, string> = {
  default: 'border-gray-300 dark:border-gray-600',
  primary: 'border-blue-600 dark:border-blue-500',
  secondary: 'border-gray-300 dark:border-gray-600',
  success: 'border-green-600 dark:border-green-500',
  warning: 'border-amber-500 dark:border-amber-400',
  error: 'border-red-600 dark:border-red-500',
  transparent: 'border-transparent'
};

export const SEPARATOR_PATTERNS = {
  controlString: /[->/|](?![a-zA-Z0-9])/
};

const baseClasses =
  'max-w-full box-border border-2 overflow-hidden flex flex-row gap-2 items-center font-mono whitespace-pre-wrap text-justify';

const variantStyles = {
  regular: ['bg-gray-light-500', 'border-gray-light-500', 'dark:bg-gray-dark-600', 'dark:border-gray-dark-600'],
  underlined: ['bg-transparent', 'border-gray-light-500', 'dark:bg-transparent', 'dark:border-gray-dark-600'],
  line: [
    'bg-transparent',
    'border-t-transparent',
    'border-l-transparent',
    'border-r-transparent',
    '!rounded-none',
    'border-b-gray-light-500',
    'dark:border-b-gray-dark-600'
  ],
  bordered: ['bg-gray-light-500', 'border-gray-light-600', 'dark:bg-gray-dark-600', 'dark:border-gray-dark-500']
};

const roundedStyles = {
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
  none: 'rounded-none'
};

const bgColorStyles = {
  default: '',
  primary: [
    'bg-blue-700 hover:bg-blue-800',
    'dark:bg-blue-600 dark:hover:bg-blue-700',
    'border-blue-700 dark:border-blue-600'
  ],
  secondary: [
    'bg-gray-100 hover:bg-gray-200',
    'dark:bg-gray-700 dark:hover:bg-gray-600',
    'border-gray-300 dark:border-gray-600'
  ],
  success: [
    'bg-green-700 hover:bg-green-800',
    'dark:bg-green-600 dark:hover:bg-green-700',
    'border-green-700 dark:border-green-600'
  ],
  warning: [
    'bg-amber-600 hover:bg-amber-700',
    'dark:bg-amber-500 dark:hover:bg-amber-600',
    'border-amber-600 dark:border-amber-500'
  ],
  error: ['bg-red-700 hover:bg-red-800', 'dark:bg-red-600 dark:hover:bg-red-700', 'border-red-700 dark:border-red-600'],
  transparent: 'bg-transparent border-transparent'
};

const sizeStyles = {
  xs: 'text-xs px-1 py-1',
  sm: 'text-sm px-2 py-1.5',
  md: 'text-md px-2 py-2',
  lg: 'text-lg px-2 py-2.5',
  xl: 'text-xl px-2 py-3'
};

export const breadcrumbVariants = cva(baseClasses, {
  variants: {
    variant: variantStyles,
    rounded: roundedStyles,
    bgColor: bgColorStyles,
    size: sizeStyles
  },
  defaultVariants: {
    variant: 'regular',
    rounded: 'md',
    bgColor: 'default',
    size: 'md'
  }
});

export type BreadCrumbVariants = VariantProps<typeof breadcrumbVariants>;
type IconSizes = 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40;

export interface BreadcrumbItem {
  title: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  disabled?: boolean;
  icon?: DynamicIconName;
}

export interface BreadcrumbProps extends BreadCrumbVariants {
  items: BreadcrumbItem[];
  variant?: (typeof BREADCRUMB_VARIANTS)[number];
  bgColor?: (typeof BREADCRUMB_BG_COLORS)[number];
  rounded?: (typeof BREADCRUMB_ROUNDED)[number];
  textColor?: string | keyof typeof BREADCRUMB_TEXT_COLORS;
  colorSeparator?: string;
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
  activeItemClassName?: string;
  linkClassName?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  onCollapsedClick?: (hiddenItems: BreadcrumbItem[]) => void;
  showTooltip?: boolean;
  tooltipDelay?: number;
  truncateLength?: number;
  showHomeIcon?: boolean;
  homeIcon?: DynamicIconName;
}

export interface ProcessedBreadcrumbItem {
  item: BreadcrumbItem | ReactNode;
  isLast: boolean;
}
