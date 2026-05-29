import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { ProgressProps } from './types';
import { useProgress } from './useProgress';

export const Progress: FC<ProgressProps> = (props) => {
  const {
    ariaLabel,
    ariaLabelledBy,
    ariaValueMax,
    ariaValueMin,
    ariaValueNow,
    className,
    indicatorClassName,
    indicatorStyle,
    label,
    rootProps,
    trackClassName,
    valueLabel
  } = useProgress(props);

  return (
    <div
      {...rootProps}
      className={cn('w-full', className)}
      role='progressbar'
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
    >
      {(label || valueLabel) && (
        <div className='mb-2 flex items-center justify-between gap-2'>
          {label && <span className='text-sm text-text-light dark:text-text-dark'>{label}</span>}
          {valueLabel && <span className='text-sm font-medium text-text-light dark:text-text-dark'>{valueLabel}</span>}
        </div>
      )}

      <div className={trackClassName}>
        <div className={indicatorClassName} style={indicatorStyle} />
      </div>
    </div>
  );
};
