import type * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  type ColumnAlign,
  type Selection,
  type SelectionMode,
  type SortDescriptor,
  type TableClassNames,
  type TableColumn,
  type TableComparableValue,
  type TableLayout,
  type TableRadius,
  type TableRowData,
  type TableShadow,
  type TableSize,
  type TableVariant,
  tableCellVariants,
  tableElementVariants,
  tableHeaderCellVariants,
  tableHeaderVariants,
  tableRowVariants,
  tableVariants
} from './types';

type UseTableProps<T extends TableRowData> = {
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
  disallowEmptySelection?: boolean;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor | null;
  onSortChange?: (descriptor: SortDescriptor | null) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  rowKey?: (row: T) => React.Key;
};

type UseTableReturn<T extends TableRowData> = {
  allFilteredData: T[];
  currentPage: number;
  filterValues: Record<string, string>;
  filteredData: T[];
  getColumnValue: (row: T, column: TableColumn<T>) => unknown;
  getRowIndex: (item: T, fallbackIndex: number) => number;
  getRowKey: (item: T, index: number) => React.Key;
  handlePageChange: (page: number) => void;
  handleSelectionChange: (keys: Selection) => void;
  handleSort: (columnKey: React.Key) => void;
  isLoading: boolean;
  selectedKeys: Selection;
  selectedRows: T[];
  setFilter: (columnKey: string, value: string) => void;
  setIsLoading: (value: boolean) => void;
  sortDescriptor: SortDescriptor | null;
  toggleAllRowsSelection: () => void;
  toggleRowSelection: (row: T) => void;
  totalPages: number;
};

type FocusedCell = { row: number; col: number } | null;

type UseTableClassesProps = {
  classNames?: TableClassNames;
  focusedCell?: FocusedCell;
  fullWidth?: boolean;
  isCompact?: boolean;
  isHeaderSticky?: boolean;
  isStriped?: boolean;
  layout?: TableLayout;
  radius?: TableRadius;
  removeWrapper?: boolean;
  shadow?: TableShadow;
  size?: TableSize;
  variant?: TableVariant;
};

type HeaderCellColumn = Pick<TableColumn<TableRowData>, 'align' | 'allowsSorting' | 'sortable'>;

const EMPTY_TABLE_DATA: TableRowData[] = [];

const getSelectionSet = (selection?: Selection): Set<string> => {
  if (!selection || selection === 'all') {
    return new Set();
  }

  return new Set(Array.from(selection, (key) => String(key)));
};

export const isInteractiveEventTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      'a[href], button, input, textarea, select, [contenteditable="true"], [role="button"], [role="checkbox"], [role="combobox"], [role="link"], [role="radio"], [role="searchbox"], [role="slider"], [role="spinbutton"], [role="textbox"]'
    )
  );
};

const isReactKeyValue = (value: unknown): value is React.Key => typeof value === 'string' || typeof value === 'number';

const toComparableValue = (value: TableComparableValue): string | number => {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  return String(value ?? '').toLocaleLowerCase();
};

const compareValues = (left: TableComparableValue, right: TableComparableValue) => {
  if (left == null && right == null) {
    return 0;
  }

  if (left == null) {
    return 1;
  }

  if (right == null) {
    return -1;
  }

  const normalizedLeft = toComparableValue(left);
  const normalizedRight = toComparableValue(right);

  if (typeof normalizedLeft === 'number' && typeof normalizedRight === 'number') {
    return normalizedLeft - normalizedRight;
  }

  return String(normalizedLeft).localeCompare(String(normalizedRight), undefined, {
    numeric: true,
    sensitivity: 'base'
  });
};

const normalizeFilterValue = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLocaleLowerCase();

const toTableComparableValue = (value: unknown): TableComparableValue => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
    return value;
  }

  return undefined;
};

