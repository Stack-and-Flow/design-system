import { useCallback, useEffect, useMemo, useState } from 'react';
import type * as React from 'react';
import type { Selection, SelectionMode, SortDescriptor, TableColumn } from './types';

/**
 * Configuration options for the useTable hook.
 * @template T - The type of data object for each row
 */
interface UseTableProps<T> {
  /** @deprecated Use items instead */
  data?: T[];
  /** Array of data items to display in the table */
  items?: T[];
  /** Column definitions for the table */
  columns: TableColumn<T>[];
  /** Loading state from parent component */
  propLoading?: boolean;
  /** Whether pagination is enabled */
  pagination?: boolean;
  /** Number of items per page */
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
  /** Selection mode for table rows */
  selectionMode?: SelectionMode;
  /** Currently selected row keys (controlled) */
  selectedKeys?: Selection;
  /** Default selected keys for uncontrolled selection */
  defaultSelectedKeys?: Selection;
  /** Keys that are disabled and cannot be selected */
  disabledKeys?: Selection;
  /** Called when selection changes */
  onSelectionChange?: (keys: Selection) => void;
  /** Current sort descriptor */
  sortDescriptor?: SortDescriptor;
  /** Called when sorting changes */
  onSortChange?: (descriptor: SortDescriptor) => void;
}

/**
 * A powerful hook for managing table state including selection, sorting, pagination, and data filtering.
 *
 * @template T - The type of data object for each row
 * @param props - Configuration options for the table
 * @returns Object containing table state and handlers
 *
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * const tableState = useTable<User>({
 *   items: users,
 *   columns: columns,
 *   selectionMode: 'multiple',
 *   onSelectionChange: (keys) => handleSelectionChange(keys)
 * });
 *
 * // Use in component
 * <div>
 *   {tableState.filteredData.map(user => (
 *     <div key={tableState.getRowKey(user)}>
 *       {user.name} - Selected: {tableState.selectedKeys.has(String(user.id))}
 *     </div>
 *   ))}
 * </div>
 * ```
 */
