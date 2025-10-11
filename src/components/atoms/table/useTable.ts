import { useCallback, useEffect, useMemo, useState } from 'react';
import type * as React from 'react';
import type { Selection, SelectionMode, SortDescriptor, TableColumn } from './types';

interface UseTableProps<T> {
  data?: T[];
  items?: T[];
  columns: TableColumn<T>[];
  propLoading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  rowSelection?: 'single' | 'multiple' | false;
  selectedRows?: T[];
  onSelectRows?: (selectedRows: T[]) => void;
  selectionMode?: SelectionMode;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  disabledKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
}

export function useTable<T>({
  data = [],
  items = [],

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
  onSortChange,
  onFilterChange
}: UseTableProps<T>) {
  const actualData = items && items.length > 0 ? Array.from(items) : data || [];

  // Helper function to compare two Sets
  const areSetsEqual = (set1: Selection, set2: Selection): boolean => {
    if (set1 === set2) {
      return true;
    }
    if (set1 === 'all' || set2 === 'all') {
      return set1 === set2;
    }
    if (!(set1 instanceof Set) || !(set2 instanceof Set)) {
      return false;
    }
    if (set1.size !== set2.size) {
      return false;
    }
    for (const item of set1) {
      if (!set2.has(item)) {
        return false;
      }
    }
    return true;
  };

  const [isLoading, setIsLoading] = useState(propLoading);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelectedRows, setInternalSelectedRows] = useState<T[]>(selectedRows || []);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Selection>(defaultSelectedKeys || new Set());

  const [internalSortDescriptor, setInternalSortDescriptor] = useState<SortDescriptor | null>(null);
  const currentSortDescriptor = controlledSortDescriptor || internalSortDescriptor;

  useEffect(() => {
    if (propLoading !== undefined) {
      setIsLoading(propLoading);
    }
  }, [propLoading]);

  useEffect(() => {
    // Solo actualizar internalSelectedRows si estamos en controlled mode (selectedKeys está definido)
    if (
      selectedKeys !== undefined &&
      selectedRows &&
      JSON.stringify(selectedRows) !== JSON.stringify(internalSelectedRows)
    ) {
      setInternalSelectedRows(selectedRows);
    }
  }, [selectedRows, selectedKeys]);

  const setFilter = useCallback(
    (columnKey: string, value: string) => {
      const newFilters = {
        ...filterValues,
        [columnKey]: value
      };
      setFilterValues(newFilters);
      setCurrentPage(1);

      // Notify backend of filter changes for API-driven approach
      onFilterChange?.(newFilters);
    },
    [filterValues, onFilterChange]
  );

  // API-driven approach: data comes already filtered and sorted from backend
  const filteredAndSortedData = useMemo(() => {
    return actualData || [];
  }, [actualData]);

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return filteredAndSortedData;
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, pagination, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (!pagination) {
      return 1;
    }
    const total = totalRows || filteredAndSortedData.length;
    return Math.ceil(total / pageSize);
  }, [pagination, totalRows, filteredAndSortedData.length, pageSize]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        onPageChange?.(page);
      }
    },
    [totalPages, onPageChange]
  );

  const getRowKey = useCallback((item: T, index: number): React.Key => {
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, any>;
      if (obj.id !== undefined) {
        return String(obj.id);
      }
      if (obj.key !== undefined) {
        return String(obj.key);
      }
      if (obj.email !== undefined) {
        return obj.email;
      }
      if (obj.name !== undefined) {
        return `${obj.name}-${index}`;
      }
    }
    return `row-${index}`;
  }, []);

  const toggleRowSelection = useCallback(
    (row: T) => {
      const rowKey = getRowKey(row, actualData.indexOf(row));
      const isSingleMode = rowSelection === 'single' || selectionMode === 'single';
      const keyAsString = String(rowKey);

      // Use controlled selectedKeys if provided, otherwise use internal state
      const currentSelectedKeys = selectedKeys !== undefined ? selectedKeys : internalSelectedKeys;
      const isCurrentlySelected =
        currentSelectedKeys instanceof Set ? currentSelectedKeys.has(keyAsString) : currentSelectedKeys === 'all';

      let newSelection: T[];
      let newKeys: Selection;

      if (isSingleMode) {
        if (isCurrentlySelected) {
          newSelection = [];
          newKeys = new Set();
        } else {
          newSelection = [row];
          newKeys = new Set([keyAsString]);
        }
      } else {
        if (selectedKeys !== undefined) {
          // Controlled selection mode
          if (isCurrentlySelected) {
            const currentRows = actualData.filter(
              (r) =>
                currentSelectedKeys instanceof Set &&
                currentSelectedKeys.has(String(getRowKey(r, actualData.indexOf(r))))
            );
            newSelection = currentRows.filter((r) => String(getRowKey(r, actualData.indexOf(r))) !== keyAsString);

            const keysSet = new Set(currentSelectedKeys instanceof Set ? currentSelectedKeys : []);
            keysSet.delete(keyAsString);
            newKeys = keysSet;
          } else {
            const currentRows = actualData.filter(
              (r) =>
                currentSelectedKeys instanceof Set &&
                currentSelectedKeys.has(String(getRowKey(r, actualData.indexOf(r))))
            );
            newSelection = [...currentRows, row];

            const keysSet = new Set(currentSelectedKeys instanceof Set ? currentSelectedKeys : []);
            keysSet.add(keyAsString);
            newKeys = keysSet;
          }
        } else {
          // Uncontrolled selection mode - use internal state
          if (isCurrentlySelected) {
            newSelection = internalSelectedRows.filter(
              (r) => String(getRowKey(r, actualData.indexOf(r))) !== keyAsString
            );
            const keysSet = new Set(internalSelectedKeys);
            keysSet.delete(keyAsString);
            newKeys = keysSet;
          } else {
            newSelection = [...internalSelectedRows, row];
            const keysSet = new Set(internalSelectedKeys);
            keysSet.add(keyAsString);
            newKeys = keysSet;
          }
        }
      }

      // En controlled mode, comparamos con el estado actual de selectedKeys
      // En uncontrolled mode, comparamos con internalSelectedRows
      const shouldUpdate =
        selectedKeys !== undefined
          ? !areSetsEqual(newKeys, currentSelectedKeys)
          : JSON.stringify(newSelection) !== JSON.stringify(internalSelectedRows);

      if (shouldUpdate) {
        if (selectedKeys !== undefined) {
          // Controlled mode - only call callbacks
          onSelectionChange?.(newKeys);
          onSelectRows?.(newSelection);
        } else {
          // Uncontrolled mode - update internal state
          setInternalSelectedRows(newSelection);
          setInternalSelectedKeys(newKeys);
          onSelectRows?.(newSelection);
          onSelectionChange?.(newKeys);
        }
      }
    },
    [
      internalSelectedRows,
      internalSelectedKeys,
      selectedKeys,
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

    const newKeys: Selection = isAllSelected ? new Set() : 'all';

    // If using controlled selection, only call the callback
    if (selectedKeys !== undefined) {
      onSelectionChange?.(newKeys);
      onSelectRows?.(newSelection);
    } else {
      // Otherwise, update internal state
      setInternalSelectedRows(newSelection);
      setInternalSelectedKeys(newKeys);
      onSelectRows?.(newSelection);
      onSelectionChange?.(newKeys);
    }
  }, [internalSelectedRows, filteredAndSortedData, onSelectRows, onSelectionChange, selectedKeys]);

  const handleSort = useCallback(
    (columnKey: React.Key) => {
      const newSortDescriptor: SortDescriptor | null = (() => {
        if (!currentSortDescriptor || currentSortDescriptor.column !== columnKey) {
          return { column: columnKey, direction: 'ascending' };
        }

        if (currentSortDescriptor.direction === 'ascending') {
          return { column: columnKey, direction: 'descending' };
        }
        return null;
      })();

      if (controlledSortDescriptor && onSortChange) {
        if (newSortDescriptor) {
          onSortChange(newSortDescriptor);
        }
      } else {
        setInternalSortDescriptor(newSortDescriptor);
      }
    },
    [currentSortDescriptor, controlledSortDescriptor, onSortChange]
  );

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      setInternalSelectedKeys(keys);
      onSelectionChange?.(keys);
    },
    [onSelectionChange]
  );

  return {
    filteredData: paginatedData,
    allFilteredData: filteredAndSortedData,

    isLoading,
    setIsLoading,

    filterValues,
    setFilter,

    currentPage,
    totalPages,
    handlePageChange,

    selectedRows: internalSelectedRows,
    toggleRowSelection,
    toggleAllRowsSelection,

    selectedKeys: selectedKeys || internalSelectedKeys,
    handleSelectionChange,

    sortDescriptor: currentSortDescriptor,
    handleSort,

    getRowKey
  };
}

