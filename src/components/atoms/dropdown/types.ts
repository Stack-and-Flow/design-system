import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const dropdownContentVariants = cva(
  [
    'min-w-40 rounded-md border p-1 shadow-dropdown-light dark:shadow-dropdown',
    'bg-background-light text-text-light border-border-light',
    'dark:bg-surface-dark dark:text-text-dark dark:border-border-dark',
    'data-[state=closed]:animate-out data-[state=open]:animate-in',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'transition-[opacity,transform] duration-150 ease-out'
  ],
  {
    variants: {
      width: {
        auto: 'w-auto',
        sm: 'w-48',
        md: 'w-56',
        lg: 'w-72',
        full: 'w-full'
      },
      side: {
        top: 'mb-2',
        bottom: 'mt-2',
        left: 'mr-2',
        right: 'ml-2'
      }
    },
    defaultVariants: {
      width: 'auto',
      side: 'bottom'
    }
  }
);

export const dropdownItemVariants = cva(
  [
    'relative flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm',
    'transition-[background,color,box-shadow] duration-150 ease-out',
    'focus-visible:focus-ring',
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'
  ],
  {
    variants: {
      variant: {
        default: [
          'text-text-secondary-light dark:text-text-secondary-dark',
          'hover:bg-surface-raised-light hover:!text-text-light',
          'dark:hover:bg-white-tint-mid dark:hover:!text-text-dark',
          'data-[highlighted]:bg-surface-raised-light data-[highlighted]:!text-text-light',
          'dark:data-[highlighted]:bg-white-tint-mid dark:data-[highlighted]:!text-text-dark'
        ],
        destructive: [
          'text-error-light dark:text-error',
          'hover:bg-red-tint-subtle dark:hover:bg-red-tint-low',
          'data-[highlighted]:bg-red-tint-subtle dark:data-[highlighted]:bg-red-tint-low'
        ]
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export const dropdownSubTriggerVariants = cva([
  'relative flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm',
  'transition-[background,color,box-shadow] duration-150 ease-out',
  'text-text-secondary-light dark:text-text-secondary-dark',
  'hover:bg-surface-raised-light hover:!text-text-light',
  'dark:hover:bg-white-tint-mid dark:hover:!text-text-dark',
  'data-[highlighted]:bg-surface-raised-light data-[highlighted]:!text-text-light',
  'dark:data-[highlighted]:bg-white-tint-mid dark:data-[highlighted]:!text-text-dark',
  'focus-visible:focus-ring'
]);

export const dropdownSubContentVariants = cva([
  'min-w-40 rounded-md border p-1 shadow-dropdown-light dark:shadow-dropdown',
  'bg-background-light text-text-light border-border-light',
  'dark:bg-surface-dark dark:text-text-dark dark:border-border-dark',
  'ml-2 transition-[opacity,transform] duration-150 ease-out'
]);

export const dropdownSeparatorVariants = cva('my-1 h-px bg-border-light dark:bg-border-dark');

export const dropdownLabelVariants = cva(
  'px-3 py-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
);

export const dropdownLoadingVariants = cva(
  'flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary-light dark:text-text-secondary-dark'
);

export const dropdownTriggerVariants = cva([
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md',
  'focus-visible:focus-ring',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
]);

export type DropdownItemVariant = NonNullable<VariantProps<typeof dropdownItemVariants>['variant']>;
export type DropdownWidth = NonNullable<VariantProps<typeof dropdownContentVariants>['width']>;
type DropdownSide = NonNullable<VariantProps<typeof dropdownContentVariants>['side']>;
export type DropdownAlign = 'start' | 'center' | 'end';
type NativeTriggerProps = Omit<ComponentProps<'button'>, 'aria-label' | 'children' | 'className' | 'type'>;

type DropdownBaseElement = {
  id?: string;
};

export type DropdownProps = NativeTriggerProps & {
  /**
   * @control select
   * @default auto
   */
  width?: DropdownWidth;
  /**
   * @control select
   * @default bottom
   */
  position?: DropdownSide;
  /**
   * @control select
   * @default start
   */
  align?: DropdownAlign;
  /**
   * @control number
   * @default 0
   */
  offset?: number;
  /**
   * @control boolean
   * @default true
   */
  closeOnSelect?: boolean;
  /**
   * @control boolean
   * @default false
   */
  loading?: boolean;
  /**
   * @control text
   */
  ariaLabel?: string;
  /**
   * @control text
   */
  'aria-label'?: string;
  /**
   * @control object
   */
  children: ReactNode;
  /**
   * @control object
   */
  items: DropdownSchema;
  /**
   * @control text
   */
  className?: string;
};

export type DropdownItem = DropdownBaseElement & {
  type: 'item';
  label: string;
  disabled?: boolean;
  variant?: DropdownItemVariant;
  onClick?: () => void;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type DropdownSubmenu = DropdownBaseElement & {
  type: 'submenu';
  label: string;
  items: DropdownElement[];
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type DropdownSeparator = DropdownBaseElement & {
  type: 'separator';
};

export type DropdownLabel = DropdownBaseElement & {
  type: 'label';
  label: string;
};

export type DropdownElement = DropdownItem | DropdownSubmenu | DropdownSeparator | DropdownLabel;

export type DropdownSchema = DropdownElement[];
