import { cva, type VariantProps } from 'class-variance-authority';
import type { JSX, ReactNode } from 'react';

export const modalVariants = cva(
  [
    'w-full z-modal p-6 shadow-shadow-dropdown',
    'bg-surface-light dark:bg-surface-dark',
    'border border-border-light dark:border-border-dark',
    'flex flex-col'
  ],
  {
    variants: {
      size: {
        xs: 'max-w-xs m-0 sm:m-1 rounded-md max-h-modal',
        sm: 'max-w-sm m-0 sm:m-1 rounded-md max-h-modal',
        md: 'max-w-full sm:max-w-md m-0 sm:m-1 rounded-md max-h-modal',
        lg: 'max-w-full sm:max-w-lg m-0 sm:m-1 rounded-md max-h-modal',
        xl: 'max-w-full sm:max-w-xl m-0 sm:m-1 rounded-md max-h-modal',
        '2xl': 'max-w-full sm:max-w-2xl m-0 sm:m-1 rounded-md max-h-modal',
        '3xl': 'max-w-full sm:max-w-3xl m-0 sm:m-1 rounded-md max-h-modal',
        '4xl': 'max-w-full sm:max-w-4xl m-0 sm:m-1 rounded-lg max-h-modal',
        '5xl': 'max-w-full sm:max-w-5xl m-0 sm:m-1 rounded-lg max-h-modal',
        full: 'max-w-full m-0 rounded-none h-dvh'
      },
      position: {
        center: 'm-auto',
        top: 'top-0',
        bottom: 'bottom-0'
      }
    },
    defaultVariants: {
      size: 'md',
      position: 'center'
    }
  }
);

type ModalSize = VariantProps<typeof modalVariants>['size'];

export type ModalProps = VariantProps<typeof modalVariants> & {
  /**
   * @control select
   * @default md
   */
  size?: ModalSize;
  /**
   * @control select
   * @default center
   */
  position?: 'center' | 'top' | 'bottom';
  /**
   * @control select
   * @default opacity
   */
  backdrop?: 'opacity' | 'blur' | 'transparent';
  /**
   * @control text
   * @default 'Modal title'
   */
  title?: string;
  header?: ReactNode | JSX.Element;
  /**
   * @control text
   * @default 'Modal content goes here.'
   */
  textContent?: string;
  content?: ReactNode | JSX.Element;
  footer?: ReactNode | JSX.Element;
  children?: ReactNode;
  /**
   * @control custom
   * @default undefined
   */
  customBackdrop?: string;
};
