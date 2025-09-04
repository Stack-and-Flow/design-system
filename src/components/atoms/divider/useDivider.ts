import { type DividerProps, dividerVariants } from './types';

export const useDivider = ({
  orientation = 'horizontal',
  color = 'primary',
  sizeWidth = 'sm',
  sizeHeight = 'lg',
  hover = 'none',
  animation = 'none'
}: DividerProps) => {
  // Additional logic can be added here if needed

  const dividerClass = dividerVariants({ orientation, color, sizeWidth, sizeHeight, hover, animation });

  return {
    orientation,
    dividerClass,
    sizeWidth,
    sizeHeight,
    hover,
    animation
  };
};
