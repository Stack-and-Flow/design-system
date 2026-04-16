import { cva } from 'class-variance-authority';

export const calendarCva = cva(
  'transition-all duration-300 ease-in-out opacity-100 scale-100 animate-fadeIn min-h-[300px]',
  {
    variants: {
      variant: {
        filled: 'bg-[var(--color-background-light)] text-[var(--color-text-light)] shadow-lg dark:bg-[var(--color-surface-dark)] dark:text-[var(--color-text-dark)] dark:shadow-black',
        outlined: 'border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]',
        soft: 'bg-[var(--color-red-tint-low)] dark:bg-[var(--color-red-tint-mid)]',
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
        md: 'rounded-[var(--radius-md)]',
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
