import { cva } from 'class-variance-authority';

export const dayCva = cva(
  'flex items-center justify-center font-medium select-none transition-all duration-150 ease-in-out',
  {
    variants: {
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
      // Range selection styles
      {
        isInRange: true,
        isRangeStart: false,
        isRangeEnd: false,
        variant: 'filled',
        class: 'bg-red-500 text-white rounded-none dark:bg-red-400 dark:text-gray-900'
      },
      {
        isInRange: true,
        isRangeStart: true,
        variant: 'filled',
        class: 'bg-red-700 text-white rounded-l-full dark:bg-red-400 dark:text-gray-900'
      },
      {
        isInRange: true,
        isRangeEnd: true,
        variant: 'filled',
        class: 'bg-red-700 text-white rounded-r-full dark:bg-red-400 dark:text-gray-900'
      },
      // Outlined variant
      {
        isInRange: true,
        isRangeStart: false,
        isRangeEnd: false,
        variant: 'outlined',
        class:
          'bg-red-100 text-red-700 border border-red-500 rounded-none dark:bg-red-900 dark:text-red-100 dark:border-red-400'
      },
      {
        isInRange: true,
        isRangeStart: true,
        variant: 'outlined',
        class:
          'bg-red-200 text-red-900 border-2 border-red-700 rounded-l-full dark:bg-red-900 dark:text-red-100 dark:border-red-400'
      },
      {
        isInRange: true,
        isRangeEnd: true,
        variant: 'outlined',
        class:
          'bg-red-200 text-red-900 border-2 border-red-700 rounded-r-full dark:bg-red-900 dark:text-red-100 dark:border-red-400'
      },
      {
        isSelected: true,
        variant: 'outlined',
        class:
          'border-2 border-red-700 text-red-700 bg-transparent rounded-full dark:border-red-400 dark:text-red-400 hover:border-red-400 hover:text-red-500 dark:hover:border-red-300 dark:hover:text-red-300'
      },
      {
        isSelected: true,
        variant: 'soft',
        class:
          'bg-red-200 text-red-900 rounded-full dark:bg-red-900 dark:text-red-100 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-700 dark:hover:text-red-50'
      },
      {
        isSelected: true,
        variant: 'ghost',
        class:
          'text-red-700 font-bold underline rounded-full dark:text-red-300 hover:text-red-500 dark:hover:text-red-200'
      },
      {
        isSelected: true,
        variant: 'filled',
        class:
          'bg-red-700 text-white rounded-full dark:bg-red-400 dark:text-gray-900 hover:bg-red-500 hover:text-white dark:hover:bg-red-300 dark:hover:text-gray-900'
      },
      {
        isToday: true,
        isSelected: false,
        class: 'border-2 border-red-600 dark:border-red-400'
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
