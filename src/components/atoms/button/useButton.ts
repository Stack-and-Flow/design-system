import type { VariantProps } from 'class-variance-authority';
import { type ComponentProps, useEffect, useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import type { ButtonProps, buttonVariants } from './types';

const getButtonIconSize = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return 'h-md w-auto';
    case 'lg':
      return 'h-xl w-auto';
    default:
      return 'h-lg w-auto';
  }
};

const getButtonSpinnerSize = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return 'h-md w-md';
    case 'lg':
      return 'h-xl w-xl';
    default:
      return 'h-lg w-lg';
  }
};

const getButtonAriaLabel = ({ ariaLabel, text }: Pick<ButtonProps, 'ariaLabel' | 'text'>) => {
  const trimmedAriaLabel = ariaLabel?.trim();

  if (trimmedAriaLabel) {
    return trimmedAriaLabel;
  }

  const trimmedText = text?.trim();

  if (trimmedText) {
    return trimmedText;
  }
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
  'aria-pressed': ariaPressed,
  type = 'button',
  ...props
}: VariantProps<typeof buttonVariants> & ButtonProps & ComponentProps<'button'>) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useRipple(buttonRef);

  const resolvedAriaLabel = getButtonAriaLabel({ ariaLabel, text });

  useEffect(() => {
    if (!icon || text?.trim() || ariaLabel?.trim() || import.meta.env.MODE === 'test') {
      return;
    }

    console.warn('Button icon-only usage requires ariaLabel for an accessible name.');
  }, [ariaLabel, icon, text]);

  const iconSize = () => getButtonIconSize(size);
  const spinnerSize = () => getButtonSpinnerSize(size);

  return {
    buttonRef,
    type,
    ariaPressed,
    isFullWidth,
    iconSize,
    spinnerSize,
    icon,
    rounded,
    text,
    isLoading,
    variant,
    size,
    uppercase,
    ariaLabel: resolvedAriaLabel,
    shadow,
    className,
    disabled,
    onClick,
    ...props
  };
};
