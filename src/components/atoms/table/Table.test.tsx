import { act, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './Table';
import type { Selection, SortDescriptor, TableColumn } from './types';
import { useTable } from './useTable';

type TestRow = {
  id: number;
  name: string;
  email: string;
  status: string;
};

const rows: TestRow[] = [
  { id: 3, name: 'Carla', email: 'carla@example.com', status: 'Pending' },
  { id: 1, name: 'Alice', email: 'alice@example.com', status: 'Active' },
  { id: 2, name: 'Bruno', email: 'bruno@example.com', status: 'Inactive' }
];

const columns: TableColumn<TestRow>[] = [
  {
    key: 'name',
    header: 'Name',
    allowsSorting: true,
    filterable: true,
    cell: (row) => row.name
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => row.status,
    sortValue: (row) => row.status
  }
];

describe('useTable — logic', () => {
  it('filters and sorts rows on the client without mutating input data', () => {
    const { result } = renderHook(() =>
      useTable({
        columns,
        items: rows,
        pageSize: 10
      })
    );

    act(() => {
      result.current.setFilter('name', 'br');
    });

    expect(result.current.allFilteredData.map((row) => row.name)).toEqual(['Bruno']);
    expect(rows.map((row) => row.name)).toEqual(['Carla', 'Alice', 'Bruno']);

    act(() => {
      result.current.setFilter('name', '');
      result.current.handleSort('name');
    });

    expect(result.current.filteredData.map((row) => row.name)).toEqual(['Alice', 'Bruno', 'Carla']);

    act(() => {
      result.current.handleSort('name');
    });

    expect(result.current.filteredData.map((row) => row.name)).toEqual(['Carla', 'Bruno', 'Alice']);

    act(() => {
      result.current.handleSort('name');
    });

    expect(result.current.sortDescriptor).toBeNull();
    expect(result.current.filteredData.map((row) => row.name)).toEqual(['Carla', 'Alice', 'Bruno']);
  });

  it('uses rowKey and defaultSelectedKeys for uncontrolled selection', () => {
    const { result } = renderHook(() =>
      useTable({
        columns,
        defaultSelectedKeys: new Set(['bruno@example.com']),
        items: rows,
        rowKey: (row) => row.email,
        selectionMode: 'multiple'
      })
    );

    expect(result.current.selectedRows.map((row) => row.email)).toEqual(['bruno@example.com']);

    act(() => {
      result.current.toggleRowSelection(rows[0]);
    });

    expect(Array.from(result.current.selectedKeys)).toEqual(['bruno@example.com', 'carla@example.com']);
  });

  it('excludes disabled rows when controlled selection uses the all sentinel', () => {
    const { result } = renderHook(() =>
      useTable({
        columns,
        disabledKeys: new Set(['bruno@example.com']),
        items: rows,
        rowKey: (row) => row.email,
        selectedKeys: 'all',
        selectionMode: 'multiple'
      })
    );

    expect(Array.from(result.current.selectedKeys)).toEqual(['carla@example.com', 'alice@example.com']);
    expect(result.current.selectedRows.map((row) => row.email)).toEqual(['carla@example.com', 'alice@example.com']);
  });

  it('emits sort callbacks consistently, including clearing the sort', () => {
    const handleSortChange = vi.fn<(descriptor: SortDescriptor | null) => void>();
    const { result } = renderHook(() =>
      useTable({
        columns,
        items: rows,
        onSortChange: handleSortChange
      })
    );

    act(() => {
      result.current.handleSort('name');
      result.current.handleSort('name');
      result.current.handleSort('name');
    });

    expect(handleSortChange.mock.calls).toEqual([
      [{ column: 'name', direction: 'ascending' }],
      [{ column: 'name', direction: 'descending' }],
      [null]
    ]);
  });
});

describe('Table — component behavior', () => {
  it('renders with an accessible table label', () => {
    render(<Table ariaLabel='Users table' columns={columns} items={rows} />);
    expect(screen.getByRole('grid', { name: 'Users table' })).toBeInTheDocument();
  });

  it('sorts rows when a sortable header button is clicked and updates aria-sort', async () => {
    const user = userEvent.setup();

    render(<Table columns={columns} items={rows} />);

    await user.click(screen.getByRole('button', { name: 'Name' }));

    const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    const tableRows = screen.getAllByRole('row').slice(1);
    expect(within(tableRows[0]).getByText('Alice')).toBeInTheDocument();
    expect(within(tableRows[1]).getByText('Bruno')).toBeInTheDocument();
    expect(within(tableRows[2]).getByText('Carla')).toBeInTheDocument();
  });

  it('filters visible rows through the column filter input', async () => {
    const user = userEvent.setup();

    render(<Table columns={columns} items={rows} />);

    await user.type(screen.getByRole('textbox', { name: 'Filter by Name' }), 'ali');

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bruno')).not.toBeInTheDocument();
    expect(screen.queryByText('Carla')).not.toBeInTheDocument();
  });

  it('fires onRowClick from a normal cell click but not from the selection control', async () => {
    const user = userEvent.setup();
    const handleRowClick = vi.fn();

    render(<Table columns={columns} items={rows} onRowClick={handleRowClick} selectionMode='multiple' />);

    await user.click(screen.getByText('Carla'));
    expect(handleRowClick).toHaveBeenCalledTimes(1);
    expect(handleRowClick).toHaveBeenCalledWith(rows[0]);

    await user.click(screen.getByRole('checkbox', { name: 'Toggle selection for Carla' }));
    expect(handleRowClick).toHaveBeenCalledTimes(1);
  });

  it('supports rowKey-driven uncontrolled selection and marks disabled rows as aria-disabled', async () => {
    const user = userEvent.setup();

    render(
      <Table
        columns={columns}
        defaultSelectedKeys={new Set(['alice@example.com'])}
        disabledKeys={new Set(['bruno@example.com'])}
        getRowLabel={(row) => row.name}
        items={rows}
        rowKey={(row) => row.email}
        selectionMode='multiple'
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Toggle selection for Alice' })).toBeChecked();

    const brunoRow = screen.getByText('Bruno').closest('tr');
    expect(brunoRow).toHaveAttribute('aria-disabled', 'true');

    await user.click(screen.getByRole('checkbox', { name: 'Toggle selection for Carla' }));
    expect(screen.getByRole('checkbox', { name: 'Toggle selection for Carla' })).toBeChecked();
  });

  it('keeps fallback row keys stable after filtering changes visible indexes', async () => {
    const user = userEvent.setup();
    const fallbackRows = [{ label: 'Alpha' }, { label: 'Beta' }, { label: 'Gamma' }];
    const fallbackColumns: TableColumn<(typeof fallbackRows)[number]>[] = [
      {
        key: 'label',
        header: 'Label',
        cell: (row) => row.label,
        filterable: true
      }
    ];

    render(
      <Table
        columns={fallbackColumns}
        defaultSelectedKeys={new Set(['row-1'])}
        items={fallbackRows}
        selectionMode='multiple'
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Filter by Label' }), 'bet');

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Toggle selection for row 1 (row-1)' })).toBeChecked();
  });

  it('supports controlled selection callbacks', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn<(keys: Selection) => void>();

    render(
      <Table
        columns={columns}
        items={rows}
        selectedKeys={new Set(['alice@example.com'])}
        rowKey={(row) => row.email}
        selectionMode='multiple'
        onSelectionChange={handleSelectionChange}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Toggle selection for Carla' }));

    expect(handleSelectionChange).toHaveBeenCalledTimes(1);
    expect(Array.from(handleSelectionChange.mock.calls[0][0])).toEqual(['alice@example.com', 'carla@example.com']);
  });

  it('emits the all selection sentinel from the header checkbox', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn<(keys: Selection) => void>();

    render(<Table columns={columns} items={rows} selectionMode='multiple' onSelectionChange={handleSelectionChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(handleSelectionChange).toHaveBeenCalledTimes(1);
    expect(handleSelectionChange).toHaveBeenCalledWith('all');
  });

  it('keeps select all available when disallowEmptySelection starts with one selected row', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn<(keys: Selection) => void>();

    render(
      <Table
        columns={columns}
        disallowEmptySelection={true}
        items={rows}
        selectedKeys={new Set(['alice@example.com'])}
        rowKey={(row) => row.email}
        selectionMode='multiple'
        onSelectionChange={handleSelectionChange}
      />
    );

    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(selectAll).not.toBeDisabled();

    await user.click(selectAll);

    expect(handleSelectionChange).toHaveBeenCalledWith('all');
  });

  it('uses the represented total row count for paginated tables', () => {
    render(<Table columns={columns} items={rows} pageSize={2} pagination={true} totalRows={42} />);

    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '43');
  });
});
