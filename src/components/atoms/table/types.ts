import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

// ========================================
// CVA VARIANTS
// ========================================

export const tableVariants = cva(['table-wrapper relative overflow-auto w-full'], {
  variants: {
    shadow: {
      none: '',
      sm: 'shadow-sm dark:shadow-gray-dark-900',
      md: 'shadow-md dark:shadow-gray-dark-900',
      lg: 'shadow-lg dark:shadow-gray-dark-900'
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg'
    }
  },
  defaultVariants: {
    shadow: 'sm',
    radius: 'md'
  }
});

export const tableElementVariants = cva(
  ['table w-full border-collapse bg-white dark:bg-gray-dark-800 transition-colors'],
  {
    variants: {
      layout: {
        auto: 'table-auto',
        fixed: 'table-fixed'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    defaultVariants: {
      layout: 'auto',
      fullWidth: true
    }
  }
);

export const tableHeaderVariants = cva(
  [
    'table-header bg-gray-light-100 dark:bg-gray-dark-700',
    'border-b-2 border-gray-light-300 dark:border-gray-dark-600',
    'transition-colors'
  ],
  {
    variants: {
      isSticky: {
        true: 'sticky top-0 z-10',
        false: 'relative'
      }
    },
    defaultVariants: {
      isSticky: false
    }
  }
);

export const tableHeaderCellVariants = cva(
  [
    'table-header-cell font-secondary-bold text-text-light dark:text-text-dark',
    'border-b border-gray-light-300 dark:border-gray-dark-600',
    'transition-colors select-none'
  ],
  {
    variants: {
      size: {
        sm: 'px-2 py-1 fs-small tablet:fs-small-tablet',
        md: 'px-4 py-2 fs-base tablet:fs-base-tablet',
        lg: 'px-6 py-3 fs-h6 tablet:fs-h6-tablet'
      },
      align: {
        start: 'text-left',
        center: 'text-center',
        end: 'text-right'
      },
      allowsSorting: {
        true: 'cursor-pointer hover:bg-gray-light-200 dark:hover:bg-gray-dark-600',
        false: ''
      }
    },
    defaultVariants: {
      size: 'md',
      align: 'start',
      allowsSorting: false
    }
  }
);

export const tableRowVariants = cva(
  ['table-row transition-colors', 'border-b border-gray-light-200 dark:border-gray-dark-700', 'last:border-b-0'],
  {
    variants: {
      isStriped: {
        true: 'even:bg-gray-light-50 dark:even:bg-gray-dark-750',
        false: ''
      },
      isSelectable: {
        true: 'cursor-pointer hover:bg-gray-light-100 dark:hover:bg-gray-dark-600',
        false: ''
      },
      isSelected: {
        true: 'bg-secondary/10 dark:bg-secondary/20 hover:bg-secondary/20 dark:hover:bg-secondary/30',
        false: ''
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: ''
      }
    },
    defaultVariants: {
      isStriped: false,
      isSelectable: false,
      isSelected: false,
      isDisabled: false
    }
  }
);

export const tableCellVariants = cva(['table-cell text-text-light dark:text-text-dark transition-colors'], {
  variants: {
    size: {
      sm: 'px-2 py-1 fs-small tablet:fs-small-tablet',
      md: 'px-4 py-2 fs-base tablet:fs-base-tablet',
      lg: 'px-6 py-3 fs-h6 tablet:fs-h6-tablet'
    },
    align: {
      start: 'text-left',
      center: 'text-center',
      end: 'text-right'
    },
    isCompact: {
      true: 'py-1',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    align: 'start',
    isCompact: false
  }
});

export const loadingOverlayVariants = cva(
  [
    'loading-overlay absolute inset-0 z-20',
    'bg-white/80 dark:bg-gray-dark-800/80',
    'backdrop-blur-sm',
    'flex items-center justify-center',
    'transition-opacity'
  ],
  {
    variants: {
      isVisible: {
        true: 'opacity-100',
        false: 'opacity-0 pointer-events-none'
      }
    },
    defaultVariants: {
      isVisible: false
    }
  }
);

// ========================================
// TYPE DEFINITIONS
// ========================================

export type Selection = 'all' | Set<React.Key>;

export type SortDescriptor = {
  column: React.Key;
  direction: 'ascending' | 'descending';
};

export type LoadingState = 'loading' | 'sorting' | 'loadingMore' | 'error' | 'idle' | 'filtering';

export type SelectionMode = 'none' | 'single' | 'multiple';

export type SelectionBehavior = 'toggle' | 'replace';

export type DisabledBehavior = 'selection' | 'all';

export type TableRadius = 'none' | 'sm' | 'md' | 'lg';

export type TableShadow = 'none' | 'sm' | 'md' | 'lg';

export type TableLayout = 'auto' | 'fixed';

export type ColumnAlign = 'start' | 'center' | 'end';

export interface TableColumn<T = any> {
  key: React.Key;
  header?: React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => any;
  align?: ColumnAlign;
  hideHeader?: boolean;
  allowsSorting?: boolean;
  sortIcon?: React.ReactNode;
  isRowHeader?: boolean;
  textValue?: string;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T = any> {
  children?: React.ReactNode;
  items?: T[];
  columns?: TableColumn<T>[];
  layout?: TableLayout;
  radius?: TableRadius;
  shadow?: TableShadow;
  maxTableHeight?: number;
  rowHeight?: number;
  isVirtualized?: boolean;
  hideHeader?: boolean;
  isStriped?: boolean;
  isCompact?: boolean;
  isHeaderSticky?: boolean;
  fullWidth?: boolean;
  removeWrapper?: boolean;
  showSelectionCheckboxes?: boolean;
  sortDescriptor?: SortDescriptor;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  disabledKeys?: Selection;
  disallowEmptySelection?: boolean;
  selectionMode?: SelectionMode;
  selectionBehavior?: SelectionBehavior;
  disabledBehavior?: DisabledBehavior;
  allowDuplicateSelectionEvents?: boolean;
  disableAnimation?: boolean;
  isKeyboardNavigationDisabled?: boolean;
  classNames?: Partial<{
    base: string;
    table: string;
    thead: string;
    tbody: string;
    tfoot: string;
    emptyWrapper: string;
    loadingWrapper: string;
    wrapper: string;
    tr: string;
    th: string;
    td: string;
    sortIcon: string;
  }>;
  data?: T[];
  loading?: boolean;
  emptyContent?: React.ReactNode;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string | number;
  variant?: 'default' | 'striped' | 'surface';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pagination?: boolean;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  rowSelection?: 'single' | 'multiple' | false;
  selectedRows?: T[];
  onSelectRows?: (selectedRows: T[]) => void;
}

export interface TableEvents {
  onRowAction?: (key: React.Key) => void;
  onCellAction?: (key: React.Key) => void;
  onSelectionChange?: (keys: Selection) => void;
  onSortChange?: (descriptor: SortDescriptor) => void;
}

export interface TableBodyProps<T = any> {
  children?: React.ReactElement | React.ReactElement[] | ((item: T) => React.ReactElement);
  items?: Iterable<T>;
  isLoading?: boolean;
  loadingState?: LoadingState;
  loadingContent?: React.ReactNode;
  emptyContent?: React.ReactNode;
  onLoadMore?: () => void;
}

export interface TableRowProps<T = any> {
  children?: React.ReactElement | React.ReactElement[] | ((item: T) => React.ReactElement);
  textValue?: string;
}

export interface TableCellProps {
  children: React.ReactNode;
  textValue?: string;
}

export interface CompleteTableProps<T = any> extends TableProps<T>, TableEvents {}

// ========================================
// VARIANT TYPES
// ========================================

export type TableVariants = VariantProps<typeof tableVariants>;
export type TableElementVariants = VariantProps<typeof tableElementVariants>;
export type TableHeaderVariants = VariantProps<typeof tableHeaderVariants>;
export type TableHeaderCellVariants = VariantProps<typeof tableHeaderCellVariants>;
export type TableRowVariants = VariantProps<typeof tableRowVariants>;
export type TableCellVariants = VariantProps<typeof tableCellVariants>;
export type LoadingOverlayVariants = VariantProps<typeof loadingOverlayVariants>;
