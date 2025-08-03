import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { FC } from 'react';
import React from 'react';
import Link from '../../atoms/link';
import { type BreadcrumbProps, breadcrumbVariants } from './types';
import { useBreadcrumb } from './useBreadcrumb';

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
    shadow,
    size,
    startContent,
    variant,
    classText
  } = useBreadcrumb({ ...props });

  return (
    <nav aria-label='Breadcrumb'>
      <ol className={cn('w-auto', className, breadcrumbVariants({ variant, size, rounded, shadow }))}>
        {processedItems.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            <li className='flex items-center'>
              {isBreadcrumbItem(item) ? (
                <>
                  {startContent && (
                    <DynamicIcon name={startContent as IconName} className={classText(props.colorText ?? '')} />
                  )}
                  <Link
                    title={item.title}
                    href={item.href}
                    target={item.target}
                    size={size}
                    className={classText(props.colorText ?? '')}
                  >
                    {item.title}
                  </Link>
                  {endContent && (
                    <DynamicIcon name={endContent as IconName} className={classText(props.colorText ?? '')} />
                  )}
                </>
              ) : (
                <span>{item}</span>
              )}
            </li>
            <li>
              {!hideSeparator && index < processedItems.length - 1 && (
                <span className={`px-1 ${classText(props.colorText ?? '')}`} aria-hidden={separator !== '/'}>
                  {separator && renderSeparator(separator)}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
