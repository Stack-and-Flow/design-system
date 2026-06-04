import * as DrawerPrimitive from '@radix-ui/react-dialog';
import { cloneElement, type FC, isValidElement, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type {
  DrawerBodyProps,
  DrawerCloseProps,
  DrawerCompoundComponent,
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerProps,
  DrawerTitleProps,
  DrawerTriggerProps
} from './types';
import {
  DrawerRootProvider,
  useDrawerBody,
  useDrawerClose,
  useDrawerContent,
  useDrawerDescription,
  useDrawerFooter,
  useDrawerHeader,
  useDrawerRoot,
  useDrawerTitle,
  useDrawerTrigger
} from './useDrawer';

const DrawerRoot: FC<DrawerProps> = (props) => {
  const { contextValue, rootProps } = useDrawerRoot(props);

  return (
    <DrawerRootProvider value={contextValue}>
      <DrawerPrimitive.Root {...rootProps}>{props.children}</DrawerPrimitive.Root>
    </DrawerRootProvider>
  );
};

const DrawerTrigger: FC<DrawerTriggerProps> = (props) => {
  const trigger = useDrawerTrigger(props);

  if (trigger.asChild) {
    return trigger.child;
  }

  return (
    <button {...trigger.buttonProps} data-slot='drawer-trigger'>
      {props.children}
    </button>
  );
};

const DrawerContent: FC<DrawerContentProps> = (props) => {
  const { children, contentProps, overlayProps } = useDrawerContent(props);

  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay {...overlayProps} data-slot='drawer-overlay' />
      <DrawerPrimitive.Content {...contentProps} data-slot='drawer-content'>
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
};

const DrawerHeader: FC<DrawerHeaderProps> = ({ children, className, ...props }) => {
  const { className: headerClassName } = useDrawerHeader({ children, className });

  return (
    <div {...props} className={headerClassName} data-scroll-lock='static' data-slot='drawer-header'>
      {children}
    </div>
  );
};

const DrawerTitle: FC<DrawerTitleProps> = ({ children, className, ...props }) => {
  const { className: titleClassName } = useDrawerTitle({ children, className });

  return (
    <DrawerPrimitive.Title {...props} className={titleClassName} data-slot='drawer-title'>
      {children}
    </DrawerPrimitive.Title>
  );
};

const DrawerDescription: FC<DrawerDescriptionProps> = ({ children, className, ...props }) => {
  const { className: descriptionClassName } = useDrawerDescription({ children, className });

  return (
    <DrawerPrimitive.Description {...props} className={descriptionClassName} data-slot='drawer-description'>
      {children}
    </DrawerPrimitive.Description>
  );
};

const DrawerBody: FC<DrawerBodyProps> = ({ children, className, ...props }) => {
  const { className: bodyClassName } = useDrawerBody({ children, className });

  return (
    <div {...props} className={bodyClassName} data-scroll-region='internal' data-slot='drawer-body'>
      {children}
    </div>
  );
};

const DrawerFooter: FC<DrawerFooterProps> = ({ children, className, ...props }) => {
  const { className: footerClassName } = useDrawerFooter({ children, className });

  return (
    <div {...props} className={footerClassName} data-scroll-lock='static' data-slot='drawer-footer'>
      {children}
    </div>
  );
};

type DrawerCloseChild = ReactElement<{ className?: string }>;

const DrawerClose: FC<DrawerCloseProps> = ({ asChild = false, children, className, type = 'button', ...props }) => {
  const { className: closeClassName } = useDrawerClose({ asChild, children, className, type, ...props });

  if (asChild && isValidElement(children)) {
    const closeChild = children as DrawerCloseChild;

    return (
      <DrawerPrimitive.Close asChild={true}>
        {cloneElement(closeChild, {
          className: cn(closeChild.props.className, closeClassName)
        })}
      </DrawerPrimitive.Close>
    );
  }

  if (children) {
    return (
      <DrawerPrimitive.Close asChild={true}>
        <button {...props} className={closeClassName} type={type}>
          {children}
        </button>
      </DrawerPrimitive.Close>
    );
  }

  return (
    <DrawerPrimitive.Close asChild={true}>
      <button {...props} aria-label={props['aria-label'] ?? 'Close drawer'} className={closeClassName} type={type}>
        <span aria-hidden={true}>×</span>
      </button>
    </DrawerPrimitive.Close>
  );
};

DrawerTrigger.displayName = 'Drawer.Trigger';
DrawerContent.displayName = 'Drawer.Content';
DrawerHeader.displayName = 'Drawer.Header';
DrawerTitle.displayName = 'Drawer.Title';
DrawerDescription.displayName = 'Drawer.Description';
DrawerBody.displayName = 'Drawer.Body';
DrawerFooter.displayName = 'Drawer.Footer';
DrawerClose.displayName = 'Drawer.Close';

const compoundDrawer = DrawerRoot as DrawerCompoundComponent;

compoundDrawer['Trigger'] = DrawerTrigger;
compoundDrawer['Content'] = DrawerContent;
compoundDrawer['Header'] = DrawerHeader;
compoundDrawer['Title'] = DrawerTitle;
compoundDrawer['Description'] = DrawerDescription;
compoundDrawer['Body'] = DrawerBody;
compoundDrawer['Footer'] = DrawerFooter;
compoundDrawer['Close'] = DrawerClose;

export const Drawer = compoundDrawer;
