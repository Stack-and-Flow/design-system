import * as DrawerPrimitive from '@radix-ui/react-dialog';
import { cloneElement, type FC, isValidElement, type ReactElement, type ReactNode } from 'react';
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

type JsxCompatiblePrimitive = (props: { [key: string]: unknown; children?: ReactNode }) => ReactElement | null;

const DialogRootPrimitive = DrawerPrimitive.Root as unknown as JsxCompatiblePrimitive;
const DialogPortalPrimitive = DrawerPrimitive.Portal as unknown as JsxCompatiblePrimitive;
const DialogOverlayPrimitive = DrawerPrimitive.Overlay as unknown as JsxCompatiblePrimitive;
const DialogContentPrimitive = DrawerPrimitive.Content as unknown as JsxCompatiblePrimitive;
const DialogTitlePrimitive = DrawerPrimitive.Title as unknown as JsxCompatiblePrimitive;
const DialogDescriptionPrimitive = DrawerPrimitive.Description as unknown as JsxCompatiblePrimitive;
const DialogClosePrimitive = DrawerPrimitive.Close as unknown as JsxCompatiblePrimitive;

const DrawerRoot: FC<DrawerProps> = (props) => {
  const { contextValue, rootProps } = useDrawerRoot(props);

  return (
    <DrawerRootProvider value={contextValue}>
      <DialogRootPrimitive {...rootProps}>{props.children}</DialogRootPrimitive>
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
    <DialogPortalPrimitive>
      <DialogOverlayPrimitive {...overlayProps} data-slot='drawer-overlay' />
      <DialogContentPrimitive {...contentProps} data-slot='drawer-content'>
        {children}
      </DialogContentPrimitive>
    </DialogPortalPrimitive>
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
    <DialogTitlePrimitive {...props} className={titleClassName} data-slot='drawer-title'>
      {children}
    </DialogTitlePrimitive>
  );
};

const DrawerDescription: FC<DrawerDescriptionProps> = ({ children, className, ...props }) => {
  const { className: descriptionClassName } = useDrawerDescription({ children, className });

  return (
    <DialogDescriptionPrimitive {...props} className={descriptionClassName} data-slot='drawer-description'>
      {children}
    </DialogDescriptionPrimitive>
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

type PreventableEvent = {
  defaultPrevented: boolean;
};

type DrawerCloseChild = ReactElement<{
  [key: string]: unknown;
  className?: string;
  onClick?: DrawerCloseProps['onClick'];
}>;

const composeEventHandlers = <TEvent extends PreventableEvent>(
  ...handlers: Array<((event: TEvent) => void) | undefined>
) => {
  const composedHandlers = handlers.filter((handler): handler is (event: TEvent) => void => Boolean(handler));

  if (composedHandlers.length === 0) {
    return undefined;
  }

  return (event: TEvent) => {
    for (const handler of composedHandlers) {
      handler(event);

      if (event.defaultPrevented) {
        return;
      }
    }
  };
};

const DrawerClose: FC<DrawerCloseProps> = ({ asChild = false, children, className, type = 'button', ...props }) => {
  const { className: closeClassName } = useDrawerClose({ asChild, children, className, type, ...props });

  if (asChild && isValidElement(children)) {
    const closeChild = children as DrawerCloseChild;
    const { onClick, ...forwardedProps } = props;

    return (
      <DialogClosePrimitive asChild={true}>
        {cloneElement(closeChild, {
          ...forwardedProps,
          ...closeChild.props,
          className: cn(closeChild.props.className, closeClassName),
          onClick: composeEventHandlers(closeChild.props.onClick, onClick)
        })}
      </DialogClosePrimitive>
    );
  }

  if (children) {
    return (
      <DialogClosePrimitive asChild={true}>
        <button {...props} className={closeClassName} type={type}>
          {children}
        </button>
      </DialogClosePrimitive>
    );
  }

  return (
    <DialogClosePrimitive asChild={true}>
      <button {...props} aria-label={props['aria-label'] ?? 'Close drawer'} className={closeClassName} type={type}>
        <span aria-hidden={true}>×</span>
      </button>
    </DialogClosePrimitive>
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
