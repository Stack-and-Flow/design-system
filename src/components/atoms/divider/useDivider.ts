import type { DividerProps } from './types';

export const useDivider = ({
  orientation = 'horizontal',
  width = 'sm',
  height = 'sm',
  horizontalColor = 'text-primary',
  verticalColor = 'bg-primary'
}: DividerProps) => {
  // Additional logic can be added here if needed

  const sizeHeight = {
    sm: '2rem',
    md: '3rem',
    lg: '5rem'
  };

  const sizeWidth = {
    sm: '15rem',
    md: '30rem',
    lg: '45rem'
  };

  const widthSize = sizeWidth[width];
  const heightSize = sizeHeight[height];
  return {
    orientation,
    widthSize,
    heightSize,
    horizontalColor,
    verticalColor
  };
};

/* 
import type { DividerProps } from './types';

export const useDivider = ({ name }: DividerProps) => {
  // Additional logic can be added here if needed

  return {
    name
  };
};


*/
