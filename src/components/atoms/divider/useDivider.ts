import type { DividerProps } from './types';

export const useDivider = ({
  orientation = 'horizontal',
  sizeWidth = 'md',
  sizeHeight = 'sm',
  colorsX = 'primary',
  colorsY = 'primary',
  shadow = undefined,
  animated = 'default'
}: DividerProps) => {
  // Additional logic can be added here if needed

  const thickness = orientation === 'horizontal' ? '0.25rem' : '0.2rem';

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

  const sizeFinal = orientation === 'horizontal' ? sizeHorizontalWidth[sizeWidth] : sizeVerticalHeight[sizeHeight];

  let colorFinal;

  const colorsListX = {
    primary: '#830213',
    secondary: '#d61e2b',
    info: '#eab308',
    success: '#138a3d',
    primaryDegrade: 'linear-gradient(90deg, #d61e2b 0%, #3b3f4e 50%, #d61e2b 100%)',
    secondaryDegrade: 'linear-gradient(90deg, #ef8f96 0%, #0e0e10 50%, #ef8f96 100%)'
  };

  const colorsListY = {
    primary: '#830213',
    secondary: '#d61e2b',
    info: '#eab308',
    success: '#138a3d',
    primaryDegrade: 'linear-gradient(180deg, #830213 0%, #3b3f4e 50%, #830213 100%)',
    secondaryDegrade: 'linear-gradient(180deg, #ef8f96 0%, #0e0e10 50%, #ef8f96 100%)'
  };

  const finalColor = orientation === 'horizontal' ? colorsListX[colorsX] : colorsListY[colorsY];

  let shadowDivider;

  if (shadow) {
    shadowDivider = `0px 1px 7px 2px #444754`;
  }

  const animationLine = {
    fadeIn: 'animate-fadeIn',
    pulse: 'animate-pulse',
    ping: 'animate-badgePing',
    bounce: 'animate-bounce',
    default: undefined
  };

  const dividerAnimation = animationLine[animated];

  return {
    orientation,
    sizeFinal,
    colorFinal,
    finalColor,
    shadowDivider,
    dividerAnimation,
    thickness
  };
};
