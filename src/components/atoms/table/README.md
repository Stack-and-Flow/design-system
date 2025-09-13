# Table Component

A comprehensive, accessible Table component with modern features and excellent performance.

## Features

- ✅ **Row Selection**: Single and multiple selection modes with visual feedback
- ✅ **Column Sorting**: Sortable columns with custom indicators and keyboard support  
- ✅ **Virtualization**: Handle large datasets (10k+ rows) with smooth scrolling
- ✅ **Pagination**: Built-in pagination with configurable page sizes
- ✅ **Accessibility**: Full ARIA support and keyboard navigation
- ✅ **Customization**: Custom cell renderers, styling, and theming
- ✅ **Responsive**: Mobile-friendly design with dark mode support
- ✅ **Performance**: Optimized rendering and state management

## Basic Usage

```tsx
import { Table } from '@/components/atoms/table';

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

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
];

<Table<User>
  items={users}
  columns={columns}
  selectionMode="multiple"
  onSelectionChange={(keys) => console.log('Selected:', keys)}
/>
```

## Advanced Examples

### With Selection and Sorting

```tsx
<Table<User>
  items={users}
  columns={columns}
  selectionMode="multiple"
  showSelectionCheckboxes={true}
  disallowEmptySelection={false}
  sortDescriptor={{ column: 'name', direction: 'ascending' }}
  onSelectionChange={(keys) => handleSelection(keys)}
  onSortChange={(descriptor) => handleSort(descriptor)}
/>
```

### With Virtualization (Large Datasets)

```tsx
<Table<User>
  items={largeUserList} // 10k+ items
  columns={columns}
  isVirtualized={true}
  maxTableHeight={400}
  rowHeight={56}
  selectionMode="single"
/>
```

### With Custom Cell Renderers

```tsx
const customColumns = [
  { 
    key: 'name', 
    header: 'Name',
    cell: (user: User) => (
      <div className="flex items-center gap-2">
        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
        <span className="font-medium">{user.name}</span>
      </div>
    )
  },
  {
    key: 'status',
    header: 'Status', 
    cell: (user: User) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {user.status}
      </span>
    )
  }
];
```

### With Pagination

```tsx
<Table<User>
  items={users}
  columns={columns}
  pagination={true}
  pageSize={20}
  onPageChange={(page) => handlePageChange(page)}
/>
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | `[]` | Array of data items to display |
| `columns` | `TableColumn<T>[]` | `[]` | Column definitions |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Row selection mode |
| `isVirtualized` | `boolean` | `false` | Enable row virtualization |
| `maxTableHeight` | `number` | - | Max height before virtualization kicks in |

### Selection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedKeys` | `Selection` | - | Controlled selection state |
| `defaultSelectedKeys` | `Selection` | - | Default selection for uncontrolled mode |
| `showSelectionCheckboxes` | `boolean` | `false` | Show selection checkboxes |
| `disallowEmptySelection` | `boolean` | `false` | Prevent empty selection |
| `onSelectionChange` | `(keys: Selection) => void` | - | Selection change handler |

### Sorting Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortDescriptor` | `SortDescriptor` | - | Current sort state |
| `onSortChange` | `(descriptor: SortDescriptor) => void` | - | Sort change handler |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `TableColor` | `'default'` | Color theme |
| `isStriped` | `boolean` | `false` | Striped rows |
| `isCompact` | `boolean` | `false` | Compact spacing |
| `hideHeader` | `boolean` | `false` | Hide table header |
| `className` | `string` | - | Additional CSS classes |

## Column Definition

```tsx
interface TableColumn<T> {
  key: React.Key;                    // Unique column identifier
  header?: React.ReactNode;          // Column header content
  cell?: (row: T) => React.ReactNode; // Custom cell renderer
  allowsSorting?: boolean;           // Enable sorting
  width?: string | number;           // Column width
  align?: 'start' | 'center' | 'end'; // Text alignment
}
```

## Selection Types

```tsx
// Select specific rows by key
const selection: Selection = new Set(['1', '2', '3']);

// Select all rows  
const selection: Selection = 'all';

// Empty selection
const selection: Selection = new Set();
```

## Keyboard Navigation

- **Arrow Keys**: Navigate between cells
- **Enter/Space**: Activate selection or sorting
- **Tab**: Move focus to next interactive element
- **Shift + Click**: Range selection (multiple mode)

## Accessibility

The Table component follows WCAG 2.1 AA guidelines:

- Full keyboard navigation support
- Screen reader compatible with ARIA attributes
- Focus management and visual indicators
- High contrast support for text and interactive elements

## Performance Considerations

### Virtualization
- Enable `isVirtualized={true}` for datasets > 100 rows
- Adjust `rowHeight` to match your row design
- Use `overscan` prop to control buffer size

### Selection Performance  
- Use `selectedKeys` with string/number keys for better performance
- Avoid frequent `onSelectionChange` calls in large datasets
- Consider debouncing selection handlers

### Memory Usage
- Virtualization only renders visible rows
- Large datasets don't impact initial render time
- Memory usage stays constant regardless of dataset size

## Browser Support

- Chrome 90+
- Firefox 88+ 
- Safari 14+
- Edge 90+

## Migration from v1

The Table component maintains backward compatibility while providing new modern APIs:

```tsx
// Legacy API (still supported)
<Table
  data={users}
  rowSelection="multiple" 
  selectedRows={selectedUsers}
  onSelectRows={handleSelectRows}
/>

// Modern API (recommended)
<Table
  items={users}
  selectionMode="multiple"
  selectedKeys={selectedKeys} 
  onSelectionChange={handleSelectionChange}
/>
```
