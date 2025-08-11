import type { DividerProps } from './types';

export const useDivider = ({
  orientation = 'horizontal',
  horizontalWidth = 'sm',
  verticalHeight = 'sm',
  colors = 'primary'
}: DividerProps) => {
  // Additional logic can be added here if needed
  const sizeHorizontalWidth = {
    xs: '3rem',
    sm: '6rem',
    md: '10rem',
    lg: '30rem',
    xl: '60rem'
  };

  const sizeVerticalHeight = {
    sm: '2rem',
    md: '3rem',
    lg: '5rem'
  };

  const colorLine = {
    primary: '#830213',
    light: '#ef8f96',
    dark: '#510b10',
    success: '#138a3d',
    info: '#f97316'
  };

  const widthHorizontalSize = sizeHorizontalWidth[horizontalWidth];
  const heightVerticalSize = sizeVerticalHeight[verticalHeight];
  const colorDivider = colorLine[colors];

  return {
    orientation,
    widthHorizontalSize,
    heightVerticalSize,
    colorDivider
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
