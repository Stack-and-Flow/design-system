import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { ReactNode } from 'react';
import type { BreadcrumbItem, BreadcrumbProps } from './types';

type BreadcrumbItemCollapsed = BreadcrumbItem | ReactNode;

const ACCESSIBLE_TEXT_COLORS: Record<
  NonNullable<BreadcrumbProps['bgColor']>,
  {
    light: string;
    dark: string;
    hover: string;
    separator: string;
  }
> = {
  default: {
    light: 'text-slate-700 hover:text-slate-900',
    dark: 'dark:text-slate-200 dark:hover:text-white',
    hover: 'hover:text-slate-900 dark:hover:text-white',
    separator: 'text-slate-500 dark:text-slate-400'
  },
  primary: {
    light: 'text-white',
    dark: 'dark:text-white',
    hover: 'hover:text-blue-50',
    separator: 'text-blue-100 dark:text-blue-200'
  },
  secondary: {
    light: 'text-slate-700',
    dark: 'dark:text-slate-200',
    hover: 'hover:text-slate-900 dark:hover:text-white',
    separator: 'text-slate-500 dark:text-slate-400'
  },
  success: {
    light: 'text-white',
    dark: 'dark:text-white',
    hover: 'hover:text-green-50',
    separator: 'text-green-100 dark:text-green-200'
  },
  warning: {
    light: 'text-white',
    dark: 'dark:text-white',
    hover: 'hover:text-amber-50',
    separator: 'text-amber-100 dark:text-amber-200'
  },
  error: {
    light: 'text-white',
    dark: 'dark:text-white',
    hover: 'hover:text-red-50',
    separator: 'text-red-100 dark:text-red-200'
  },
  transparent: {
    light: 'text-slate-700',
    dark: 'dark:text-slate-200',
    hover: 'hover:text-slate-900 dark:hover:text-white',
    separator: 'text-slate-500 dark:text-slate-400'
  }
};

const ACCESSIBLE_BORDER_COLORS: Record<NonNullable<BreadcrumbProps['bgColor']>, string> = {
  default: 'border-slate-300 dark:border-slate-600',
  primary: 'border-blue-600 dark:border-blue-500',
  secondary: 'border-slate-300 dark:border-slate-600',
  success: 'border-green-600 dark:border-green-500',
  warning: 'border-amber-500 dark:border-amber-400',
  error: 'border-red-600 dark:border-red-500',
  transparent: 'border-transparent'
};

export interface ProcessedBreadcrumbItem {
  item: BreadcrumbItemCollapsed;
  isLast: boolean;
}

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
  colorText
}: BreadcrumbProps) => {
  const getAccessibleTextColors = () => {
    if (colorText) {
      return {
        text: colorText,
        separator: colorText
      };
    }
    const colors = ACCESSIBLE_TEXT_COLORS[bgColor] || ACCESSIBLE_TEXT_COLORS.default;
    return {
      text: `${colors.light} ${colors.dark} ${colors.hover}`,
      separator: `${colors.light} ${colors.dark} ${colors.hover}`
    };
  };

  const getBorderColorClass = (): string => {
    return ACCESSIBLE_BORDER_COLORS[bgColor] || '';
  };

  const renderSeparator = (separator: ReactNode): ReactNode => {
    if (typeof separator === 'string') {
      const controlString = /[->/|](?![a-zA-Z0-9])/;
      return controlString.test(separator) ? (
        <span className={`text-[${iconSizes}px] ${getAccessibleTextColors().separator}`}>{separator}</span>
      ) : (
        <DynamicIcon name={separator as IconName} size={iconSizes} className={getAccessibleTextColors().separator} />
      );
    }
    return separator;
  };

  const getHiddenItems = (): BreadcrumbItem[] => {
    if (maxItem === 0 || items.length <= maxItem) {
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

    const collapsedElementJsx: ReactNode = collapsedElement ?? (
      <span
        key='collapsed-icon'
        className={`hover:cursor-pointer ${getAccessibleTextColors().text}`}
        title={`${getHiddenItems().length} hidden items`}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Aquí se podría expandir el breadcrumb
          }
        }}
      >
        {iconCollapse && <DynamicIcon name={iconCollapse as IconName} size={iconSizes} />}
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
    getHiddenItems
  };
};
