import { cn } from '@/lib/utils';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRightIcon } from 'lucide-react';
import type { FC } from 'react';
import { SpinnerCircular } from 'spinners-react';
import type { DropdownElement, DropdownProps } from './types';
import { useDropdown } from './useDropdown';

const renderDropdownItem = (element: DropdownElement, index: number) => {
  if (element.type === 'item') {
    return (
      <DropdownMenuPrimitive.Item
        key={index}
        disabled={element.disabled}
        data-variant={element.variant}
        aria-disabled={element.disabled || undefined}
        className={cn(
          'relative flex cursor-default justify-between items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
          'transition-opacity duration-300 ease-in-out',
          'hover:outline-offset-1 hover:outline-[var(--color-brand-light)] dark:hover:outline-[var(--color-brand-dark)] hover:outline-1',
          'focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-1',
          element.variant === 'destructive' && 'bg-[var(--color-error-light)] dark:bg-[var(--color-error)] text-white hover:bg-[var(--color-brand-light-dark)]'
        )}
        onClick={element.onClick}
      >
        {element.startContent && <span className='flex items-center'>{element.startContent}</span>}
        <span className='w-full max-w-full'>{element.label}</span>
        {element.endContent && <span className='flex items-center'>{element.endContent}</span>}
      </DropdownMenuPrimitive.Item>
    );
  }
};

const renderDropdownSubmenu = (element: DropdownElement, index: number) => {
  if (element.type === 'submenu') {
    const submenuId = `submenu-${index}`;
    return (
      <DropdownMenuPrimitive.Sub key={index}>
        <DropdownMenuPrimitive.SubTrigger
          aria-haspopup='menu'
          aria-controls={submenuId}
          aria-expanded={false}
          className={cn(
            'flex items-center rounded-md justify-between px-2 py-1.5 text-sm',
            'transition-opacity duration-300 ease-in-out',
          'hover:outline-offset-1 hover:outline-[var(--color-brand-light)] dark:hover:outline-[var(--color-brand-dark)] hover:outline-1',
          'focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-1'
          )}
        >
          {element.startContent && <span className='flex items-center'>{element.startContent}</span>}
          <span className='w-full max-w-full'>{element.label}</span>
          {element.endContent ? (
            <span className='flex items-center'>{element.endContent}</span>
          ) : (
            <ChevronRightIcon className='ml-auto size-4' />
          )}
        </DropdownMenuPrimitive.SubTrigger>
        <DropdownMenuPrimitive.SubContent
          id={submenuId}
          className={cn(
            'min-w-[8rem] ml-2 rounded-[var(--radius-md)] border p-1 shadow-lg',
            'transition-opacity duration-300 ease-in-out',
            'focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-1',
            'hover:outline-offset-1 hover:outline-[var(--color-brand-light)] dark:hover:outline-[var(--color-brand-dark)] hover:outline-1',
            'bg-[var(--color-surface-light)] border-[var(--color-border-light)]',
            'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)]'
          )}
        >
          {element.items.map((subElement, subIndex) => renderDropdownElement(subElement, subIndex))}
        </DropdownMenuPrimitive.SubContent>
      </DropdownMenuPrimitive.Sub>
    );
  }
};

const renderDropdownElement = (element: DropdownElement, index: number) => {
  switch (element.type) {
    case 'item':
      return renderDropdownItem(element, index);
    case 'submenu':
      return renderDropdownSubmenu(element, index);
    case 'separator':
      return (
        <DropdownMenuPrimitive.Separator key={index} className='my-1 h-px bg-[var(--color-border-light)] dark:bg-[var(--color-border-dark)]' />
      );
    case 'label': {
      const labelId = `dropdown-label-${index}`;
      return (
        <DropdownMenuPrimitive.Label key={index} id={labelId} className='px-2 py-1.5 text-sm font-medium'>
          {element.label}
        </DropdownMenuPrimitive.Label>
      );
    }
    default:
      return null;
  }
};

const Dropdown: FC<DropdownProps> = ({ ...props }) => {
  const {
    items,
    loading,
    closeOnSelect,
    position,
    align,
    offset,
    width,
    className,
    accessibleLabelId,
    marginClasses,
    firstLabelId,
    fallbackId
  } = useDropdown(props);

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild={true}>
        <div>{props.children}</div>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          role='menu'
          aria-labelledby={accessibleLabelId}
          className={cn(
            'min-w-[8rem] rounded-md border p-1 shadow-md',
            'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
            'bg-[var(--color-surface-light)] border-[var(--color-border-light)]',
            'dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)]',
            'data-[state=closed]:animate-out data-[state=open]:animate-in',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            marginClasses[position],
            className
          )}
          style={{ width }}
          side={position}
          align={align}
          sideOffset={offset}
          collisionPadding={8}
          avoidCollisions={true}
          onCloseAutoFocus={(e) => {
            if (!closeOnSelect) {
              e.preventDefault();
            }
          }}
        >
          {loading ? (
            <div className='flex justify-center items-center p-4'>
              <SpinnerCircular
                color={'currentColor'}
                secondaryColor={'rgba(45, 6, 9, 0.2)'}
                thickness={200}
                size='1.5em'
              />
            </div>
          ) : (
            <>
              {!firstLabelId && (
                <span id={fallbackId} className='sr-only'>
                  Dropdown menu
                </span>
              )}
              {items.map(renderDropdownElement)}
            </>
          )}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default Dropdown;
