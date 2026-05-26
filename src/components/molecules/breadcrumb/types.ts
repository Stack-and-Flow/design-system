import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactElement, ReactNode } from 'react';
import type { DynamicIconName, IconSizes } from '@/types';

export const breadcrumbBase = cva(
  'flex max-w-full flex-row items-center gap-1.5 overflow-visible whitespace-nowrap bg-transparent font-sans transition-colors duration-200',
  {
    variants: {
      size: {
        xs: 'px-1 py-0.5 fs-xs',
        sm: 'px-1.5 py-1 fs-small',
        md: 'px-2 py-1.5 fs-base',
        lg: 'px-2.5 py-2 fs-h6',
        xl: 'px-3 py-2.5 fs-h5'
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
        regular: 'border-0 bg-transparent',
        underlined: 'border-b-2 border-border-strong-light bg-transparent dark:border-border-strong-dark rounded-none!',
        line: 'border-b border-border-light bg-transparent dark:border-border-dark rounded-none!',
        bordered: 'border border-border-light bg-transparent dark:border-border-dark'
      }
    },
    defaultVariants: {
      size: 'md',
      rounded: 'md',
      variant: 'regular'
    }
  }
);

export type BreadcrumbVariants = VariantProps<typeof breadcrumbBase>;
export type BreadcrumbRounded = NonNullable<BreadcrumbVariants['rounded']>;
export type BreadcrumbContent = DynamicIconName | ReactElement;
export type BreadcrumbTarget = '_blank' | '_self' | '_parent' | '_top';

export type BreadcrumbItem = {
  title: string;
  href?: string;
  target?: BreadcrumbTarget;
  disabled?: boolean;
  icon?: DynamicIconName;
  startContent?: BreadcrumbContent;
  endContent?: BreadcrumbContent;
};

export type BreadcrumbProps = BreadcrumbVariants & {
  'aria-label'?: string;
  containerClassName?: string;
  collapsedElement?: ReactNode;
  endContent?: BreadcrumbContent;
  hideSeparator?: boolean;
  iconCollapse?: BreadcrumbContent;
  iconSizes?: IconSizes;
  isNavigationDisabled?: boolean;
  items: BreadcrumbItem[];
  itemsAfterCollapse?: number;
  itemsBeforeCollapse?: number;
  linkClassName?: string;
  maxItem?: number;
  maxItems?: number;
  onCollapsedClick?: (hiddenItems: BreadcrumbItem[]) => void;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  radius?: BreadcrumbRounded;
  separator?: ReactNode;
  separatorClassName?: string;
  showTooltip?: boolean;
  startContent?: BreadcrumbContent;
  textClassName?: string;
};

export type VisibleBreadcrumbItem = {
  type: 'item';
  item: BreadcrumbItem;
  originalIndex: number;
};

export type CollapsedBreadcrumbItem = {
  type: 'collapsed';
  hiddenItems: BreadcrumbItem[];
  hiddenItemIndexes: number[];
};

export type BreadcrumbRenderItem = VisibleBreadcrumbItem | CollapsedBreadcrumbItem;

export type ProcessedBreadcrumbItem = BreadcrumbRenderItem & {
  isLast: boolean;
};
