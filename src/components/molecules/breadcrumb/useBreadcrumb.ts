import type { BreadcrumbItem, BreadcrumbProps, ProcessedBreadcrumbItem } from './types';

const canCollapseItems = (
  items: BreadcrumbItem[],
  maxItems: number,
  itemsBeforeCollapse: number,
  itemsAfterCollapse: number
) => {
  if (maxItems === 0 || items.length <= maxItems || maxItems < 3) {
    return false;
  }

  if (itemsBeforeCollapse + itemsAfterCollapse + 1 > maxItems) {
    return false;
  }

  if (itemsBeforeCollapse > maxItems - 1 || itemsAfterCollapse > maxItems - 1) {
    return false;
  }

  return true;
};

export const useBreadcrumb = ({
  items,
  variant = 'regular',
  size = 'md',
  iconSizes = 18,
  rounded = 'md',
  radius,
  startContent,
  endContent,
  hideSeparator = false,
  separator = '/',
  maxItem = 0,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  iconCollapse = 'more-horizontal',
  showTooltip = false
}: BreadcrumbProps) => {
  const resolvedRounded = radius ?? rounded;
  const resolvedMaxItems = maxItems ?? maxItem;

  const indexedItems = items.map((item, originalIndex) => ({ item, originalIndex }));

  const hiddenEndIndex = itemsAfterCollapse > 0 ? items.length - itemsAfterCollapse : items.length;
  const leadingEntries = indexedItems.slice(0, itemsBeforeCollapse);
  const trailingEntries = itemsAfterCollapse > 0 ? indexedItems.slice(-itemsAfterCollapse) : [];
  const hiddenEntries = canCollapseItems(items, resolvedMaxItems, itemsBeforeCollapse, itemsAfterCollapse)
    ? indexedItems.slice(itemsBeforeCollapse, hiddenEndIndex)
    : [];

  const collapsedItems = hiddenEntries.length
    ? [
        ...leadingEntries.map(({ item, originalIndex }) => ({
          type: 'item' as const,
          item,
          originalIndex
        })),
        {
          type: 'collapsed' as const,
          hiddenItems: hiddenEntries.map(({ item }) => item),
          hiddenItemIndexes: hiddenEntries.map(({ originalIndex }) => originalIndex)
        },
        ...trailingEntries.map(({ item, originalIndex }) => ({
          type: 'item' as const,
          item,
          originalIndex
        }))
      ]
    : indexedItems.map(({ item, originalIndex }) => ({ type: 'item' as const, item, originalIndex }));

  const processedItems: ProcessedBreadcrumbItem[] = collapsedItems.map((entry, index, array) => ({
    ...entry,
    isLast: index === array.length - 1
  }));

  return {
    endContent,
    hideSeparator,
    iconCollapse,
    iconSizes,
    processedItems,
    rounded: resolvedRounded,
    separator,
    showTooltip,
    size,
    startContent,
    variant
  };
};
