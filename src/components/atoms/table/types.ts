import type * as React from 'react';

/**
 * Selection type that represents either all rows selected or a set of specific keys.
 * @example
 * // Select all rows
 * const selection: Selection = 'all';
 *
 * // Select specific rows by key
 * const selection: Selection = new Set(['row1', 'row2']);
 */
export type Selection = 'all' | Set<React.Key>;

/**
 * Describes how a column should be sorted.
 */
export type SortDescriptor = {
  /** The column key to sort by */
  column: React.Key;
  /** The direction of sorting */
  direction: 'ascending' | 'descending';
};

/**
 * Loading states for async operations in the table.
 */
export type LoadingState = 'loading' | 'sorting' | 'loadingMore' | 'error' | 'idle' | 'filtering';

/**
 * Selection mode for table rows.
 * @control select
 * @defaultValue none
 */
export type SelectionMode = 'none' | 'single' | 'multiple';

/**
 * Behavior when selecting items.
 */
export type SelectionBehavior = 'toggle' | 'replace';

/**
 * Behavior for disabled items.
 */
export type DisabledBehavior = 'selection' | 'all';

/**
 * Color variants for the table.
 */
export type TableColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * Border radius options for the table.
 */
export type TableRadius = 'none' | 'sm' | 'md' | 'lg';

/**
 * Shadow options for the table.
 */
export type TableShadow = 'none' | 'sm' | 'md' | 'lg';

/**
 * Table layout algorithm.
 */
export type TableLayout = 'auto' | 'fixed';

/**
 * Placement options for content elements.
 */
export type ContentPlacement = 'inside' | 'outside';

/**
 * Text alignment options for columns.
 */
export type ColumnAlign = 'start' | 'center' | 'end';

/**
 * Enhanced TableColumn interface that defines the structure and behavior of a table column.
 * @template T - The type of data object for each row
 */
export interface TableColumn<T = any> {
  /** Unique identifier for the column */
  key: React.Key;
  /** Content to display in the column header */
  header?: React.ReactNode;
  /** Custom cell renderer function */
  cell?: (row: T) => React.ReactNode;
  /** Text alignment for the column */
  align?: ColumnAlign;
  /** Whether to hide the column header */
  hideHeader?: boolean;
  /** Whether the column can be sorted */
  allowsSorting?: boolean;
  /** Custom sort icon component */
  sortIcon?: React.ReactNode;
  /** Whether this column acts as a row header */
  isRowHeader?: boolean;
  /** Text value for accessibility */
  textValue?: string;
  /** Column width (CSS value or number) */
  width?: string | number;
  /** Minimum column width */
  minWidth?: string | number;
  /** Maximum column width */
  maxWidth?: string | number;
  /** @deprecated Use allowsSorting instead */
  sortable?: boolean;
  /** Whether the column can be filtered */
  filterable?: boolean;
}

/**
 * Main Table component props interface.
 * @template T - The type of data object for each row
 *
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * const users: User[] = [
 *   { id: '1', name: 'John Doe', email: 'john@example.com' },
 * ];
 *
 * <Table<User>
 *   items={users}
 *   columns={columns}
 *   selectionMode="multiple"
 *   onSelectionChange={(keys) => setSelectedKeys(keys)}
 * />
 * ```
 */
export interface TableProps<T = any> {
  // Data and structure
  /** ReactNode children (alternative to items/columns pattern) */
  children?: React.ReactNode;
  /** @control object Array of data items to display in the table */
  items?: T[];
  /** @control object Column definitions for the table */
  columns?: TableColumn<T>[];

  // Visual styling
  /** @control select @defaultValue default Color theme for the table */
  color?: TableColor;
  /** @control select @defaultValue auto Table layout algorithm */
  layout?: TableLayout;
  /** @control select @defaultValue none Border radius for the table */
  radius?: TableRadius;
  /** @control select @defaultValue none Shadow depth for the table */
  shadow?: TableShadow;

  // Virtualization
  /** @control number Maximum height before enabling virtualization */
  maxTableHeight?: number;
  /** @control number @defaultValue 56 Height of each table row in pixels */
  rowHeight?: number;
  /** @control boolean @defaultValue false Whether to enable row virtualization for performance */
  isVirtualized?: boolean;

  // Layout options
  /** @control boolean @defaultValue false Whether to hide the table header */
  hideHeader?: boolean;
  /** @control boolean @defaultValue false Whether to show striped rows */
  isStriped?: boolean;
  /** @control boolean @defaultValue false Whether to use compact row spacing */
  isCompact?: boolean;
  /** @control boolean @defaultValue false Whether to make the header sticky */
  isHeaderSticky?: boolean;
  /** @control boolean @defaultValue false Whether the table should take full width */
  fullWidth?: boolean;
  /** @control boolean @defaultValue false Whether to remove the wrapper div */
  removeWrapper?: boolean;

