import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import type { CompleteTableProps, TableColumn } from './types';
import { useTable } from './useTable';
import { useVirtualization } from './useVirtualization';

// Utility functions for keyboard navigation
const useKeyboardNavigation = (rowCount: number, columnCount: number, disabled: boolean = false) => {
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

/**
 * A comprehensive, accessible Table component.
 * Supports advanced features like row selection, sorting, virtualization, pagination, and keyboard navigation.
 *
 * @template T - The type of data object for each row
 * @param props - Table configuration props
 * @returns JSX.Element - Rendered table component
 *
 * @example
 * ```tsx
 * // Basic usage
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   role: string;
 * }
 *
 * const columns = [
 *   { key: 'name', header: 'Name', allowsSorting: true },
 *   { key: 'email', header: 'Email' },
 *   { key: 'role', header: 'Role' }
 * ];
 *
 * const users: User[] = [
 *   { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
 *   { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
 * ];
 *
 * <Table<User>
 *   items={users}
 *   columns={columns}
 *   selectionMode="multiple"
 *   onSelectionChange={(keys) => setSelectedKeys(keys)}
 *   sortDescriptor={{ column: 'name', direction: 'ascending' }}
 *   onSortChange={(descriptor) => handleSort(descriptor)}
 *   isVirtualized={false}
 *   className="custom-table"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with virtualization
 * <Table<User>
 *   items={largeUserList}
 *   columns={columns}
 *   selectionMode="single"
 *   isVirtualized={true}
 *   maxTableHeight={400}
 *   rowHeight={56}
 *   showSelectionCheckboxes={true}
 *   disallowEmptySelection={false}
 *   pagination={true}
 *   pageSize={50}
 *   topContent={<div>Custom header content</div>}
 *   bottomContent={<div>Custom footer content</div>}
 * />
 * ```
 *
 * @features
 * - ✅ Row selection (single/multiple) with keyboard support
 * - ✅ Column sorting with custom sort indicators
 * - ✅ Row virtualization for large datasets (10k+ rows)
 * - ✅ Pagination with configurable page sizes
 * - ✅ Keyboard navigation (Arrow keys, Enter, Space)
 * - ✅ Accessibility (ARIA attributes, screen reader support)
 * - ✅ Custom cell renderers and row actions
 * - ✅ Loading states and empty states
 * - ✅ Responsive design with mobile support
 * - ✅ Dark mode support
 */
function Table<T = any>(props: CompleteTableProps<T>) {
  const {
    // Data
    data = [],
    items = [],
    columns = [],

    // Visual styling
    color = 'default',
    layout = 'auto',
    shadow = 'sm',

    // Layout options
    hideHeader = false,
    isStriped = false,
    isCompact = false,
    isHeaderSticky = false,
    fullWidth = true,
    removeWrapper = false,

    // Content areas
    topContent,
    bottomContent,
    topContentPlacement = 'inside',
    bottomContentPlacement = 'inside',

    // Selection
    selectionMode = 'none',
    selectedKeys,
    defaultSelectedKeys,
    disabledKeys,
    disallowEmptySelection = false,
    showSelectionCheckboxes,

    // Sorting
    sortDescriptor,

    // Accessibility
    isKeyboardNavigationDisabled = false,

    // Virtualization
    isVirtualized = false,
    maxTableHeight = 400,

    // Events
    onRowAction,
    onCellAction,
    onSelectionChange,
    onSortChange,

    // Styling
    classNames = {},

    // Legacy props
    loading = false,
    emptyContent,
    variant = 'default',
    size = 'md',
    className,
    pagination = false,
    pageSize = 10,
    totalRows,
    onPageChange,
    rowSelection = false,
    selectedRows = [],
    onSelectRows,
    onRowClick,

    // Props for interface compatibility (unused but required)
    radius: _radius = 'lg',
    selectionBehavior: _selectionBehavior = 'toggle',
    rowKey: _rowKey
  } = props;

  const tableRef = useRef<HTMLTableElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tableId = useRef(`table-${Math.random().toString(36).substr(2, 9)}`);

  // Virtualization configuration
  const defaultRowHeight = size === 'sm' ? 32 : size === 'lg' ? 56 : 44;
  const containerHeight = maxTableHeight || 400;

  // Use the enhanced table hook
  const tableState = useTable({
    data: data.length > 0 ? data : Array.from(items || []),
    items,
    columns,
    propLoading: loading,
    pagination,
    pageSize,
    totalRows,
    onPageChange,
    rowSelection: rowSelection || (selectionMode !== 'none' ? 'multiple' : false),
    selectedRows,
    onSelectRows,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    sortDescriptor,
    onSortChange
  });

  // Virtualization hook
  const { virtualItems, totalHeight, offsetY, handleScroll } = useVirtualization({
    items: tableState.filteredData,
    containerHeight,
    itemHeight: defaultRowHeight,
    isVirtualized,
    overscan: 5
  });

  // Keyboard navigation
  const { focusedCell, setFocusedCell, handleKeyDown } = useKeyboardNavigation(
    tableState.filteredData.length,
    columns.length,
    isKeyboardNavigationDisabled
  );

  // Get CSS classes
  const getBaseClasses = useCallback(() => {
    let classes = 'relative';
    if (fullWidth) {
      classes += ' w-full';
    }
    if (classNames.base) {
      classes += ` ${classNames.base}`;
    }
    return classes;
  }, [fullWidth, classNames.base]);

  const getWrapperClasses = useCallback(() => {
    let classes = 'flex flex-col relative';
    if (!removeWrapper) {
      classes += ' border border-[#636579] rounded-lg bg-[#1a1a1a]';
      if (shadow !== 'none') {
        const shadowMap = {
          sm: 'shadow-sm',
          md: 'shadow-md',
          lg: 'shadow-lg'
        };
        classes += ` ${shadowMap[shadow] || 'shadow-sm'}`;
      }
    }
    if (classNames.wrapper) {
      classes += ` ${classNames.wrapper}`;
    }
    return classes;
  }, [removeWrapper, shadow, classNames.wrapper]);

  const getTableClasses = useCallback(() => {
    let classes = `table-${layout} w-full bg-[#1a1a1a]`;

    // Color theming using design system color classes
    const colorMap = {
      default: 'text-text-dark dark:text-text-dark',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      danger: 'text-red-500'
    };
    classes += ` ${colorMap[color] || colorMap.default}`;

    // Striped rows with design system colors
    if (isStriped || variant === 'striped') {
      classes += ' [&>tbody>tr:nth-child(odd)]:bg-[#2a2a2a]';
    }

    // Compact mode
    if (isCompact) {
      classes += ' [&>thead>tr>th]:py-1 [&>tbody>tr>td]:py-1';
    }

    // Size classes
    const sizeMap = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    classes += ` ${sizeMap[size] || sizeMap.md}`;

    if (classNames.table) {
      classes += ` ${classNames.table}`;
    }
    return classes;
  }, [layout, color, isStriped, variant, isCompact, size, classNames.table]);

  const getHeaderClasses = useCallback(() => {
    let classes = 'bg-[#830213] border-b border-[#636579]';
    if (isHeaderSticky) {
      classes += ' sticky top-0 z-10';
    }
    if (classNames.thead) {
      classes += ` ${classNames.thead}`;
    }
    return classes;
  }, [isHeaderSticky, classNames.thead]);

  const getHeaderCellClasses = useCallback(
    (column: TableColumn<T>, columnIndex: number) => {
      let classes = 'px-4 py-3 text-left font-semibold text-white';

      // Alignment
      if (column.align) {
        const alignMap = {
          start: 'text-left',
          center: 'text-center',
          end: 'text-right'
        };
        classes = classes.replace('text-left', alignMap[column.align] || 'text-left');
      }

      // Sortable cursor
      if (column.allowsSorting || column.sortable) {
        classes += ' cursor-pointer hover:bg-[#b41520] transition-colors';
      }

      // Focus styles
      if (focusedCell && focusedCell.row === -1 && focusedCell.col === columnIndex) {
        classes += ' ring-2 ring-[#d61e2b] ring-inset';
      }

      if (classNames.th) {
        classes += ` ${classNames.th}`;
      }
      return classes;
    },
    [focusedCell, classNames.th]
  );

  const getCellClasses = useCallback(
    (rowIndex: number, columnIndex: number) => {
      let classes = 'px-4 py-3 text-white border-b border-[#636579]';

      // Focus styles
      if (focusedCell && focusedCell.row === rowIndex && focusedCell.col === columnIndex) {
        classes += ' ring-2 ring-[#d61e2b] ring-inset';
      }

      if (classNames.td) {
        classes += ` ${classNames.td}`;
      }
      return classes;
    },
    [focusedCell, classNames.td]
  );

  // Sort icon renderer
  const renderSortIcon = useCallback(
    (column: TableColumn<T>) => {
      if (column.sortIcon) {
        return column.sortIcon;
      }

      // Default sort icons
      const isCurrentlySorted = tableState.sortDescriptor?.column === column.key;
      const direction = isCurrentlySorted ? tableState.sortDescriptor?.direction : null;

      return (
        <span className={`ml-2 inline-flex flex-col ${classNames.sortIcon || ''}`} aria-hidden='true'>
          {direction === 'ascending' ? (
            <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          ) : direction === 'descending' ? (
            <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          ) : (
            <svg className='w-3 h-3 opacity-50' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M5 10l3-3 4 3v1l-4 3-3-3v-1z' />
            </svg>
          )}
        </span>
      );
    },
    [tableState.sortDescriptor, classNames.sortIcon]
  );

  // Handle cell click
  const handleCellClick = useCallback(
    (rowIndex: number, columnIndex: number, row: T) => {
      setFocusedCell({ row: rowIndex, col: columnIndex });

      if (onCellAction) {
        const key = tableState.getRowKey(row, rowIndex);
        onCellAction(key);
      }
    },
    [tableState.getRowKey, onCellAction, setFocusedCell]
  );

  // Handle row click
  const handleRowClick = useCallback(
    (rowIndex: number, row: T) => {
      const key = tableState.getRowKey(row, rowIndex);

      if (onRowAction) {
        onRowAction(key);
      }

      if (onRowClick) {
        onRowClick(row);
      }
    },
    [tableState.getRowKey, onRowAction, onRowClick]
  );

  // Render loading state
  const renderLoadingState = useCallback(
    () => (
      <div className={`${getWrapperClasses()} ${className || ''}`}>
        <table className={getTableClasses()} role='grid' aria-label='Loading table data' aria-busy='true'>
          {!hideHeader && (
            <thead className={getHeaderClasses()}>
              <tr role='row'>
                {(selectionMode !== 'none' || showSelectionCheckboxes) && (
                  <th
                    className={getHeaderCellClasses({} as TableColumn<T>, -1)}
                    role='columnheader'
                    aria-label='Selection'
                  >
                    <div className='w-4 h-4 bg-[#636579] rounded animate-pulse'></div>
                  </th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={String(column.key)}
                    className={getHeaderCellClasses(column, index)}
                    role='columnheader'
                    aria-label={String(column.header)}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className={classNames.tbody}>
            {Array.from({ length: pageSize || 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} role='row' aria-rowindex={rowIndex + 1}>
                {(selectionMode !== 'none' || showSelectionCheckboxes) && (
                  <td className={getCellClasses(rowIndex, -1)} role='gridcell'>
                    <div className='w-4 h-4 bg-[#636579] rounded animate-pulse'></div>
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={String(column.key)} className={getCellClasses(rowIndex, colIndex)} role='gridcell'>
                    <div className='h-4 bg-[#636579] rounded animate-pulse'></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-center items-center py-4'>
          <div className='animate-spin h-5 w-5 border-2 border-[#830213] border-t-transparent rounded-full mr-3'></div>
          <span className='text-white'>Cargando datos...</span>
        </div>
      </div>
    ),
    [
      getWrapperClasses,
      className,
      getTableClasses,
      hideHeader,
      getHeaderClasses,
      selectionMode,
      showSelectionCheckboxes,
      getHeaderCellClasses,
      columns,
      classNames.tbody,
      pageSize,
      getCellClasses
    ]
  );

  // Render empty state
  const renderEmptyState = useCallback(
    () => (
      <div className={`${getWrapperClasses()} ${className || ''}`}>
        <table className={getTableClasses()} role='grid' aria-label='Empty table' aria-rowcount={1}>
          {!hideHeader && (
            <thead className={getHeaderClasses()}>
              <tr role='row'>
                {(selectionMode !== 'none' || showSelectionCheckboxes) && (
                  <th
                    className={getHeaderCellClasses({} as TableColumn<T>, -1)}
                    role='columnheader'
                    aria-label='Selection'
                  >
                    <input
                      type='checkbox'
                      disabled={true}
                      aria-label='Select all rows'
                      className='opacity-50 cursor-not-allowed'
                    />
                  </th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={String(column.key)}
                    className={getHeaderCellClasses(column, index)}
                    role='columnheader'
                    aria-label={String(column.header)}
                    aria-sort={
                      tableState.sortDescriptor?.column === column.key
                        ? tableState.sortDescriptor.direction === 'ascending'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <div className='flex items-center justify-between'>
                      <span>{column.header}</span>
                      {(column.allowsSorting || column.sortable) && renderSortIcon(column)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className={classNames.tbody}>
            <tr role='row'>
              <td
                colSpan={columns.length + (selectionMode !== 'none' || showSelectionCheckboxes ? 1 : 0)}
                className='px-4 py-8 text-center text-[#636579]'
                role='gridcell'
              >
                {emptyContent || 'No hay datos para mostrar.'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    [
      getWrapperClasses,
      className,
      getTableClasses,
      hideHeader,
      getHeaderClasses,
      selectionMode,
      showSelectionCheckboxes,
      getHeaderCellClasses,
      columns,
      tableState.sortDescriptor,
      renderSortIcon,
      classNames.tbody,
      emptyContent
    ]
  );

  // Loading state
  if (tableState.isLoading) {
    return renderLoadingState();
  }

  // Empty state
  if (!tableState.filteredData || tableState.filteredData.length === 0) {
    return renderEmptyState();
  }

  // Main table render
  const tableContent = (
    <div className={`${getBaseClasses()} ${className || ''}`}>
      {topContent && topContentPlacement === 'outside' && <div className='mb-4'>{topContent}</div>}

      <div className={getWrapperClasses()}>
        {topContent && topContentPlacement === 'inside' && (
          <div className='p-4 border-b border-[#636579]'>{topContent}</div>
        )}

        <div
          ref={containerRef}
          className={isVirtualized ? 'overflow-auto' : ''}
          style={isVirtualized ? { maxHeight: `${containerHeight}px` } : undefined}
          onScroll={isVirtualized ? handleScroll : undefined}
        >
          <table
            ref={tableRef}
            className={getTableClasses()}
            role='grid'
            aria-label='Data table'
            aria-rowcount={tableState.filteredData.length + (hideHeader ? 0 : 1)}
            aria-colcount={columns.length + (selectionMode !== 'none' || showSelectionCheckboxes ? 1 : 0)}
            onKeyDown={handleKeyDown}
            tabIndex={isKeyboardNavigationDisabled ? -1 : 0}
            id={tableId.current}
          >
            {!hideHeader && (
              <thead className={getHeaderClasses()}>
                <tr role='row' aria-rowindex={1}>
                  {(selectionMode !== 'none' || showSelectionCheckboxes) && (
                    <th
                      className={getHeaderCellClasses({} as TableColumn<T>, -1)}
                      role='columnheader'
                      aria-label='Selection'
                      aria-colindex={1}
                    >
                      <input
                        type='checkbox'
                        checked={
                          tableState.selectedRows.length === tableState.filteredData.length &&
                          tableState.filteredData.length > 0
                        }
                        onChange={tableState.toggleAllRowsSelection}
                        aria-label='Select all rows'
                        disabled={disallowEmptySelection && tableState.selectedRows.length === 1}
                      />
                    </th>
                  )}
                  {columns.map((column, index) => (
                    <th
                      key={String(column.key)}
                      className={getHeaderCellClasses(column, index)}
                      role='columnheader'
                      aria-label={String(column.header)}
                      aria-colindex={index + (selectionMode !== 'none' || showSelectionCheckboxes ? 2 : 1)}
                      aria-sort={
                        tableState.sortDescriptor?.column === column.key
                          ? tableState.sortDescriptor.direction === 'ascending'
                            ? 'ascending'
                            : 'descending'
                          : column.allowsSorting || column.sortable
                            ? 'none'
                            : undefined
                      }
                      tabIndex={column.allowsSorting || column.sortable ? 0 : -1}
                      onClick={() => {
                        if (column.allowsSorting || column.sortable) {
                          tableState.handleSort(column.key);
                        }
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && (column.allowsSorting || column.sortable)) {
                          e.preventDefault();
                          tableState.handleSort(column.key);
                        }
                      }}
                    >
                      <div className='flex items-center justify-between'>
                        <span>{column.header}</span>
                        {(column.allowsSorting || column.sortable) && renderSortIcon(column)}
                        {column.filterable && (
                          <input
                            type='text'
                            placeholder='Filtrar...'
                            value={tableState.filterValues[String(column.key)] || ''}
                            onChange={(e) => tableState.setFilter(String(column.key), e.target.value)}
                            className='ml-2 p-1 border rounded-md text-sm bg-[#2a2a2a] border-[#636579] text-white placeholder-[#636579] focus:ring-[#d61e2b] focus:border-[#d61e2b] w-20'
                            aria-label={`Filter by ${column.header}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody
              className={classNames.tbody}
              style={
                isVirtualized
                  ? {
                      height: `${totalHeight}px`,
                      position: 'relative'
                    }
                  : undefined
              }
            >
              {isVirtualized && (
                <tr
                  style={{
                    height: `${offsetY}px`,
                    pointerEvents: 'none',
                    border: 'none'
                  }}
                />
              )}
              {(isVirtualized
                ? virtualItems
                : tableState.filteredData.map((item: T, index: number) => ({ item, index }))
              ).map(({ item: row, index: rowIndex }) => {
                const actualRowIndex = rowIndex;
                const rowKeyValue = tableState.getRowKey(row, actualRowIndex);
                const isSelected =
                  tableState.selectedKeys === 'all' ||
                  (typeof tableState.selectedKeys !== 'string' && tableState.selectedKeys.has(String(rowKeyValue)));

                const isDisabled =
                  disabledKeys &&
                  (disabledKeys === 'all' || (typeof disabledKeys !== 'string' && disabledKeys.has(rowKeyValue)));

                return (
                  <tr
                    key={rowKeyValue}
                    role='row'
                    aria-rowindex={actualRowIndex + (hideHeader ? 1 : 2)}
                    aria-selected={selectionMode !== 'none' ? isSelected : undefined}
                    data-selected={isSelected}
                    data-disabled={isDisabled}
                    data-first={actualRowIndex === 0}
                    data-last={actualRowIndex === tableState.filteredData.length - 1}
                    data-odd={actualRowIndex % 2 === 1}
                    className={`
                    border-b border-[#636579] hover:bg-[#2a2a2a] transition-colors
                    ${isSelected ? 'bg-[#830213]/20' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${classNames.tr || ''}
                  `}
                    style={
                      isVirtualized
                        ? {
                            position: 'absolute',
                            top: `${actualRowIndex * defaultRowHeight + offsetY}px`,
                            left: 0,
                            right: 0,
                            height: `${defaultRowHeight}px`,
                            width: '100%'
                          }
                        : undefined
                    }
                    onClick={() => !isDisabled && handleRowClick(actualRowIndex, row)}
                    onKeyDown={(e) => {
                      if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleRowClick(actualRowIndex, row);
                      }
                    }}
                    tabIndex={isDisabled ? -1 : 0}
                  >
                    {(selectionMode !== 'none' || showSelectionCheckboxes) && (
                      <td
                        className={getCellClasses(actualRowIndex, -1)}
                        role='gridcell'
                        aria-colindex={1}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                          name={selectionMode === 'single' ? `table-${tableId.current}-selection` : undefined}
                          checked={isSelected}
                          onChange={() => {
                            if (!isDisabled) {
                              tableState.toggleRowSelection(row);
                            }
                          }}
                          aria-label={`Select row ${actualRowIndex + 1}`}
                          disabled={
                            isDisabled || (disallowEmptySelection && isSelected && tableState.selectedRows.length === 1)
                          }
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={String(column.key)}
                        className={getCellClasses(actualRowIndex, colIndex)}
                        role={column.isRowHeader ? 'rowheader' : 'gridcell'}
                        aria-colindex={colIndex + (selectionMode !== 'none' || showSelectionCheckboxes ? 2 : 1)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(actualRowIndex, colIndex, row);
                        }}
                      >
                        {column.cell ? column.cell(row) : String((row as any)[String(column.key)] || '')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {bottomContent && bottomContentPlacement === 'inside' && (
          <div className='p-4 border-t border-[#636579]'>{bottomContent}</div>
        )}
      </div>

      {bottomContent && bottomContentPlacement === 'outside' && <div className='mt-4'>{bottomContent}</div>}

      {pagination && (
        <div className='flex justify-between items-center py-4 px-4 border-t border-[#636579] bg-[#1a1a1a]'>
          <button
            onClick={() => tableState.handlePageChange(tableState.currentPage - 1)}
            disabled={tableState.currentPage === 1}
            className='px-3 py-1 border rounded-md bg-[#830213] border-[#636579] text-white hover:bg-[#b41520] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            aria-label='Go to previous page'
          >
            Anterior
          </button>
          <span aria-live='polite' className='text-white'>
            Página {tableState.currentPage} de {tableState.totalPages}
          </span>
          <button
            onClick={() => tableState.handlePageChange(tableState.currentPage + 1)}
            disabled={tableState.currentPage === tableState.totalPages}
            className='px-3 py-1 border rounded-md bg-[#830213] border-[#636579] text-white hover:bg-[#b41520] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            aria-label='Go to next page'
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );

  return tableContent;
}

export default Table;
