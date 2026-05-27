import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import Table from './Table';
import type { CompleteTableProps, Selection, SortDescriptor, TableColumn } from './types';

type UserData = {
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
};

/**
 * StatusBadge component optimized for WCAG 2.1 AA accessibility compliance.
 * Uses design-system semantic colors that remain readable even with reduced opacity in disabled rows.
 */
const statusBadgeClasses: Record<string, string> = {
  active:
    'border border-success-light bg-success-tint text-success-light dark:border-success dark:bg-success-tint dark:text-success',
  inactive:
    'border border-error-light bg-error-tint text-error-light dark:border-error dark:bg-error-tint dark:text-error',
  pending:
    'border border-warning-light bg-warning-tint text-warning-light dark:border-warning dark:bg-warning-tint dark:text-warning'
};

const departmentBadgeClasses: Record<string, string> = {
  design: 'bg-purple/10 text-purple-dark dark:text-purple-light',
  engineering: 'bg-blue/10 text-blue-dark dark:text-blue-light',
  marketing: 'bg-success-tint text-success-light dark:text-success',
  sales: 'bg-warning-tint text-warning-light dark:text-warning'
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex min-w-16 items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClasses[status.toLocaleLowerCase()] ?? 'border border-border-strong-light bg-surface-raised-light text-text-light dark:border-border-strong-dark dark:bg-surface-raised-dark dark:text-text-dark'}`}
    role='status'
    aria-label={`Status: ${status}`}
  >
    {status}
  </span>
);

const TruncatedText = ({ value, className }: { value: string; className?: string }) => (
  <span
    className={`block w-full min-w-0 max-w-full overflow-hidden truncate whitespace-nowrap ${className ?? ''}`}
    title={value}
  >
    {value}
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

const selectionChangedAction = action('selection-change');
const sortChangedAction = action('sort-change');
const pageChangedAction = action('page-change');
const rowClickAction = action('row-click');
const rowActionTriggered = action('row-action');
const editUserAction = action('edit-user');
const deleteUserAction = action('delete-user');

const getRowIds = (data: UserData[]) => {
  const ids: string[] = [];

  for (const item of data) {
    ids.push(item.id.toString());
  }

  return ids;
};

const toSelectionSet = (keys: Selection, data: UserData[]) =>
  keys === 'all' ? new Set(getRowIds(data)) : new Set(Array.from(keys, (key) => String(key)));

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
    cell: (row: UserData) => <TruncatedText value={row.name} />
  },
  {
    key: 'email',
    header: 'Email',
    cell: (row: UserData) => <TruncatedText value={row.email} />
  },
  {
    key: 'role',
    header: 'Role',
    cell: (row: UserData) => <TruncatedText value={row.role} />
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row: UserData) => <StatusBadge status={row.status} />,
    sortValue: (row: UserData) => row.status
  }
];

// Sortable columns
const sortableColumns: TableColumn<UserData>[] = [
  {
    ...basicColumns[0],
    allowsSorting: true,
    filterable: false
  },
  {
    ...basicColumns[1],
    allowsSorting: true,
    filterable: true
  },
  {
    ...basicColumns[2],
    allowsSorting: true,
    filterable: false
  },
  {
    ...basicColumns[3],
    allowsSorting: true,
    filterable: false
  },
  {
    ...basicColumns[4],
    allowsSorting: true,
    filterable: false
  }
];

/**
 * ## Description
 * The Table component is a powerful and accessible data presentation element for displaying structured information in rows and columns.
 * It supports sorting, filtering, pagination, row selection, and custom cell rendering.
 * Designed for both simple datasets and complex API-driven applications with comprehensive accessibility features.
 *
 * ## Usage Guide
 * - **Interactive Sorting**: Click column headers to sort data in ascending or descending order
 * - **Row Selection**: Single or multiple selection modes with keyboard support and visual feedback
 * - **Pagination**: Built-in or API-driven pagination controls with customizable page sizes
 * - **Custom Cells**: Render any React component in table cells for rich data presentation
 * - **Loading States**: Skeleton UI placeholders during data fetch operations
 * - **Keyboard Navigation**: Full arrow key navigation (↑↓←→) and accessibility shortcuts (Home, End, Page Up/Down)
 * - **Disabled Rows**: Mark specific rows as non-selectable with visual indicators
 * - **Striped Rows**: Alternating row backgrounds for improved readability
 * - **Empty States**: Customizable messages when no data is available
 * - **Filtering**: Column-based filtering with debounced input for performance
 * - **API Integration**: Designed for backend-driven sorting, filtering, and pagination
 * - **Responsive Design**: Adapts to different screen sizes with horizontal scrolling when needed
 * - **Dark Mode**: Full theme support with consistent colors across light and dark themes
 * - **WCAG Compliance**: Meets WCAG 2.1 AA accessibility standards for color contrast and interaction
 *
 * ### Usage Patterns
 *
 * ### Column Definition
 * Columns define how data is displayed and can include custom renderers, sorting logic, and alignment:
 * ```tsx
 * const columns: TableColumn<UserData>[] = [
 *   {
 *     key: 'name',
 *     header: 'Name',
 *     cell: (row) => <span className="font-medium">{row.name}</span>,
 *     allowsSorting: true,
 *     sortValue: (row) => row.name,
 *     align: 'start'
 *   },
 *   {
 *     key: 'status',
 *     header: 'Status',
 *     cell: (row) => <StatusBadge status={row.status} />,
 *     sortValue: (row) => row.status,
 *     allowsSorting: true
 *   }
 * ];
 * ```
 *
 * ### Selection Modes
 * Control how users can select rows:
 * - **none**: No selection (read-only table for data display only)
 * - **single**: Only one row can be selected at a time (radio-like behavior)
 * - **multiple**: Multiple rows with checkboxes (checkbox behavior)
 *
 * ### Controlled vs Uncontrolled
 * The table supports both controlled and uncontrolled patterns:
 * - **Controlled**: Manage `selectedKeys` in parent component state
 * - **Uncontrolled**: Use `defaultSelectedKeys` for initial selection, let table manage state
 *
 * ### API-Driven vs Client-Side
 * The table supports two data management approaches:
 * - **Client-side**: Pass all data via `items` prop, table handles sorting/filtering internally
 * - **API-driven**: Use callbacks (`onSortChange`, `onPageChange`, `onFilterChange`) to fetch data from backend
 *
 * ### Accessibility
 * - **Keyboard Navigation**: Arrow keys (↑↓←→), Home, End, Page Up/Down for cell navigation
 * - **ARIA Roles**: Proper grid, row, gridcell, columnheader roles for screen readers
 * - **Screen Reader Support**: Announcements for loading states, page changes, and row counts
 * - **Focus Management**: Visible focus indicators with ring styles for keyboard users
 * - **Sortable Columns**: Announced with aria-sort (ascending/descending/none)
 * - **Selectable Rows**: Proper aria-selected state and aria-label for checkboxes
 * - **Color Contrast**: WCAG 2.1 AA compliant colors in both light and dark themes
 * - **Disabled States**: Clear visual indicators with aria-disabled attributes
 *
 * ## Dependencies
 * - React: Core functionality and hooks (useState, useCallback, useMemo, useRef, useEffect)
 * - Tailwind CSS: Styling with dark mode support and responsive utilities
 * - class-variance-authority (CVA): Type-safe variant management for component styling
 * - Custom hooks: useTable, useKeyboardNavigation, useTableEvents, useTableClasses
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
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<CompleteTableProps<UserData>>;

// ============================================================================
// BASIC USAGE
// ============================================================================
// Stories demonstrating fundamental table configurations and empty states

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
      <div className='bg-background-light py-6 text-center dark:bg-surface-dark'>
        <svg
          className='mx-auto h-12 w-12 text-text-tertiary-light dark:text-text-tertiary-dark'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-text-light dark:text-text-dark'>No users found</h3>
        <p className='mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
          Get started by creating a new user.
        </p>
        <div className='mt-6'>
          <button className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-btn-primary hover:bg-btn-primary-hover'>
            Add User
          </button>
        </div>
      </div>
    )
  }
};

// ============================================================================
// VISUAL CUSTOMIZATION
// ============================================================================
// Stories showcasing different visual styles and layout options

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

// ============================================================================
// SELECTION MODES
// ============================================================================
// Stories demonstrating single, multiple, and constrained selection patterns

/**
 * - **Single Selection**: Allows selecting only one row at a time with radio button behavior.
 * - **Exclusive Choice**: Automatically deselects previous selection when new row is chosen.
 * - **Console Logging**: Selection events are logged to browser console for development.
 */
export const SingleRowSelection: Story = {
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `
import { useState } from 'react';
import Table from './Table';