export const useKeyboardNavigation = (rowCount: number, columnCount: number, disabled: boolean = false) => {
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || !focusedCell) {
        return;
      }

      const { row, col } = focusedCell;
      let newRow = row;
      let newCol = col;
      let preventDefault = true;

      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(rowCount - 1, row + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(columnCount - 1, col + 1);
          break;
        case 'Home':
          if (e.ctrlKey) {
            newRow = 0;
            newCol = 0;
          } else {
            newCol = 0;
          }
          break;
        case 'End':
          if (e.ctrlKey) {
            newRow = rowCount - 1;
            newCol = columnCount - 1;
          } else {
            newCol = columnCount - 1;
          }
          break;
        case 'PageUp':
          newRow = Math.max(0, row - 10);
          break;
        case 'PageDown':
          newRow = Math.min(rowCount - 1, row + 10);
          break;
        default:
          preventDefault = false;
      }

      if (preventDefault) {
        e.preventDefault();
        setFocusedCell({ row: newRow, col: newCol });
      }
    },
    [focusedCell, rowCount, columnCount, disabled]
  );

  return { focusedCell, setFocusedCell, handleKeyDown };
};

export const useTableEvents = <T>(
  getRowKey: (item: T, index: number) => React.Key,
  setFocusedCell: (cell: { row: number; col: number } | null) => void,
  onRowAction?: (key: React.Key) => void,
  onCellAction?: (key: React.Key) => void,
  onRowClick?: (row: T) => void
) => {
  const handleCellClick = useCallback(
    (rowIndex: number, columnIndex: number, row: T) => {
      setFocusedCell({ row: rowIndex, col: columnIndex });

      if (onCellAction) {
        const key = getRowKey(row, rowIndex);
        onCellAction(key);
      }
    },
    [getRowKey, onCellAction, setFocusedCell]
  );

  const handleRowClick = useCallback(
    (rowIndex: number, row: T) => {
      const key = getRowKey(row, rowIndex);

      if (onRowAction) {
        onRowAction(key);
      }

      if (onRowClick) {
        onRowClick(row);
      }
    },
    [getRowKey, onRowAction, onRowClick]
  );

  return { handleCellClick, handleRowClick };
};

