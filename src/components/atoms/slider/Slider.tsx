import * as SliderPrimitive from '@radix-ui/react-slider';
import type { FC } from 'react';
import type { SliderProps } from './types';
import { useSlider } from './useSlider';

export const Slider: FC<SliderProps> = (props) => {
  const { rootProps, trackClassName, rangeClassName, thumbs } = useSlider(props);

  return (
    <SliderPrimitive.Root {...rootProps}>
      <SliderPrimitive.Track className={trackClassName}>
        <SliderPrimitive.Range className={rangeClassName} />
      </SliderPrimitive.Track>
      {thumbs.map((thumb) => (
        <SliderPrimitive.Thumb
          key={thumb.key}
          className={thumb.className}
          aria-describedby={thumb['aria-describedby']}
          aria-disabled={thumb['aria-disabled']}
          aria-label={thumb['aria-label']}
          aria-labelledby={thumb['aria-labelledby']}
        >
          <span aria-hidden='true' className={thumb.visualClassName} />
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
};