const SingleSelectionTable = () => {
  const [selectedKeys, setSelectedKeys] = useState<Set<React.Key>>(new Set());

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
    selectionChangedAction(keys);
  };

  return (
    <Table
      items={data}
      columns={columns}
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
    />
  );
};
`
      }
    }
  },
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());

    const handleSelectionChange = (keys: Selection) => {
      const nextSelection = toSelectionSet(keys, sampleData.slice(0, 8));
      setSelectedKeys(nextSelection);
      selectionChangedAction(keys);
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
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `
import { useState } from 'react';
import Table from './Table';

const MultipleSelectionTable = () => {
  const [selectedKeys, setSelectedKeys] = useState<Set<React.Key>>(new Set());

  const handleSelectionChange = (keys: Selection) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(data.map((item) => item.id.toString())));
    } else {
      setSelectedKeys(keys);
    }
    selectionChangedAction(keys);
  };

  return (
    <Table
      items={data}
      columns={columns}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
    />
  );
};
`
      }
    }
  },
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());

    const handleSelectionChange = (keys: Selection) => {
      setSelectedKeys(toSelectionSet(keys, sampleData.slice(0, 8)));
      selectionChangedAction(keys);
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

    const handleSelectionChange = (keys: Selection) => {
      if (keys === 'all') {
        return;
      }

      if (keys.size === 0) {
        return;
      }

      setSelectedKeys(new Set(Array.from(keys, (key) => String(key))));
      selectionChangedAction(keys);
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

    const handleSelectionChange = (keys: Selection) => {
      if (keys === 'all') {
        const enabledIds: string[] = [];

        for (const item of sampleData.slice(0, 8)) {
          if (!['2', '4', '6'].includes(item.id.toString())) {
            enabledIds.push(item.id.toString());
          }
        }

        setSelectedKeys(new Set(enabledIds));
        selectionChangedAction(keys);
        return;
      }

      setSelectedKeys(new Set(Array.from(keys, (key) => String(key))));
      selectionChangedAction(keys);
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

// ============================================================================
// SORTING & FILTERING
// ============================================================================
// Stories showcasing data manipulation and organization features

/**
 * - **Column Sorting**: Click headers to sort data in ascending or descending order.
 * - **API Integration**: Uses onSortChange callback for server-side sorting implementation.
 * - **Visual Indicators**: Sort direction is clearly indicated in column headers.
 */
export const SortingRows: Story = {
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `
import Table from './Table';