export const useTableClasses = <T = any>({
  fullWidth,
  classNames,
  removeWrapper,
  shadow,
  layout,
  isStriped,
  variant,
  isCompact,
  size,
  isHeaderSticky,
  focusedCell
}: {
  fullWidth?: boolean;
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
  removeWrapper?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  layout?: 'auto' | 'fixed';
  isStriped?: boolean;
  variant?: 'default' | 'striped' | 'surface';
  isCompact?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isHeaderSticky?: boolean;
  focusedCell?: { row: number; col: number } | null;
}) => {
  const getBaseClasses = useCallback(() => {
    let classes = 'relative';
    if (fullWidth) {
      classes += ' w-full';
    }
    if (classNames?.base) {
      classes += ` ${classNames.base}`;
    }
    return classes;
  }, [fullWidth, classNames?.base]);

  const getWrapperClasses = useCallback(() => {
    let classes = 'flex flex-col relative';
    if (!removeWrapper) {
      classes += ' border border-gray-light-300 dark:border-gray-dark-600 rounded-lg bg-white dark:bg-gray-dark-900';
      if (shadow && shadow !== 'none') {
        const shadowMap = {
          sm: 'shadow-sm',
          md: 'shadow-md',
          lg: 'shadow-lg'
        };
        classes += ` ${shadowMap[shadow]}`;
      }
    }
    if (classNames?.wrapper) {
      classes += ` ${classNames.wrapper}`;
    }
    return classes;
  }, [removeWrapper, shadow, classNames?.wrapper]);

  const getTableClasses = useCallback(() => {
    let classes = `table-${layout} w-full bg-white dark:bg-gray-dark-900 text-text-light dark:text-text-dark`;

    if (isStriped || variant === 'striped') {
      classes += ' [&>tbody>tr:nth-child(odd)]:bg-gray-light-50 dark:[&>tbody>tr:nth-child(odd)]:bg-gray-dark-800';
    }

    if (isCompact) {
      classes += ' [&>thead>tr>th]:py-1 [&>tbody>tr>td]:py-1';
    }

    const sizeMap = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    classes += ` ${sizeMap[size || 'md'] || sizeMap.md}`;

    if (classNames?.table) {
      classes += ` ${classNames.table}`;
    }
    return classes;
  }, [layout, isStriped, variant, isCompact, size, classNames?.table]);

  const getHeaderClasses = useCallback(() => {
    let classes = 'bg-gray-light-100 dark:bg-primary border-b border-gray-light-300 dark:border-gray-dark-600';
    if (isHeaderSticky) {
      classes += ' sticky top-0 z-10';
    }
    if (classNames?.thead) {
      classes += ` ${classNames.thead}`;
    }
    return classes;
  }, [isHeaderSticky, classNames?.thead]);

  const getHeaderCellClasses = useCallback(
    (column: TableColumn<T>, columnIndex: number) => {
      let classes = 'px-4 py-3 text-left font-semibold text-text-light dark:text-white';

      if (column.align) {
        const alignMap = {
          start: 'text-left',
          center: 'text-center',
          end: 'text-right'
        };
        classes = classes.replace('text-left', alignMap[column.align] || 'text-left');
      }

      if (column.allowsSorting || column.sortable) {
        classes += ' cursor-pointer hover:bg-gray-light-200 dark:hover:bg-secondary transition-colors';
      }

      if (focusedCell && focusedCell.row === -1 && focusedCell.col === columnIndex) {
        classes += ' ring-2 ring-accent ring-inset';
      }

      if (classNames?.th) {
        classes += ` ${classNames.th}`;
      }
      return classes;
    },
    [focusedCell, classNames?.th]
  );

  const getCellClasses = useCallback(
    (rowIndex: number, columnIndex: number) => {
      let classes =
        'px-4 py-3 text-text-light dark:text-white border-b border-gray-light-300 dark:border-gray-dark-600';

      if (focusedCell && focusedCell.row === rowIndex && focusedCell.col === columnIndex) {
        classes += ' ring-2 ring-accent ring-inset';
      }

      if (classNames?.td) {
        classes += ` ${classNames.td}`;
      }
      return classes;
    },
    [focusedCell, classNames?.td]
  );

  return {
    getBaseClasses,
    getWrapperClasses,
    getTableClasses,
    getHeaderClasses,
    getHeaderCellClasses,
    getCellClasses
  };
};
