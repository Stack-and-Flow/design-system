import type { DynamicIconName } from '@/components/utils/types';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const breadcrumbVariants = cva(
  'w-full max-w-full box-border overflow-hidden flex flex-row gap-2 justify-center items-center p-2 font-mono whitespace-pre-wrap text-text-light dark:text-text-dark text-justify',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border-2 bg-transparent',
        bordered: ['rounded', 'rounded-xl', 'border-2', 'border-solid'],
        ghost: 'bg-transparent'
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
        default: 'dark:hover:bg-gray-800',
        primary: 'bg-secondary hover:bg-secondary/90 dark:bg-accent dark:hover:bg-accent/90',
        secondary: 'bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500',
        transparent: 'bg-transparent'
      },
      size: {
        xs: 'text-xs px-1 py-1',
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-2 py-2',
        lg: 'text-base px-3 py-2',
        xl: 'text-lg px-4 py-3'
      },
      alignment: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end'
      }
    },
    defaultVariants: {
      variant: 'solid',
      rounded: 'md',
      bgColor: 'default',
      size: 'md',
      alignment: 'left'
    }
  }
);

export type BreadCrumbVariants = VariantProps<typeof breadcrumbVariants>;

type Size = 'sm' | 'md' | 'lg';

export type BreadcrumbItem = {
  title: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top' | undefined;
};

export interface BreadcrumbProps extends BreadCrumbVariants {
  items: BreadcrumbItem[];
  variant?: 'solid' | 'outline' | 'bordered';
  bgColor?: 'default' | 'primary' | 'secondary';
  rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  colorText?: string;
  size?: Size;
  separator?: ReactNode;
  hideSeparator?: boolean;
  startContent?: DynamicIconName | undefined;
  endContent?: DynamicIconName | undefined;
  maxItem: number;
  itemsBeforeCollapse: number;
  itemsAfterCollapse: number;
  iconCollapse?: DynamicIconName;
  collapsedElement?: ReactNode;
  className?: string;
  'aria-label'?: string;
}
