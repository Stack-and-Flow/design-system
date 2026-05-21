import { cva, type VariantProps } from 'class-variance-authority';
import type { MouseEvent, ReactElement, ReactNode } from 'react';

export const modalVariants = cva(
  [
    'z-modal flex w-full flex-col border p-6 shadow-modal dark:shadow-modal-dark',
    'bg-surface-light dark:bg-surface-dark',
    'border-border-light dark:border-border-dark',
    'data-[state=closed]:animate-out data-[state=open]:animate-in',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
  ],
  {
    variants: {
      size: {
        xs: 'm-0 max-h-modal max-w-modal-xs rounded-md sm:m-1',
        sm: 'm-0 max-h-modal max-w-modal-sm rounded-md sm:m-1',
        md: 'm-0 max-h-modal max-w-modal-md rounded-md sm:m-1',
        lg: 'm-0 max-h-modal max-w-modal-lg rounded-md sm:m-1',
        xl: 'm-0 max-h-modal max-w-modal-xl rounded-md sm:m-1',
        '2xl': 'm-0 max-h-modal max-w-modal-2xl rounded-md sm:m-1',
        '3xl': 'm-0 max-h-modal max-w-modal-3xl rounded-md sm:m-1',
        '4xl': 'm-0 max-h-modal max-w-modal-4xl rounded-lg sm:m-1',
        '5xl': 'm-0 max-h-modal max-w-modal-5xl rounded-lg sm:m-1',
        full: 'm-0 h-dvh max-w-full rounded-none'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export const modalContainerVariants = cva('fixed inset-0 z-modal flex w-full p-0 md:p-4', {
  variants: {
    position: {
      center: 'items-center justify-center',
      top: 'items-start justify-center',
      bottom: 'items-end justify-center'
    }
  },
  defaultVariants: {
    position: 'center'
  }
});

export const modalOverlayVariants = cva(
  [
    'fixed inset-0 z-modal',
    'data-[state=closed]:animate-out data-[state=open]:animate-in',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
  ],
  {
    variants: {
      backdrop: {
        opacity: 'bg-overlay-dark',
        blur: 'bg-overlay-dark backdrop-blur-overlay',
        transparent: 'bg-transparent'
      }
    },
    defaultVariants: {
      backdrop: 'opacity'
    }
  }
);

type ModalVariantProps = VariantProps<typeof modalVariants>;
export type ModalSize = NonNullable<ModalVariantProps['size']>;
export type ModalPosition = NonNullable<VariantProps<typeof modalContainerVariants>['position']>;
export type ModalBackdrop = NonNullable<VariantProps<typeof modalOverlayVariants>['backdrop']>;

export type ModalTriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'dialog';
};

export type ModalActions = {
  close: () => void;
};

type ModalSlot = ReactNode | ((actions: ModalActions) => ReactNode);

export type ModalProps = {
  /**
   * @control custom
   */
  children: ReactElement<ModalTriggerProps>;
  /**
   * @control select
   * @default md
   */
  size?: ModalSize;
  /**
   * @control select
   * @default center
   */
  position?: ModalPosition;
  /**
   * @control select
   * @default opacity
   */
  backdrop?: ModalBackdrop;
  /**
   * @control text
   * @default Modal title
   */
  title?: string;
  /**
   * @control custom
   */
  header?: ReactNode;
  /**
   * @control text
   * @default Modal content goes here.
   */
  textContent?: string;
  /**
   * @control custom
   */
  content?: ModalSlot;
  /**
   * @control custom
   */
  footer?: ModalSlot;
  /**
   * @control custom
   */
  customBackdrop?: string;
};
