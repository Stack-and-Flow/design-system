import { cva } from 'class-variance-authority';

export const calendarCva = cva(
  'transition-all duration-300 ease-in-out opacity-100 scale-100 animate-fadeIn min-h-[300px]',
  {
    variants: {
      variant: {
        filled: 'bg-background-light text-text-light shadow-lg dark:bg-surface-dark dark:text-text-dark dark:shadow-black',
        outlined: 'border border-border-light dark:border-border-dark',
        soft: 'bg-red-tint-low dark:bg-red-tint-mid',
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
        md: 'rounded-md',
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
        true: 'pointer-events-none',
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
