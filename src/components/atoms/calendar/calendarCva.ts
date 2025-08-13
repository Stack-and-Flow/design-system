import { cva } from 'class-variance-authority';

export const calendarCva = cva(
  'font-inter transition-all duration-300 ease-in-out opacity-100 scale-100 animate-fadeIn min-h-[300px]',
  {
    variants: {
      variant: {
        filled: 'bg-white text-gray-900 shadow-lg dark:bg-gray-900 dark:text-gray-100 dark:shadow-black',
        outlined: 'border border-gray-500 dark:border-gray-600',
        soft: 'bg-red-100 dark:bg-red-900',
        ghost: 'bg-transparent'
      },
      size: {
        sm: 'p-2 w-64',
        md: 'p-4 w-80',
        lg: 'p-6 w-96'
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-2xl'
      },
      theme: {
        light: '',
        dark: ''
      },
      show: {
        true: 'opacity-100 scale-100',
        false: 'hidden opacity-0 scale-95'
      },
      disabled: {
        true: 'pointer-events-none opacity-60 relative after:absolute after:inset-0 after:bg-black/60 after:rounded-inherit after:pointer-events-none',
        false: ''
      },
      readOnly: {
        true: 'select-none',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      radius: 'md',
      theme: 'light',
      show: true,
      disabled: false,
      readOnly: false
    }
  }
);
