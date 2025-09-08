import { type DividerProps, dividerVariants } from './types';

export const useDivider = ({
  orientation = 'horizontal',
  color = 'bg-accent',
  sizeWidth = 'sm',
  sizeHeight = 'lg',
  hover = 'none'
}: DividerProps) => {
  // Additional logic can be added here if needed

  const dividerClass = dividerVariants({ orientation, sizeWidth, sizeHeight, hover });

  return {
    orientation,
    color,
    dividerClass,
    sizeWidth,
    sizeHeight,
    hover
  };
};
('');
