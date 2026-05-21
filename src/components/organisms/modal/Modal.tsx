import { Button } from '@atoms/button';
import { IconButton } from '@atoms/icon-button';
import * as ModalPrimitive from '@radix-ui/react-dialog';
import { cloneElement, type FC, type ReactNode } from 'react';
import type { ModalActions, ModalProps } from './types';
import { useModal } from './useModal';

const renderModalSlot = (slot: ModalProps['content'], actions: ModalActions): ReactNode =>
  typeof slot === 'function' ? slot(actions) : slot;

export const Modal: FC<ModalProps> = (props) => {
  const {
    bodyClassName,
    children,
    closeModal,
    containerClassName,
    content,
    contentId,
    footer,
    getTriggerProps,
    handleCloseAutoFocus,
    handleOpenChange,
    header,
    isOpen,
    overlayClassName,
    panelClassName,
    shouldRenderCustomContent,
    shouldRenderCustomFooter,
    shouldRenderCustomHeader,
    textContent,
    title
  } = useModal(props);

  const modalActions: ModalActions = { close: closeModal };
  const renderedContent = renderModalSlot(content, modalActions);
  const renderedFooter = renderModalSlot(footer, modalActions);

  return (
    <ModalPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      {cloneElement(children, getTriggerProps(children.props.onClick))}
      <ModalPrimitive.Portal>
        <ModalPrimitive.Overlay className={overlayClassName} />
        <div className={containerClassName}>
          <ModalPrimitive.Content id={contentId} className={panelClassName} onCloseAutoFocus={handleCloseAutoFocus}>
            <div className='relative pb-4 pr-12'>
              {shouldRenderCustomHeader ? (
                <>
                  <ModalPrimitive.Title className='sr-only'>{title}</ModalPrimitive.Title>
                  {header}
                </>
              ) : (
                <ModalPrimitive.Title className='fs-h5 font-semibold text-text-light dark:text-text-dark'>
                  {title}
                </ModalPrimitive.Title>
              )}
              <IconButton
                className='absolute right-0 top-0'
                icon='x'
                onClick={closeModal}
                size='sm'
                title='Close dialog'
                variant='ghost'
              />
            </div>

            <div className={bodyClassName}>
              {shouldRenderCustomContent ? (
                <>
                  <ModalPrimitive.Description className='sr-only'>{textContent}</ModalPrimitive.Description>
                  {renderedContent}
                </>
              ) : (
                <ModalPrimitive.Description className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  {textContent}
                </ModalPrimitive.Description>
              )}
            </div>

            <div className='flex justify-end pt-4'>
              {shouldRenderCustomFooter ? (
                renderedFooter
              ) : (
                <Button onClick={closeModal} size='sm' text='Close' variant='outlined' />
              )}
            </div>
          </ModalPrimitive.Content>
        </div>
      </ModalPrimitive.Portal>
    </ModalPrimitive.Root>
  );
};