export const useTable = <T extends TableRowData>({
  data: rawData,
  items: rawItems,
  columns,
  propLoading = false,
  pagination = false,
  pageSize = 10,
  totalRows,
  onPageChange,
  rowSelection = false,
  selectedRows,
  onSelectRows,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  disabledKeys,
  disallowEmptySelection = false,
  onSelectionChange,
  sortDescriptor: controlledSortDescriptor,
  onSortChange,
  onFilterChange,
  rowKey
}: UseTableProps<T>): UseTableReturn<T> => {
  const data = (rawData ?? EMPTY_TABLE_DATA) as T[];
  const items = (rawItems ?? EMPTY_TABLE_DATA) as T[];
  const actualData = useMemo(() => [...(rawItems === undefined ? data : items)], [data, items, rawItems]);
  const [isLoading, setIsLoading] = useState(propLoading);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Selection>(defaultSelectedKeys ?? new Set());
  const [internalSortDescriptor, setInternalSortDescriptor] = useState<SortDescriptor | null>(
    controlledSortDescriptor ?? null
  );

  const isKeysControlled = selectedKeys !== undefined;
  const isRowsControlled = !isKeysControlled && selectedRows !== undefined;

  useEffect(() => {
    setIsLoading(propLoading);
  }, [propLoading]);

  useEffect(() => {
    if (controlledSortDescriptor !== undefined) {
      setInternalSortDescriptor(controlledSortDescriptor);
    }
  }, [controlledSortDescriptor]);

  const getRowKey = useCallback(
    (item: T, index: number): React.Key => {
      if (rowKey) {
        return rowKey(item);
      }

      if (isReactKeyValue(item.id)) {
        return item.id;
      }

      if (isReactKeyValue(item.key)) {
        return item.key;
      }

      if (typeof item.email === 'string') {
        return item.email;
      }

      if (typeof item.name === 'string') {
        return `${item.name}-${index}`;
      }

      return `row-${index}`;
    },
    [rowKey]
  );

  const getRowIndex = useCallback(
    (item: T, fallbackIndex: number) => {
      const dataIndex = actualData.indexOf(item);
      return dataIndex >= 0 ? dataIndex : fallbackIndex;
    },
    [actualData]
  );

  const getColumnValue = useCallback((row: T, column: TableColumn<T>): unknown => {
    if (typeof column.key === 'symbol') {
      return undefined;
    }

    return row[String(column.key)];
  }, []);

  const getColumnComparableValue = useCallback(
    (row: T, column: TableColumn<T>): TableComparableValue => {
      const explicitSortValue = column.sortValue?.(row);

      if (explicitSortValue !== undefined) {
        return explicitSortValue;
      }

      return toTableComparableValue(getColumnValue(row, column));
    },
    [getColumnValue]
  );

  const getColumnFilterValue = useCallback(
    (row: T, column: TableColumn<T>) => column.filterValue?.(row) ?? getColumnComparableValue(row, column),
    [getColumnComparableValue]
  );

  const currentSortDescriptor =
    controlledSortDescriptor !== undefined ? controlledSortDescriptor : internalSortDescriptor;
  const disabledKeySet = useMemo(() => getSelectionSet(disabledKeys), [disabledKeys]);

  const filteredAndSortedData = useMemo(() => {
    const filteredData = actualData.filter((row) => {
      return Object.entries(filterValues).every(([columnKey, rawFilterValue]) => {
        const filterValue = rawFilterValue.trim();

        if (!filterValue) {
          return true;
        }

        const column = columns.find((item) => String(item.key) === columnKey);

        if (!column?.filterable) {
          return true;
        }

        const comparableValue = getColumnFilterValue(row, column);
        return normalizeFilterValue(comparableValue).includes(filterValue.toLocaleLowerCase());
      });
    });

    if (!currentSortDescriptor) {
      return filteredData;
    }

    const sortColumn = columns.find((column) => column.key === currentSortDescriptor.column);

    if (!sortColumn) {
      return filteredData;
    }

    return [...filteredData].sort((left, right) => {
      const comparison = compareValues(
        getColumnComparableValue(left, sortColumn),
        getColumnComparableValue(right, sortColumn)
      );

      return currentSortDescriptor.direction === 'ascending' ? comparison : comparison * -1;
    });
  }, [actualData, columns, currentSortDescriptor, filterValues, getColumnComparableValue, getColumnFilterValue]);

  const totalPages = useMemo(() => {
    if (!pagination) {
      return 1;
    }

    const total = totalRows ?? filteredAndSortedData.length;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [filteredAndSortedData.length, pageSize, pagination, totalRows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return filteredAndSortedData;
    }

    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [currentPage, filteredAndSortedData, pageSize, pagination]);

  const selectedKeysFromRows = useMemo<Selection>(() => {
    if (!isRowsControlled || !selectedRows) {
      return new Set();
    }

    return new Set(selectedRows.map((row, index) => String(getRowKey(row, getRowIndex(row, index)))));
  }, [getRowIndex, getRowKey, isRowsControlled, selectedRows]);

  const currentSelection = isKeysControlled
    ? selectedKeys
    : isRowsControlled
      ? selectedKeysFromRows
      : internalSelectedKeys;

  const currentSelectionSet = useMemo(() => {
    if (currentSelection === 'all') {
      return new Set(
        actualData.map((row, index) => String(getRowKey(row, index))).filter((key) => !disabledKeySet.has(key))
      );
    }

    return getSelectionSet(currentSelection);
  }, [actualData, currentSelection, disabledKeySet, getRowKey]);

  const currentSelectedRows = useMemo(() => {
    if (isRowsControlled && selectedRows) {
      return selectedRows;
    }

    return actualData.filter((row, index) => currentSelectionSet.has(String(getRowKey(row, index))));
  }, [actualData, currentSelectionSet, getRowKey, isRowsControlled, selectedRows]);

  const getSelectionFromKeySet = useCallback(
    (selectionSet: Set<string>): Set<React.Key> => {
      const keyMap = new Map(actualData.map((row, index) => [String(getRowKey(row, index)), getRowKey(row, index)]));
      return new Set(Array.from(selectionSet, (key) => keyMap.get(key) ?? key));
    },
    [actualData, getRowKey]
  );

  const commitSelection = useCallback(
    (nextSelectionSet: Set<string>, emittedSelection: Selection = getSelectionFromKeySet(nextSelectionSet)) => {
      const nextSelectedRows = actualData.filter((row, index) => nextSelectionSet.has(String(getRowKey(row, index))));
      const nextSelection = new Set(nextSelectionSet);

      if (!isKeysControlled && !isRowsControlled) {
        setInternalSelectedKeys(nextSelection);
      }

      onSelectionChange?.(emittedSelection);
      onSelectRows?.(nextSelectedRows);
    },
    [actualData, getRowKey, getSelectionFromKeySet, isKeysControlled, isRowsControlled, onSelectRows, onSelectionChange]
  );

  const setFilter = useCallback(
    (columnKey: string, value: string) => {
      setFilterValues((currentFilters) => {
        const nextFilters = {
          ...currentFilters,
          [columnKey]: value
        };

        onFilterChange?.(nextFilters);
        return nextFilters;
      });
      setCurrentPage(1);
    },
    [onFilterChange]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) {
        return;
      }

      setCurrentPage(page);
      onPageChange?.(page);
    },
    [onPageChange, totalPages]
  );

  const toggleRowSelection = useCallback(
    (row: T) => {
      const rowIndex = getRowIndex(row, 0);
      const rowKeyValue = String(getRowKey(row, rowIndex));

      if (disabledKeySet.has(rowKeyValue)) {
        return;
      }

      const isSingleMode = rowSelection === 'single' || selectionMode === 'single';
      const nextSelectionSet = new Set(currentSelectionSet);
      const isCurrentlySelected = nextSelectionSet.has(rowKeyValue);

      if (isSingleMode) {
        if (isCurrentlySelected && disallowEmptySelection) {
          return;
        }

        nextSelectionSet.clear();

        if (!isCurrentlySelected) {
          nextSelectionSet.add(rowKeyValue);
        }
      } else if (isCurrentlySelected) {
        if (disallowEmptySelection && nextSelectionSet.size === 1) {
          return;
        }

        nextSelectionSet.delete(rowKeyValue);
      } else {
        nextSelectionSet.add(rowKeyValue);
      }

      commitSelection(nextSelectionSet);
    },
    [
      actualData,
      commitSelection,
      currentSelectionSet,
      disabledKeySet,
      disallowEmptySelection,
      getRowIndex,
      getRowKey,
      rowSelection,
      selectionMode
    ]
  );

  const toggleAllRowsSelection = useCallback(() => {
    const visibleSelectableRows = filteredAndSortedData.filter((row, index) => {
      const rowIndex = getRowIndex(row, index);
      return !disabledKeySet.has(String(getRowKey(row, rowIndex)));
    });
    const visibleSelectableKeys = new Set(
      visibleSelectableRows.map((row, index) => String(getRowKey(row, getRowIndex(row, index))))
    );
    const allSelectableKeys = new Set(
      actualData.map((row, index) => String(getRowKey(row, index))).filter((key) => !disabledKeySet.has(key))
    );
    const allVisibleSelected =
      visibleSelectableKeys.size > 0 && [...visibleSelectableKeys].every((key) => currentSelectionSet.has(key));
    const nextSelectionSet = new Set(currentSelectionSet);

    if (allVisibleSelected) {
      if (disallowEmptySelection && nextSelectionSet.size === visibleSelectableKeys.size) {
        return;
      }

      visibleSelectableKeys.forEach((key) => {
        nextSelectionSet.delete(key);
      });
      commitSelection(nextSelectionSet);
      return;
    }

    visibleSelectableKeys.forEach((key) => {
      nextSelectionSet.add(key);
    });

    const selectsEverySelectableRow =
      visibleSelectableKeys.size === allSelectableKeys.size &&
      [...allSelectableKeys].every((key) => visibleSelectableKeys.has(key));

    commitSelection(nextSelectionSet, selectsEverySelectableRow ? 'all' : getSelectionFromKeySet(nextSelectionSet));
  }, [
    actualData,
    commitSelection,
    currentSelectionSet,
    disabledKeySet,
    disallowEmptySelection,
    filteredAndSortedData,
    getRowIndex,
    getRowKey,
    getSelectionFromKeySet
  ]);

  const handleSort = useCallback(
    (columnKey: React.Key) => {
      const getNextSortDescriptor = (descriptor: SortDescriptor | null): SortDescriptor | null => {
        if (!descriptor || descriptor.column !== columnKey) {
          return { column: columnKey, direction: 'ascending' };
        }

        if (descriptor.direction === 'ascending') {
          return { column: columnKey, direction: 'descending' };
        }

        return null;
      };

      if (controlledSortDescriptor === undefined) {
        setInternalSortDescriptor((currentDescriptor) => {
          const nextSortDescriptor = getNextSortDescriptor(currentDescriptor);
          onSortChange?.(nextSortDescriptor);
          return nextSortDescriptor;
        });

        return;
      }

      onSortChange?.(getNextSortDescriptor(controlledSortDescriptor));
    },
    [controlledSortDescriptor, onSortChange]
  );

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      const nextSelectionSet =
        keys === 'all'
          ? new Set(
              actualData.map((row, index) => String(getRowKey(row, index))).filter((key) => !disabledKeySet.has(key))
            )
          : getSelectionSet(keys);
      commitSelection(nextSelectionSet, keys);
    },
    [actualData, commitSelection, disabledKeySet, getRowKey]
  );

  const stableSelectedKeys = useMemo(() => new Set(currentSelectionSet), [currentSelectionSet]);

  return {
    allFilteredData: filteredAndSortedData,
    currentPage,
    filterValues,
    filteredData: paginatedData,
    getColumnValue,
    getRowIndex,
    getRowKey,
    handlePageChange,
    handleSelectionChange,
    handleSort,
    isLoading,
    selectedKeys: stableSelectedKeys,
    selectedRows: currentSelectedRows,
    setFilter,
    setIsLoading,
    sortDescriptor: currentSortDescriptor,
    toggleAllRowsSelection,
    toggleRowSelection,
    totalPages
  };
};

