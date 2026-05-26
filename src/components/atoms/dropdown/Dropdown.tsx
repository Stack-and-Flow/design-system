import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRightIcon } from 'lucide-react';
import type { FC } from 'react';
import type { DropdownProps } from './types';
import { type DropdownRenderableElement, useDropdown } from './useDropdown';

const renderDropdownElement = ({
  element,
  getItemProps,
  getLabelProps,
  getSeparatorProps,
  getSubContentProps,
  getSubTriggerProps
}: {
  element: DropdownRenderableElement;
  getItemProps: ReturnType<typeof useDropdown>['getItemProps'];
  getLabelProps: ReturnType<typeof useDropdown>['getLabelProps'];
  getSeparatorProps: ReturnType<typeof useDropdown>['getSeparatorProps'];
  getSubContentProps: ReturnType<typeof useDropdown>['getSubContentProps'];
  getSubTriggerProps: ReturnType<typeof useDropdown>['getSubTriggerProps'];
}) => {
  switch (element.type) {
    case 'item': {
      const itemProps = getItemProps(element);

      return (
        <DropdownMenuPrimitive.Item key={element.key} {...itemProps} textValue={element.label}>
          {element.startContent && <span className='flex items-center'>{element.startContent}</span>}
          <span className='flex-1 truncate'>{element.label}</span>
          {element.endContent && <span className='flex items-center'>{element.endContent}</span>}
        </DropdownMenuPrimitive.Item>
      );
    }
    case 'submenu': {
      const subTriggerProps = getSubTriggerProps(element);
      const subContentProps = getSubContentProps(element);

      return (
        <DropdownMenuPrimitive.Sub key={element.key}>
          <DropdownMenuPrimitive.SubTrigger {...subTriggerProps} textValue={element.label}>
            {element.startContent && <span className='flex items-center'>{element.startContent}</span>}
            <span className='flex-1 truncate'>{element.label}</span>
            {element.endContent ? (
              <span className='flex items-center'>{element.endContent}</span>
            ) : (
              <ChevronRightIcon aria-hidden='true' className='ml-auto size-4' />
            )}
          </DropdownMenuPrimitive.SubTrigger>
          <DropdownMenuPrimitive.SubContent {...subContentProps}>
            {element.items.map((subElement) =>
              renderDropdownElement({
                element: subElement,
                getItemProps,
                getLabelProps,
                getSeparatorProps,
                getSubContentProps,
                getSubTriggerProps
              })
            )}
          </DropdownMenuPrimitive.SubContent>
        </DropdownMenuPrimitive.Sub>
      );
    }
    case 'separator':
      return <DropdownMenuPrimitive.Separator key={element.key} {...getSeparatorProps()} />;
    case 'label':
      return (
        <DropdownMenuPrimitive.Label key={element.key} {...getLabelProps(element)}>
          {element.label}
        </DropdownMenuPrimitive.Label>
      );
  }
};

export const Dropdown: FC<DropdownProps> = (props) => {
  const {
    contentProps,
    elements,
    loading,
    loadingClassName,
    loadingLabel,
    spinnerClassName,
    triggerProps,
    getItemProps,
    getLabelProps,
    getSeparatorProps,
    getSubContentProps,
    getSubTriggerProps
  } = useDropdown(props);

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild={true}>
        <button {...triggerProps}>{props.children}</button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content {...contentProps}>
          {loading ? (
            <div className={loadingClassName} role='status' aria-live='polite'>
              <span aria-hidden='true' className={spinnerClassName} />
              <span className='sr-only'>{loadingLabel}</span>
            </div>
          ) : (
            elements.map((element) =>
              renderDropdownElement({
                element,
                getItemProps,
                getLabelProps,
                getSeparatorProps,
                getSubContentProps,
                getSubTriggerProps
              })
            )
          )}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
