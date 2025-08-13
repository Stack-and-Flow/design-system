import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { FC } from 'react';
import React from 'react';
import Link from '../../atoms/link';
import Text from '../../atoms/text';
import './breadcrumb.css';
import { type BreadcrumbProps, breadcrumbVariants } from './types';
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

  return (
    <nav aria-label={props['aria-label'] ?? 'Breadcrumb navigation'} role='navigation' className={containerClassName}>
      <ol className={cn('w-auto', breadcrumbVariants({ variant, bgColor, size, rounded }), className)}>
        {processedItems.map(({ item, isLast }, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            <li className={cn('flex items-center', itemClassName)}>
              {isBreadcrumbItem(item) ? (
                <>
                  {startContent && (
                    <span className='mr-1'>
                      <DynamicIcon
                        name={startContent as IconName}
                        className={cn('breadcrumb-link', accessibleColors.text)}
                        size={iconSizes}
                        aria-hidden='true'
                      />
                    </span>
                  )}

                  {isLast ? (
                    <Text
                      tag='span'
                      className={cn(accessibleColors.text, 'cursor-default font-medium')}
                      aria-current='page'
                    >
                      {item.title}
                    </Text>
                  ) : (
                    <Link
                      title={item.title}
                      href={item.href}
                      target={item.target}
                      size='md'
                      className={cn(accessibleColors.text)}
                      aria-label={`Go to ${item.title}`}
                    >
                      {item.title}
                    </Link>
                  )}

                  {endContent && (
                    <span className='ml-1'>
                      <DynamicIcon
                        name={endContent as IconName}
                        className={cn('breadcrumb-link', accessibleColors.text)}
                        size={iconSizes}
                        aria-hidden='true'
                      />
                    </span>
                  )}
                </>
              ) : (
                <span className={accessibleColors.text}>{item}</span>
              )}
            </li>

            {!hideSeparator && !isLast && (
              <li>
                <span className={cn(accessibleColors.separator, separatorClassName)} aria-hidden='true'>
                  {separator && renderSeparator(separator)}
                </span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
