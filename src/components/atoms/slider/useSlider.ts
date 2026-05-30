import type * as SliderPrimitive from '@radix-ui/react-slider';
import { type ComponentProps, useId } from 'react';
import { cn } from '@/lib/utils';
import {
  type SliderProps,
  sliderRangeVariants,
  sliderRootVariants,
  sliderThumbVariants,
  sliderThumbVisualVariants,
  sliderTrackVariants
} from './types';

type SliderRootProps = ComponentProps<typeof SliderPrimitive.Root>;
type SliderThumbProps = {
  key: string;
  className: string;
  visualClassName: string;
  'aria-describedby'?: string;
  'aria-disabled'?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  hiddenLabel?: {
    id: string;
    text: string;
  };
};

export type UseSliderReturn = {
  rootProps: SliderRootProps;
  trackClassName: string;
  rangeClassName: string;
  thumbs: SliderThumbProps[];
};

const finite = (value: number | undefined, fallback: number): number =>
  Number.isFinite(value) ? Number(value) : fallback;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const normalizeSliderValues = (
  value: number[] | undefined,
  fallback: number[],
  min: number,
  max: number
): number[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const finiteValues = value.filter((item) => Number.isFinite(item)).slice(0, 2);
  return finiteValues.length > 0 ? finiteValues.map((item) => clamp(item, min, max)) : fallback;
};

const resolveThumbValues = (
  normalizedValue: number[] | undefined,
  normalizedDefaultValue: number[] | undefined,
  fallback: number[]
): number[] => {
  if (normalizedValue !== undefined) {
    return normalizedValue;
  }

  if (normalizedDefaultValue !== undefined) {
    return normalizedDefaultValue;
  }

  return fallback;
};

const resolveThumbAriaLabelledBy = ({
  isRange,
  ariaLabelledBy,
  hiddenLabelId
}: {
  isRange: boolean;
  ariaLabelledBy?: string;
  hiddenLabelId?: string;
}): string | undefined => {
  if (isRange && ariaLabelledBy && hiddenLabelId) {
    return `${ariaLabelledBy} ${hiddenLabelId}`;
  }

  if (isRange) {
    return undefined;
  }

  return ariaLabelledBy;
};

const resolveThumbAriaLabel = ({
  isRange,
  index,
  rangeLabels,
  ariaLabelledBy,
  ariaLabel,
  nativeAriaLabel
}: {
  isRange: boolean;
  index: number;
  rangeLabels: [string, string];
  ariaLabelledBy?: string;
  ariaLabel?: string;
  nativeAriaLabel?: string;
}): string | undefined => {
  if (isRange && ariaLabelledBy) {
    return undefined;
  }

  if (isRange) {
    return rangeLabels[index];
  }

  if (ariaLabelledBy) {
    return undefined;
  }

  return ariaLabel ?? nativeAriaLabel ?? 'Slider value';
};

export const useSlider = ({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min,
  max,
  step,
  disabled = false,
  size = 'md',
  color = 'default',
  rounded = 'full',
  fullWidth = true,
  ariaLabel,
  'aria-label': nativeAriaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  thumbLabels,
  className,
  ...restProps
}: SliderProps): UseSliderReturn => {
  const resolvedMin = finite(min, 0);
  const candidateStep = finite(step, 1);
  const candidateMax = finite(max, 100);
  const resolvedStep = candidateStep > 0 ? candidateStep : 1;
  const resolvedMax = candidateMax > resolvedMin ? candidateMax : Math.max(100, resolvedMin + resolvedStep);
  const singleFallback = [resolvedMin];
  const normalizedValue = normalizeSliderValues(value, singleFallback, resolvedMin, resolvedMax);
  const normalizedDefaultValue = normalizeSliderValues(
    defaultValue ?? (value === undefined ? singleFallback : undefined),
    singleFallback,
    resolvedMin,
    resolvedMax
  );
  const thumbValues = resolveThumbValues(normalizedValue, normalizedDefaultValue, singleFallback);
  const isRange = thumbValues.length === 2;
  const rangeLabels = thumbLabels ?? ['Minimum value', 'Maximum value'];
  const rangeThumbLabelBaseId = useId();
  const thumbs = thumbValues.map((_, index) => {
    const hiddenLabel =
      isRange && ariaLabelledBy
        ? { id: `${rangeThumbLabelBaseId}-thumb-${index}-label`, text: rangeLabels[index] }
        : undefined;

    return {
      key: `thumb-${index}`,
      className: sliderThumbVariants({ rounded }),
      visualClassName: sliderThumbVisualVariants({ color, rounded, size }),
      'aria-describedby': ariaDescribedBy,
      'aria-disabled': disabled ? true : undefined,
      'aria-labelledby': resolveThumbAriaLabelledBy({ isRange, ariaLabelledBy, hiddenLabelId: hiddenLabel?.id }),
      'aria-label': resolveThumbAriaLabel({
        isRange,
        index,
        rangeLabels,
        ariaLabelledBy,
        ariaLabel,
        nativeAriaLabel
      }),
      hiddenLabel
    };
  });

  return {
    rootProps: {
      ...restProps,
      value: normalizedValue,
      defaultValue: normalizedValue === undefined ? normalizedDefaultValue : undefined,
      onValueChange,
      onValueCommit,
      min: resolvedMin,
      max: resolvedMax,
      step: resolvedStep,
      disabled,
      dir: 'ltr',
      orientation: 'horizontal',
      className: cn(sliderRootVariants({ fullWidth }), className)
    },
    trackClassName: sliderTrackVariants({ color, rounded, size }),
    rangeClassName: sliderRangeVariants({ color, rounded }),
    thumbs
  };
};
