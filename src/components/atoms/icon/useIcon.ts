import type { IconProps } from './types';

export const useIcon = ({
  name,
  color = 'text-color-brand-light',
  colorDark = 'dark:text-color-brand-dark',
  size = 24,
  className
}: IconProps) => {
  return {
    name,
    color,
    colorDark,
    size,
    className
  };
};
