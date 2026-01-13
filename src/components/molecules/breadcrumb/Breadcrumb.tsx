import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { FC } from 'react';
import React, { useId } from 'react';
import Link from '../../atoms/link';
import Text from '../../atoms/text';
import './breadcrumb.css';
import { type BreadcrumbItem, type BreadcrumbProps, breadcrumbBase } from './types';
import { useBreadcrumb } from './useBreadcrumb';

const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const {
    maxItem = 0,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    separatorClassName,
    linkClassName,
    textClassName,
    containerClassName,
    state,
    ...restProps
  } = props;

  const uniqueId = useId();
  const ariaLabel = props['aria-label'] || `Breadcrumb navigation ${uniqueId}`;

  const {
    processedItems,
    renderSeparator,
    isBreadcrumbItem,
    endContent,
    hideSeparator,
    rounded,
    separator,
    size,
    iconSizes,
    startContent,
    variant,
    isHovered,
    handleMouseEnter,
    handleMouseLeave
  } = useBreadcrumb({
    ...restProps,
    maxItem,
    itemsBeforeCollapse,
    itemsAfterCollapse
  });

  const getCurrentState = () => {
    if (isHovered) {
      return 'hovered';
    }
    return 'default';
  };

  const renderBreadcrumbItem = (item: BreadcrumbItem | React.ReactNode, isLast: boolean) => {
    if (!isBreadcrumbItem(item)) {
      return <span title='Breadcrumb navigation item'>{item}</span>;
    }
    return (
      <>
        {renderStarOrEndIcon(startContent)}
        {renderTextOrLinkItem(item, isLast)}
        {renderStarOrEndIcon(endContent)}
      </>
    );
  };

  const renderStarOrEndIcon = (iconItem: React.ReactNode) => {
    if (!iconItem) {
      return null;
    }

    return (
      <span className='mx-1'>
        <DynamicIcon name={iconItem as IconName} className={cn(linkClassName)} size={iconSizes} aria-hidden='true' />
      </span>
    );
  };

  const renderTextOrLinkItem = (item: BreadcrumbItem, isLast: boolean) => {
    if (isLast) {
      return (
        <Text tag='span' className={cn(linkClassName, textClassName)} aria-current='page'>
          {item.title}
        </Text>
      );
    }
    return (
      <Link
        title={`Navigate to ${item.title}`}
        href={item.href}
        target={item.target}
        size={['md', 'sm', 'lg'].includes(size as string) ? (size as 'md' | 'sm' | 'lg') : 'md'}
        className={cn(linkClassName)}
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
          className={cn(linkClassName, separatorClassName)}
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
    <nav aria-label={ariaLabel} role='navigation' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ol
        className={cn(
          breadcrumbBase({
            variant,
            size,
            rounded,
            state: getCurrentState(),
            hovered: isHovered
          }),
          containerClassName
        )}
      >
        {processedItems.map(({ item, isLast }, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            <li className={cn('flex items-center')}>{renderBreadcrumbItem(item, isLast)}</li>
            {renderSeparatorElement(isLast)}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
