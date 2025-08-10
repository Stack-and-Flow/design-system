import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { FC } from 'react';
import React from 'react';
import Link from '../../atoms/link';
import './breadcrumb.css';
import { type BreadcrumbProps, breadcrumbVariants } from './types';
import { useBreadcrumb } from './useBreadcrumb';

//TODO: APPLY MARGIN/PADDING PARAMS, ICON SIZE, SEPARATOR CLASS ICON CLASS
const Breadcrumb: FC<BreadcrumbProps> = ({ ...props }) => {
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
    startContent,
    variant,
    bgColor,
    classText
  } = useBreadcrumb({ ...props });

  return (
    <nav aria-label='Breadcrumb'>
      <ol className={cn('w-auto', className, breadcrumbVariants({ variant, bgColor, size, rounded }))}>
        {processedItems.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            <li className='flex items-center'>
              {isBreadcrumbItem(item) ? (
                <>
                  {startContent && (
                    <span>
                      <DynamicIcon
                        name={startContent as IconName}
                        className={cn('breadcrumb-link', classText(props.colorText ?? ''))}
                        size={18}
                      />
                    </span>
                  )}
                  <Link
                    title={item.title}
                    href={item.href}
                    target={item.target}
                    size={size}
                    className={cn(classText(props.colorText ?? ''))}
                  >
                    {item.title}
                  </Link>
                  {endContent && (
                    <span>
                      <DynamicIcon
                        name={endContent as IconName}
                        className={cn('breadcrumb-link', classText(props.colorText ?? ''))}
                        size={18}
                      />
                    </span>
                  )}
                </>
              ) : (
                <span>{item}</span>
              )}
            </li>
            {!hideSeparator && index < processedItems.length - 1 && (
              <li>
                <span className={cn(classText(props.colorText ?? ''))} aria-hidden={separator === '/'}>
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
