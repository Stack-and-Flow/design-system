import type { DialogContentProps } from '@radix-ui/react-dialog';
import { type MouseEvent, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { type ModalProps, modalContainerVariants, modalOverlayVariants, modalVariants } from './types';

type CloseAutoFocusEvent = Parameters<NonNullable<DialogContentProps['onCloseAutoFocus']>>[0];

type UseModalReturn = {
  bodyClassName: string;
  children: ModalProps['children'];
  closeModal: () => void;
  containerClassName: string;
  content: ModalProps['content'];
  contentId: string;
  footer: ModalProps['footer'];
  getTriggerProps: (originalOnClick?: ModalProps['children']['props']['onClick']) => ModalProps['children']['props'];
  handleCloseAutoFocus: (event: CloseAutoFocusEvent) => void;
  handleOpenChange: (open: boolean) => void;
  header: ModalProps['header'];
  isOpen: boolean;
  overlayClassName: string;
  panelClassName: string;
  shouldRenderCustomContent: boolean;
  shouldRenderCustomFooter: boolean;
  shouldRenderCustomHeader: boolean;
  textContent: string;
  title: string;
};

export const useModal = ({
  backdrop = 'opacity',
  children,
  content,
  customBackdrop,
  footer,
  header,
  position = 'center',
  size = 'md',
  textContent = 'Modal content goes here.',
  title = 'Modal title'
}: ModalProps): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const idBase = useId().replace(/:/g, '');

  const contentId = `modal-${idBase}-content`;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const getTriggerProps = (
    originalOnClick?: ModalProps['children']['props']['onClick']
  ): ModalProps['children']['props'] => ({
    'aria-controls': contentId,
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
    onClick: (event: MouseEvent<HTMLElement>) => {
      triggerElementRef.current = event.currentTarget;
      originalOnClick?.(event);
      if (!event.defaultPrevented) {
        setIsOpen(true);
      }
    }
  });

  const handleCloseAutoFocus = (event: CloseAutoFocusEvent) => {
    event.preventDefault();
    triggerElementRef.current?.focus();
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    bodyClassName: cn('flex-1 overflow-y-auto py-4', size !== 'full' && 'max-h-modal'),
    children,
    closeModal,
    containerClassName: modalContainerVariants({ position }),
    content,
    contentId,
    footer,
    getTriggerProps,
    handleCloseAutoFocus,
    handleOpenChange,
    header,
    isOpen,
    overlayClassName: customBackdrop
      ? cn(
          'fixed inset-0 z-modal',
          'data-[state=closed]:animate-out data-[state=open]:animate-in',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          customBackdrop
        )
      : modalOverlayVariants({ backdrop }),
    panelClassName: modalVariants({ size }),
    shouldRenderCustomContent: content !== undefined,
    shouldRenderCustomFooter: footer !== undefined,
    shouldRenderCustomHeader: header !== undefined,
    textContent,
    title
  };
};
