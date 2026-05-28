import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { ComponentProps } from 'react';

export const tableVariants = cva(
  [
    'table-wrapper relative w-full overflow-auto',
    'border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark'
  ],
  {
    variants: {
      shadow: {
        none: '',
        sm: 'shadow-sm dark:shadow-dropdown',
        md: 'shadow-md dark:shadow-dropdown',
        lg: 'shadow-lg dark:shadow-dropdown'
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
  }
);

export const tableElementVariants = cva(
  [
    'w-full border-collapse text-text-light dark:text-text-dark',
    'bg-surface-light dark:bg-surface-dark',
    'transition-[background-color,color] duration-200 ease-out'
  ],
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
    'bg-surface-raised-light dark:bg-surface-raised-dark',
    'border-b border-border-light dark:border-border-dark',
    'transition-[background-color,border-color] duration-200 ease-out'
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
    'border-b border-border-light dark:border-border-dark',
    'text-text-light dark:text-text-dark',
    'transition-[background-color,border-color,box-shadow,color] duration-150 ease-out'
  ],
  {
    variants: {
      size: {
        sm: 'px-3 py-2 text-sm font-medium',
        md: 'px-4 py-3 text-base font-semibold',
        lg: 'px-5 py-4 text-lg font-semibold'
      },
      align: {
        start: 'text-left',
        center: 'text-center',
        end: 'text-right'
      },
      allowsSorting: {
        true: 'cursor-pointer hover:bg-surface-light dark:hover:bg-white-tint-faint',
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
  [
    'transition-[background-color,border-color,box-shadow,opacity] duration-150 ease-out',
    'border-b border-border-light dark:border-border-dark',
    'last:border-b-0'
  ],
  {
    variants: {
      isStriped: {
        true: 'even:bg-surface-raised-light dark:even:bg-surface-raised-dark',
        false: ''
      },
      isSelectable: {
        true: 'cursor-pointer hover:bg-surface-raised-light dark:hover:bg-white-tint-faint',
        false: ''
      },
      isSelected: {
        true: 'bg-red-tint-subtle hover:bg-red-tint-low dark:bg-red-tint-low dark:hover:bg-red-tint-active',
        false: ''
      },
      isDisabled: {
        true: 'pointer-events-none cursor-not-allowed opacity-40',
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

export const tableCellVariants = cva(
  [
    'border-b border-border-light dark:border-border-dark',
    'text-text-secondary-light dark:text-text-secondary-dark',
    'transition-[background-color,border-color,box-shadow,color] duration-150 ease-out'
  ],
  {
    variants: {
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg'
      },
      align: {
        start: 'text-left',
        center: 'text-center',
        end: 'text-right'
      },
      isCompact: {
        true: 'py-2',
        false: ''
      }
    },
    defaultVariants: {
      size: 'md',
      align: 'start',
      isCompact: false
    }
  }
);

export const loadingOverlayVariants = cva(
  [
    'absolute inset-0 z-20 flex items-center justify-center',
    'bg-background-light/80 dark:bg-background-dark/80',
    'backdrop-blur-sm transition-opacity duration-200 ease-out'
  ],
  {
    variants: {
      isVisible: {
        true: 'opacity-100',
        false: 'pointer-events-none opacity-0'
      }
    },
    defaultVariants: {
      isVisible: false
    }
  }
);

export type TableRowData = Record<string, unknown>;
export type Selection = 'all' | Set<React.Key>;
export type SortDirection = 'ascending' | 'descending';
export type SortDescriptor = {
  column: React.Key;
  direction: SortDirection;
};
export type TableComparableValue = string | number | boolean | Date | null | undefined;
export type TableFilterValue = string | number | boolean | null | undefined;
export type LoadingState = 'loading' | 'sorting' | 'loadingMore' | 'error' | 'idle' | 'filtering';
export type SelectionMode = 'none' | 'single' | 'multiple';
export type TableRadius = 'none' | 'sm' | 'md' | 'lg';
export type TableShadow = 'none' | 'sm' | 'md' | 'lg';
export type TableLayout = 'auto' | 'fixed';
export type ColumnAlign = 'start' | 'center' | 'end';
export type TableSize = 'sm' | 'md' | 'lg';
export type TableVariant = 'default' | 'striped' | 'surface';
export type TableClassNames = Partial<{
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

export type TableColumn<T extends TableRowData = TableRowData> = {
  key: React.Key;
  header?: React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => TableComparableValue;
  filterValue?: (row: T) => TableFilterValue;
  align?: ColumnAlign;
  allowsSorting?: boolean;
  sortIcon?: React.ReactNode;
  isRowHeader?: boolean;
  textValue?: string;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
};

export type TableEvents = {
  onRowAction?: (key: React.Key) => void;
  onCellAction?: (key: React.Key) => void;
  onSelectionChange?: (keys: Selection) => void;
  onSortChange?: (descriptor: SortDescriptor | null) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
};

type NativeTableProps = Omit<ComponentProps<'table'>, 'children' | 'className'>;

export type TableProps<T extends TableRowData = TableRowData> = NativeTableProps & {
  items?: T[];
  columns?: TableColumn<T>[];
  layout?: TableLayout;
  radius?: TableRadius;
  shadow?: TableShadow;
  hideHeader?: boolean;
  isStriped?: boolean;
  isCompact?: boolean;
  isHeaderSticky?: boolean;
  fullWidth?: boolean;
  removeWrapper?: boolean;
  showSelectionCheckboxes?: boolean;
  sortDescriptor?: SortDescriptor | null;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  disabledKeys?: Selection;
  disallowEmptySelection?: boolean;
  selectionMode?: SelectionMode;
  isKeyboardNavigationDisabled?: boolean;
  classNames?: TableClassNames;
  data?: T[];
  loading?: boolean;
  emptyContent?: React.ReactNode;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => React.Key;
  getRowLabel?: (row: T) => string;
  variant?: TableVariant;
  size?: TableSize;
  className?: string;
  pagination?: boolean;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  rowSelection?: 'single' | 'multiple' | false;
  selectedRows?: T[];
  onSelectRows?: (selectedRows: T[]) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
};

export type TableBodyProps<T extends TableRowData = TableRowData> = {
  children?: React.ReactElement | React.ReactElement[] | ((item: T) => React.ReactElement);
  items?: Iterable<T>;
  isLoading?: boolean;
  loadingState?: LoadingState;
  loadingContent?: React.ReactNode;
  emptyContent?: React.ReactNode;
  onLoadMore?: () => void;
};

export type TableRowProps<T extends TableRowData = TableRowData> = {
  children?: React.ReactElement | React.ReactElement[] | ((item: T) => React.ReactElement);
  textValue?: string;
};

export type TableCellProps = {
  children: React.ReactNode;
  textValue?: string;
};

export type CompleteTableProps<T extends TableRowData = TableRowData> = TableProps<T> & TableEvents;

export type TableVariants = VariantProps<typeof tableVariants>;
export type TableElementVariants = VariantProps<typeof tableElementVariants>;
export type TableHeaderVariants = VariantProps<typeof tableHeaderVariants>;
export type TableHeaderCellVariants = VariantProps<typeof tableHeaderCellVariants>;
export type TableRowVariants = VariantProps<typeof tableRowVariants>;
export type TableCellVariants = VariantProps<typeof tableCellVariants>;
export type LoadingOverlayVariants = VariantProps<typeof loadingOverlayVariants>;
