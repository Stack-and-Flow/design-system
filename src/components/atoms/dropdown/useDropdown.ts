import type { ComponentProps } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import {
  type DropdownAlign,
  type DropdownElement,
  type DropdownItem,
  type DropdownLabel,
  type DropdownProps,
  type DropdownSchema,
  type DropdownSeparator,
  type DropdownSubmenu,
  dropdownContentVariants,
  dropdownItemVariants,
  dropdownLabelVariants,
  dropdownLoadingVariants,
  dropdownSeparatorVariants,
  dropdownSpinnerVariants,
  dropdownSubContentVariants,
  dropdownSubTriggerVariants,
  dropdownTriggerVariants
} from './types';

type DropdownRenderableBase = {
  key: string;
};

type DropdownRenderableItem = DropdownItem & DropdownRenderableBase;
type DropdownRenderableSeparator = DropdownSeparator & DropdownRenderableBase;
type DropdownRenderableLabel = DropdownLabel & DropdownRenderableBase & { labelId: string };
type DropdownRenderableSubmenu = Omit<DropdownSubmenu, 'items'> &
  DropdownRenderableBase & {
    items: DropdownRenderableElement[];
    submenuId: string;
  };

export type DropdownRenderableElement =
  | DropdownRenderableItem
  | DropdownRenderableSeparator
  | DropdownRenderableLabel
  | DropdownRenderableSubmenu;

type DropdownContentProps = {
  align: DropdownAlign;
  avoidCollisions: true;
  className: string;
  side: NonNullable<DropdownProps['position']>;
  sideOffset: number;
  role: 'menu';
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

type UseDropdownReturn = {
  contentProps: DropdownContentProps;
  elements: DropdownRenderableElement[];
  loading: boolean;
  loadingClassName: string;
  loadingLabel: string;
  spinnerClassName: string;
  triggerProps: ComponentProps<'button'>;
  getItemProps: (element: DropdownRenderableItem) => {
    'aria-disabled': true | undefined;
    className: string;
    disabled: boolean | undefined;
    onSelect: (event: Event) => void;
  };
  getLabelProps: (element: DropdownRenderableLabel) => {
    className: string;
    id: string;
  };
  getSeparatorProps: () => {
    className: string;
  };
  getSubContentProps: (element: DropdownRenderableSubmenu) => {
    className: string;
    id: string;
    sideOffset: number;
  };
  getSubTriggerProps: (element: DropdownRenderableSubmenu) => {
    'aria-controls': string;
    'aria-haspopup': 'menu';
    className: string;
  };
};

const getElementKey = ({
  element,
  index,
  prefix
}: {
  element: DropdownElement;
  index: number;
  prefix: string;
}): string => element.id ?? `${prefix}-${element.type}-${index}`;

const normalizeDropdownElements = ({
  items,
  prefix
}: {
  items: DropdownSchema;
  prefix: string;
}): DropdownRenderableElement[] => {
  return items.map((element, index) => {
    const key = getElementKey({ element, index, prefix });

    switch (element.type) {
      case 'submenu':
        return {
          ...element,
          key,
          submenuId: `${key}-submenu`,
          items: normalizeDropdownElements({ items: element.items, prefix: key })
        };
      case 'label':
        return {
          ...element,
          key,
          labelId: `${key}-label`
        };
      default:
        return {
          ...element,
          key
        };
    }
  });
};

const getFirstLabel = (items: DropdownRenderableElement[]): DropdownRenderableLabel | undefined => {
  const firstElement = items.find((element) => element.type === 'label');

  if (firstElement?.type === 'label') {
    return firstElement;
  }

  return undefined;
};

const getExplicitAriaLabel = ({
  ariaLabel,
  nativeAriaLabel
}: {
  ariaLabel: string | undefined;
  nativeAriaLabel: string | undefined;
}): string | undefined => ariaLabel ?? nativeAriaLabel;

export const useDropdown = ({
  items,
  loading = false,
  closeOnSelect = true,
  position = 'bottom',
  align = 'start',
  offset = 0,
  width = 'auto',
  className,
  ariaLabel,
  'aria-label': nativeAriaLabel,
  ...triggerProps
}: DropdownProps): UseDropdownReturn => {
  const generatedId = useId().replaceAll(':', '');
  const prefix = `dropdown-${generatedId}`;
  const elements = normalizeDropdownElements({ items, prefix });
  const firstLabel = getFirstLabel(elements);
  const explicitAriaLabel = getExplicitAriaLabel({
    ariaLabel,
    nativeAriaLabel
  });

  return {
    elements,
    loading,
    triggerProps: {
      ...triggerProps,
      type: 'button',
      className: dropdownTriggerVariants(),
      'aria-label': explicitAriaLabel
    },
    contentProps: {
      role: 'menu',
      side: position,
      align,
      sideOffset: offset,
      avoidCollisions: true,
      className: cn(dropdownContentVariants({ width, side: position }), className),
      'aria-labelledby': firstLabel?.labelId,
      'aria-label': firstLabel ? undefined : (explicitAriaLabel ?? 'Dropdown menu')
    },
    loadingClassName: dropdownLoadingVariants(),
    spinnerClassName: dropdownSpinnerVariants(),
    loadingLabel: 'Loading menu items',
    getItemProps: (element) => ({
      disabled: element.disabled,
      'aria-disabled': element.disabled || undefined,
      className: dropdownItemVariants({ variant: element.variant }),
      onSelect: (event) => {
        if (closeOnSelect === false) {
          event.preventDefault();
        }

        element.onClick?.();
      }
    }),
    getSubTriggerProps: (element) => ({
      'aria-haspopup': 'menu',
      'aria-controls': element.submenuId,
      className: dropdownSubTriggerVariants()
    }),
    getSubContentProps: (element) => ({
      id: element.submenuId,
      sideOffset: offset,
      className: dropdownSubContentVariants()
    }),
    getSeparatorProps: () => ({
      className: dropdownSeparatorVariants()
    }),
    getLabelProps: (element) => ({
      id: element.labelId,
      className: dropdownLabelVariants()
    })
  };
};
