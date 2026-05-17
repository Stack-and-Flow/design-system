import { cva, type VariantProps } from 'class-variance-authority';

export const spacerScaleClasses = {
  0: { width: 'w-0', height: 'h-0' },
  px: { width: 'w-px', height: 'h-px' },
  1: { width: 'w-1', height: 'h-1' },
  2: { width: 'w-2', height: 'h-2' },
  3: { width: 'w-3', height: 'h-3' },
  4: { width: 'w-4', height: 'h-4' },
  5: { width: 'w-5', height: 'h-5' },
  6: { width: 'w-6', height: 'h-6' },
  8: { width: 'w-8', height: 'h-8' },
  10: { width: 'w-10', height: 'h-10' },
  12: { width: 'w-12', height: 'h-12' },
  16: { width: 'w-16', height: 'h-16' },
  20: { width: 'w-20', height: 'h-20' },
  24: { width: 'w-24', height: 'h-24' },
  30: { width: 'w-30', height: 'h-30' }
} as const;

export type SpacerScale = keyof typeof spacerScaleClasses;
export type SpacerAxis = 'horizontal' | 'vertical' | 'both';

export const spacerVariants = cva('shrink-0 grow-0', {
  variants: {
    axis: {
      horizontal: 'block h-0',
      vertical: 'block w-0',
      both: 'block'
    }
  },
  defaultVariants: {
    axis: 'vertical'
  }
});

export type SpacerVariantProps = VariantProps<typeof spacerVariants>;

export type SpacerProps = SpacerVariantProps & {
  /**
   * @control select
   * @default vertical
   */
  axis?: SpacerAxis;
  /**
   * @control select
   * @default 4
   */
  size?: SpacerScale;
  /**
   * @control select
   * @default undefined
   */
  spaceX?: SpacerScale;
  /**
   * @control select
   * @default undefined
   */
  spaceY?: SpacerScale;
  /** @control text */
  className?: string;
  /**
   * @control boolean
   * @default true
   */
  ariaHidden?: boolean;
};
