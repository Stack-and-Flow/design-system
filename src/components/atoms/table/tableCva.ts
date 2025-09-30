import { cva } from 'class-variance-authority';

// Estilos minimalistas con dark mode support
export const tableVariants = cva(
  // Base styles - bordes redondeados y responsividad
  'w-full border-collapse overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700',
  {
    variants: {
      variant: {
        default: '',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-gray-50 [&_tbody_tr:nth-child(odd)]:dark:bg-gray-800/50'
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export const tableHeaderVariants = cva(
  // Header estilizado con dark mode
  'bg-gray-50 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-100',
  {
    variants: {
      size: {
        sm: 'px-2 py-1.5',
        md: 'px-3 py-2',
        lg: 'px-4 py-3'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export const tableRowVariants = cva(
  // Row hover effects y dark mode
  'border-b border-gray-200 dark:border-gray-700 transition-colors',
  {
    variants: {
      interactive: {
        true: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
        false: ''
      },
      selected: {
        true: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
        false: ''
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: ''
      }
    },
    defaultVariants: {
      interactive: false,
      selected: false,
      disabled: false
    }
  }
);

export const tableCellVariants = cva(
  // Cell styling básico
  'text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0',
  {
    variants: {
      size: {
        sm: 'px-2 py-1.5',
        md: 'px-3 py-2',
        lg: 'px-4 py-3'
      },
      align: {
        start: 'text-left',
        center: 'text-center',
        end: 'text-right'
      }
    },
    defaultVariants: {
      size: 'md',
      align: 'start'
    }
  }
);

export const loadingOverlayVariants = cva(
  // Loading state overlay
  'absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center backdrop-blur-sm',
  {
    variants: {
      visible: {
        true: 'opacity-100 pointer-events-auto',
        false: 'opacity-0 pointer-events-none'
      }
    },
    defaultVariants: {
      visible: false
    }
  }
);
