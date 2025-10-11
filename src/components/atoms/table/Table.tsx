import { useCallback, useRef } from 'react';
import type { CompleteTableProps, TableColumn } from './types';
import { useKeyboardNavigation, useTable, useTableClasses, useTableEvents } from './useTable';

function Table<T = any>(props: CompleteTableProps<T>) {
  const {
    items = [],
    columns = [],
    variant = 'default',
    size = 'md',
    hideHeader = false,
    className,
    selectionMode = 'none',
    selectedKeys = new Set(),
    disabledKeys = new Set(),
    disallowEmptySelection = false,

    loading = false,
    emptyContent = 'No data available',
    onRowClick,
    data = [],
    pagination = false,
    pageSize = 10,
    totalRows = 0,
    onPageChange,
    rowSelection,
    selectedRows = [],
    onSelectRows,
    fullWidth = true,
    removeWrapper = false,
    shadow = 'sm',
    classNames = {},
    isKeyboardNavigationDisabled = false,
    onRowAction,
    onCellAction,
    defaultSelectedKeys,
    onSelectionChange,
    sortDescriptor,
    onSortChange,
    layout = 'auto',
    isStriped = false,
    isCompact = false,
    isHeaderSticky = false,
    showSelectionCheckboxes = false
  } = props;

  const tableRef = useRef<HTMLTableElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tableId = useRef(`table-${Math.random().toString(36).substr(2, 9)}`);

  const tableState = useTable({
    data: Array.from(items?.length > 0 ? items : data || []),
    items: items?.length > 0 ? items : data || [],
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

  const { focusedCell, setFocusedCell, handleKeyDown } = useKeyboardNavigation(
    tableState.filteredData.length,
    columns.length,
    isKeyboardNavigationDisabled
  );

  const { handleCellClick, handleRowClick } = useTableEvents(
    tableState.getRowKey,
    setFocusedCell,
    onRowAction,
    onCellAction,
    onRowClick
  );

  const { getBaseClasses, getWrapperClasses, getTableClasses, getHeaderClasses, getHeaderCellClasses, getCellClasses } =
    useTableClasses({
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
    });

  const renderSortIcon = useCallback(
    (column: TableColumn<T>) => {
      if (column.sortIcon) {
        return column.sortIcon;
      }

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

  const renderLoadingState = useCallback(
    () => (
      <div className={`${getWrapperClasses()} ${className || ''}`}>
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          Cargando datos de la tabla...
        </div>
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
                    <div className='w-4 h-4 bg-gray-light-300 dark:bg-gray-dark-600 rounded animate-pulse'></div>
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
                    <div className='w-4 h-4 bg-gray-light-300 dark:bg-gray-dark-600 rounded animate-pulse'></div>
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={String(column.key)} className={getCellClasses(rowIndex, colIndex)} role='gridcell'>
                    <div className='h-4 bg-gray-light-300 dark:bg-gray-dark-600 rounded animate-pulse'></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-center items-center py-4'>
          <div className='animate-spin h-5 w-5 border-2 border-secondary border-t-transparent rounded-full mr-3'></div>
          <span className='text-text-light dark:text-text-dark'>Cargando datos...</span>
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
                    {selectionMode === 'multiple' ? (
                      <input
                        type='checkbox'
                        disabled={true}
                        aria-label='Select all rows'
                        className='opacity-50 cursor-not-allowed'
                      />
                    ) : (
                      <span aria-hidden='true'></span>
                    )}
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
                      {column.filterable && (
                        <>
                          <div id={`filter-help-${column.key}`} className='sr-only'>
                            Ingrese texto para filtrar la columna {column.header}
                          </div>
                          <input
                            type='text'
                            placeholder='Filtrar...'
                            value={tableState.filterValues[String(column.key)] || ''}
                            onChange={(e) => tableState.setFilter(String(column.key), e.target.value)}
                            className='ml-2 p-1 border rounded-md text-sm bg-white dark:bg-gray-dark-800 border-gray-light-300 dark:border-gray-dark-600 text-text-light dark:text-text-dark placeholder-gray-light-400 dark:placeholder-gray-dark-400 focus:ring-primary focus:border-primary w-20'
                            aria-label={`Filter by ${column.header}`}
                            aria-describedby={`filter-help-${column.key}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </>
                      )}
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
                className='px-4 py-8 text-center text-gray-light-400 dark:text-gray-dark-300'
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

  if (tableState.isLoading) {
    return renderLoadingState();
  }

  // Check if there are original data items but they're all filtered out
  const actualDataSource = items?.length > 0 ? items : data || [];
  const hasOriginalData = actualDataSource && actualDataSource.length > 0;
  const hasActiveFilters = Object.values(tableState.filterValues).some((value) => value && value.trim() !== '');
  const hasFilteredResults = tableState.filteredData && tableState.filteredData.length > 0;

  // Only show empty state if there's truly no data OR no filtered results AND no active filters
  if (!hasOriginalData) {
    return renderEmptyState();
  }

  const tableContent = (
    <div className={`${getBaseClasses()} ${className || ''}`}>
      <div className={getWrapperClasses()}>
        <div ref={containerRef}>
          <div id={`${tableId.current}-description`} className='sr-only'>
            Tabla con {tableState.filteredData.length} filas de datos
            {selectionMode !== 'none' || showSelectionCheckboxes ? ' con selección habilitada' : ''}
            {tableState.sortDescriptor && ' ordenada por ' + tableState.sortDescriptor.column}
          </div>
          <table
            ref={tableRef}
            className={getTableClasses()}
            role='grid'
            aria-label='Data table'
            aria-describedby={`${tableId.current}-description`}
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
                      {selectionMode === 'multiple' ? (
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
                      ) : (
                        // En single mode, mostramos texto visible para accesibilidad
                        <span className='sr-only'>Select</span>
                      )}
                    </th>
                  )}
                  {columns.map((column, index) => (
                    <th
                      key={String(column.key)}
                      className={getHeaderCellClasses(column, index)}
                      role='columnheader'
                      scope='col'
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
                      aria-expanded={
                        column.allowsSorting || column.sortable
                          ? tableState.sortDescriptor?.column === column.key
                            ? 'true'
                            : 'false'
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
                          <>
                            <div id={`filter-help-${column.key}`} className='sr-only'>
                              Ingrese texto para filtrar la columna {column.header}
                            </div>
                            <input
                              type='text'
                              placeholder='Filtrar...'
                              value={tableState.filterValues[String(column.key)] || ''}
                              onChange={(e) => tableState.setFilter(String(column.key), e.target.value)}
                              className='ml-2 p-1 border rounded-md text-sm bg-white dark:bg-gray-dark-800 border-gray-light-300 dark:border-gray-dark-600 text-text-light dark:text-text-dark placeholder-gray-light-400 dark:placeholder-gray-dark-400 focus:ring-primary focus:border-primary w-20'
                              aria-label={`Filter by ${column.header}`}
                              aria-describedby={`filter-help-${column.key}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody className={classNames.tbody}>
              {/* Show "no results" message when filtering returns empty results */}
              {hasActiveFilters && !hasFilteredResults ? (
                <tr role='row'>
                  <td
                    colSpan={columns.length + (selectionMode !== 'none' || showSelectionCheckboxes ? 1 : 0)}
                    className='px-4 py-8 text-center text-gray-dark-300'
                    role='gridcell'
                  >
                    No se encontraron resultados para los filtros aplicados. Intente modificar los criterios de
                    búsqueda.
                  </td>
                </tr>
              ) : hasFilteredResults ? (
                tableState.filteredData.map((row: T, rowIndex: number) => {
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
                            type='checkbox'
                            checked={isSelected}
                            onChange={() => {
                              if (!isDisabled) {
                                tableState.toggleRowSelection(row);
                              }
                            }}
                            aria-label={`${selectionMode === 'single' ? 'Select row' : 'Select row'} ${actualRowIndex + 1}`}
                            disabled={
                              isDisabled ||
                              (disallowEmptySelection && isSelected && tableState.selectedRows.length === 1)
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
                })
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <div className='flex justify-between items-center py-4 px-4 border-t border-gray-light-300 dark:border-gray-dark-600 bg-gray-light-50 dark:bg-gray-dark-900'>
          <button
            onClick={() => tableState.handlePageChange(tableState.currentPage - 1)}
            disabled={tableState.currentPage === 1}
            className='px-3 py-1 border rounded-md bg-secondary border-gray-light-300 dark:border-gray-dark-600 text-white hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            aria-label='Go to previous page'
          >
            Anterior
          </button>
          <span aria-live='polite' className='text-text-light dark:text-text-dark'>
            Página {tableState.currentPage} de {tableState.totalPages}
          </span>
          <button
            onClick={() => tableState.handlePageChange(tableState.currentPage + 1)}
            disabled={tableState.currentPage === tableState.totalPages}
            className='px-3 py-1 border rounded-md bg-secondary border-gray-light-300 dark:border-gray-dark-600 text-white hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
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
