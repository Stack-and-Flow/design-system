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
 * Generates large datasets asynchronously to prevent UI blocking.
 * Uses chunked processing to maintain responsive user interface.
 */
const generateUsersAsync = async (count: number, chunkSize: number = 1000): Promise<UserData[]> => {
  const roles = ['Admin', 'User', 'Editor', 'Manager'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  const teams = ['Engineering', 'Design', 'Marketing', 'Sales'];

  const users: UserData[] = [];

  for (let i = 0; i < count; i += chunkSize) {
    const chunk = Math.min(chunkSize, count - i);
    const chunkData = Array.from({ length: chunk }, (_, j) => {
      const index = i + j;
      const nameIndex = index % SAMPLE_NAMES.length;
      const userName = SAMPLE_NAMES[nameIndex];
      const firstName = userName.split(' ')[0].toLowerCase();
      const lastName = userName.split(' ')[1]?.toLowerCase() || 'user';

      return {
        id: index + 1,
        name: userName,
        email: `${firstName}.${lastName}@${SAMPLE_COMPANIES[index % SAMPLE_COMPANIES.length].toLowerCase().replace(/\s+/g, '')}.com`,
        role: roles[index % roles.length],
        status: statuses[index % statuses.length],
        team: teams[index % teams.length],
        avatar: getAvatarForUser(userName, index)
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

/**
 * Pre-generated sample datasets for consistent story demonstrations
 */
const sampleData: UserData[] = generateUsers(12);
const mediumData: UserData[] = generateUsers(500); // For virtualization testing
interface ProductData {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  brand: string;
  rating: number;
  lastUpdated: string;
}

const PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
const PRODUCT_BRANDS = ['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'Canon', 'HP'];
const PRODUCT_NAMES = [
  'Smartphone Pro Max',
  'Wireless Headphones',
  'Gaming Laptop',
  'Smart Watch',
  'Tablet Ultra',
  'Bluetooth Speaker',
  'Digital Camera',
  'Fitness Tracker',
  'Power Bank',
  'USB-C Cable',
  'Wireless Charger',
  'Gaming Mouse',
  'Mechanical Keyboard',
  'Monitor 4K',
  'External SSD'
];

/**
 * Generates realistic product data for e-commerce demonstrations
 */
const generateProducts = (count: number): ProductData[] => {
  return Array.from({ length: count }, (_, i) => {
    const stock = Math.floor(Math.random() * 200);
    const getStatus = (stock: number): ProductData['status'] => {
      if (stock === 0) {
        return 'Out of Stock';
      }
      if (stock < 20) {
        return 'Low Stock';
      }
      return 'In Stock';
    };

    return {
      id: i + 1,
      name: `${PRODUCT_BRANDS[i % PRODUCT_BRANDS.length]} ${PRODUCT_NAMES[i % PRODUCT_NAMES.length]}`,
      category: PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length],
      price: Math.floor(Math.random() * 2000) + 50,
      stock: stock,
      status: getStatus(stock),
      brand: PRODUCT_BRANDS[i % PRODUCT_BRANDS.length],
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
    };
  });
};

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

// Filterable columns
const filterableColumns: TableColumn<UserData>[] = [
  { key: 'id', header: 'ID', cell: (row: UserData) => row.id },
  { key: 'name', header: 'Name', cell: (row: UserData) => row.name, filterable: true },
  { key: 'email', header: 'Email', cell: (row: UserData) => row.email, filterable: true },
  { key: 'role', header: 'Role', cell: (row: UserData) => row.role, filterable: true },
  { key: 'status', header: 'Status', cell: (row: UserData) => row.status, filterable: true }
];

// Custom cell columns with avatar and extended user info
const customCellColumns: TableColumn<UserData>[] = [
  {
    key: 'user',
    header: 'User',
    cell: (row: UserData) => (
      <div className='flex items-center gap-3'>
        <img src={row.avatar} alt={row.name} className='w-8 h-8 rounded-full' />
        <div>
          <div className='font-medium text-text-dark'>{row.name}</div>
          <div className='text-sm text-gray-dark-300'>{row.email}</div>
        </div>
      </div>
    ),
    allowsSorting: true,
    sortValue: (row: UserData) => row.name
  },
  {
    key: 'team',
    header: 'Team',
    cell: (row: UserData) => <span className='px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs'>{row.team}</span>,
    allowsSorting: true
  },
  {
    key: 'role',
    header: 'Role',
    cell: (row: UserData) => row.role,
    allowsSorting: true
  },
  {
    key: 'location',
    header: 'Location',
    cell: (row: UserData) => row.location || 'N/A',
    allowsSorting: true
  },
  {
    key: 'joinDate',
    header: 'Join Date',
    cell: (row: UserData) => (row.joinDate ? new Date(row.joinDate).toLocaleDateString() : 'N/A'),
    allowsSorting: true,
    sortValue: (row: UserData) => row.joinDate || ''
  },
  {
    key: 'salary',
    header: 'Salary',
    cell: (row: UserData) => (row.salary ? `€${row.salary.toLocaleString()}` : 'N/A'),
    allowsSorting: true,
    sortValue: (row: UserData) => row.salary || 0
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
    cell: (_row: UserData) => (
      <div className='flex gap-2' role='group' aria-label='Row actions'>
        <button
          className='text-gray-dark-200 hover:text-gray-dark-100 font-medium transition-colors'
          aria-label={`Edit user ${_row.name}`}
        >
          Edit
        </button>
        <button
          className='text-red-300 hover:text-red-200 font-medium transition-colors'
          aria-label={`Delete user ${_row.name}`}
        >
          Delete
        </button>
      </div>
    )
  }
];

/**
 * ProductStatusBadge component optimized for WCAG 2.1 AA accessibility compliance.
 * Provides distinct visual indicators for different stock status levels with high contrast colors.
 */
const ProductStatusBadge = ({ status }: { status: ProductData['status'] }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center min-w-[70px] ${
      status === 'In Stock'
        ? 'bg-green-900 text-green-50 border border-green-800 dark:bg-green-950 dark:text-green-50 dark:border-green-900'
        : status === 'Low Stock'
          ? 'bg-yellow-900 text-white border border-yellow-800 dark:bg-yellow-950 dark:text-white dark:border-yellow-900'
          : 'bg-red-900 text-red-50 border border-red-800 dark:bg-red-950 dark:text-red-50 dark:border-red-900'
    }`}
    role='status'
    aria-label={`Stock status: ${status}`}
  >
    {status}
  </span>
);

const productColumns: TableColumn<ProductData>[] = [
  {
    key: 'name',
    header: 'Product Name',
    cell: (row: ProductData) => (
      <div>
        <div className='font-medium text-text-dark'>{row.name}</div>
        <div className='text-sm text-gray-dark-300'>{row.brand}</div>
      </div>
    ),
    allowsSorting: true,
    sortValue: (row: ProductData) => row.name,
    filterable: true
  },
  {
    key: 'category',
    header: 'Category',
    cell: (row: ProductData) => (
      <span className='px-2 py-1 bg-purple-900 text-purple-200 rounded text-xs'>{row.category}</span>
    ),
    allowsSorting: true,
    filterable: true
  },
  {
    key: 'price',
    header: 'Price',
    cell: (row: ProductData) => `€${row.price.toLocaleString()}`,
    allowsSorting: true,
    sortValue: (row: ProductData) => row.price
  },
  {
    key: 'stock',
    header: 'Stock',
    cell: (row: ProductData) => (
      <div className='text-center'>
        <div className='font-medium'>{row.stock}</div>
        <div className='text-xs text-gray-dark-300'>units</div>
      </div>
    ),
    allowsSorting: true,
    sortValue: (row: ProductData) => row.stock
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row: ProductData) => <ProductStatusBadge status={row.status} />,
    sortValue: (row: ProductData) => row.status,
    allowsSorting: true,
    filterable: true
  },
  {
    key: 'rating',
    header: 'Rating',
    cell: (row: ProductData) => (
      <div className='flex items-center gap-1'>
        <span className='font-medium'>{row.rating}</span>
        <span className='text-xs text-gray-dark-300'>/ 5 stars</span>
      </div>
    ),
    allowsSorting: true,
    sortValue: (row: ProductData) => row.rating
  },
  {
    key: 'lastUpdated',
    header: 'Last Updated',
    cell: (row: ProductData) => new Date(row.lastUpdated).toLocaleDateString(),
    allowsSorting: true,
    sortValue: (row: ProductData) => row.lastUpdated
  }
];

/**
 * ## DESCRIPTION
 * A comprehensive, accessible Table component that supports advanced features like row selection,
 * sorting, virtualization, pagination, and keyboard navigation. Designed for handling both small
 * and large datasets with optimal performance and full accessibility compliance.
 *
 * ## DEPENDENCIES
 * - React Aria: For accessibility features and keyboard navigation
 * - Tailwind CSS: For styling and theming
 * - React Virtualized: For handling large datasets efficiently
 *
 * ## FEATURES
 * - ✅ **Row Selection**: Single and multiple selection modes with visual feedback
 * - ✅ **Column Sorting**: Sortable columns with custom indicators and keyboard support
 * - ✅ **Virtualization**: Handle large datasets (10k+ rows) with smooth scrolling
 * - ✅ **Pagination**: Built-in pagination with configurable page sizes
 * - ✅ **Accessibility**: Full ARIA support and keyboard navigation
 * - ✅ **Customization**: Custom cell renderers, styling, and theming
 * - ✅ **Responsive**: Mobile-friendly design with dark mode support
 * - ✅ **Performance**: Optimized rendering and state management
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
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Enable row selection behavior'
    },
    selectionBehavior: {
      control: 'select',
      options: ['toggle', 'replace'],
      description: 'How selection should behave when clicking rows'
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Color theme for the table'
    },
    isStriped: {
      control: 'boolean',
      description: 'Add alternating row background colors'
    },
    isCompact: {
      control: 'boolean',
      description: 'Reduce padding for denser layout'
    },
    hideHeader: {
      control: 'boolean',
      description: 'Hide the table header row'
    },
    removeWrapper: {
      control: 'boolean',
      description: 'Remove the default table wrapper container'
    }
  }
};

export default meta;
type Story = StoryObj<CompleteTableProps<UserData>>;

/**
 * Default table implementation with realistic Spanish user data.
 * Includes essential columns and clean presentation.
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
 * A table populated with dynamic data using the `items` prop.
 * This is the recommended pattern for most use cases.
 */
export const Dynamic: Story = {
  render: (args) => {
    const dynamicData = generateUsers(12);
    return <Table {...args} items={dynamicData} columns={basicColumns} />;
  }
};

/**
 * Table with no data showing custom empty state content.
 * Demonstrates how to provide meaningful feedback when there are no items to display.
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
 * Table without header row for simplified layouts.
 * Useful when the column context is clear from surrounding UI elements.
 */
export const WithoutHeader: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    hideHeader: true
  }
};

/**
 * Table without the default wrapper container.
 * Provides more control over the table's container styling and layout.
 */
export const WithoutWrapper: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    removeWrapper: true
  }
};

/**
 * Table with custom cell renderers including avatars, badges, formatted data, and action buttons.
 * Demonstrates how to create rich, interactive table content with complex cell layouts.
 */
export const CustomCells: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: customCellColumns
  }
};

/**
 * Table with alternating row colors for improved readability.
 * The striped pattern helps users visually track data across rows.
 */
export const StripedRows: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    isStriped: true
  }
};

/**
 * Table with reduced padding and spacing for dense data presentation.
 * Ideal for displaying more information in limited screen space.
 */
export const Compact: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    isCompact: true
  }
};

/**
 * Table with single row selection enabled. Users can select one row at a time using radio buttons.
 * Check the browser console to see selection events.
 */
export const SingleRowSelection: Story = {
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

/**
 * Table with multiple row selection enabled. Users can select multiple rows using checkboxes.
 * The header checkbox allows selecting/deselecting all rows. Check the browser console to see selection events.
 */
export const MultipleRowSelection: Story = {
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

/**
 * Table that requires at least one row to always be selected.
 * Useful for scenarios where a selection is mandatory for the interface to function properly.
 */
export const DisallowEmptySelection: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    selectionMode: 'single',
    disallowEmptySelection: true,
    defaultSelectedKeys: new Set(['1'])
  }
};

/**
 * Table with externally controlled selection state.
 * Demonstrates how to manage selection state in the parent component and provide selection controls.
 */
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
        <div className='mb-4 p-4 bg-background-dark rounded'>
          <p className='text-text-dark'>Selected IDs: {Array.from(selectedKeys).join(', ')}</p>
          <button
            onClick={() => setSelectedKeys(new Set())}
            className='mt-2 px-4 py-2 bg-gray-dark-600 text-text-dark rounded hover:bg-gray-dark-500 transition-colors'
          >
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

/**
 * Table with specific rows disabled from selection and interaction.
 * Disabled rows are visually distinct and cannot be selected by users.
 */
export const DisabledRows: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    selectionMode: 'multiple',
    disabledKeys: new Set(['2', '4', '6'])
  }
};

/**
 * Table with clickable rows that trigger custom actions.
 * Demonstrates how to handle row click events for navigation or other interactions.
 */
export const RowActions: Story = {
  args: {
    items: sampleData.slice(0, 5),
    columns: basicColumns,
    onRowAction: (key) => {
      alert(`Row action triggered for key: ${key}`);
    }
  }
};

/**
 * Table with sortable columns. Click column headers to sort data in ascending or descending order.
 * Supports custom sort indicators and keyboard navigation.
 */
export const SortingRows: Story = {
  args: {
    items: sampleData,
    columns: sortableColumns
  }
};

/**
 * Table with column filtering capabilities.
 * Users can filter data by typing in the filter inputs for enabled columns.
 */
export const WithFiltering: Story = {
  args: {
    items: sampleData,
    columns: filterableColumns
  }
};

/**
 * Table displaying loading state with skeleton placeholders.
 * Provides visual feedback while data is being fetched from an API or processed.
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
 * Splits large datasets into manageable pages with navigation controls.
 */
export const PaginatedTable: Story = {
  args: {
    items: sampleData,
    columns: basicColumns,
    pagination: true,
    pageSize: 5
  }
};

/**
 * Table with custom header and footer content areas.
 * Useful for adding titles, action buttons, summary information, or other contextual elements.
 */
export const WithTopBottomContent: Story = {
  args: {
    items: sampleData.slice(0, 8),
    columns: basicColumns,
    topContent: (
      <div className='flex justify-between items-center p-4 bg-gray-light-200 dark:bg-gray-dark-600'>
        <h3 className='text-lg font-semibold text-gray-dark-900 dark:text-gray-light-100'>Users Management</h3>
        <div className='flex gap-2'>
          <button className='px-3 py-1 text-sm bg-red-700 text-white border border-red-700 hover:bg-red-800 transition-colors rounded'>
            Add User
          </button>
          <button className='px-3 py-1 text-sm bg-gray-dark-600 text-gray-light-100 rounded hover:bg-gray-dark-500 transition-colors'>
            Export
          </button>
        </div>
      </div>
    ),
    bottomContent: (
      <div className='text-center text-sm text-gray-dark-700 dark:text-gray-light-300 p-4 bg-gray-light-200 dark:bg-gray-dark-600'>
        Showing 8 of 12 users
      </div>
    )
  }
};

/**
 * Table with a sticky header that remains visible while scrolling through data.
 * Essential for long tables where column context needs to remain visible.
 */
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

/**
 * Table with virtualization enabled for handling medium to large datasets efficiently.
 * Only visible rows are rendered, providing smooth scrolling performance even with thousands of rows.
 */
export const VirtualizedTable: Story = {
  args: {
    items: mediumData, // Usando mediumData para evitar bloqueos
    columns: basicColumns,
    isVirtualized: true,
    maxTableHeight: 400
  }
};

/**
 * Table demonstrating asynchronous data loading with progress indicators.
 * Shows how to handle large datasets with incremental loading and user feedback.
 */
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
        <div className='p-8 text-center bg-background-dark text-text-dark'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-text-dark'>Generando datos de ejemplo...</p>
          <div className='w-full bg-gray-dark-600 rounded-full h-2 mt-2'>
            <div
              className='bg-primary h-2 rounded-full transition-all duration-300'
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className='text-sm text-gray-dark-300 mt-2'>{Math.round(loadingProgress)}% completado</p>
        </div>
      );
    }

    return (
      <div>
        {loading && (
          <div className='mb-4 p-3 bg-gray-dark-800 border border-gray-dark-600 rounded text-text-dark'>
            <div className='flex items-center gap-2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
              <span className='text-sm text-gray-dark-200'>Cargando datos... {data.length} elementos cargados</span>
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
              <h3 className='text-lg font-semibold text-text-dark'>Tabla con Carga Asíncrona</h3>
              <span className='text-sm text-gray-dark-300'>
                {data.length} elementos {loading ? '(cargando...)' : '(completo)'}
              </span>
            </div>
          }
        />
      </div>
    );
  }
};

/**
 * Interactive performance testing table with configurable dataset sizes.
 * Allows testing table performance with different amounts of data and virtualization settings.
 */
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
        <div className='mb-6 p-4 bg-background-dark rounded-lg'>
          <h3 className='text-lg font-semibold mb-3 text-text-dark'>Control de Tamaño de Tabla</h3>
          <div className='flex flex-wrap gap-2 mb-4'>
            {[50, 100, 200, 500, 1000, 2000].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                disabled={isGenerating}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  itemCount === size
                    ? 'bg-primary text-white'
                    : 'bg-background-dark border border-gray-dark-600 hover:bg-gray-dark-800 text-text-dark'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {size} elementos
              </button>
            ))}
          </div>
          {isGenerating && (
            <div className='flex items-center gap-2 text-sm text-gray-dark-300'>
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
              <h3 className='text-lg font-semibold text-text-dark'>Tabla Configurable</h3>
              <span className='text-sm text-gray-dark-300'>
                {data.length} elementos {itemCount > 100 ? '(virtualizada)' : ''}
              </span>
            </div>
          }
        />
      </div>
    );
  }
};

/**
 * Complete table showcase with realistic Spanish employee data, controlled selection and sorting.
 * Features rich cell formatting including avatars, badges, tenure calculations, and salary information.
 * This is the most comprehensive example demonstrating all table capabilities in a real-world context.
 */
export const RichUserData: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(new Set());
    const [sortDescriptor, setSortDescriptor] = React.useState<any>(null);
    const richData = generateUsers(25);

    const handleSelectionChange = (keys: any) => {
      if (keys === 'all') {
        setSelectedKeys(new Set(richData.map((item) => item.id.toString())));
      } else {
        setSelectedKeys(keys);
      }
    };

    // Enhanced columns with rich formatting like RealWorldSimulation had
    const enhancedColumns = [
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
        sortValue: (row: UserData) => row.name,
        filterable: true
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
        allowsSorting: true,
        filterable: true
      },
      {
        key: 'compensation',
        header: 'Compensation',
        cell: (row: UserData) => (
          <div>
            <div className='font-medium text-text-dark'>€{row.salary?.toLocaleString()}</div>
            <div className='text-xs text-gray-dark-300'>Annual</div>
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
        allowsSorting: true,
        filterable: true
      }
    ];

    return (
      <Table
        {...args}
        items={richData}
        columns={enhancedColumns}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectionMode='multiple'
        isStriped={true}
        color='primary'
        topContent={
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-text-dark'>Employee Management System</h3>
            <div className='text-sm text-gray-dark-300'>
              {selectedKeys.size} of {richData.length} selected
            </div>
          </div>
        }
      />
    );
  }
};

/**
 * Product catalog table demonstrating e-commerce data with pricing, stock levels, ratings, and status indicators.
 * Perfect for inventory management systems and product browsing interfaces.
 */
type ProductStory = StoryObj<CompleteTableProps<ProductData>>;
export const ProductCatalog: ProductStory = {
  render: (args) => {
    const products = generateProducts(15);
    return <Table {...args} items={products} columns={productColumns} selectionMode='multiple' isStriped={true} />;
  }
};

/**
 * Showcase of all available color themes for the table.
 * Each color variant affects the text color and visual styling throughout the table content.
 */
export const ColorVariants: Story = {
  render: () => (
    <div className='space-y-8' style={{ backgroundColor: 'var(--color-background-dark)' }}>
      <div className='p-4 rounded-lg' style={{ backgroundColor: 'var(--color-background-dark)' }}>
        <h3 className='text-lg font-semibold mb-2 text-text-dark'>Default Color</h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='default' />
      </div>
      <div className='p-4 rounded-lg' style={{ backgroundColor: 'var(--color-background-dark)' }}>
        <h3 className='text-lg font-semibold mb-2' style={{ color: 'var(--color-red-200)' }}>
          Primary Color
        </h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='primary' />
      </div>
      <div className='p-4 rounded-lg' style={{ backgroundColor: 'var(--color-background-dark)' }}>
        <h3 className='text-lg font-semibold mb-2' style={{ color: 'var(--color-red-300)' }}>
          Secondary Color
        </h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='secondary' />
      </div>
      <div className='p-4 rounded-lg' style={{ backgroundColor: 'var(--color-background-dark)' }}>
        <h3 className='text-lg font-semibold mb-2' style={{ color: '#4ade80' }}>
          Success Color
        </h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='success' />
      </div>
      <div className='p-4 rounded-lg' style={{ backgroundColor: 'var(--color-background-dark)' }}>
        <h3 className='text-lg font-semibold mb-2' style={{ color: '#fbbf24' }}>
          Warning Color
        </h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='warning' />
      </div>
      <div className='p-4 rounded-lg' style={{ backgroundColor: 'var(--color-background-dark)' }}>
        <h3 className='text-lg font-semibold mb-2' style={{ color: '#f87171' }}>
          Danger Color
        </h3>
        <Table items={sampleData.slice(0, 3)} columns={basicColumns} color='danger' />
      </div>
    </div>
  )
};
