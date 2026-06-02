import { type MouseEvent, type RefObject, useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils';
import { type ButtonEmphasis, type ButtonProps, buttonVariants } from './types';

type UseButtonReturn = Omit<ButtonProps, 'onClick'> & {
  ariaLabel: string;
  ariaPressed: ButtonProps['aria-pressed'];
  buttonRef: RefObject<HTMLButtonElement | null>;
  className: string;
  contentClassName: string;
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
  emphasis,
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
    ariaLabel: getAriaLabel(ariaLabel, nativeAriaLabel, text),
    className: cn(
      buttonVariants({
        variant,
        size,
        rounded,
        emphasis: resolveEmphasis(emphasis, shadow),
        uppercase,
        fullWidth: isFullWidth
      }),
      className
    ),
    contentClassName: cn('flex items-center justify-center z-0', getContentGap(size)),
    disabled: isDisabled,
    iconSize: getIconSize(size),
    handleClick
  };
};

const getAriaLabel = (
  ariaLabel: string | undefined,
  nativeAriaLabel: string | undefined,
  text: string | undefined
): string => ariaLabel ?? nativeAriaLabel ?? text ?? 'Button';

const resolveEmphasis = (emphasis: ButtonProps['emphasis'], shadow: ButtonProps['shadow']): ButtonEmphasis =>
  emphasis ?? (shadow === false ? 'flat' : 'default');

const getIconSize = (size: NonNullable<ButtonProps['size']>): string => {
  switch (size) {
    case 'xs':
      return 'h-sm w-auto';
    case 'sm':
      return 'h-md w-auto';
    case 'lg':
      return 'h-xl w-auto';
    default:
      return 'h-lg w-auto';
  }
};

const getContentGap = (size: NonNullable<ButtonProps['size']>): string => {
  switch (size) {
    case 'xs':
      return 'gap-1';
    case 'sm':
      return 'gap-1.5';
    case 'lg':
      return 'gap-4';
    default:
      return 'gap-2';
  }
};
