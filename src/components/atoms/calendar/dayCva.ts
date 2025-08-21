import { cva } from 'class-variance-authority';
// Helper arrays for compound variants
const filledRangeVariants = [
  {
    isInRange: true,
    isRangeStart: false,
    isRangeEnd: false,
    variant: 'filled' as const,
    class:
      'bg-secondary text-white rounded-none hover:bg-red-400 hover:text-white dark:bg-accent dark:text-gray-100 dark:hover:bg-red-400 dark:hover:text-white'
  },
  {
    isInRange: true,
    isRangeStart: true,
    variant: 'filled' as const,
    class:
      'bg-secondary text-white rounded-l-full hover:bg-red-400 hover:text-white dark:bg-accent dark:text-gray-100 dark:hover:bg-red-400 dark:hover:text-white'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    variant: 'filled' as const,
    class:
      'bg-secondary text-white rounded-r-full hover:bg-red-400 hover:text-white dark:bg-accent dark:text-gray-100 dark:hover:bg-red-400 dark:hover:text-white'
  }
];

const filledDisabledRangeVariants = [
  {
    isInRange: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-secondary text-gray-900 dark:bg-accent dark:text-gray-100 rounded-none opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeStart: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-secondary text-gray-900 dark:bg-accent dark:text-gray-100 rounded-l-full opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-secondary text-gray-900 dark:bg-accent dark:text-gray-100 rounded-r-full opacity-40 cursor-not-allowed pointer-events-none'
  }
];

const outlinedRangeVariants = [
  {
    isInRange: true,
    isRangeStart: false,
    isRangeEnd: false,
    variant: 'outlined' as const,
    class: 'bg-red-900 text-red-100 border border-red-400 rounded-none'
  },
  {
    isInRange: true,
    isRangeStart: true,
    variant: 'outlined' as const,
    class: 'bg-red-900 text-red-100 border-2 border-red-400 rounded-l-full'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    variant: 'outlined' as const,
    class: 'bg-red-900 text-red-100 border-2 border-red-400 rounded-r-full'
  }
];

const outlinedDisabledRangeVariants = [
  {
    isInRange: true,
    isDisabled: true,
    variant: 'outlined' as const,
    class:
      'bg-red-900 text-red-100 border border-red-400 rounded-none opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeStart: true,
    isDisabled: true,
    variant: 'outlined' as const,
    class:
      'bg-red-900 text-red-100 border-2 border-red-400 rounded-l-full opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    isDisabled: true,
    variant: 'outlined' as const,
    class:
      'bg-red-900 text-red-100 border-2 border-red-400 rounded-r-full opacity-40 cursor-not-allowed pointer-events-none'
  }
];

export const dayCva = cva(
  'flex items-center justify-center font-medium select-none transition-all duration-150 ease-in-out',
  {
    variants: {
      readOnly: {
        true: '', // No visual styles, only interaction is removed in the component
        false: ''
      },
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
      },
      isCurrentMonth: {
        true: 'text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100',
        false: 'text-gray-400 bg-transparent cursor-default pointer-events-none dark:text-gray-500 dark:bg-transparent'
      },
      isSelected: {
        true: '', // handled below
        false: ''
      },
      variant: {
        outlined: '', // handled below
        soft: '',
        ghost: '',
        filled: ''
      },
      isToday: {
        true: '', // handled below
        false: ''
      },
      isDisabled: {
        true: 'text-gray-400 bg-transparent cursor-default pointer-events-none dark:text-gray-500 dark:bg-transparent',
        false: 'cursor-pointer'
      },
      isInRange: {
        true: '',
        false: ''
      },
      isRangeStart: {
        true: '',
        false: ''
      },
      isRangeEnd: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      // Disabled days of current month should look like out-of-month days in light theme
      {
        isCurrentMonth: true,
        isDisabled: true,
        readOnly: false,
        class: 'text-gray-400 bg-transparent cursor-default pointer-events-none dark:text-gray-500 dark:bg-transparent'
      },
      ...filledRangeVariants,
      ...filledDisabledRangeVariants,
      ...outlinedRangeVariants,
      ...outlinedDisabledRangeVariants,
      // Selected variants
      {
        isSelected: true,
        variant: 'outlined' as const,
        class: 'border-2 border-red-400 bg-transparent rounded-full hover:border-red-300'
      },
      {
        isSelected: true,
        variant: 'soft' as const,
        class:
          'bg-red-100 text-red-700 rounded-full hover:bg-red-400 hover:text-white dark:bg-red-700 dark:text-white dark:hover:bg-red-400 dark:hover:text-white'
      },
      {
        isSelected: true,
        variant: 'ghost' as const,
        class:
          'text-red-300 font-bold underline rounded-full hover:bg-red-400 hover:text-white dark:hover:bg-red-400 dark:hover:text-white'
      },
      {
        isSelected: true,
        variant: 'filled' as const,
        class:
          'bg-red-600 text-white rounded-full hover:bg-red-400 hover:text-white dark:bg-red-600 dark:text-white dark:hover:bg-red-400 dark:hover:text-white'
      },
      // Today variant
      {
        isToday: true,
        isSelected: false,
        class: 'border-2 border-red-400 text-gray-900 dark:text-gray-100'
      }
    ],
    defaultVariants: {
      size: 'md',
      isCurrentMonth: true,
      isSelected: false,
      variant: 'filled',
      isToday: false,
      isDisabled: false
    }
  }
);
