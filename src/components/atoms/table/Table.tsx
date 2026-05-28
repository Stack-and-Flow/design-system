import { useCallback, useId, useMemo } from 'react';
import type { CompleteTableProps, TableColumn, TableRowData } from './types';
import { isInteractiveEventTarget, useKeyboardNavigation, useTable, useTableClasses, useTableEvents } from './useTable';

const getColumnHeaderLabel = <T extends TableRowData>(column: TableColumn<T>) => {
  if (typeof column.header === 'string' && column.header.trim().length > 0) {
    return column.header;
  }

  return String(column.textValue ?? column.key);
};

const getSelectionLabel = <T extends TableRowData>({
  getRowLabel,
  row,
  rowIndex,
  rowKeyValue
}: {
  getRowLabel?: (row: T) => string;
  row: T;
  rowIndex: number;
  rowKeyValue: string;
}) => {
  const fallbackName = typeof row.name === 'string' ? row.name : undefined;
  return getRowLabel?.(row) ?? fallbackName ?? `row ${rowIndex + 1} (${rowKeyValue})`;
};

const sortDirections = {
  ascending: 'ascending',
  descending: 'descending'
} as const;

const formatCellValue = (value: unknown) => {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
};

export const Table = <T extends TableRowData>(props: CompleteTableProps<T>) => {
  const {
    items = [],
    columns = [],
    variant = 'default',
    size = 'md',
    hideHeader = false,
    className,
    selectionMode = 'none',
    selectedKeys,
    disabledKeys,
    disallowEmptySelection = false,
    loading = false,
    emptyContent = 'No data available',
    onRowClick,
    data = [],
    pagination = false,
    pageSize = 10,
    totalRows,
    onPageChange,
    rowSelection,
    selectedRows,
    onSelectRows,
    fullWidth = true,
    removeWrapper = false,
    shadow = 'sm',
    radius = 'md',
    classNames = {},
    isKeyboardNavigationDisabled = false,
    onRowAction,
    onCellAction,
    defaultSelectedKeys,
    onSelectionChange,
    sortDescriptor,
    onSortChange,
    onFilterChange,
    layout = 'auto',
    isStriped = false,
    isCompact = false,
    isHeaderSticky = false,
    showSelectionCheckboxes = false,
    rowKey,
    getRowLabel,
    ariaLabel,
    ariaLabelledBy,
    'aria-label': nativeAriaLabel,
    'aria-labelledby': nativeAriaLabelledBy,
    ...restTableProps
  } = props;

  const tableId = useId().replace(/:/g, '');
  const tableLabel = ariaLabel?.trim() || nativeAriaLabel?.trim() || 'Data table';
  const tableLabelledBy = ariaLabelledBy?.trim() || nativeAriaLabelledBy?.trim() || undefined;
  const dataSource = items.length > 0 ? items : data;
  const effectiveSelectionMode = selectionMode !== 'none' ? selectionMode : rowSelection || 'none';
  const selectionEnabled = effectiveSelectionMode !== 'none' || showSelectionCheckboxes;
  const resolvedSelectionMode = rowSelection ?? (effectiveSelectionMode === 'none' ? false : effectiveSelectionMode);

  const tableState = useTable({
    columns,
    data,
    defaultSelectedKeys,
    disabledKeys,
    disallowEmptySelection,
    items,
    onFilterChange,
    onPageChange,
    onSelectRows,
    onSelectionChange,
    onSortChange,
    pageSize,
    pagination,
    propLoading: loading,
    rowKey,
    rowSelection: resolvedSelectionMode,
    selectedKeys,
    selectedRows,
    selectionMode: effectiveSelectionMode,
    sortDescriptor,
    totalRows
  });

  const { focusedCell, handleKeyDown } = useKeyboardNavigation(
    tableState.filteredData.length,
    columns.length,
    isKeyboardNavigationDisabled
  );

  const { handleCellClick, handleRowClick } = useTableEvents(
    tableState.getRowKey,
    onRowAction,
    onCellAction,
    onRowClick
  );

  const {
    getBaseClasses,
    getCellClasses,
    getHeaderCellClasses,
    getHeaderClasses,
    getRowClasses,
    getTableClasses,
    getWrapperClasses
  } = useTableClasses({
    classNames,
    focusedCell,
    fullWidth,
    isCompact,
    isHeaderSticky,
    isStriped,
    layout,
    removeWrapper,
    shadow,
    size,
    radius,
    variant
  });

  const selectedKeySet = useMemo(
    () => new Set(Array.from(tableState.selectedKeys, (key) => String(key))),
    [tableState.selectedKeys]
  );
  const disabledKeySet = useMemo(
    () => new Set(Array.from(disabledKeys instanceof Set ? disabledKeys : [], (key) => String(key))),
    [disabledKeys]
  );
  const hasActiveFilters = Object.values(tableState.filterValues).some((value) => value.trim().length > 0);
  const hasFilteredResults = tableState.allFilteredData.length > 0;
  const representedDataRowCount = totalRows ?? tableState.allFilteredData.length;
  const allVisibleSelectableKeys = useMemo(
    () =>
      tableState.filteredData
        .map((row, index) => String(tableState.getRowKey(row, tableState.getRowIndex(row, index))))
        .filter((key) => !disabledKeySet.has(key)),
    [disabledKeySet, tableState.filteredData, tableState.getRowIndex, tableState.getRowKey]
  );

  const areAllVisibleRowsSelected =
    allVisibleSelectableKeys.length > 0 && allVisibleSelectableKeys.every((key) => selectedKeySet.has(key));
  const activeDescendantId =
    focusedCell && tableState.filteredData[focusedCell.row] && columns[focusedCell.col]
      ? `${tableId}-cell-${focusedCell.row}-${focusedCell.col}`
      : undefined;

  const renderSortIcon = useCallback(
    (column: TableColumn<T>) => {
      if (column.sortIcon) {
        return column.sortIcon;
      }

      const direction = tableState.sortDescriptor?.column === column.key ? tableState.sortDescriptor.direction : null;

      return (
        <span className={`inline-flex shrink-0 ${classNames.sortIcon ?? ''}`} aria-hidden='true'>
          {direction === sortDirections.ascending ? (
            <svg className='size-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                clipRule='evenodd'
                d='M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 1 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0Z'
                fillRule='evenodd'
              />
            </svg>
          ) : direction === sortDirections.descending ? (
            <svg className='size-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                clipRule='evenodd'
                d='M14.707 10.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L9 12.586V5a1 1 0 1 1 2 0v7.586l2.293-2.293a1 1 0 0 1 1.414 0Z'
                fillRule='evenodd'
              />
            </svg>
          ) : (
            <svg className='size-4 opacity-50' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M5 10 8 7l4 3v1l-4 3-3-3v-1Z' />
            </svg>
          )}
        </span>
      );
    },
    [classNames.sortIcon, tableState.sortDescriptor]
  );

  const renderColumnHeader = useCallback(
    (column: TableColumn<T>) => {
      const columnLabel = getColumnHeaderLabel(column);
      const isSortable = Boolean(column.allowsSorting || column.sortable);
      const headerContent =
        column.header === undefined ||
        column.header === null ||
        (typeof column.header === 'string' && column.header.trim().length === 0)
          ? columnLabel
          : column.header;

      return (
        <div className='flex items-center gap-2'>
          {isSortable ? (
            <button
              type='button'
              className='inline-flex min-h-11 items-center gap-2 text-left text-inherit focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'
              aria-label={columnLabel}
              onClick={() => tableState.handleSort(column.key)}
            >
              <span>{headerContent}</span>
              {renderSortIcon(column)}
            </button>
          ) : (
            <span>{headerContent}</span>
          )}
          {column.filterable && (
            <input
              type='text'
              placeholder='Filter...'
              value={tableState.filterValues[String(column.key)] ?? ''}
              onChange={(event) => tableState.setFilter(String(column.key), event.target.value)}
              onClick={(event) => event.stopPropagation()}
              className='min-h-11 w-24 rounded-md border border-border-light bg-background-light px-2 py-1 text-sm text-text-light placeholder:text-text-tertiary-light focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:border-border-dark dark:bg-surface-raised-dark dark:text-text-dark dark:placeholder:text-text-tertiary-dark dark:focus-visible:shadow-glow-focus-dark'
              aria-label={`Filter by ${columnLabel}`}
            />
          )}
        </div>
      );
    },
    [renderSortIcon, tableState]
  );

  const renderTableHead = useCallback(
    () => (
      <thead className={getHeaderClasses()}>
        <tr role='row' aria-rowindex={1}>
          {selectionEnabled && (
            <th className={getHeaderCellClasses(undefined, -1)} role='columnheader' aria-colindex={1} scope='col'>
              {effectiveSelectionMode === 'multiple' ? (
                <input
                  type='checkbox'
                  checked={areAllVisibleRowsSelected}
                  onChange={tableState.toggleAllRowsSelection}
                  aria-label='Select all rows'
                />
              ) : (
                <span className='sr-only'>Selection</span>
              )}
            </th>
          )}
          {columns.map((column, index) => {
            const isSortable = Boolean(column.allowsSorting || column.sortable);
            const columnLabel = getColumnHeaderLabel(column);

            return (
              <th
                key={String(column.key)}
                className={getHeaderCellClasses(column, index)}
                role='columnheader'
                scope='col'
                aria-colindex={index + (selectionEnabled ? 2 : 1)}
                aria-label={columnLabel}
                aria-sort={
                  tableState.sortDescriptor?.column === column.key
                    ? tableState.sortDescriptor.direction
                    : isSortable
                      ? 'none'
                      : undefined
                }
              >
                {renderColumnHeader(column)}
              </th>
            );
          })}
        </tr>
      </thead>
    ),
    [
      areAllVisibleRowsSelected,
      columns,
      disallowEmptySelection,
      getHeaderCellClasses,
      getHeaderClasses,
      renderColumnHeader,
      selectionEnabled,
      effectiveSelectionMode,
      tableState
    ]
  );

  const renderLoadingState = () => {
    const bodyRowIndexOffset = hideHeader ? 1 : 2;

    return (
      <div className={`${getBaseClasses()} ${className ?? ''}`}>
        <div className={getWrapperClasses()}>
          <div aria-atomic='true' aria-live='polite' className='sr-only'>
            Loading table data
          </div>
          <table
            {...restTableProps}
            className={getTableClasses()}
            role='grid'
            aria-busy='true'
            aria-labelledby={tableLabelledBy}
            aria-label={tableLabelledBy ? undefined : tableLabel}
          >
            {!hideHeader && renderTableHead()}
            <tbody className={classNames.tbody}>
              {Array.from({ length: pageSize }).map((_, rowIndex) => (
                <tr key={`loading-row-${rowIndex}`} role='row' aria-rowindex={rowIndex + bodyRowIndexOffset}>
                  {selectionEnabled && (
                    <td className={getCellClasses({ columnIndex: -1, rowIndex, align: 'center' })} role='gridcell'>
                      <div className='size-4 rounded bg-border-strong-light dark:bg-border-strong-dark' />
                    </td>
                  )}
                  {columns.map((column, columnIndex) => (
                    <td
                      key={`loading-cell-${String(column.key)}`}
                      className={getCellClasses({ align: column.align, columnIndex, rowIndex })}
                      role='gridcell'
                    >
                      <div className='h-4 rounded bg-border-strong-light dark:bg-border-strong-dark' />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex items-center justify-center gap-3 px-4 py-4 text-text-secondary-light dark:text-text-secondary-dark'>
            <div className='size-5 animate-spin rounded-full border-2 border-border-light border-t-brand-light dark:border-border-dark dark:border-t-brand-dark' />
            <span>Loading data...</span>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className={`${getBaseClasses()} ${className ?? ''}`}>
      <div className={getWrapperClasses()}>
        <table
          {...restTableProps}
          className={getTableClasses()}
          role='grid'
          aria-labelledby={tableLabelledBy}
          aria-label={tableLabelledBy ? undefined : tableLabel}
        >
          {!hideHeader && renderTableHead()}
          <tbody className={classNames.tbody}>
            <tr role='row'>
              <td
                colSpan={columns.length + (selectionEnabled ? 1 : 0)}
                className='px-4 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark'
                role='gridcell'
              >
                {emptyContent}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  if (tableState.isLoading) {
    return renderLoadingState();
  }

  if (dataSource.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className={`${getBaseClasses()} ${className ?? ''}`}>
      <div className={getWrapperClasses()}>
        <div id={`${tableId}-description`} className='sr-only'>
          Table with {representedDataRowCount} data rows
          {selectionEnabled ? ' and row selection enabled' : ''}
          {tableState.sortDescriptor ? `, sorted by ${String(tableState.sortDescriptor.column)}` : ''}
        </div>
        <table
          {...restTableProps}
          className={getTableClasses()}
          role='grid'
          id={tableId}
          aria-describedby={`${tableId}-description`}
          aria-labelledby={tableLabelledBy}
          aria-label={tableLabelledBy ? undefined : tableLabel}
          aria-rowcount={representedDataRowCount + (hideHeader ? 0 : 1)}
          aria-colcount={columns.length + (selectionEnabled ? 1 : 0)}
          aria-activedescendant={activeDescendantId}
          onKeyDown={handleKeyDown}
          tabIndex={isKeyboardNavigationDisabled ? -1 : 0}
        >
          {!hideHeader && renderTableHead()}
          <tbody className={classNames.tbody}>
            {hasActiveFilters && !hasFilteredResults ? (
              <tr role='row'>
                <td
                  colSpan={columns.length + (selectionEnabled ? 1 : 0)}
                  className='px-4 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark'
                  role='gridcell'
                >
                  No results found for the applied filters. Try modifying the search criteria.
                </td>
              </tr>
            ) : (
              tableState.filteredData.map((row, rowIndex) => {
                const rowDataIndex = tableState.getRowIndex(row, rowIndex);
                const rowKeyValue = String(tableState.getRowKey(row, rowDataIndex));
                const isSelected = selectedKeySet.has(rowKeyValue);
                const isDisabled = disabledKeySet.has(rowKeyValue);
                const rowLabel = getSelectionLabel({ getRowLabel, row, rowIndex, rowKeyValue });
                const rowIsInteractive = !isDisabled && Boolean(onRowClick || onRowAction);

                return (
                  <tr
                    key={rowKeyValue}
                    role='row'
                    aria-rowindex={rowIndex + (hideHeader ? 1 : 2)}
                    aria-selected={selectionEnabled ? isSelected : undefined}
                    aria-disabled={isDisabled || undefined}
                    data-disabled={isDisabled || undefined}
                    data-selected={isSelected || undefined}
                    className={getRowClasses({ isDisabled, isInteractive: rowIsInteractive, isSelected })}
                    onClick={() => {
                      if (rowIsInteractive) {
                        handleRowClick(rowIndex, row, rowDataIndex);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (
                        rowIsInteractive &&
                        (event.key === 'Enter' || event.key === ' ') &&
                        !isInteractiveEventTarget(event.target)
                      ) {
                        event.preventDefault();
                        handleRowClick(rowIndex, row, rowDataIndex);
                      }
                    }}
                    tabIndex={rowIsInteractive ? 0 : undefined}
                  >
                    {selectionEnabled && (
                      <td
                        className={getCellClasses({ align: 'center', columnIndex: -1, rowIndex })}
                        role='gridcell'
                        aria-colindex={1}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          type={effectiveSelectionMode === 'single' ? 'radio' : 'checkbox'}
                          name={effectiveSelectionMode === 'single' ? `${tableId}-selection` : undefined}
                          checked={isSelected}
                          onChange={() => tableState.toggleRowSelection(row)}
                          aria-label={`${effectiveSelectionMode === 'single' ? 'Select' : 'Toggle selection for'} ${rowLabel}`}
                          disabled={
                            isDisabled || (disallowEmptySelection && isSelected && tableState.selectedRows.length === 1)
                          }
                        />
                      </td>
                    )}
                    {columns.map((column, columnIndex) => {
                      const cellContent = column.cell
                        ? column.cell(row)
                        : formatCellValue(tableState.getColumnValue(row, column));

                      return (
                        <td
                          key={String(column.key)}
                          id={`${tableId}-cell-${rowIndex}-${columnIndex}`}
                          className={getCellClasses({ align: column.align, columnIndex, rowIndex })}
                          role={column.isRowHeader ? 'rowheader' : 'gridcell'}
                          aria-colindex={columnIndex + (selectionEnabled ? 2 : 1)}
                          onClick={() => handleCellClick(rowIndex, columnIndex, row, rowDataIndex)}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className='flex items-center justify-between border-t border-border-light bg-surface-raised-light px-4 py-4 dark:border-border-dark dark:bg-surface-raised-dark'>
          <button
            type='button'
            onClick={() => tableState.handlePageChange(tableState.currentPage - 1)}
            disabled={tableState.currentPage === 1}
            className='inline-flex min-h-11 items-center rounded-md border border-red-tint-border bg-red-tint-subtle px-3 py-2 text-brand-light-darkest transition-[background-color,border-color,box-shadow,color] duration-200 ease-out hover:bg-red-tint-active hover:border-brand-light focus-visible:outline-none focus-visible:shadow-glow-focus-light disabled:cursor-not-allowed disabled:opacity-40 dark:text-text-dark dark:hover:border-brand-dark-light dark:focus-visible:shadow-glow-focus-dark'
            aria-label='Go to previous page'
          >
            Previous
          </button>
          <span aria-live='polite' className='text-text-secondary-light dark:text-text-secondary-dark'>
            Page {tableState.currentPage} of {tableState.totalPages}
          </span>
          <button
            type='button'
            onClick={() => tableState.handlePageChange(tableState.currentPage + 1)}
            disabled={tableState.currentPage === tableState.totalPages}
            className='inline-flex min-h-11 items-center rounded-md border border-red-tint-border bg-red-tint-subtle px-3 py-2 text-brand-light-darkest transition-[background-color,border-color,box-shadow,color] duration-200 ease-out hover:bg-red-tint-active hover:border-brand-light focus-visible:outline-none focus-visible:shadow-glow-focus-light disabled:cursor-not-allowed disabled:opacity-40 dark:text-text-dark dark:hover:border-brand-dark-light dark:focus-visible:shadow-glow-focus-dark'
            aria-label='Go to next page'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
