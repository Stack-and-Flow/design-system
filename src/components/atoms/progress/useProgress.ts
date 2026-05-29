import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { type ProgressProps, progressIndicatorVariants, progressVariants } from './types';

type ProgressNativeProps = Omit<
  ProgressProps,
  | 'aria-label'
  | 'aria-labelledby'
  | 'className'
  | 'color'
  | 'isIndeterminate'
  | 'label'
  | 'maxValue'
  | 'minValue'
  | 'rounded'
  | 'showValueLabel'
  | 'size'
  | 'value'
>;

export type UseProgressReturn = {
  ariaLabel: string | undefined;
  ariaLabelledBy: ProgressProps['aria-labelledby'];
  ariaValueMax: number;
  ariaValueMin: number;
  ariaValueNow: number | undefined;
  className: ProgressProps['className'];
  clampedValue: number;
  indicatorClassName: string;
  indicatorStyle: CSSProperties | undefined;
  isIndeterminate: boolean;
  label: ProgressProps['label'];
  percentage: number;
  rootProps: ProgressNativeProps;
  trackClassName: string;
  valueLabel: string | undefined;
};

export const useProgress = ({
  value = 0,
  minValue = 0,
  maxValue = 100,
  isIndeterminate = false,
  label,
  showValueLabel = false,
  size = 'md',
  color = 'default',
  rounded = 'full',
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...restProps
}: ProgressProps): UseProgressReturn => {
  const safeMinValue = Number.isFinite(minValue) ? minValue : 0;
  const safeMaxValue = Number.isFinite(maxValue) ? maxValue : 100;
  const safeValue = Number.isFinite(value) ? value : safeMinValue;
  const hasValidRange = safeMaxValue > safeMinValue;
  const clampedValue = hasValidRange ? Math.min(Math.max(safeValue, safeMinValue), safeMaxValue) : safeMinValue;
  const percentage = hasValidRange ? ((clampedValue - safeMinValue) / (safeMaxValue - safeMinValue)) * 100 : 0;
  const boundedPercentage = Math.min(Math.max(percentage, 0), 100);

  const trackClassName = progressVariants({
    size,
    rounded,
    color
  });

  const indicatorClassName = cn(
    progressIndicatorVariants({
      rounded,
      color
    }),
    isIndeterminate
      ? 'progress-indeterminate-bar'
      : 'w-full transition-transform duration-300 ease-in-out motion-reduce:transition-none'
  );

  return {
    ariaLabel: ariaLabelledBy ? undefined : (ariaLabel ?? label ?? 'Progress'),
    ariaLabelledBy,
    ariaValueMax: hasValidRange ? safeMaxValue : safeMinValue,
    ariaValueMin: safeMinValue,
    ariaValueNow: isIndeterminate ? undefined : clampedValue,
    className,
    clampedValue,
    indicatorClassName,
    indicatorStyle: isIndeterminate ? undefined : { width: '100%', transform: `scaleX(${boundedPercentage / 100})` },
    isIndeterminate,
    label,
    percentage: boundedPercentage,
    rootProps: restProps,
    trackClassName,
    valueLabel: showValueLabel && !isIndeterminate ? `${Math.round(boundedPercentage)}%` : undefined
  };
};
