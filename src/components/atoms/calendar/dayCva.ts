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
        class: 'bg-red-400 text-gray-900 rounded-none'
      },
      {
        isInRange: true,
        isRangeStart: true,
        variant: 'filled',
        class: 'bg-red-400 text-gray-900 rounded-l-full'
      },
      {
        isInRange: true,
        isRangeEnd: true,
        variant: 'filled',
        class: 'bg-red-400 text-gray-900 rounded-r-full'
      },
      // Disabled days in range (filled)
      {
        isInRange: true,
        isDisabled: true,
        variant: 'filled',
        class: 'bg-red-400 text-gray-900 rounded-none opacity-40 cursor-not-allowed pointer-events-none'
      },
      {
        isInRange: true,
        isRangeStart: true,
        isDisabled: true,
        variant: 'filled',
        class: 'bg-red-400 text-gray-900 rounded-l-full opacity-40 cursor-not-allowed pointer-events-none'
      },
      {
        isInRange: true,
        isRangeEnd: true,
        isDisabled: true,
        variant: 'filled',
        class: 'bg-red-400 text-gray-900 rounded-r-full opacity-40 cursor-not-allowed pointer-events-none'
      },
      // Outlined variant
      {
        isInRange: true,
        isRangeStart: false,
        isRangeEnd: false,
        variant: 'outlined',
        class: 'bg-red-900 text-red-100 border border-red-400 rounded-none'
      },
      {
        isInRange: true,
        isRangeStart: true,
        variant: 'outlined',
        class: 'bg-red-900 text-red-100 border-2 border-red-400 rounded-l-full'
      },
      {
        isInRange: true,
        isRangeEnd: true,
        variant: 'outlined',
        class: 'bg-red-900 text-red-100 border-2 border-red-400 rounded-r-full'
      },
      // Disabled days in range (outlined)
      {
        isInRange: true,
        isDisabled: true,
        variant: 'outlined',
        class:
          'bg-red-900 text-red-100 border border-red-400 rounded-none opacity-40 cursor-not-allowed pointer-events-none'
      },
      {
        isInRange: true,
        isRangeStart: true,
        isDisabled: true,
        variant: 'outlined',
        class:
          'bg-red-900 text-red-100 border-2 border-red-400 rounded-l-full opacity-40 cursor-not-allowed pointer-events-none'
      },
      {
        isInRange: true,
        isRangeEnd: true,
        isDisabled: true,
        variant: 'outlined',
        class:
          'bg-red-900 text-red-100 border-2 border-red-400 rounded-r-full opacity-40 cursor-not-allowed pointer-events-none'
      },
      {
        isSelected: true,
        variant: 'outlined',
        class:
          'border-2 border-red-400 text-red-400 bg-transparent rounded-full hover:border-red-300 hover:text-red-300'
      },
      {
        isSelected: true,
        variant: 'soft',
        class: 'bg-red-900 text-red-100 rounded-full hover:bg-red-700 hover:text-red-50'
      },
      {
        isSelected: true,
        variant: 'ghost',
        class: 'text-red-300 font-bold underline rounded-full hover:text-red-200'
      },
      {
        isSelected: true,
        variant: 'filled',
        class: 'bg-red-400 text-gray-900 rounded-full hover:bg-red-300 hover:text-gray-900'
      },
      {
        isToday: true,
        isSelected: false,
        class: 'border-2 border-red-400'
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
