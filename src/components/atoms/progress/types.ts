import { cva } from 'class-variance-authority';

export const progressVariants = cva('', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    }
  },
  defaultVariants: {
    size: 'md',
    rounded: 'full'
  }
});

type ProgressSize = 'sm' | 'md' | 'lg';
type ProgressColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type ProgressRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type ProgressProps = {
  /**
   * @control number
   * @description Current progress value (clamped between minValue and maxValue)
   */
  value?: number;

  /**
   * @control number
   * @default 0
   * @description Minimum value of the range
   */
  minValue?: number;

  /**
   * @control number
   * @default 100
   * @description Maximum value of the range
   */
  maxValue?: number;

  /**
   * @control boolean
   * @default false
   * @description Indeterminate mode
   */
  isIndeterminate?: boolean;

  /**
   * @control text
   * @description Label for the progress bar
   */
  label?: string;

  /**
   * @control boolean
   * @default false
   * @description Shows the value label
   */
  showValueLabel?: boolean;

  /**
   * @control select
   * @default md
   * @description Size of the progress bar
   */
  size?: ProgressSize;

  /**
   * @control select
   * @default default
   * @description Color theme of the progress bar
   */
  color?: ProgressColor;

  /**
   * @control select
   * @default full
   * @description Border radius of the progress bar
   */
  rounded?: ProgressRounded;

  /**
   * @control text
   * @description Additional CSS classes
   */
  className?: string;
};
