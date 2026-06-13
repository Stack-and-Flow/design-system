import type * as SliderPrimitive from '@radix-ui/react-slider';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

export const sliderRootVariants = cva(
  'relative flex touch-none select-none items-center data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
  { variants: { fullWidth: { true: 'w-full', false: 'w-auto min-w-44' } }, defaultVariants: { fullWidth: true } }
);

export const sliderTrackVariants = cva(
  'relative mx-5 grow overflow-hidden border transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none',
  {
    variants: {
      size: { sm: 'h-1', md: 'h-2', lg: 'h-3' },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
      },
      color: {
        default: 'border-red-tint-low bg-red-tint-subtle dark:border-red-tint-active dark:bg-red-tint-low',
        primary: 'border-red-tint-active bg-red-tint-low dark:border-red-tint-strong dark:bg-red-tint-active',
        secondary: 'border-border-light bg-border-light dark:border-border-dark dark:bg-surface-raised-dark',
        info: 'border-info-tint bg-info-tint',
        success: 'border-success-tint bg-success-tint',
        warning: 'border-warning-tint bg-warning-tint',
        danger: 'border-error-tint bg-error-tint'
      }
    },
    defaultVariants: { size: 'md', rounded: 'full', color: 'default' }
  }
);

export const sliderRangeVariants = cva('absolute h-full', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    },
    color: {
      default: 'bg-brand-light dark:bg-brand-dark',
      primary: 'bg-brand-light-dark dark:bg-brand-dark-light',
      secondary: 'bg-text-secondary-light dark:bg-border-strong-dark',
      info: 'bg-info-light dark:bg-info',
      success: 'bg-success-light dark:bg-success',
      warning: 'bg-warning-light dark:bg-warning',
      danger: 'bg-error-light dark:bg-error'
    }
  },
  defaultVariants: { rounded: 'full', color: 'default' }
});

export const sliderThumbVariants = cva(
  'group flex size-11 items-center justify-center transition-transform duration-150 ease-out active:scale-95 focus-visible:focus-ring motion-reduce:transition-none disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
      }
    },
    defaultVariants: { rounded: 'full' }
  }
);

export const sliderThumbVisualVariants = cva(
  'pointer-events-none block border bg-background-light transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none dark:bg-surface-dark',
  {
    variants: {
      size: { sm: 'size-3', md: 'size-4', lg: 'size-5' },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
      },
      color: {
        default:
          'border-brand-light group-hover:border-brand-light-light dark:border-brand-dark dark:group-hover:border-brand-dark-light',
        primary:
          'border-brand-light-dark group-hover:border-brand-light-light dark:border-brand-dark-light dark:group-hover:border-brand-dark-lighter',
        secondary:
          'border-text-secondary-light group-hover:border-text-light dark:border-border-strong-dark dark:group-hover:border-text-secondary-dark',
        info: 'border-info-light group-hover:border-info dark:border-info dark:group-hover:border-blue-light',
        success:
          'border-success-light group-hover:border-success dark:border-success dark:group-hover:border-green-light',
        warning:
          'border-warning-light group-hover:border-warning dark:border-warning dark:group-hover:border-yellow-light',
        danger: 'border-error-light group-hover:border-error dark:border-error dark:group-hover:border-brand-dark-light'
      }
    },
    defaultVariants: { size: 'md', rounded: 'full', color: 'default' }
  }
);

type RootVariants = VariantProps<typeof sliderRootVariants>;
type TrackVariants = VariantProps<typeof sliderTrackVariants>;
type RangeVariants = VariantProps<typeof sliderRangeVariants>;
type RadixRootProps = ComponentProps<typeof SliderPrimitive.Root>;
type NativeSliderProps = Omit<
  RadixRootProps,
  | 'asChild'
  | 'children'
  | 'className'
  | 'defaultValue'
  | 'dir'
  | 'inverted'
  | 'max'
  | 'min'
  | 'onValueChange'
  | 'onValueCommit'
  | 'orientation'
  | 'step'
  | 'value'
>;

export type SliderSize = NonNullable<TrackVariants['size']>;
export type SliderColor = NonNullable<RangeVariants['color']>;
export type SliderRounded = NonNullable<TrackVariants['rounded']>;

export type SliderProps = NativeSliderProps & {
  /** Controlled value as a one-item single slider or two-item range `number[]`. @control object */
  value?: number[];
  /** Initial value as a one-item single slider or two-item range `number[]`. @control object */
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  /** @control number @default 0 */
  min?: number;
  /** @control number @default 100 */
  max?: number;
  /** @control number @default 1 */
  step?: number;
  /** @control boolean @default false */
  disabled?: boolean;
  /** @control select @default md */
  size?: SliderSize;
  /** @control select @default default */
  color?: SliderColor;
  /** @control select @default full */
  rounded?: SliderRounded;
  /** @control boolean @default true */
  fullWidth?: NonNullable<RootVariants['fullWidth']>;
  /** Convenience accessible name for the single thumb. @control text @default Slider value */
  ariaLabel?: string;
  /** Distinguishable accessible names for explicit two-thumb range mode. @control object */
  thumbLabels?: [string, string];
  /** @control text */
  className?: string;
};
