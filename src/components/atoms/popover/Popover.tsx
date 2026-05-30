import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { FC } from 'react';
import type {
  PopoverArrowProps,
  PopoverBodyProps,
  PopoverCompoundComponent,
  PopoverContentProps,
  PopoverFooterProps,
  PopoverHeaderProps,
  PopoverProps,
  PopoverTriggerProps
} from './types';
import {
  PopoverContentProvider,
  PopoverRootProvider,
  usePopoverArrow,
  usePopoverBody,
  usePopoverContent,
  usePopoverFooter,
  usePopoverHeader,
  usePopoverRoot,
  usePopoverTrigger
} from './usePopover';

const PopoverRoot: FC<PopoverProps> = (props) => {
  const { contextValue, rootProps } = usePopoverRoot(props);

  return (
    <PopoverRootProvider value={contextValue}>
      <PopoverPrimitive.Root {...rootProps}>{props.children}</PopoverPrimitive.Root>
    </PopoverRootProvider>
  );
};

const PopoverTrigger: FC<PopoverTriggerProps> = (props) => {
  const trigger = usePopoverTrigger(props);

  return (
    <PopoverPrimitive.Anchor asChild={true}>
      <span className={trigger.anchorClassName} data-slot='popover-anchor' ref={trigger.anchorRef}>
        {trigger.asChild ? (
          trigger.child
        ) : (
          <button {...trigger.buttonProps} data-slot='popover-trigger'>
            {props.children}
          </button>
        )}
      </span>
    </PopoverPrimitive.Anchor>
  );
};

const PopoverContent: FC<PopoverContentProps> = (props) => {
  const { children, contentProps, contextValue, needsScopedDarkPortal } = usePopoverContent(props);

  return (
    <PopoverPrimitive.Portal>
      <div className={needsScopedDarkPortal ? 'dark' : undefined} style={{ display: 'contents' }}>
        <PopoverContentProvider value={contextValue}>
          <PopoverPrimitive.Content {...contentProps} data-slot='popover-content'>
            {children}
          </PopoverPrimitive.Content>
        </PopoverContentProvider>
      </div>
    </PopoverPrimitive.Portal>
  );
};

const PopoverHeader: FC<PopoverHeaderProps> = (props) => {
  const { className, id } = usePopoverHeader(props);

  return (
    <h3 className={className} data-slot='popover-header' id={id}>
      {props.children}
    </h3>
  );
};

const PopoverBody: FC<PopoverBodyProps> = (props) => {
  const { className, id } = usePopoverBody(props);

  return (
    <div className={className} data-slot='popover-body' id={id}>
      {props.children}
    </div>
  );
};

const PopoverFooter: FC<PopoverFooterProps> = (props) => {
  const { className } = usePopoverFooter(props);

  return (
    <div className={className} data-slot='popover-footer'>
      {props.children}
    </div>
  );
};

const PopoverArrow: FC<PopoverArrowProps> = (props) => {
  const { className } = usePopoverArrow(props);

  return (
    <PopoverPrimitive.Arrow aria-hidden={true} className={className} data-slot='popover-arrow' height={10} width={20} />
  );
};

PopoverTrigger.displayName = 'Popover.Trigger';
PopoverContent.displayName = 'Popover.Content';
PopoverHeader.displayName = 'Popover.Header';
PopoverBody.displayName = 'Popover.Body';
PopoverFooter.displayName = 'Popover.Footer';
PopoverArrow.displayName = 'Popover.Arrow';

const compoundPopover = PopoverRoot as PopoverCompoundComponent;

compoundPopover['Trigger'] = PopoverTrigger;
compoundPopover['Content'] = PopoverContent;
compoundPopover['Header'] = PopoverHeader;
compoundPopover['Body'] = PopoverBody;
compoundPopover['Footer'] = PopoverFooter;
compoundPopover['Arrow'] = PopoverArrow;

export const Popover = compoundPopover;
