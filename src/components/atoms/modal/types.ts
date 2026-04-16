import { type VariantProps, cva } from 'class-variance-authority';
import type { JSX, ReactNode } from 'react';

export const modalVariants = cva(
  ['w-full z-50 p-6 shadow-md', 'bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]', 'flex flex-col'],
  {
    variants: {
      size: {
        xs: 'max-w-[20rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        sm: 'max-w-[24rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        md: 'max-w-full sm:max-w-[28rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        lg: 'max-w-full sm:max-w-[32rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        xl: 'max-w-full sm:max-w-[36rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        '2xl': 'max-w-full sm:max-w-[42rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        '3xl': 'max-w-full sm:max-w-[48rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        '4xl': 'max-w-full sm:max-w-[56rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
        '5xl': 'max-w-full sm:max-w-[64rem] m-0 sm:m-1 rounded-lg max-h-[80dvh]',
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