export function useTable<T>({
  data = [],
  items = [],
  columns,
  propLoading = false,
  pagination = false,
  pageSize = 10,
  totalRows,
  onPageChange,
  rowSelection = false,
  selectedRows = [],
  onSelectRows,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  sortDescriptor: controlledSortDescriptor,
  onSortChange
}: UseTableProps<T>) {
  // Use items if provided, fallback to data (legacy)
  const actualData = items.length > 0 ? Array.from(items) : data;

  // Loading state
  const [isLoading, setIsLoading] = useState(propLoading);

  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Selection state
  const [internalSelectedRows, setInternalSelectedRows] = useState<T[]>(selectedRows);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Selection>(defaultSelectedKeys || new Set());

  // Sort state - use controlled if provided, otherwise internal
  const [internalSortDescriptor, setInternalSortDescriptor] = useState<SortDescriptor | null>(null);
  const currentSortDescriptor = controlledSortDescriptor || internalSortDescriptor;

  // Update loading state when prop changes
  useEffect(() => {
    if (propLoading !== undefined) {
      setIsLoading(propLoading);
    }
  }, [propLoading]);

  // Update selected rows when prop changes (only if different)
  useEffect(() => {
    if (selectedRows && JSON.stringify(selectedRows) !== JSON.stringify(internalSelectedRows)) {
      setInternalSelectedRows(selectedRows);
    }
  }, [selectedRows]); // Removed internalSelectedRows from deps to avoid loop

  // Filter logic
  const setFilter = useCallback((columnKey: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    if (!actualData) {
      return [];
    }

    let processedData = [...actualData];

    // Apply filters
    const activeFilters = Object.entries(filterValues).filter(([, value]) => value.trim() !== '');

    if (activeFilters.length > 0) {
      processedData = processedData.filter((row) => {
        return activeFilters.every(([columnKey, filterValue]) => {
          const column = columns.find((col) => String(col.key) === columnKey);
          if (!column) {
            return true;
          }

          // Get the cell content for filtering
          const cellContent = column.cell ? String(column.cell(row)) : '';
          return cellContent.toLowerCase().includes(filterValue.toLowerCase());
        });
      });
    }

    // Apply sorting with improved type handling
    if (currentSortDescriptor) {
      const { column: sortColumn, direction } = currentSortDescriptor;
      processedData.sort((a, b) => {
        const columnDef = columns.find((col) => col.key === sortColumn);
        if (!columnDef) {
          return 0;
        }

        // Get raw values first
        const aValue: any = columnDef.cell ? columnDef.cell(a) : (a as any)[String(sortColumn)];
        const bValue: any = columnDef.cell ? columnDef.cell(b) : (b as any)[String(sortColumn)];

        // Handle null/undefined values (put them at the end)
        if (aValue == null && bValue == null) {
          return 0;
        }
        if (aValue == null) {
          return direction === 'ascending' ? 1 : -1;
        }
        if (bValue == null) {
          return direction === 'ascending' ? -1 : 1;
        }

        // Convert to string for comparison
        const aStr = String(aValue);
        const bStr = String(bValue);

        // Try to parse as numbers
        const aNum = parseFloat(aStr);
        const bNum = parseFloat(bStr);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return direction === 'ascending' ? aNum - bNum : bNum - aNum;
        }

        // Try to parse as dates
        const aDate = new Date(aStr);
        const bDate = new Date(bStr);

        if (
          !isNaN(aDate.getTime()) &&
          !isNaN(bDate.getTime()) &&
          (aStr.includes('-') || aStr.includes('/') || aStr.includes('T'))
        ) {
          const diff = aDate.getTime() - bDate.getTime();
          return direction === 'ascending' ? diff : -diff;
        }

        // Boolean comparison
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return direction === 'ascending'
            ? aValue === bValue
              ? 0
              : aValue
                ? 1
                : -1
            : aValue === bValue
              ? 0
              : bValue
                ? 1
                : -1;
        }

        // String comparison with locale support
        return direction === 'ascending'
          ? aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' })
          : bStr.localeCompare(aStr, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return processedData;
  }, [actualData, filterValues, columns, currentSortDescriptor]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) {
      return filteredAndSortedData;
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, pagination, currentPage, pageSize]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    if (!pagination) {
      return 1;
    }
    const total = totalRows || filteredAndSortedData.length;
    return Math.ceil(total / pageSize);
  }, [pagination, totalRows, filteredAndSortedData.length, pageSize]);

  // Page change handler
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        onPageChange?.(page);
      }
    },
    [totalPages, onPageChange]
  );

  // Get key for a row item with stable, unique keys
  const getRowKey = useCallback((item: T, index: number): React.Key => {
    // Try to find an ID field first
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, any>;
      if (obj.id !== undefined) {
        return String(obj.id);
      }
      if (obj.key !== undefined) {
        return String(obj.key);
      }
      if (obj.email !== undefined) {
        return obj.email; // Use email as unique key
      }
      if (obj.name !== undefined) {
        return `${obj.name}-${index}`; // Name with index
      }
    }
    // Stable fallback that doesn't use random
    return `row-${index}`;
  }, []);

  // Unified row selection handler
  const toggleRowSelection = useCallback(
    (row: T) => {
      const rowKey = getRowKey(row, actualData.indexOf(row));

      // Determine if it's single selection mode from either prop
      const isSingleMode = rowSelection === 'single' || selectionMode === 'single';

      // Current selection state
      const isCurrentlySelected = internalSelectedRows.includes(row);

      let newSelection: T[];
      let newKeys: Selection;

      if (isSingleMode) {
        // Single selection: only one item can be selected
        if (isCurrentlySelected) {
          // Deselect if already selected
          newSelection = [];
          newKeys = new Set();
        } else {
          // Select this item only (clear others)
          newSelection = [row];
          newKeys = new Set([rowKey]);
        }
      } else {
        // Multiple selection mode
        if (isCurrentlySelected) {
          // Remove from selection
          newSelection = internalSelectedRows.filter((r) => r !== row);
          const keysSet = new Set(internalSelectedKeys);
          keysSet.delete(rowKey);
          newKeys = keysSet;
        } else {
          // Add to selection
          newSelection = [...internalSelectedRows, row];
          const keysSet = new Set(internalSelectedKeys);
          keysSet.add(rowKey);
          newKeys = keysSet;
        }
      }

      // Update states only if they actually changed
      if (JSON.stringify(newSelection) !== JSON.stringify(internalSelectedRows)) {
        setInternalSelectedRows(newSelection);
        setInternalSelectedKeys(newKeys);

        // Call callbacks
        onSelectRows?.(newSelection);
        onSelectionChange?.(newKeys);
      }
    },
    [
      internalSelectedRows,
      internalSelectedKeys,
      rowSelection,
      selectionMode,
      onSelectRows,
      onSelectionChange,
      getRowKey,
      actualData
    ]
  );

  const toggleAllRowsSelection = useCallback(() => {
    const isAllSelected =
      internalSelectedRows.length === filteredAndSortedData.length && filteredAndSortedData.length > 0;
    const newSelection = isAllSelected ? [] : [...filteredAndSortedData];

    // Handle selection
    const newKeys: Selection = isAllSelected ? new Set() : 'all';

    setInternalSelectedRows(newSelection);
    setInternalSelectedKeys(newKeys);
    onSelectRows?.(newSelection);
    onSelectionChange?.(newKeys);
  }, [internalSelectedRows, filteredAndSortedData, onSelectRows, onSelectionChange]);

  // Sort handler
  const handleSort = useCallback(
    (columnKey: React.Key) => {
      const newSortDescriptor: SortDescriptor | null = (() => {
        if (!currentSortDescriptor || currentSortDescriptor.column !== columnKey) {
          return { column: columnKey, direction: 'ascending' };
        }

        if (currentSortDescriptor.direction === 'ascending') {
          return { column: columnKey, direction: 'descending' };
        }

        // Third click removes sorting
        return null;
      })();

      if (controlledSortDescriptor && onSortChange) {
        // Controlled mode - notify parent
        if (newSortDescriptor) {
          onSortChange(newSortDescriptor);
        }
      } else {
        // Uncontrolled mode - update internal state
        setInternalSortDescriptor(newSortDescriptor);
      }
    },
    [currentSortDescriptor, controlledSortDescriptor, onSortChange]
  );

  // Selection handlers
  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      setInternalSelectedKeys(keys);
      onSelectionChange?.(keys);
    },
    [onSelectionChange]
  );

  return {
    // Data
    filteredData: paginatedData,
    allFilteredData: filteredAndSortedData,

    // Loading
    isLoading,
    setIsLoading,

    // Filtering
    filterValues,
    setFilter,

    // Pagination
    currentPage,
    totalPages,
    handlePageChange,

    // Selection (legacy)
    selectedRows: internalSelectedRows,
    toggleRowSelection,
    toggleAllRowsSelection,

    // Selection
    selectedKeys: selectedKeys || internalSelectedKeys,
    handleSelectionChange,

    // Sorting
    sortDescriptor: currentSortDescriptor,
    handleSort,

    // Utilities
    getRowKey
  };
}
