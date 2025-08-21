import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { ReactNode } from 'react';
import type { BreadcrumbItem, BreadcrumbProps, ProcessedBreadcrumbItem } from './types';
import { ACCESSIBLE_BORDER_COLORS, ACCESSIBLE_TEXT_COLORS, BREADCRUMB_TEXT_COLORS, SEPARATOR_PATTERNS } from './types';

type BreadcrumbItemCollapsed = BreadcrumbItem | ReactNode;

export const useBreadcrumb = ({
  items,
  variant = 'regular',
  bgColor = 'default',
  size = 'md',
  iconSizes = 18,
  rounded = 'md',
  className = '',
  startContent,
  endContent,
  hideSeparator = false,
  separator = '/',
  maxItem = 0,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  iconCollapse = 'more-horizontal',
  collapsedElement,
  textColor,
  colorSeparator,
  onCollapsedClick,
  showTooltip = false,
  truncateLength,
  showHomeIcon = false,
  homeIcon = 'home'
}: BreadcrumbProps) => {
  const getAccessibleTextColors = () => {
    if (textColor) {
      const predefinedColor = BREADCRUMB_TEXT_COLORS[textColor as keyof typeof BREADCRUMB_TEXT_COLORS];
      if (predefinedColor) {
        return {
          text: predefinedColor,
          separator: colorSeparator || predefinedColor
        };
      }

      const hasUtilities = textColor.includes('dark:') || textColor.includes('hover:');
      const finaltextColor = hasUtilities
        ? textColor
        : `${textColor} dark:${textColor.replace('text-', 'dark:text-')} hover:opacity-80`;

      return {
        text: finaltextColor,
        separator: colorSeparator || finaltextColor
      };
    }

    const colors = ACCESSIBLE_TEXT_COLORS[bgColor] || ACCESSIBLE_TEXT_COLORS.default;
    return {
      text: `${colors.light} ${colors.dark} ${colors.hover}`,
      separator: colorSeparator || `${colors.separator}`
    };
  };

  const getBorderColorClass = (): string => {
    return ACCESSIBLE_BORDER_COLORS[bgColor] || '';
  };

  const renderSeparator = (separator: ReactNode): ReactNode => {
    if (typeof separator === 'string') {
      return SEPARATOR_PATTERNS.controlString.test(separator) ? (
        <span
          className={`text-[${iconSizes}px] ${getAccessibleTextColors().separator}`}
          aria-hidden='true'
          title='Breadcrumb separator'
        >
          {separator}
        </span>
      ) : (
        <DynamicIcon
          name={separator as IconName}
          size={iconSizes}
          className={getAccessibleTextColors().separator}
          aria-hidden='true'
        />
      );
    }
    return separator;
  };

  const truncateText = (text: string, length?: number): string => {
    if (!length || text.length <= length) {
      return text;
    }
    return `${text.slice(0, length)}...`;
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
        className={`hover:cursor-pointer ${getAccessibleTextColors().text} transition-colors inline-flex items-center`}
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
    bgColor,
    size,
    iconSizes,
    rounded,
    className,
    startContent,
    endContent,
    hideSeparator,
    separator,
    processedItems,
    iconCollapse,
    renderSeparator,
    isBreadcrumbItem,
    getAccessibleTextColors,
    getBorderColorClass,
    getHiddenItems,
    truncateText,
    showTooltip,
    truncateLength,
    showHomeIcon,
    homeIcon
  };
};
