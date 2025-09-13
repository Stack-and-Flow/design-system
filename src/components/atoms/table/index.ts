export { default as Table } from './Table';
export type {
  TableProps,
  CompleteTableProps,
  TableColumn as TableColumnType,
  TableEvents,
  SortDescriptor,
  Selection,
  SelectionMode,
  SelectionBehavior
} from './types';
export { useTable } from './useTable';
export { useVirtualization } from './useVirtualization';

// Default export for backward compatibility
import Table from './Table';
export default Table;
