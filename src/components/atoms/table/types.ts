import type * as React from 'react';

export type Selection = 'all' | Set<React.Key>;

export type SortDescriptor = {
  column: React.Key;
  direction: 'ascending' | 'descending';
};

export type LoadingState = 'loading' | 'sorting' | 'loadingMore' | 'error' | 'idle' | 'filtering';

export type SelectionMode = 'none' | 'single' | 'multiple';

export type SelectionBehavior = 'toggle' | 'replace';

export type DisabledBehavior = 'selection' | 'all';

export type TableColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export type TableRadius = 'none' | 'sm' | 'md' | 'lg';

export type TableShadow = 'none' | 'sm' | 'md' | 'lg';

export type TableLayout = 'auto' | 'fixed';

export type ContentPlacement = 'inside' | 'outside';

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

  color?: TableColor;
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

  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  topContentPlacement?: ContentPlacement;
  bottomContentPlacement?: ContentPlacement;

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