  // Content areas
  /** Content to display above the table */
  topContent?: React.ReactNode;
  /** Content to display below the table */
  bottomContent?: React.ReactNode;
  /** @control select @defaultValue outside Placement of top content */
  topContentPlacement?: ContentPlacement;
  /** @control select @defaultValue outside Placement of bottom content */
  bottomContentPlacement?: ContentPlacement;

  // Selection
  /** @control boolean @defaultValue false Whether to show selection checkboxes */
  showSelectionCheckboxes?: boolean;
  /** Current sort descriptor */
  sortDescriptor?: SortDescriptor;
  /** Currently selected row keys (controlled) */
  selectedKeys?: Selection;
  /** Default selected keys for uncontrolled selection */
  defaultSelectedKeys?: Selection;
  /** Keys that are disabled and cannot be selected */
  disabledKeys?: Selection;
  /** @control boolean @defaultValue false Whether to prevent empty selection */
  disallowEmptySelection?: boolean;
  /** @control select @defaultValue none Selection mode for table rows */
  selectionMode?: SelectionMode;
  /** @control select @defaultValue toggle Selection behavior mode */
  selectionBehavior?: SelectionBehavior;
  /** Behavior for disabled items */
  disabledBehavior?: DisabledBehavior;
  /** Whether to allow duplicate selection events */
  allowDuplicateSelectionEvents?: boolean;

  // Accessibility
  /** @control boolean @defaultValue false Whether to disable animations */
  disableAnimation?: boolean;
  /** @control boolean @defaultValue false Whether to disable keyboard navigation */
  isKeyboardNavigationDisabled?: boolean;

  // Styling
  /** Custom CSS classes for different table elements */
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

  // Legacy compatibility
  /** @deprecated Use items instead */
  data?: T[];
  /** @control boolean @defaultValue false Loading state for the table */
  loading?: boolean;
  /** Content to display when table is empty */
  emptyContent?: React.ReactNode;
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Function to extract unique key from row data */
  rowKey?: (row: T) => string | number;
  /** @control select @defaultValue default Visual variant of the table */
  variant?: 'default' | 'striped' | 'surface';
  /** @control select @defaultValue md Size variant for the table */
  size?: 'sm' | 'md' | 'lg';
  /** @control text Additional CSS classes */
  className?: string;
  /** @control boolean @defaultValue false Whether to show pagination */
  pagination?: boolean;
  /** @control number @defaultValue 10 Number of items per page */
  pageSize?: number;
  /** Total number of rows for pagination */
  totalRows?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** @deprecated Use selectionMode instead */
  rowSelection?: 'single' | 'multiple' | false;
  /** @deprecated Use selectedKeys instead */
  selectedRows?: T[];
  /** @deprecated Use onSelectionChange instead */
  onSelectRows?: (selectedRows: T[]) => void;
}

/**
 * Event handlers interface for table interactions.
 */
export interface TableEvents {
  /** Called when a row action is triggered */
  onRowAction?: (key: React.Key) => void;
  /** Called when a cell action is triggered */
  onCellAction?: (key: React.Key) => void;
  /** Called when selection changes */
  onSelectionChange?: (keys: Selection) => void;
  /** Called when sorting changes */
  onSortChange?: (descriptor: SortDescriptor) => void;
}

/**
 * TableBody specific props for handling table body content and states.
 * @template T - The type of data object for each row
 */
export interface TableBodyProps<T = any> {
  /** Children elements or render function for table body */
  children?: React.ReactElement | React.ReactElement[] | ((item: T) => React.ReactElement);
  /** Items to render in the table body */
  items?: Iterable<T>;
  /** Whether the table is in loading state */
  isLoading?: boolean;
  /** Specific loading state */
  loadingState?: LoadingState;
  /** Content to show during loading */
  loadingContent?: React.ReactNode;
  /** Content to show when empty */
  emptyContent?: React.ReactNode;
  /** Callback for loading more data */
  onLoadMore?: () => void;
}

/**
 * TableRow props for individual table row configuration.
 * @template T - The type of data object for the row
 */
export interface TableRowProps<T = any> {
  /** Children elements or render function for table row */
  children?: React.ReactElement | React.ReactElement[] | ((item: T) => React.ReactElement);
  /** Text value for accessibility */
  textValue?: string;
}

// TableCell props
export interface TableCellProps {
  children: React.ReactNode;
  textValue?: string;
}

// Combined props for complete Table component
export interface CompleteTableProps<T = any> extends TableProps<T>, TableEvents {}
