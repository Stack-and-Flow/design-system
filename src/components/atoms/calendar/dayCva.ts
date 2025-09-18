import { cva } from 'class-variance-authority';
// Helper arrays for compound variants
const filledRangeVariants = [
  {
    isInRange: true,
    isRangeStart: false,
    isRangeEnd: false,
    variant: 'filled' as const,
    class: 'bg-red-600 text-white rounded-none dark:bg-red-600 dark:text-white'
  },
  {
    isInRange: true,
    isRangeStart: true,
    variant: 'filled' as const,
    class: 'bg-red-600 text-white rounded-l-full dark:bg-red-600 dark:text-white'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    variant: 'filled' as const,
    class: 'bg-red-600 text-white rounded-r-full dark:bg-red-600 dark:text-white'
  }
];

const filledDisabledRangeVariants = [
  {
    isInRange: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-red-600 text-gray-900 dark:bg-red-600 dark:text-gray-100 rounded-none opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeStart: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-red-600 text-gray-900 dark:bg-red-600 dark:text-gray-100 rounded-l-full opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-red-600 text-gray-900 dark:bg-red-600 dark:text-gray-100 rounded-r-full opacity-40 cursor-not-allowed pointer-events-none'
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
        true: 'text-gray-900 dark:text-gray-100',
        false: 'text-gray-400 bg-transparent cursor-default pointer-events-none dark:text-gray-500 dark:bg-transparent'
      },
      isSelected: {
        true: '',
        false: ''
      },
      variant: {
        outlined: '',
        soft: '',
        ghost: '',
        filled: ''
      },
      isToday: {
        true: '',
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
      },
      theme: {
        light: '',
        dark: ''
      }
    },
    compoundVariants: [
      // Disabled days of current month should always look like out-of-month days (highest priority)
      {
        isCurrentMonth: true,
        isDisabled: true,
        class:
          'text-gray-400 !text-gray-400 bg-transparent cursor-default pointer-events-none dark:text-gray-500 !dark:text-gray-500 dark:bg-transparent'
      },
      ...filledRangeVariants,
      ...filledDisabledRangeVariants,
      ...outlinedRangeVariants,
      ...outlinedDisabledRangeVariants,
      // Selected variants
      {
        isSelected: true,
        variant: 'outlined' as const,
        class: 'border-2 border-red-400 bg-transparent rounded-full'
      },
      {
        isSelected: true,
        variant: 'soft' as const,
        class: 'bg-red-100 text-red-700 rounded-full dark:bg-red-700 dark:text-white'
      },
      {
        isSelected: true,
        variant: 'ghost' as const,
        class: 'text-red-300 font-bold underline rounded-full'
      },
      {
        isSelected: true,
        variant: 'filled' as const,
        class: 'bg-red-600 text-white rounded-full dark:bg-red-600 dark:text-white'
      },
      // Today variant
      {
        isToday: true,
        isSelected: false,
        class: 'border-2 border-red-400 text-gray-900 dark:text-gray-100'
      },
      // Override rounded for range start and end when selected - to fix overriding of rounded-full
      {
        isSelected: true,
        isRangeStart: true,
        isRangeEnd: false,
        class: 'rounded-l-full !rounded-r-none'
      },
      {
        isSelected: true,
        isRangeStart: false,
        isRangeEnd: true,
        class: 'rounded-r-full !rounded-l-none'
      },
      {
        isSelected: true,
        isRangeStart: true,
        isRangeEnd: true,
        class: 'rounded-full'
      },
      // Prevent hover on selected or range days
      {
        isSelected: true,
        class: '!hover:bg-transparent !hover:text-inherit'
      },
      {
        isInRange: true,
        class: '!hover:bg-transparent !hover:text-inherit'
      },
      // Hover effect for non-selected current-month days in light theme
      {
        isCurrentMonth: true,
        isSelected: false,
        isInRange: false,
        isDisabled: false,
        theme: 'light',
        class: 'hover:bg-gray-300 hover:text-gray-900'
      },
      // Hover effect for non-selected current-month days in dark theme
      {
        isCurrentMonth: true,
        isSelected: false,
        isInRange: false,
        isDisabled: false,
        theme: 'dark',
        class: 'hover:!bg-gray-100 hover:!text-gray-900'
      }
    ],
    defaultVariants: {
      size: 'md',
      isCurrentMonth: true,
      isSelected: false,
      variant: 'filled',
      isToday: false,
      isDisabled: false,
      theme: 'light'
    }
  }
);
