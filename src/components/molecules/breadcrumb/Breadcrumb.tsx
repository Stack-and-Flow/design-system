import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { FC } from 'react';
import React, { useId } from 'react';
import Link from '../../atoms/link';
import Text from '../../atoms/text';
import './breadcrumb.css';
import { type BreadcrumbItem, type BreadcrumbProps, breadcrumbVariants } from './types';
import { useBreadcrumb } from './useBreadcrumb';

const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const {
    maxItem = 0,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    separatorClassName,
    itemClassName,
    containerClassName,
    ...restProps
  } = props;

  const uniqueId = useId();
  const ariaLabel = props['aria-label'] || `Breadcrumb navigation ${uniqueId}`;

  const {
    processedItems,
    renderSeparator,
    isBreadcrumbItem,
    className,
    endContent,
    hideSeparator,
    rounded,
    separator,
    size,
    iconSizes,
    startContent,
    variant,
    bgColor,
    getAccessibleTextColors
  } = useBreadcrumb({
    ...restProps,
    maxItem,
    itemsBeforeCollapse,
    itemsAfterCollapse
  });

  const accessibleColors = getAccessibleTextColors();

  const renderBreadcrumbItem = (item: BreadcrumbItem | React.ReactNode, isLast: boolean) => {
    if (!isBreadcrumbItem(item)) {
      return (
        <span className={accessibleColors.text} title='Breadcrumb navigation item'>
          {item}
        </span>
      );
    }

    const itemContent = (
      <>
        {renderStartIcon()}
        {renderItemText(item, isLast)}
        {renderEndIcon()}
      </>
    );

    return itemContent;
  };

  const renderStartIcon = () => {
    if (!startContent) {
      return null;
    }

    return (
      <span className='mx-1'>
        <DynamicIcon
          name={startContent as IconName}
          className={cn('breadcrumb-link', accessibleColors.text)}
          size={iconSizes}
          aria-hidden='true'
        />
      </span>
    );
  };

  const renderEndIcon = () => {
    if (!endContent) {
      return null;
    }

    return (
      <span className='mx-1'>
        <DynamicIcon
          name={endContent as IconName}
          className={cn('breadcrumb-link', accessibleColors.text)}
          size={iconSizes}
          aria-hidden='true'
        />
      </span>
    );
  };

  const renderItemText = (item: BreadcrumbItem, isLast: boolean) => {
    if (isLast) {
      return (
        <Text tag='span' className={cn(accessibleColors.text, 'cursor-default font-medium')} aria-current='page'>
          {item.title}
        </Text>
      );
    }

    return (
      <Link
        title={`Navigate to ${item.title}`}
        href={item.href}
        target={item.target}
        size={['md', 'sm', 'lg'].includes(size as string) ? (size as 'md' | 'sm' | 'lg') : 'md'} //TODO change for link variable
        className={cn(accessibleColors.text)}
        aria-label={`Navigate to ${item.title}`}
      >
        {item.title}
      </Link>
    );
  };

  const renderSeparatorElement = (isLast: boolean) => {
    if (hideSeparator || isLast) {
      return null;
    }

    return (
      <li aria-hidden='true'>
        <span
          className={cn(accessibleColors.separator, separatorClassName)}
          aria-hidden='true'
          role='separator'
          title='Path separator'
        >
          {separator && renderSeparator(separator)}
        </span>
      </li>
    );
  };

  return (
    <nav aria-label={ariaLabel} role='navigation'>
      <ol className={cn(breadcrumbVariants({ variant, bgColor, size, rounded }), className)}>
        {processedItems.map(({ item, isLast }, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            <li className={cn('flex items-center', itemClassName)}>{renderBreadcrumbItem(item, isLast)}</li>
            {renderSeparatorElement(isLast)}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
