import { type DividerProps, dividerVariants } from './types';

export const useDivider = ({
  orientation = 'horizontal',
  color = 'bg-primary',
  size = 'xs',
  corner = 'none',
  thickness = 'xs'
}: DividerProps) => {
  // Additional logic can be added here if needed

  const sizeX = {
    xs: 'w-8',
    sm: 'w-16',
    md: 'w-32',
    lg: 'w-64',
    xl: 'w-96'
  };

  const sizeY = {
    xs: 'h-6',
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-18',
    xl: 'h-24'
  };

  let sizeFinal;

  if (orientation === 'horizontal') {
    sizeFinal = sizeX[size];
  } else {
    sizeFinal = sizeY[size];
  }

  const dividerClass = dividerVariants({
    orientation,
    corner,
    thickness
  });

  return {
    orientation,
    color,
    corner,
    sizeFinal,
    dividerClass,
    thickness
  };
};