const SortableTable = () => {
  const handleSortChange = (sortDescriptor: SortDescriptor | null) => {
    sortChangedAction(sortDescriptor);
  };

  return (
    <Table
      items={data}
      columns={sortableColumns}
      onSortChange={handleSortChange}
    />
  );
};
`
      }
    }
  },
  args: {
    items: sampleData,
    columns: sortableColumns,
    onSortChange: sortChangedAction
  }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
// Stories demonstrating loading states and pagination controls

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
 * - **Paginated Navigation**: Built-in pagination controls for large datasets.
 * - **API-Driven Approach**: Uses onPageChange callback for server-side data fetching.
 * - **Page Size Control**: Configurable number of rows per page.
 * - **User Feedback**: Shows current page and total pages with Previous/Next buttons.
 */
export const PaginatedTable: Story = {
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `
import Table from './Table';

const PaginatedTableExample = () => {
  const handlePageChange = (page: number) => {
    pageChangedAction(page);
  };

  return (
    <Table
      items={data}
      columns={columns}
      pagination={true}
      pageSize={5}
      onPageChange={handlePageChange}
    />
  );
};
`
      }
    }
  },
  args: {
    items: sampleData,
    columns: basicColumns,
    pagination: true,
    pageSize: 5,
    onPageChange: pageChangedAction
  }
};

// ============================================================================
// ADVANCED EXAMPLES
// ============================================================================
// Stories showcasing complex real-world implementations and rich features

/**
 * - **Dynamic Data**: Generates user data on-the-fly with realistic Spanish names and information.
 * - **Interactive Rows**: Clickable rows trigger custom actions and callbacks.
 * - **Unified Functionality**: Combines dynamic data generation with row action handling.
 * - **API Callbacks**: Demonstrates integration patterns for sorting and selection events.
 */
export const DynamicInteractions: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor | null>(null);
    const dynamicData = generateUsers(15);

    const handleSelectionChange = (keys: Selection) => {
      setSelectedKeys(toSelectionSet(keys, dynamicData));
      selectionChangedAction(keys);
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
          sortChangedAction(descriptor);
        }}
        onRowClick={(row) => {
          rowClickAction(row);
        }}
        onRowAction={(key) => {
          const user = dynamicData.find((item) => item.id.toString() === String(key));
          rowActionTriggered({ key, user: user?.name });
        }}
        rowKey={(row) => row.email}
        selectionMode='multiple'
        layout='fixed'
        classNames={{
          ...args.classNames,
          th: `${args.classNames?.th ?? ''} overflow-hidden`,
          td: `${args.classNames?.td ?? ''} overflow-hidden`
        }}
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
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `
import Table from './Table';
import type { TableColumn } from './types';

