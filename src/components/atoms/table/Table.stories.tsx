import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Table from './Table';
import type { CompleteTableProps, TableColumn } from './types';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  team?: string;
}

const generateUsers = (count: number): UserData[] => {
  const roles = ['Admin', 'User', 'Editor', 'Manager'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  const teams = ['Engineering', 'Design', 'Marketing', 'Sales'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    team: teams[i % teams.length],
    avatar: `https://i.pravatar.cc/40?img=${(i % 50) + 1}`
  }));
};

// Generación asíncrona para evitar bloqueos
const generateUsersAsync = async (count: number, chunkSize: number = 1000): Promise<UserData[]> => {
  const roles = ['Admin', 'User', 'Editor', 'Manager'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  const teams = ['Engineering', 'Design', 'Marketing', 'Sales'];

  const users: UserData[] = [];

  for (let i = 0; i < count; i += chunkSize) {
    const chunk = Math.min(chunkSize, count - i);
    const chunkData = Array.from({ length: chunk }, (_, j) => {
      const index = i + j;
      return {
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: roles[index % roles.length],
        status: statuses[index % statuses.length],
        team: teams[index % teams.length],
        avatar: `https://i.pravatar.cc/40?img=${(index % 50) + 1}`
      };
    });

    users.push(...chunkData);

    // Yield control back to browser to prevent blocking
    if (i + chunkSize < count) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return users;
};

const sampleData: UserData[] = generateUsers(12);
const mediumData: UserData[] = generateUsers(100); // Para pruebas rápidas

// Basic columns without sorting or filtering
const basicColumns: TableColumn<UserData>[] = [
  {
    key: 'id',
    header: 'ID',
    cell: (row: UserData) => row.id
  },
  {
    key: 'name',
    header: 'Name',
    cell: (row: UserData) => row.name
  },
  {
    key: 'email',
    header: 'Email',
    cell: (row: UserData) => row.email
  },
  {
    key: 'role',
    header: 'Role',
    cell: (row: UserData) => row.role
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row: UserData) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.status === 'Active'
            ? 'bg-green-500/20 text-green-500 border border-green-500/30'
            : row.status === 'Inactive'
              ? 'bg-red-500/20 text-red-500 border border-red-500/30'
              : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
        }`}
      >
        {row.status}
      </span>
    )
  }
];

// Sortable columns
const sortableColumns: TableColumn<UserData>[] = basicColumns.map((col) => ({
  ...col,
  allowsSorting: true
}));

// Filterable columns
const filterableColumns: TableColumn<UserData>[] = [
  { key: 'id', header: 'ID', cell: (row: UserData) => row.id },
  { key: 'name', header: 'Name', cell: (row: UserData) => row.name, filterable: true },
  { key: 'email', header: 'Email', cell: (row: UserData) => row.email, filterable: true },
  { key: 'role', header: 'Role', cell: (row: UserData) => row.role, filterable: true },
  { key: 'status', header: 'Status', cell: (row: UserData) => row.status, filterable: true }
];

// Custom cell columns with avatar
const customCellColumns: TableColumn<UserData>[] = [
  {
    key: 'user',
    header: 'User',
    cell: (row: UserData) => (
      <div className='flex items-center gap-3'>
        <img src={row.avatar} alt={row.name} className='w-8 h-8 rounded-full' />
        <div>
          <div className='font-medium'>{row.name}</div>
          <div className='text-sm text-gray-500'>{row.email}</div>
        </div>
      </div>
    )
  },
  { key: 'team', header: 'Team', cell: (row: UserData) => row.team },
  { key: 'role', header: 'Role', cell: (row: UserData) => row.role },
  {
    key: 'status',
    header: 'Status',
    cell: (row: UserData) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.status === 'Active'
            ? 'bg-green-500/20 text-green-500 border border-green-500/30'
            : row.status === 'Inactive'
              ? 'bg-red-500/20 text-red-500 border border-red-500/30'
              : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
        }`}
      >
        {row.status}
      </span>
    )
  },
  {
    key: 'actions',
    header: 'Actions',
    cell: (_row: UserData) => (
      <div className='flex gap-2'>
        <button className='text-primary hover:text-primary/80 font-medium'>Edit</button>
        <button className='text-red-500 hover:text-red-600 font-medium'>Delete</button>
      </div>
    )
  }
];

