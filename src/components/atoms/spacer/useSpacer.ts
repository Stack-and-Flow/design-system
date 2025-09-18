import type { SpacerProps } from './types';

export const useSpacer = ({ spaceX, spaceY }: SpacerProps) => {
  // Additional logic can be added here if needed
  const baseUnit = 0.25;

  const spacerX = spaceX ? `${spaceX * baseUnit}rem` : '0rem';
  const spacerY = spaceY ? `${spaceY * baseUnit}rem` : '0rem';

  return {
    width: spacerX,
    height: spacerY
  };
};
