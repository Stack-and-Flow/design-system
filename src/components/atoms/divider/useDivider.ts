import { type DividerProps, dividerVariants } from './types';

export const useDivider = ({
  orientation = 'vertical',
  color = 'bg-accent',
  lengthX = 'xs',
  lengthY = 'xs',
  thickness = 'xs',
  hover = 'none'
}: DividerProps) => {
  // Additional logic can be added here if needed

  const dividerClass = dividerVariants({
    orientation,
    lengthX,
    lengthY,
    thickness,
    hover
  });

  return {
    orientation,
    color,
    dividerClass,
    lengthX,
    lengthY,
    thickness,
    hover
  };
};
