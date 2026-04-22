import { cva } from 'class-variance-authority';

// Helper arrays for compound variants
const filledRangeVariants = [
  {
    isInRange: true,
    isRangeStart: false,
    isRangeEnd: false,
    variant: 'filled' as const,
    class: 'bg-primary text-text-dark rounded-none dark:bg-primary dark:text-text-dark'
  },
  {
    isInRange: true,
    isRangeStart: true,
    variant: 'filled' as const,
    class: 'bg-primary text-text-dark rounded-l-full dark:bg-primary dark:text-text-dark'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    variant: 'filled' as const,
    class: 'bg-primary text-text-dark rounded-r-full dark:bg-primary dark:text-text-dark'
  }
];

const filledDisabledRangeVariants = [
  {
    isInRange: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-primary text-text-light dark:bg-primary dark:text-text-dark rounded-none opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeStart: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-primary text-text-light dark:bg-primary dark:text-text-dark rounded-l-full opacity-40 cursor-not-allowed pointer-events-none'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    isDisabled: true,
    variant: 'filled' as const,
    class:
      'bg-primary text-text-light dark:bg-primary dark:text-text-dark rounded-r-full opacity-40 cursor-not-allowed pointer-events-none'
  }
];

const outlinedRangeVariants = [
  {
    isInRange: true,
    isRangeStart: false,
    isRangeEnd: false,
    variant: 'outlined' as const,
    class:
      'bg-red-tint-mid text-text-light border border-border-light rounded-none dark:text-text-dark dark:border-border-dark'
  },
  {
    isInRange: true,
    isRangeStart: true,
    variant: 'outlined' as const,
    class:
      'bg-red-tint-mid text-text-light border-2 border-border-light rounded-l-full dark:text-text-dark dark:border-border-dark'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    variant: 'outlined' as const,
    class:
      'bg-red-tint-mid text-text-light border-2 border-border-light rounded-r-full dark:text-text-dark dark:border-border-dark'
  }
];

const outlinedDisabledRangeVariants = [
  {
    isInRange: true,
    isDisabled: true,
    variant: 'outlined' as const,
    class:
      'bg-red-tint-mid text-text-light border border-border-light rounded-none opacity-40 cursor-not-allowed pointer-events-none dark:text-text-dark dark:border-border-dark'
  },
  {
    isInRange: true,
    isRangeStart: true,
    isDisabled: true,
    variant: 'outlined' as const,
    class:
      'bg-red-tint-mid text-text-light border-2 border-border-light rounded-l-full opacity-40 cursor-not-allowed pointer-events-none dark:text-text-dark dark:border-border-dark'
  },
  {
    isInRange: true,
    isRangeEnd: true,
    isDisabled: true,
    variant: 'outlined' as const,
    class:
      'bg-red-tint-mid text-text-light border-2 border-border-light rounded-r-full opacity-40 cursor-not-allowed pointer-events-none dark:text-text-dark dark:border-border-dark'
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
        true: 'text-text-light dark:text-text-dark',
        false:
          'text-text-tertiary-light bg-transparent cursor-default pointer-events-none dark:text-text-tertiary-dark dark:bg-transparent'
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
        true: 'text-text-tertiary-light bg-transparent cursor-default pointer-events-none dark:text-text-tertiary-dark dark:bg-transparent',
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
          'text-text-tertiary-light !text-text-tertiary-light bg-transparent cursor-default pointer-events-none dark:text-text-tertiary-dark !dark:text-text-tertiary-dark dark:bg-transparent'
      },
      ...filledRangeVariants,
      ...filledDisabledRangeVariants,
      ...outlinedRangeVariants,
      ...outlinedDisabledRangeVariants,
      // Selected variants
      {
        isSelected: true,
        variant: 'outlined' as const,
        class: 'border-2 border-primary bg-transparent rounded-full'
      },
      {
        isSelected: true,
        variant: 'soft' as const,
        class: 'bg-red-tint-low text-primary rounded-full dark:bg-red-tint-mid dark:text-text-dark'
      },
      {
        isSelected: true,
        variant: 'ghost' as const,
        class: 'text-primary font-bold underline rounded-full'
      },
      {
        isSelected: true,
        variant: 'filled' as const,
        class: 'bg-primary text-text-dark rounded-full dark:bg-primary dark:text-text-dark'
      },
      // Today variant
      {
        isToday: true,
        isSelected: false,
        class: 'border-2 border-primary text-text-light dark:text-text-dark'
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
        class: 'hover:bg-surface-raised-light hover:text-text-light'
      },
      // Hover effect for non-selected current-month days in dark theme
      {
        isCurrentMonth: true,
        isSelected: false,
        isInRange: false,
        isDisabled: false,
        theme: 'dark',
        class: 'hover:!bg-surface-raised-light hover:!text-text-light'
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
