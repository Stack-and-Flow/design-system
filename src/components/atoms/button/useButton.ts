import type { VariantProps } from 'class-variance-authority';
import { type ComponentProps, useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import type { ButtonProps, buttonVariants } from './types';

export const useButton = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  onClick,
  icon,
  text,
  disabled = false,
  shadow = true,
  rounded = true,
  uppercase = false,
  ariaLabel,
  'aria-pressed': ariaPressed,
  type = 'button',
  ...props
}: VariantProps<typeof buttonVariants> & ButtonProps & ComponentProps<'button'>) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useRipple(buttonRef);

  const iconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-md w-auto';
      case 'lg':
        return 'h-xl w-auto';
      default:
        return 'h-lg w-auto';
    }
  };

  return {
    buttonRef,
    type,
    ariaPressed,
    isFullWidth,
    iconSize,
    icon,
    rounded,
    text,
    isLoading,
    variant,
    size,
    uppercase,
    ariaLabel,
    shadow,
    className,
    disabled,
    onClick,
    ...props
  };
};