export const useKeyboardNavigation = (rowCount: number, columnCount: number, disabled = false) => {
  const [focusedCell, setFocusedCell] = useState<FocusedCell>(null);

  useEffect(() => {
    setFocusedCell((currentCell) => {
      if (disabled || rowCount === 0 || columnCount === 0) {
        return currentCell === null ? currentCell : null;
      }

      if (!currentCell) {
        return currentCell;
      }

      const nextCell = {
        row: Math.min(currentCell.row, rowCount - 1),
        col: Math.min(currentCell.col, columnCount - 1)
      };

      return nextCell.row === currentCell.row && nextCell.col === currentCell.col ? currentCell : nextCell;
    });
  }, [columnCount, disabled, rowCount]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || rowCount === 0 || columnCount === 0 || isInteractiveEventTarget(event.target)) {
        return;
      }

      const initialCell = (() => {
        switch (event.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
          case 'Home':
          case 'PageUp':
            return { row: 0, col: 0 };
          case 'ArrowDown':
          case 'ArrowRight':
          case 'End':
          case 'PageDown':
            return { row: 0, col: 0 };
          default:
            return null;
        }
      })();

      if (!focusedCell && initialCell) {
        event.preventDefault();
        setFocusedCell(initialCell);
        return;
      }

      if (!focusedCell) {
        return;
      }

      const { row, col } = focusedCell;
      let nextRow = row;
      let nextCol = col;
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowUp':
          nextRow = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          nextRow = Math.min(rowCount - 1, row + 1);
          break;
        case 'ArrowLeft':
          nextCol = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          nextCol = Math.min(columnCount - 1, col + 1);
          break;
        case 'Home':
          nextCol = 0;
          if (event.ctrlKey) {
            nextRow = 0;
          }
          break;
        case 'End':
          nextCol = columnCount - 1;
          if (event.ctrlKey) {
            nextRow = rowCount - 1;
          }
          break;
        case 'PageUp':
          nextRow = Math.max(0, row - 10);
          break;
        case 'PageDown':
          nextRow = Math.min(rowCount - 1, row + 10);
          break;
        default:
          shouldPreventDefault = false;
      }

      if (shouldPreventDefault) {
        event.preventDefault();
        setFocusedCell({ row: nextRow, col: nextCol });
      }
    },
    [columnCount, disabled, focusedCell, rowCount]
  );

  return { focusedCell, handleKeyDown, setFocusedCell };
};

