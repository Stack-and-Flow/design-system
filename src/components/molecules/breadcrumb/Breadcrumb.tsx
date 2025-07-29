import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { FC } from 'react';
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
    variant
  } = useBreadcrumb({ ...props });

  return (
    <nav>
      <ul className={cn('w-auto', className, breadcrumbVariants({ variant, size, rounded, shadow }))}>
        {processedItems.map((item, index) => (
          <>
            <li className={cn('flex')} key={`breadcrumb-${index}`}>
              {isBreadcrumbItem(item) ? (
                <>
                  {startContent && <DynamicIcon name={startContent as IconName} />}
                  <Link title={item.title} href={item.href} target={item.target} size={size}>
                    {item.title}
                  </Link>
                  {endContent && <DynamicIcon name={endContent as IconName} />}
                </>
              ) : (
                <span>{item}</span>
              )}
            </li>
            <li key={`separator-${index}`}>
              {!hideSeparator && index < processedItems.length - 1 && (
                <span className='mx-1'>{renderSeparator(separator)}</span>
              )}
            </li>
          </>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
