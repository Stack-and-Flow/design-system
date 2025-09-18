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
}

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

  const setFilter = useCallback((columnKey: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  }, []);

  const filteredAndSortedData = useMemo(() => {
    if (!actualData) {
      return [];
    }

    let processedData = [...actualData];

    const activeFilters = Object.entries(filterValues).filter(([, value]) => value.trim() !== '');

    if (activeFilters.length > 0) {
      processedData = processedData.filter((row) => {
        return activeFilters.every(([columnKey, filterValue]) => {
          const column = columns.find((col) => String(col.key) === columnKey);
          if (!column) {
            return true;
          }

          const cellContent = column.cell ? String(column.cell(row)) : '';
          const filterValueLower = filterValue.toLowerCase();
          const cellContentLower = cellContent.toLowerCase();

          // If filter value has spaces or special chars, try exact match first
          if (filterValue.includes(' ') || filterValue.includes('-') || filterValue.includes('_')) {
            // Try exact match first
            if (cellContentLower === filterValueLower) {
              return true;
            }
            // Fall back to word-by-word matching
            const filterWords = filterValueLower.split(/\s+/).filter((word) => word.length > 0);
            return filterWords.every((word) => cellContentLower.includes(word));
          }

          // Default behavior for single words
          return cellContentLower.includes(filterValueLower);
        });
      });
    }
    if (currentSortDescriptor) {
      const { column: sortColumn, direction } = currentSortDescriptor;
      processedData.sort((a, b) => {
        const columnDef = columns.find((col) => col.key === sortColumn);
        if (!columnDef) {
          return 0;
        }

        // Use custom sorting function if provided, otherwise use the raw data value
        const aValue: any = columnDef.sortValue ? columnDef.sortValue(a) : (a as any)[String(sortColumn)];
        const bValue: any = columnDef.sortValue ? columnDef.sortValue(b) : (b as any)[String(sortColumn)];

        if (aValue == null && bValue == null) {
          return 0;
        }
        if (aValue == null) {
          return direction === 'ascending' ? 1 : -1;
        }
        if (bValue == null) {
          return direction === 'ascending' ? -1 : 1;
        }

        const aStr = String(aValue);
        const bStr = String(bValue);

        const aNum = parseFloat(aStr);
        const bNum = parseFloat(bStr);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return direction === 'ascending' ? aNum - bNum : bNum - aNum;
        }

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

        return direction === 'ascending'
          ? aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' })
          : bStr.localeCompare(aStr, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return processedData;
  }, [actualData, filterValues, columns, currentSortDescriptor]);

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