const meta: Meta<typeof Table<UserData>> = {
  title: 'Atoms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Table Component

A comprehensive, accessible Table component; Supports advanced features like row selection, sorting, virtualization, pagination, and keyboard navigation.

## Features

- ✅ **Row Selection**: Single and multiple selection modes with visual feedback
- ✅ **Column Sorting**: Sortable columns with custom indicators and keyboard support
- ✅ **Virtualization**: Handle large datasets (10k+ rows) with smooth scrolling
- ✅ **Pagination**: Built-in pagination with configurable page sizes  
- ✅ **Accessibility**: Full ARIA support and keyboard navigation
- ✅ **Customization**: Custom cell renderers, styling, and theming
- ✅ **Responsive**: Mobile-friendly design with dark mode support
- ✅ **Performance**: Optimized rendering and state management

## Usage

\`\`\`tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns = [
  { key: 'name', header: 'Name', allowsSorting: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' }
];

<Table<User>
  items={users}
  columns={columns}
  selectionMode="multiple"
  onSelectionChange={(keys) => setSelectedKeys(keys)}
/>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple']
    },
    selectionBehavior: {
      control: 'select',
      options: ['toggle', 'replace']
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger']
    },
    isStriped: {
      control: 'boolean'
    },
    isCompact: {
      control: 'boolean'
    },
    hideHeader: {
      control: 'boolean'
    },
    removeWrapper: {
      control: 'boolean'
    }
  }
};

export default meta;
type Story = StoryObj<CompleteTableProps<UserData>>;

// Default story (required by Storybook)
export const Default: Story = {
  args: {
    items: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' }
    ],
    columns: [
      { key: 'id', header: 'ID', cell: (row: UserData) => row.id },
      { key: 'name', header: 'Name', cell: (row: UserData) => row.name },
      { key: 'email', header: 'Email', cell: (row: UserData) => row.email }
    ]
  }
};

// Dynamic Table (uses items prop)
export const Dynamic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A table populated with dynamic data using the `items` prop. This is the recommended pattern for most use cases.'
      }
    }
  },
  args: {
    items: sampleData,
    columns: basicColumns
  }
};

// Empty State
export const EmptyState: Story = {
  args: {
    items: [],
    columns: basicColumns,
    emptyContent: (
      <div className='text-center py-6'>
        <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-gray-900'>No users found</h3>
        <p className='mt-1 text-sm text-gray-500'>Get started by creating a new user.</p>
        <div className='mt-6'>
          <button className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90'>
            Add User
          </button>
        </div>
      </div>
    )
  }
};

// Without Header
export const WithoutHeader: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    hideHeader: true
  }
};

// Without Wrapper
export const WithoutWrapper: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    removeWrapper: true
  }
};

// Custom Cells
export const CustomCells: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: customCellColumns
  }
};

// Striped Rows
export const StripedRows: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    isStriped: true
  }
};

// Compact Table
export const Compact: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    isCompact: true
  }
};

// Single Row Selection
export const SingleRowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Table with single row selection enabled. Users can select one row at a time using radio buttons. Check the console to see selection events.'
      }
    }
  },
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    selectionMode: 'single',
    showSelectionCheckboxes: true,
    onSelectionChange: (_keys) => {
      // Handle single selection change
      // In production, you would update your application state here
      // Example: setSelectedUser(Array.from(keys)[0])
    }
  }
};

// Multiple Row Selection
export const MultipleRowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Table with multiple row selection enabled. Users can select multiple rows using checkboxes. The header checkbox allows selecting/deselecting all rows. Check the browser console to see selection events.'
      }
    }
  },
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    selectionMode: 'multiple',
    showSelectionCheckboxes: true,
    onSelectionChange: (_keys) => {
      // Handle multiple selection change
      // In production, you would update your application state here
      // Example: setSelectedUsers(Array.from(keys))
    }
  }
};

// Disallow Empty Selection
export const DisallowEmptySelection: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    selectionMode: 'single',
    disallowEmptySelection: true,
    defaultSelectedKeys: new Set(['1'])
  }
};

// Controlled Selection
export const ControlledSelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set(['1', '3']));

    const handleSelectionChange = (keys: any) => {
      if (keys === 'all') {
        setSelectedKeys(new Set(sampleData.slice(0, 8).map((item) => item.id.toString())));
      } else {
        setSelectedKeys(keys);
      }
    };

    return (
      <div>
        <div className='mb-4'>
          <p>Selected IDs: {Array.from(selectedKeys).join(', ')}</p>
          <button onClick={() => setSelectedKeys(new Set())} className='mt-2 px-4 py-2 bg-gray-200 rounded'>
            Clear Selection
          </button>
        </div>
        <Table {...args} selectedKeys={selectedKeys} onSelectionChange={handleSelectionChange} />
      </div>
    );
  },
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    selectionMode: 'multiple'
  }
};

// Disabled Rows
export const DisabledRows: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    selectionMode: 'multiple',
    disabledKeys: new Set(['2', '4', '6'])
  }
};

// Selection Behavior Replace
export const SelectionBehaviorReplace: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    selectionMode: 'multiple',
    selectionBehavior: 'replace'
  }
};

// Row Actions
export const RowActions: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    onRowAction: (key) => {
      alert(`Row action triggered for key: ${key}`);
    }
  }
};

// Sorting Rows (only this story has sorting enabled)
export const SortingRows: Story = {
  args: {
    items: sampleData,
    columns: sortableColumns
  }
};

// Custom Sort Icon
export const CustomSortIcon: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: sortableColumns.map((col) => ({
      ...col,
      sortIcon: col.allowsSorting ? (
        <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
          />
        </svg>
      ) : undefined
    }))
  }
};

// With Filtering (only this story has filtering enabled)
export const WithFiltering: Story = {
  args: {
    items: sampleData,
    columns: filterableColumns
  }
};

// Loading State
export const LoadingState: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    loading: true
  }
};

// Paginated Table
export const PaginatedTable: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    pagination: true,
    pageSize: 5
  }
};

// Top and Bottom Content
export const WithTopBottomContent: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    topContent: (
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Users Management</h3>
        <div className='flex gap-2'>
          <button className='px-3 py-1 text-sm bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20'>
            Add User
          </button>
          <button className='px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded'>Export</button>
        </div>
      </div>
    ),
    bottomContent: <div className='text-center text-sm text-gray-500'>Showing 8 of 12 users</div>
  }
};

// Sticky Header
export const StickyHeader: Story = {
  args: {
    items: sampleData.concat(sampleData).concat(sampleData), // Triple the data for scrolling
    columns: basicColumns,
    isHeaderSticky: true
  },
  decorators: [
    (Story) => (
      <div className='h-64 overflow-auto'>
        <Story />
      </div>
    )
  ]
};

// Virtualized Table (for performance with medium dataset)
export const VirtualizedTable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Table with virtualization enabled for handling medium to large datasets efficiently. Only visible rows are rendered, providing smooth scrolling performance even with thousands of rows. The table height is constrained to 400px.'
      }
    }
  },
  args: {
    items: mediumData, // Usando mediumData para evitar bloqueos
    columns: basicColumns,
    isVirtualized: true,
    maxTableHeight: 400
  }
};

// Large Dataset with Async Loading Simulation
export const AsyncLargeDataTable: Story = {
  render: (args) => {
    const [data, setData] = React.useState<UserData[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [loadingProgress, setLoadingProgress] = React.useState(0);

    React.useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        setLoadingProgress(0);

        try {
          const totalItems = 2000; // Cantidad configurable
          const chunkSize = 100;
          const users: UserData[] = [];

          for (let i = 0; i < totalItems; i += chunkSize) {
            const chunk = generateUsers(Math.min(chunkSize, totalItems - i));
            users.push(...chunk);
            setData([...users]); // Update progressively
            setLoadingProgress((users.length / totalItems) * 100);

            // Yield control to prevent blocking
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, []);

    if (loading && data.length === 0) {
      return (
        <div className='p-8 text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p>Generando datos de ejemplo...</p>
          <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
            <div
              className='bg-primary h-2 rounded-full transition-all duration-300'
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className='text-sm text-gray-600 mt-2'>{Math.round(loadingProgress)}% completado</p>
        </div>
      );
    }

    return (
      <div>
        {loading && (
          <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded'>
            <div className='flex items-center gap-2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
              <span className='text-sm text-blue-800'>Cargando datos... {data.length} elementos cargados</span>
            </div>
          </div>
        )}
        <Table
          {...args}
          items={data}
          columns={basicColumns}
          isVirtualized={true}
          maxTableHeight={500}
          topContent={
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold'>Tabla con Carga Asíncrona</h3>
              <span className='text-sm text-gray-600'>
                {data.length} elementos {loading ? '(cargando...)' : '(completo)'}
              </span>
            </div>
          }
        />
      </div>
    );
  }
};

// Performance Test with Configurable Size
export const ConfigurableSize: Story = {
  render: (args) => {
    const [itemCount, setItemCount] = React.useState(100);
    const [data, setData] = React.useState<UserData[]>(generateUsers(100));
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleSizeChange = async (newSize: number) => {
      if (newSize > 1000) {
        setIsGenerating(true);
        const newData = await generateUsersAsync(newSize, 200);
        setData(newData);
        setIsGenerating(false);
      } else {
        setData(generateUsers(newSize));
      }
      setItemCount(newSize);
    };

    return (
      <div>
        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-semibold mb-3'>Control de Tamaño de Tabla</h3>
          <div className='flex flex-wrap gap-2 mb-4'>
            {[50, 100, 200, 500, 1000, 2000].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                disabled={isGenerating}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  itemCount === size ? 'bg-primary text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {size} elementos
              </button>
            ))}
          </div>
          {isGenerating && (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
              <span>Generando {itemCount} elementos...</span>
            </div>
          )}
        </div>
        <Table
          {...args}
          items={data}
          columns={basicColumns}
          isVirtualized={itemCount > 100}
          maxTableHeight={400}
          topContent={
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold'>Tabla Configurable</h3>
              <span className='text-sm text-gray-600'>
                {data.length} elementos {itemCount > 100 ? '(virtualizada)' : ''}
              </span>
            </div>
          }
        />
      </div>
    );
  }
};

// Different Colors
export const PrimaryColor: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    color: 'primary',
    selectionMode: 'multiple'
  }
};

export const SuccessColor: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    color: 'success',
    selectionMode: 'multiple'
  }
};

export const WarningColor: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    color: 'warning',
    selectionMode: 'multiple'
  }
};

// Complete Example (kitchen sink)
export const CompleteExample: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());
    const [sortDescriptor, setSortDescriptor] = React.useState<any>(null);

    const handleSelectionChange = (keys: any) => {
      if (keys === 'all') {
        setSelectedKeys(new Set(sampleData.map((item) => item.id.toString())));
      } else {
        setSelectedKeys(keys);
      }
    };

    return (
      <Table
        {...args}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        topContent={
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>Complete Table Example</h3>
            <div className='text-sm text-gray-500'>
              {selectedKeys.size} of {sampleData.length} selected
            </div>
          </div>
        }
      />
    );
  },
  args: {
    items: sampleData,
    columns: customCellColumns.map((col) => ({ ...col, allowsSorting: true })),
    selectionMode: 'multiple',
    isStriped: true,
    color: 'primary'
  }
};

// Color Variants Showcase
export const ColorVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of all available color themes for the table. Each color affects the text color throughout the table content.'
      }
    }
  },
  render: () => (
    <div className='space-y-8'>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-text-dark'>Default Color</h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='default' />
      </div>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-primary'>Primary Color</h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='primary' />
      </div>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-secondary'>Secondary Color</h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='secondary' />
      </div>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-green-500'>Success Color</h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='success' />
      </div>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-yellow-500'>Warning Color</h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='warning' />
      </div>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-red-500'>Danger Color</h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='danger' />
      </div>
    </div>
  )
};
