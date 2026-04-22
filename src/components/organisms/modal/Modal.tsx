import { Button } from '@atoms/button';
import { Header } from '@atoms/header';
import { IconButton } from '@atoms/icon-button';
import { Text } from '@atoms/text';
import * as ModalPrimitive from '@radix-ui/react-dialog';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { ModalProps } from './types';
import { modalVariants } from './types';
import { useModal } from './useModal';

const Modal: FC<Omit<ModalProps, 'isOpen'>> = ({ ...props }) => {
  const {
    isOpen,
    setIsOpen,
    contentId,
    children,
    currentBackdrop,
    position,
    titleId,
    descriptionId,
    size,
    header,
    title,
    content,
    textContent,
    footer
  } = useModal(props);

  return (
    <ModalPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <ModalPrimitive.Trigger asChild={true} aria-controls={isOpen ? contentId : undefined}>
        {children}
      </ModalPrimitive.Trigger>
      <ModalPrimitive.Portal>
        <ModalPrimitive.Overlay className={currentBackdrop} />
        <div
          className={cn(
            'fixed w-full inset-0 z-modal flex p-0 tablet:p-4',
            position === 'center' && 'items-center justify-center',
            position === 'top' && 'items-start justify-center',
            position === 'bottom' && 'items-end justify-center'
          )}
        >
          <ModalPrimitive.Content
            id={contentId}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={cn(
              modalVariants({ size, position }),
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
          >
            <div className='relative pb-4'>
              <div className='w-full flex items-start justify-start pr-8'>
                {header ?? (
                  <Header tag='h5' id={titleId} className='text-text-light dark:text-text-dark text-lg font-semibold'>
                    {title}
                  </Header>
                )}
              </div>
              <IconButton
                icon='x'
                size={18}
                title='Close'
                variant='ghost'
                rounded={true}
                onClick={() => setIsOpen(false)}
                className='p-1 absolute top-0 right-0'
              />
            </div>
            <div id={descriptionId} className='py-4 flex-1 overflow-y-auto max-h-[80dvh]'>
              {content || (
                <Text tag='p' className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  {textContent}
                </Text>
              )}
            </div>
            <div className='flex justify-end pt-4'>
              {footer || <Button text='Close' size='sm' variant='outlined' onClick={() => setIsOpen(false)} />}
            </div>
          </ModalPrimitive.Content>
        </div>
      </ModalPrimitive.Portal>
    </ModalPrimitive.Root>
  );
};

export default Modal;