type UserData = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  team: string;
  role: string;
  salary: number;
  status: string;
};

const RichCellsExample = () => {
  const richColumns: TableColumn<UserData>[] = [
    {
      key: 'employee',
      header: 'Employee',
      cell: (row) => (
        <div className="flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden">
          <img src={row.avatar} alt={row.name} className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="truncate font-medium" title={row.name}>{row.name}</div>
            <div className="truncate text-sm text-text-secondary-light dark:text-text-secondary-dark" title={row.email}>{row.email}</div>
          </div>
        </div>
      ),
      allowsSorting: true
    },
    {
      key: 'compensation',
      header: 'Compensation',
      cell: (row) => (
        <div className="text-right">
          <div className="font-medium text-success-light dark:text-success">
            €{row.salary.toLocaleString()}
          </div>
          <div className="text-xs text-text-tertiary-light dark:text-text-tertiary-dark">Annual</div>
        </div>
      ),
      allowsSorting: true
    }
  ];

  return (
    <Table
      items={data}
      columns={richColumns}
      selectionMode="multiple"
      isStriped={true}
    />
  );
};
`
      }
    }
  },
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor | null>(null);
    const richData = generateUsers(20);

    const handleSelectionChange = (keys: Selection) => {
      setSelectedKeys(toSelectionSet(keys, richData));
      selectionChangedAction(keys);
    };

    // Enhanced columns with rich formatting including avatars and complex layouts
    const richColumns: TableColumn<UserData>[] = [
      {
        key: 'employee',
        header: 'Employee',
        cell: (row: UserData) => (
          <div className='flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden'>
            <img src={row.avatar} alt={row.name} className='h-10 w-10 shrink-0 rounded-full' />
            <div className='min-w-0 flex-1 overflow-hidden'>
              <TruncatedText value={row.name} className='font-medium text-text-light dark:text-text-dark' />
              <TruncatedText
                value={row.email}
                className='text-sm text-text-secondary-light dark:text-text-secondary-dark'
              />
              {row.location && (
                <TruncatedText
                  value={row.location}
                  className='text-xs text-text-tertiary-light dark:text-text-tertiary-dark'
                />
              )}
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
          <div className='min-w-0 overflow-hidden'>
            <div
              className={`block max-w-full truncate rounded px-2 py-1 text-xs font-medium ${
                departmentBadgeClasses[row.team?.toLocaleLowerCase() ?? ''] ??
                'bg-surface-raised-light text-text-light dark:bg-surface-raised-dark dark:text-text-dark'
              }`}
              title={row.team}
            >
              {row.team}
            </div>
            <TruncatedText
              value={row.role}
              className='mt-1 text-xs text-text-tertiary-light dark:text-text-tertiary-dark'
            />
          </div>
        ),
        allowsSorting: true
      },
      {
        key: 'compensation',
        header: 'Compensation',
        cell: (row: UserData) => (
          <div className='text-right'>
            <div className='font-medium text-success-light dark:text-success'>
              {row.salary ? `€${row.salary.toLocaleString()}` : 'N/A'}
            </div>
            <div className='text-xs text-text-tertiary-light dark:text-text-tertiary-dark'>Annual</div>
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
              <div className='font-medium text-text-light dark:text-text-dark'>
                {years > 0 ? `${years}y ${months}m` : `${months}m`}
              </div>
              <div className='text-xs text-text-tertiary-light dark:text-text-tertiary-dark'>
                {joinDate.toLocaleDateString()}
              </div>
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
          <div className='flex flex-wrap gap-2' role='group' aria-label='Row actions'>
            <button
              className='font-medium text-text-secondary-light transition-colors hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark'
              aria-label={`Edit user ${row.name}`}
              onClick={(e) => {
                e.stopPropagation();
                editUserAction(row.name);
              }}
            >
              Edit
            </button>
            <button
              className='font-medium text-error-light transition-colors hover:text-brand-light-dark dark:text-error dark:hover:text-brand-dark-light'
              aria-label={`Delete user ${row.name}`}
              onClick={(e) => {
                e.stopPropagation();
                deleteUserAction(row.name);
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
        onSortChange={(descriptor) => {
          setSortDescriptor(descriptor);
          sortChangedAction(descriptor);
        }}
        selectionMode='multiple'
        isStriped={true}
        layout='fixed'
        classNames={{
          ...args.classNames,
          th: `${args.classNames?.th ?? ''} overflow-hidden`,
          td: `${args.classNames?.td ?? ''} overflow-hidden`
        }}
      />
    );
  }
};
