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
        true: 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800',
        false: 'text-gray-700 dark:text-gray-300'
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
        true: 'cursor-not-allowed bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
        false: 'cursor-pointer'
      }
    },
    compoundVariants: [
      {
        isSelected: true,
        variant: 'outlined',
        class: 'border-2 border-red-700 text-red-700 bg-transparent rounded-full dark:border-red-400 dark:text-red-400'
      },
      {
        isSelected: true,
        variant: 'soft',
        class: 'bg-red-200 text-red-900 rounded-full dark:bg-red-900 dark:text-red-100'
      },
      {
        isSelected: true,
        variant: 'ghost',
        class: 'text-red-700 font-bold underline rounded-full dark:text-red-300'
      },
      {
        isSelected: true,
        variant: 'filled',
        class: 'bg-red-700 text-white rounded-full dark:bg-red-400 dark:text-gray-900'
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
