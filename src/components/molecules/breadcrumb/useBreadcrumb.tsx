import type { VariantProps } from 'class-variance-authority';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { type ComponentProps, type MouseEvent, type ReactNode, useState } from 'react';
import type { BreadcrumbItem, BreadcrumbProps, ProcessedBreadcrumbItem, breadcrumbBase } from './types';

type BreadcrumbItemCollapsed = BreadcrumbItem | ReactNode;

export const useBreadcrumb = ({
  items,
  variant = 'regular',
  size = 'md',
  iconSizes = 18,
  rounded = 'md',
  startContent,
  endContent,
  hideSeparator = false,
  separator = '/',
  maxItem = 0,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  iconCollapse = 'more-horizontal',
  collapsedElement,
  onCollapsedClick,
  onMouseEnter,
  onMouseLeave,
  showTooltip = false
}: Omit<VariantProps<typeof breadcrumbBase>, 'state' | 'focused'> & BreadcrumbProps & ComponentProps<'nav'>) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  const controlString = /[->/|](?![a-zA-Z0-9])/;
  const renderSeparator = (separator: ReactNode): ReactNode => {
    if (typeof separator === 'string') {
      return controlString.test(separator) ? (
        <span aria-hidden='true' title='Breadcrumb separator'>
          {separator}
        </span>
      ) : (
        <DynamicIcon name={separator as IconName} size={iconSizes} aria-hidden='true' />
      );
    }
    return separator;
  };

  const getHiddenItems = (): BreadcrumbItem[] => {
    if (items.length <= maxItem) {
      return [];
    }
    return items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse);
  };

  const itemsCollapsed = (): BreadcrumbItemCollapsed[] => {
    if (
      maxItem === 0 ||
      items.length <= maxItem ||
      maxItem < 2 ||
      itemsBeforeCollapse + itemsAfterCollapse > maxItem ||
      itemsBeforeCollapse > maxItem - 1 ||
      itemsAfterCollapse > maxItem - 1
    ) {
      return items;
    }

    const hiddenItems = getHiddenItems();
    const hiddenItemsText = hiddenItems.map((item) => item.title).join(', ');
    const collapsedElementJsx: ReactNode = collapsedElement ?? (
      <span
        key='collapsed-icon'
        className={`hover:cursor-pointer transition-colors inline-flex items-center`}
        title={
          showTooltip
            ? `${hiddenItems.length} hidden items: ${hiddenItemsText}`
            : `Show ${hiddenItems.length} hidden items`
        }
        role='button'
        tabIndex={0}
        onClick={() => onCollapsedClick?.(hiddenItems)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCollapsedClick?.(hiddenItems);
          }
        }}
      >
        {iconCollapse && <DynamicIcon name={iconCollapse as IconName} size={iconSizes} aria-hidden='true' />}
        <span className='sr-only'>
          Show {hiddenItems.length} hidden navigation items: {hiddenItemsText}
        </span>
      </span>
    );

    return [...items.slice(0, itemsBeforeCollapse), collapsedElementJsx, ...items.slice(-itemsAfterCollapse)];
  };

  const isBreadcrumbItem = (item: BreadcrumbItem | ReactNode): item is BreadcrumbItem =>
    typeof item === 'object' && item !== null && 'title' in item && 'href' in item;

  const processedItems: ProcessedBreadcrumbItem[] = itemsCollapsed().map((item, index, arr) => ({
    item,
    isLast: index === arr.length - 1
  }));

  return {
    items,
    variant,
    size,
    iconSizes,
    rounded,
    startContent,
    endContent,
    hideSeparator,
    separator,
    processedItems,
    iconCollapse,
    renderSeparator,
    isBreadcrumbItem,
    getHiddenItems,
    handleMouseEnter,
    handleMouseLeave,
    showTooltip,
    isHovered,
    setIsHovered
  };
};
