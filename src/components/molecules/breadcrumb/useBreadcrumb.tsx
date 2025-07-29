import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { JSX } from 'react';
import type { BreadcrumbItem, BreadcrumbProps } from './types';

type BreadcrumbItemCollapsed = BreadcrumbItem | JSX.Element;

type UseBreadcrumbProps = BreadcrumbProps & {
  collapsedElement?: JSX.Element;
};

export const useBreadcrumb = ({
  items,
  variant = 'solid',
  size = 'md',
  rounded = false,
  className = '',
  shadow = false,
  startContent,
  endContent,
  hideSeparator = false,
  separator,
  maxItem = 2,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  iconCollapse,
  collapsedElement
}: UseBreadcrumbProps) => {
  const renderSeparator = (separator: string | IconName): string | JSX.Element => {
    const controlString = /[->/|](?![a-zA-Z0-9])/;
    return controlString.test(separator) ? separator : <DynamicIcon name={separator as IconName} />;
  };

  const itemsCollapsed = (
    items: BreadcrumbItem[],
    maxItemToShow: number,
    itemsAfterCollapseToShow: number,
    itemsBeforeCollapseToShow: number
  ): BreadcrumbItemCollapsed[] => {
    if (items.length <= maxItemToShow) {
      return items;
    }

    if (maxItemToShow < 2) {
      return items;
    }
    if (itemsBeforeCollapseToShow + itemsAfterCollapseToShow > maxItemToShow) {
      return items;
    }
    if (itemsBeforeCollapseToShow > maxItemToShow - 1) {
      return items;
    }
    if (itemsAfterCollapseToShow > maxItemToShow - 1) {
      return items;
    }

    const firstElementBeforeCollapse = items.slice(0, itemsBeforeCollapseToShow);
    const lastElementsAfterCollapse = items.slice(-itemsAfterCollapseToShow);

    const collapsedElementJsx: JSX.Element = collapsedElement || (
      <span key='collapsed-icon'>
        <DynamicIcon name={iconCollapse as IconName} />
      </span>
    );

    return [...firstElementBeforeCollapse, collapsedElementJsx, ...lastElementsAfterCollapse];
  };

  const isBreadcrumbItem = (item: BreadcrumbItem | JSX.Element): item is BreadcrumbItem => {
    return typeof item === 'object' && item !== null && 'title' in item && 'href' in item;
  };

  const processedItems = itemsCollapsed(items, maxItem, itemsAfterCollapse, itemsBeforeCollapse);

  return {
    items,
    variant,
    size,
    rounded,
    className,
    shadow,
    startContent,
    endContent,
    hideSeparator,
    separator,
    processedItems,
    iconCollapse,
    renderSeparator,
    isBreadcrumbItem
  };
};
