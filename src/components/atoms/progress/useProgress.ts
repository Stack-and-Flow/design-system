import { type ProgressProps, progressVariants } from './types';

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
  className
}: ProgressProps) => {
  // Clamp value between minValue and maxValue
  const clampedValue = Math.min(Math.max(value, minValue), maxValue);

  // Calculate percentage
  const percentage = ((clampedValue - minValue) / (maxValue - minValue)) * 100;

  // Color classes for the progress bar
  const colorClasses = {
    default: 'bg-gray-light-400 dark:bg-gray-dark-400',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green',
    warning: 'bg-yellow',
    danger: 'bg-red-500'
  };

  // Background color for the track
  const trackColorClasses = {
    default: 'bg-gray-light-200 dark:bg-gray-dark-700',
    primary: 'bg-gray-light-200 dark:bg-gray-dark-700',
    secondary: 'bg-gray-light-200 dark:bg-gray-dark-700',
    success: 'bg-green-light dark:bg-green-dark',
    warning: 'bg-yellow-light dark:bg-yellow-dark',
    danger: 'bg-red-200 dark:bg-red-900'
  };

  const progressClass = progressVariants({
    size,
    rounded
  });

  const colorClass = colorClasses[color];
  const trackColorClass = trackColorClasses[color];

  return {
    clampedValue,
    percentage,
    isIndeterminate,
    label,
    showValueLabel,
    progressClass,
    colorClass,
    trackColorClass,
    className,
    minValue,
    maxValue
  };
};
