import { DynamicIcon, type IconName } from 'lucide-react/dynamic.js';
import { type FC, type ReactNode, useId, useState } from 'react';
import { cn } from '@/lib/utils';
import { type BreadcrumbContent, type BreadcrumbItem, type BreadcrumbProps, breadcrumbBase } from './types';
import { useBreadcrumb } from './useBreadcrumb';

const breadcrumbTextSizeClass = {
  xs: 'fs-xs',
  sm: 'fs-small',
  md: 'fs-base',
  lg: 'fs-h6',
  xl: 'fs-h5'
} as const;

const breadcrumbItemBaseClass =
  'inline-flex min-w-0 max-w-full items-center gap-1 border-b border-transparent font-medium text-text-light no-underline transition-[color,border-color,box-shadow] duration-200 ease-[ease] hover:border-brand-light-dark/80 hover:text-brand-light-dark hover:no-underline focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:text-text-dark dark:hover:border-brand-dark-light dark:hover:text-brand-dark-light dark:focus-visible:shadow-glow-focus-dark';

const Breadcrumb: FC<BreadcrumbProps> = ({
  'aria-label': ariaLabel,
  collapsedElement,
  containerClassName,
  isNavigationDisabled = false,
  items,
  linkClassName,
  onCollapsedClick,
  onItemClick,
  separatorClassName,
  textClassName,
  ...breadcrumbProps
}) => {
  const {
    processedItems,
    endContent,
    hideSeparator,
    iconCollapse,
    iconSizes,
    rounded,
    separator,
    showTooltip,
    size,
    startContent,
    variant
  } = useBreadcrumb({
    items,
    ...breadcrumbProps
  });

  const itemSizeClass = breadcrumbTextSizeClass[size ?? 'md'];
  const collapsedMenuId = useId();
  const [isCollapsedMenuOpen, setIsCollapsedMenuOpen] = useState(false);

  const renderAdornment = (content?: BreadcrumbContent) => {
    if (!content) {
      return null;
    }

    if (typeof content === 'string') {
      return <DynamicIcon name={content as IconName} size={iconSizes} className='shrink-0' aria-hidden='true' />;
    }

    return <span className='inline-flex shrink-0 items-center'>{content}</span>;
  };

  const renderItemContent = (item: BreadcrumbItem) => (
    <>
      {renderAdornment(item.icon)}
      {renderAdornment(item.startContent ?? startContent)}
      <span className='truncate'>{item.title}</span>
      {renderAdornment(item.endContent ?? endContent)}
    </>
  );

  const renderSeparator = (separatorContent: ReactNode) => {
    if (typeof separatorContent === 'string') {
      return <span aria-hidden='true'>{separatorContent}</span>;
    }

    return separatorContent;
  };

  const renderCollapsedItem = (hiddenItems: BreadcrumbItem[], hiddenItemIndexes: number[]) => {
    const hiddenItemsText = hiddenItems.map((item) => item.title).join(', ');

    return (
      <>
        <button
          type='button'
          className='inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-sm border border-transparent px-1 text-text-light transition-[background-color,border-color,color,box-shadow] duration-200 ease-[ease] hover:bg-black-tint-low hover:text-brand-light-dark focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:text-text-dark dark:hover:border-white-tint-high dark:hover:bg-white-tint-faint dark:hover:text-brand-dark-light dark:focus-visible:shadow-glow-focus-dark'
          aria-label={`Show ${hiddenItems.length} hidden breadcrumb items`}
          aria-expanded={isCollapsedMenuOpen}
          aria-controls={collapsedMenuId}
          title={showTooltip ? `${hiddenItems.length} hidden items: ${hiddenItemsText}` : undefined}
          onClick={() => {
            setIsCollapsedMenuOpen((isOpen) => !isOpen);
            onCollapsedClick?.(hiddenItems);
          }}
        >
          {collapsedElement ?? renderAdornment(iconCollapse)}
          <span className='sr-only'>Show hidden breadcrumb items: {hiddenItemsText}</span>
        </button>
        {isCollapsedMenuOpen && (
          <div
            id={collapsedMenuId}
            role='list'
            className='absolute left-0 top-full z-20 mt-2 min-w-40 rounded-md border border-border-light bg-background-light p-1 shadow-[var(--shadow-dropdown-light)] dark:border-border-dark dark:bg-surface-dark dark:shadow-[var(--shadow-dropdown)]'
          >
            {hiddenItems.map((item, itemPosition) => {
              const itemIndex = hiddenItemIndexes[itemPosition];
              const itemKey = `${item.href ?? item.title}-${itemIndex}`;
              const isHiddenItemInteractive = !isNavigationDisabled && !item.disabled && Boolean(item.href);
              const hiddenItemClassName =
                'flex w-full min-w-0 items-center gap-2 rounded-sm px-3 py-2 font-medium text-text-light no-underline transition-[background-color,color,box-shadow] duration-200 ease-[ease] hover:bg-black-tint-low hover:text-brand-light-dark hover:no-underline focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:text-text-dark dark:hover:bg-white-tint-faint dark:hover:text-brand-dark-light dark:focus-visible:shadow-glow-focus-dark';

              return (
                <div key={itemKey} role='listitem'>
                  {isHiddenItemInteractive ? (
                    <a
                      href={item.href}
                      target={item.target}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className={hiddenItemClassName}
                      onClick={() => {
                        setIsCollapsedMenuOpen(false);
                        onItemClick?.(item, itemIndex);
                      }}
                    >
                      {renderItemContent(item)}
                    </a>
                  ) : (
                    <span
                      aria-disabled={item.disabled ? true : undefined}
                      className={cn(
                        hiddenItemClassName,
                        'cursor-default hover:bg-transparent hover:text-text-light dark:hover:text-text-dark',
                        item.disabled && 'opacity-40'
                      )}
                    >
                      {renderItemContent(item)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  const renderBreadcrumbItem = (item: BreadcrumbItem, originalIndex: number, isLast: boolean) => {
    const isInteractive = !isLast && !isNavigationDisabled && !item.disabled && Boolean(item.href);

    if (isInteractive) {
      return (
        <a
          href={item.href}
          target={item.target}
          rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
          className={cn(breadcrumbItemBaseClass, itemSizeClass, linkClassName)}
          onClick={() => onItemClick?.(item, originalIndex)}
        >
          {renderItemContent(item)}
        </a>
      );
    }

    return (
      <span
        aria-current={isLast ? 'page' : undefined}
        aria-disabled={!isLast && (isNavigationDisabled || item.disabled) ? true : undefined}
        className={cn(
          'inline-flex min-w-0 max-w-full items-center gap-1 cursor-default border-b border-transparent font-medium',
          itemSizeClass,
          isLast
            ? 'pointer-events-none text-text-light dark:text-text-dark'
            : 'text-text-light opacity-60 dark:text-text-dark',
          textClassName
        )}
      >
        {renderItemContent(item)}
      </span>
    );
  };

  return (
    <nav aria-label={ariaLabel ?? 'Breadcrumb'} role='navigation'>
      <ol className={cn(breadcrumbBase({ rounded, size, variant }), containerClassName)}>
        {processedItems.map((entry) => (
          <li
            key={
              entry.type === 'collapsed'
                ? `breadcrumb-collapsed-${entry.hiddenItemIndexes.join('-')}`
                : `breadcrumb-${entry.originalIndex}-${entry.item.href ?? entry.item.title}`
            }
            className='relative flex min-w-0 items-center gap-1'
          >
            {entry.type === 'collapsed'
              ? renderCollapsedItem(entry.hiddenItems, entry.hiddenItemIndexes)
              : renderBreadcrumbItem(entry.item, entry.originalIndex, entry.isLast)}
            {!hideSeparator && !entry.isLast && (
              <span
                className={cn(
                  'inline-flex items-center text-text-secondary-light dark:text-text-secondary-dark',
                  separatorClassName
                )}
                aria-hidden='true'
                role='presentation'
              >
                {renderSeparator(separator)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
