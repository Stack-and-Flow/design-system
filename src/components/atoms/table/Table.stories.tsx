import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
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
  location?: string;
  joinDate?: string;
  salary?: number;
}

/**
 * StatusBadge component optimized for WCAG 2.1 AA accessibility compliance.
 * Uses high-contrast colors that remain readable even with 50% opacity in disabled rows.
 */
const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center min-w-[60px] ${
      status === 'Active'
        ? 'bg-green-900 text-green-50 border border-green-800 dark:bg-green-950 dark:text-green-50 dark:border-green-900'
        : status === 'Inactive'
          ? 'bg-red-900 text-red-50 border border-red-800 dark:bg-red-950 dark:text-red-50 dark:border-red-900'
          : 'bg-yellow-900 text-white border border-yellow-800 dark:bg-yellow-950 dark:text-white dark:border-yellow-900'
    }`}
    role='status'
    aria-label={`Status: ${status}`}
  >
    {status}
  </span>
);

/**
 * Sample data arrays for generating realistic Spanish user information
 */
const SAMPLE_NAMES = [
  'María González',
  'Juan Carlos Rodríguez',
  'Ana Martínez',
  'Carlos López',
  'Laura Fernández',
  'Miguel Sánchez',
  'Isabel Torres',
  'David Ramírez',
  'Carmen Ruiz',
  'José Luis García',
  'Elena Díaz',
  'Antonio Morales',
  'Sara Jiménez',
  'Francisco Herrera',
  'Patricia Vázquez',
  'Manuel Castro',
  'Rosa Ortega',
  'Javier Rubio',
  'Lucia Molina',
  'Roberto Delgado',
  'Cristina Peña',
  'Diego Romero',
  'Mónica Gil',
  'Pablo Medina',
  'Silvia Guerrero'
];

const SAMPLE_COMPANIES = ['Acme Corp', 'TechFlow Inc', 'Global Solutions', 'Innovation Labs', 'Digital Dynamics'];
const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'HR', 'Finance', 'Operations'];
const ROLES = ['Senior Manager', 'Team Lead', 'Developer', 'Designer', 'Analyst', 'Specialist', 'Coordinator'];
const LOCATIONS = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Remote'];

/**
 * Detects gender from Spanish names for appropriate avatar assignment
 */
const getGenderFromName = (fullName: string): 'male' | 'female' => {
  const femaleNames = [
    'María',
    'Ana',
    'Laura',
    'Carmen',
    'Elena',
    'Isabel',
    'Sara',
    'Patricia',
    'Rosa',
    'Cristina',
    'Mónica',
    'Silvia',
    'Lucia',
    'Pilar',
    'Teresa',
    'Dolores',
    'Josefa',
    'Francisca',
    'Antonia',
    'Concepción'
  ];

  const firstName = fullName.split(' ')[0];
  return femaleNames.includes(firstName) ? 'female' : 'male';
};

/**
 * Generates consistent avatar URL based on name gender and index
 */
const getAvatarForUser = (name: string, index: number): string => {
  const gender = getGenderFromName(name);
  const avatarId = (index % 99) + 1; // randomuser.me has 99 portraits per gender
  return `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${avatarId}.jpg`;
};

/**
 * Generates realistic user data with Spanish names and localized information
 */
const generateUsers = (count: number): UserData[] => {
  const statuses = ['Active', 'Inactive', 'Pending'];

  return Array.from({ length: count }, (_, i) => {
    const nameIndex = i % SAMPLE_NAMES.length;
    const name = SAMPLE_NAMES[nameIndex];
    const firstName = name.split(' ')[0].toLowerCase();
    const lastName = name.split(' ')[1]?.toLowerCase() || 'user';

    return {
      id: i + 1,
      name: name,
      email: `${firstName}.${lastName}@${SAMPLE_COMPANIES[i % SAMPLE_COMPANIES.length].toLowerCase().replace(/\s+/g, '')}.com`,
      role: ROLES[i % ROLES.length],
      status: statuses[i % statuses.length],
      team: DEPARTMENTS[i % DEPARTMENTS.length],
      avatar: getAvatarForUser(name, i),
      location: LOCATIONS[i % LOCATIONS.length],
      joinDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString().split('T')[0],
      salary: 45000 + i * 1000 + Math.floor(Math.random() * 15000)
    };
  });
};

/**
 * Pre-generated sample datasets for consistent story demonstrations
 */
const sampleData: UserData[] = generateUsers(12);

/**
 * Column definitions for different table configurations
 */

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
    cell: (row: UserData) => <StatusBadge status={row.status} />,
    sortValue: (row: UserData) => row.status
  }
];

// Sortable columns
const sortableColumns: TableColumn<UserData>[] = basicColumns.map((col) => ({
  ...col,
  allowsSorting: true
}));

/**
 * ## DESCRIPTION
 * The Table component is a flexible and accessible data presentation element that displays structured information in rows and columns.
 * It supports various interactive features including row selection, column sorting, and custom cell rendering.
 * The component is designed to handle both small datasets and provides hooks for integration with external data sources.
 * It includes comprehensive accessibility features with proper ARIA labels and keyboard navigation support.
 * The Table component can be customized with different visual styles, selection modes, and layout options to fit various use cases.
 * It supports API-driven interactions through callback functions for sorting, selection changes, and pagination events.
 * The component is optimized for performance and provides a consistent user experience across different screen sizes.
 *
 * ## DEPENDENCIES
 * - React: Core functionality and hooks for state management
 * - Tailwind CSS: For styling and responsive design
 * - Custom hooks: useTable, useKeyboardNavigation, useTableEvents for enhanced functionality
 */

const meta: Meta<typeof Table<UserData>> = {
  title: 'Atoms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of data objects to display in the table',
      control: false
    },
    columns: {
      description: 'Array of column definitions with headers and cell renderers',
      control: false
    },
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Controls how users can select table rows'
    },
    selectionBehavior: {
      control: 'select',
      options: ['toggle', 'replace'],
      description: 'Defines selection behavior when clicking rows'
    },
    selectedKeys: {
      description: 'Set of currently selected row keys (controlled)',
      control: false
    },
    disabledKeys: {
      description: 'Set of disabled row keys that cannot be selected',
      control: false
    },
    disallowEmptySelection: {
      control: 'boolean',
      description: 'Prevents clearing all selections when enabled'
    },
    isStriped: {
      control: 'boolean',
      description: 'Adds alternating row background colors for better readability'
    },
    isCompact: {
      control: 'boolean',
      description: 'Reduces row padding for denser data presentation'
    },
    hideHeader: {
      control: 'boolean',
      description: 'Hides the table header row when enabled'
    },
    removeWrapper: {
      control: 'boolean',
      description: 'Removes the default container wrapper for custom styling'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state with skeleton placeholders'
    },
    emptyContent: {
      description: 'Content to display when the table has no data',
      control: 'text'
    },
    variant: {
      control: 'select',
      options: ['default', 'striped', 'surface'],
      description: 'Visual style variant of the table'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size preset that affects padding and typography'
    },
    onSelectionChange: {
      description: 'Callback fired when row selection changes',
      action: 'selectionChanged'
    },
    onSortChange: {
      description: 'Callback fired when column sorting is requested',
      action: 'sortChanged'
    },
    onRowAction: {
      description: 'Callback fired when a row is clicked or activated',
      action: 'rowAction'
    },
    onPageChange: {
      description: 'Callback fired when pagination page changes',
      action: 'pageChanged'
    }
  }
};

export default meta;
type Story = StoryObj<CompleteTableProps<UserData>>;

/**
 * - **Default Implementation**: Basic table with essential columns displaying realistic Spanish user data.
 * - **Clean Presentation**: Minimal styling with standard row height and spacing.
 * - **Foundation Example**: Serves as the base implementation for other variants.
 */
export const Default: Story = {
  render: (args) => {
    const data = [
      {
        id: 1,
        name: 'María González',
        email: 'maria.gonzalez@acmecorp.com',
        role: 'Senior Manager',
        status: 'Active',
        team: 'Engineering',
        location: 'Madrid',
        joinDate: '2023-01-15',
        salary: 65000
      },
      {
        id: 2,
        name: 'Juan Carlos Rodríguez',
        email: 'juan.rodriguez@techflow.com',
        role: 'Developer',
        status: 'Active',
        team: 'Engineering',
        location: 'Barcelona',
        joinDate: '2022-06-20',
        salary: 55000
      },
      {
        id: 3,
        name: 'Ana Martínez',
        email: 'ana.martinez@globalsolutions.com',
        role: 'Designer',
        status: 'Inactive',
        team: 'Design',
        location: 'Valencia',
        joinDate: '2021-03-10',
        salary: 50000
      },
      {
        id: 4,
        name: 'Carlos López',
        email: 'carlos.lopez@innovationlabs.com',
        role: 'Team Lead',
        status: 'Active',
        team: 'Marketing',
        location: 'Sevilla',
        joinDate: '2023-08-12',
        salary: 58000
      },
      {
        id: 5,
        name: 'Laura Fernández',
        email: 'laura.fernandez@digitaldynamics.com',
        role: 'Analyst',
        status: 'Pending',
        team: 'Sales',
        location: 'Bilbao',
        joinDate: '2024-02-28',
        salary: 47000
      }
    ];

    return <Table {...args} items={data} columns={basicColumns} />;
  }
};

/**
 * - **Empty State**: Custom content displayed when no data is available.
 * - **User Guidance**: Provides clear messaging and actionable next steps.
 * - **Visual Feedback**: Includes icons and call-to-action buttons for better UX.
 */
export const EmptyState: Story = {
  args: {
    items: [],
    columns: basicColumns,
    emptyContent: (
      <div className='text-center py-6 bg-background-dark'>
        <svg className='mx-auto h-12 w-12 text-gray-dark-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-text-dark'>No users found</h3>
        <p className='mt-1 text-sm text-gray-dark-300'>Get started by creating a new user.</p>
        <div className='mt-6'>
          <button className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary'>
            Add User
          </button>
        </div>
      </div>
    )
  }
};

/**
 * - **Headerless Design**: Table without column headers for cleaner presentation.
 * - **Context-Dependent**: Useful when column meanings are clear from surrounding UI.
 * - **Simplified Layout**: Focuses attention entirely on the data content.
 */
export const WithoutHeader: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    hideHeader: true
  }
};

/**
 * - **Alternating Colors**: Zebra-striped rows improve data readability and visual tracking.
 * - **Enhanced Scanning**: Makes it easier to follow data across columns in long tables.
 * - **Professional Appearance**: Provides a polished look for data-heavy interfaces.
 */
export const StripedRows: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    isStriped: true
  }
};

/**
 * - **Dense Layout**: Reduced padding and spacing for maximum data density.
 * - **Space Efficient**: Ideal for dashboards and limited screen real estate.
 * - **Information Rich**: Allows more rows to be visible simultaneously.
 */
export const Compact: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    isCompact: true
  }
};

/**
 * - **Single Selection**: Allows selecting only one row at a time with radio button behavior.
 * - **Exclusive Choice**: Automatically deselects previous selection when new row is chosen.
 * - **Console Logging**: Selection events are logged to browser console for development.
 */
export const SingleRowSelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());

    const handleSelectionChange = (keys: any) => {
      setSelectedKeys(keys);
      console.log('Single selection changed:', Array.from(keys));
      // Handle single selection change
      // In production, you would update your application state here
      // Example: setSelectedUser(Array.from(keys)[0])
    };

    return (
      <Table
        {...args}
        items={sampleData.slice(0, 8)}
        columns={basicColumns}
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      />
    );
  }
};

/**
 * - **Multiple Selection**: Users can select multiple rows using checkboxes.
 * - **Select All**: Header checkbox provides convenient select/deselect all functionality.
 * - **Batch Operations**: Enables bulk actions on multiple selected items.
 */
export const MultipleRowSelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());

    const handleSelectionChange = (keys: any) => {
      if (keys === 'all') {
        setSelectedKeys(new Set(sampleData.slice(0, 8).map((item) => item.id.toString())));
      } else {
        setSelectedKeys(keys);
      }
      console.log('Multiple selection changed:', Array.from(keys));
      // Handle multiple selection change
      // In production, you would update your application state here
      // Example: setSelectedUsers(Array.from(keys))
    };

    return (
      <Table
        {...args}
        items={sampleData.slice(0, 8)}
        columns={basicColumns}
        selectionMode='multiple'
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      />
    );
  }
};

/**
 * - **Mandatory Selection**: Prevents users from clearing all selections.
 * - **Always Active**: Ensures at least one item remains selected at all times.
 * - **Form Requirements**: Useful for interfaces that require a selection to function.
 */
export const DisallowEmptySelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set(['1']));

    const handleSelectionChange = (keys: any) => {
      // Prevent empty selection
      if (keys.size === 0) {
        console.log('Empty selection prevented - keeping current selection');
        return;
      }
      setSelectedKeys(keys);
      console.log('Selection changed (disallow empty):', Array.from(keys));
    };

    return (
      <Table
        {...args}
        items={sampleData.slice(0, 5)}
        columns={basicColumns}
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        disallowEmptySelection={true}
      />
    );
  }
};

/**
 * - **Conditional Availability**: Some rows are disabled and cannot be selected.
 * - **Visual Distinction**: Disabled rows have different styling to indicate their state.
 * - **Selective Interaction**: Only enabled rows respond to user selection actions.
 */
export const DisabledRows: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());

    const handleSelectionChange = (keys: any) => {
      if (keys === 'all') {
        // Filter out disabled keys when selecting all
        const enabledIds = sampleData
          .slice(0, 8)
          .filter((item) => !['2', '4', '6'].includes(item.id.toString()))
          .map((item) => item.id.toString());
        setSelectedKeys(new Set(enabledIds));
      } else {
        setSelectedKeys(keys);
      }
      console.log('Selection changed (with disabled rows):', Array.from(keys));
    };

    return (
      <Table
        {...args}
        items={sampleData.slice(0, 8)}
        columns={basicColumns}
        selectionMode='multiple'
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        disabledKeys={new Set(['2', '4', '6'])}
      />
    );
  }
};

/**
 * - **Column Sorting**: Click headers to sort data in ascending or descending order.
 * - **API Integration**: Uses onSortChange callback for server-side sorting implementation.
 * - **Visual Indicators**: Sort direction is clearly indicated in column headers.
 */
export const SortingRows: Story = {
  args: {
    items: sampleData,
    columns: sortableColumns,
    onSortChange: (sortDescriptor) => {
      console.log('Sort change requested:', sortDescriptor);
      // In production, you would send this to your API
      // Example: fetchSortedData(sortDescriptor.column, sortDescriptor.direction)
    }
  }
};

/**
 * - **Loading Feedback**: Shows skeleton placeholders during data fetch operations.
 * - **User Experience**: Maintains table structure while indicating loading state.
 * - **Performance Perception**: Provides immediate visual feedback for better perceived performance.
 */
export const LoadingState: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    loading: true
  }
};

/**
 * Table with built-in pagination controls.
 * Uses API-driven approach - pagination events are delegated via onPageChange callback for backend processing.
 */
export const PaginatedTable: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    pagination: true,
    pageSize: 5,
    onPageChange: (page) => {
      console.log('Page change requested:', page);
      // In production, you would send this to your API
      // Example: fetchPageData(page, pageSize)
    }
  }
};

/**
 * - **Dynamic Data**: Generates user data on-the-fly with realistic Spanish names and information.
 * - **Interactive Rows**: Clickable rows trigger custom actions and callbacks.
 * - **Unified Functionality**: Combines dynamic data generation with row action handling.
 * - **API Callbacks**: Demonstrates integration patterns for sorting and selection events.
 */
export const DynamicInteractions: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());
    const [sortDescriptor, setSortDescriptor] = React.useState<any>(null);
    const dynamicData = generateUsers(15);

    const handleSelectionChange = (keys: any) => {
      if (keys === 'all') {
        setSelectedKeys(new Set(dynamicData.map((item) => item.id.toString())));
      } else {
        setSelectedKeys(keys);
      }
    };

    return (
      <Table
        {...args}
        items={dynamicData}
        columns={sortableColumns}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) => {
          setSortDescriptor(descriptor);
          console.log('Sort requested:', descriptor);
        }}
        onRowAction={(key) => {
          const user = dynamicData.find((u) => u.id.toString() === key);
          alert(`Row action triggered for: ${user?.name} (ID: ${key})`);
        }}
        selectionMode='multiple'
      />
    );
  }
};

/**
 * - **Rich Cell Rendering**: Complex cells with avatars, badges, and formatted data presentation.
 * - **Employee Management**: Demonstrates HR/employee data table with comprehensive information.
 * - **Custom Formatting**: Shows salary formatting, tenure calculations, and status indicators.
 * - **Professional Layout**: Real-world example of enterprise data table implementation.
 */
export const RichCustomCells: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());
    const [sortDescriptor, setSortDescriptor] = React.useState<any>(null);
    const richData = generateUsers(20);

    const handleSelectionChange = (keys: any) => {
      if (keys === 'all') {
        setSelectedKeys(new Set(richData.map((item) => item.id.toString())));
      } else {
        setSelectedKeys(keys);
      }
    };

    // Enhanced columns with rich formatting including avatars and complex layouts
    const richColumns: TableColumn<UserData>[] = [
      {
        key: 'employee',
        header: 'Employee',
        cell: (row: UserData) => (
          <div className='flex items-center gap-3'>
            <img src={row.avatar} alt={row.name} className='w-10 h-10 rounded-full' />
            <div>
              <div className='font-medium text-text-dark'>{row.name}</div>
              <div className='text-sm text-gray-dark-300'>{row.email}</div>
              <div className='text-xs text-gray-dark-400'>{row.location}</div>
            </div>
          </div>
        ),
        allowsSorting: true,
        sortValue: (row: UserData) => row.name
      },
      {
        key: 'department',
        header: 'Department',
        cell: (row: UserData) => (
          <div>
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                row.team === 'Engineering'
                  ? 'bg-blue-900 text-blue-200'
                  : row.team === 'Design'
                    ? 'bg-purple-900 text-purple-200'
                    : row.team === 'Marketing'
                      ? 'bg-green-900 text-green-200'
                      : row.team === 'Sales'
                        ? 'bg-yellow-900 text-yellow-200'
                        : 'bg-gray-900 text-gray-200'
              }`}
            >
              {row.team}
            </div>
            <div className='text-xs text-gray-dark-300 mt-1'>{row.role}</div>
          </div>
        ),
        allowsSorting: true
      },
      {
        key: 'compensation',
        header: 'Compensation',
        cell: (row: UserData) => (
          <div className='text-right'>
            <div className='font-medium text-green-300'>{row.salary ? `€${row.salary.toLocaleString()}` : 'N/A'}</div>
            <div className='text-xs text-gray-dark-400'>Annual</div>
          </div>
        ),
        allowsSorting: true,
        sortValue: (row: UserData) => row.salary || 0
      },
      {
        key: 'tenure',
        header: 'Tenure',
        cell: (row: UserData) => {
          if (!row.joinDate) {
            return 'N/A';
          }
          const joinDate = new Date(row.joinDate);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - joinDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);

          return (
            <div>
              <div className='font-medium text-text-dark'>{years > 0 ? `${years}y ${months}m` : `${months}m`}</div>
              <div className='text-xs text-gray-dark-300'>{joinDate.toLocaleDateString()}</div>
            </div>
          );
        },
        allowsSorting: true,
        sortValue: (row: UserData) => row.joinDate || ''
      },
      {
        key: 'status',
        header: 'Status',
        cell: (row: UserData) => <StatusBadge status={row.status} />,
        sortValue: (row: UserData) => row.status,
        allowsSorting: true
      },
      {
        key: 'actions',
        header: 'Actions',
        cell: (row: UserData) => (
          <div className='flex gap-2' role='group' aria-label='Row actions'>
            <button
              className='text-gray-dark-200 hover:text-gray-dark-100 font-medium transition-colors'
              aria-label={`Edit user ${row.name}`}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Edit user: ${row.name}`);
              }}
            >
              Edit
            </button>
            <button
              className='text-red-300 hover:text-red-200 font-medium transition-colors'
              aria-label={`Delete user ${row.name}`}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Delete user: ${row.name}`);
              }}
            >
              Delete
            </button>
          </div>
        )
      }
    ];

    return (
      <Table
        {...args}
        items={richData}
        columns={richColumns}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectionMode='multiple'
        isStriped={true}
      />
    );
  }
};
