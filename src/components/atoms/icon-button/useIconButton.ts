import type { VariantProps } from 'class-variance-authority';
import { type ComponentProps, useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import type { IconButtonProps, iconButtonVariants } from './types';

export const useIconButton = ({
  variant = 'primary',
  icon = 'image',
  size = 20,
  className,
  onClick,
  title,
  rounded = true,
  shadow = false,
  disabled = false,
  'aria-pressed': ariaPressed,
  ...props
}: IconButtonProps & VariantProps<typeof iconButtonVariants> & ComponentProps<'button'>) => {
  const iconButtonRef = useRef<HTMLButtonElement | null>(null);
  useRipple(iconButtonRef);

  return {
    variant,
    icon,
    size,
    className,
    onClick,
    title,
    rounded,
    shadow,
    disabled,
    iconButtonRef,
    ariaPressed,
    ...props
  };
};
