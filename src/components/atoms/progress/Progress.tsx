import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { ProgressProps } from './types';
import { useProgress } from './useProgress';

const Progress: FC<ProgressProps> = ({ ...props }) => {
  const {
    percentage,
    isIndeterminate,
    label,
    showValueLabel,
    progressClass,
    colorClass,
    trackColorClass,
    className,
    clampedValue,
    maxValue
  } = useProgress(props);

  return (
    <div
      className={cn('w-full', className)}
      role='progressbar'
      aria-valuemin={props.minValue}
      aria-valuemax={maxValue}
      aria-valuenow={isIndeterminate ? undefined : clampedValue}
      aria-label={label || 'Progress'}
    >
      {/* Label and value row */}
      {(label || showValueLabel) && (
        <div className='mb-2 flex justify-between items-center'>
          {label && <span className='text-sm text-gray-dark-900 dark:text-gray-light-100'>{label}</span>}
          {showValueLabel && !isIndeterminate && (
            <span className='text-sm text-gray-dark-900 dark:text-gray-light-100 font-medium'>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress track */}
      <div className={cn('w-full overflow-hidden', progressClass, trackColorClass)}>
        {/* Progress bar */}
        <div
          className={cn('h-full transition-all duration-300 ease-in-out', colorClass, {
            'animate-[progress-indeterminate_1.5s_ease-in-out_infinite]': isIndeterminate
          })}
          style={{
            width: isIndeterminate ? '30%' : `${percentage}%`
          }}
        />
      </div>
    </div>
  );
};

export default Progress;
