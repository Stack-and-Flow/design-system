import { type MouseEvent, type RefObject, useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils';
import { type ButtonProps, buttonVariants } from './types';

type UseButtonReturn = Omit<ButtonProps, 'onClick'> & {
  ariaLabel: string | undefined;
  ariaPressed: ButtonProps['aria-pressed'];
  buttonRef: RefObject<HTMLButtonElement>;
  className: string;
  disabled: boolean;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  iconSize: string;
  isLoading: boolean;
  type: NonNullable<ButtonProps['type']>;
};

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
  'aria-label': nativeAriaLabel,
  'aria-pressed': ariaPressed,
  type = 'button',
  ...props
}: ButtonProps): UseButtonReturn => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDisabled = disabled || isLoading;

  useRipple(buttonRef);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  return {
    ...props,
    buttonRef,
    type,
    ariaPressed,
    icon,
    text,
    isLoading,
    ariaLabel: ariaLabel ?? nativeAriaLabel ?? text,
    className: cn(buttonVariants({ variant, size, rounded, shadow, uppercase, fullWidth: isFullWidth }), className),
    disabled: isDisabled,
    iconSize: getIconSize(size),
    handleClick
  };
};

const getIconSize = (size: NonNullable<ButtonProps['size']>): string => {
  switch (size) {
    case 'sm':
      return 'h-md w-auto';
    case 'lg':
      return 'h-xl w-auto';
    default:
      return 'h-lg w-auto';
  }
};
