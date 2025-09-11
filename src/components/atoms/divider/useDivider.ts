import { type DividerProps, dividerVariants } from './types';

export const useDivider = ({
  orientation = 'horizontal',
  color = 'bg-accent',
  lengthX = 'md',
  thicknessX = 'thin',
  lengthY = 'md',
  thicknessY = 'thin',
  hover = 'none'
}: DividerProps) => {
  // Additional logic can be added here if needed

  const dividerClass = dividerVariants({ orientation, lengthX, thicknessX, lengthY, thicknessY, hover });

  return {
    orientation,
    color,
    dividerClass,
    lengthX,
    thicknessX,
    lengthY,
    thicknessY,
    hover
  };
};
('');