export const useTableEvents = <T extends TableRowData>(
  getRowKey: (item: T, index: number) => React.Key,
  onRowAction?: (key: React.Key) => void,
  onCellAction?: (key: React.Key) => void,
  onRowClick?: (row: T) => void
) => {
  const handleCellClick = useCallback(
    (_rowIndex: number, _columnIndex: number, row: T, keyIndex = _rowIndex) => {
      onCellAction?.(getRowKey(row, keyIndex));
    },
    [getRowKey, onCellAction]
  );

  const handleRowClick = useCallback(
    (rowIndex: number, row: T, keyIndex = rowIndex) => {
      const key = getRowKey(row, keyIndex);
      onRowAction?.(key);
      onRowClick?.(row);
    },
    [getRowKey, onRowAction, onRowClick]
  );

  return { handleCellClick, handleRowClick };
};

export const useTableClasses = ({
  fullWidth,
  classNames,
  removeWrapper,
  shadow,
  layout,
  isStriped,
  variant,
  isCompact,
  size = 'md',
  isHeaderSticky,
  focusedCell,
  radius = 'md'
}: UseTableClassesProps) => {
  const getBaseClasses = useCallback(
    () => cn('relative', fullWidth && 'w-full', classNames?.base),
    [classNames?.base, fullWidth]
  );

  const getWrapperClasses = useCallback(
    () =>
      cn(
        'flex flex-col relative',
        !removeWrapper && tableVariants({ shadow, radius }),
        removeWrapper && 'border-0 bg-transparent shadow-none',
        classNames?.wrapper
      ),
    [classNames?.wrapper, radius, removeWrapper, shadow]
  );

  const getTableClasses = useCallback(
    () =>
      cn(
        tableElementVariants({ fullWidth, layout }),
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        variant === 'surface' && 'bg-surface-raised-light dark:bg-surface-raised-dark',
        classNames?.table
      ),
    [classNames?.table, fullWidth, layout, size, variant]
  );

  const getHeaderClasses = useCallback(
    () => cn(tableHeaderVariants({ isSticky: isHeaderSticky }), classNames?.thead),
    [classNames?.thead, isHeaderSticky]
  );

  const getHeaderCellClasses = useCallback(
    (column?: HeaderCellColumn, columnIndex?: number) =>
      cn(
        tableHeaderCellVariants({
          size,
          align: column?.align ?? 'start',
          allowsSorting: Boolean(column?.allowsSorting || column?.sortable)
        }),
        'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark',
        focusedCell &&
          focusedCell.row === -1 &&
          focusedCell.col === columnIndex &&
          'shadow-glow-focus-light dark:shadow-glow-focus-dark',
        classNames?.th
      ),
    [classNames?.th, focusedCell, size]
  );

  const getRowClasses = useCallback(
    ({ isDisabled, isInteractive, isSelected }: { isDisabled: boolean; isInteractive: boolean; isSelected: boolean }) =>
      cn(
        tableRowVariants({
          isDisabled,
          isSelectable: isInteractive,
          isSelected,
          isStriped: Boolean(isStriped || variant === 'striped')
        }),
        classNames?.tr
      ),
    [classNames?.tr, isStriped, variant]
  );

  const getCellClasses = useCallback(
    ({ align, columnIndex, rowIndex }: { align?: ColumnAlign; columnIndex: number; rowIndex: number }) =>
      cn(
        tableCellVariants({ align: align ?? 'start', isCompact, size }),
        focusedCell &&
          focusedCell.row === rowIndex &&
          focusedCell.col === columnIndex &&
          'shadow-glow-focus-light dark:shadow-glow-focus-dark',
        classNames?.td
      ),
    [classNames?.td, focusedCell, isCompact, size]
  );

  return {
    getBaseClasses,
    getCellClasses,
    getHeaderCellClasses,
    getHeaderClasses,
    getRowClasses,
    getTableClasses,
    getWrapperClasses
  };
};
