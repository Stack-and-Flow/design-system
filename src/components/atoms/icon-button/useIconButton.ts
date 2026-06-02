import { type ComponentProps, type MouseEvent, useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils';
import { type IconButtonEmphasis, type IconButtonProps, type IconButtonSize, iconButtonVariants } from './types';

type UseIconButtonReturn = Omit<
  IconButtonProps,
  'aria-label' | 'aria-pressed' | 'ariaLabel' | 'className' | 'icon' | 'onClick' | 'size' | 'type'
> & {
  ariaLabel: string;
  ariaPressed: IconButtonProps['aria-pressed'];
  buttonRef: ComponentProps<'button'>['ref'];
  className: string;
  disabled: boolean;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon: NonNullable<IconButtonProps['icon']>;
  iconSize: number;
  size: IconButtonSize;
  type: NonNullable<IconButtonProps['type']>;
};

export const useIconButton = ({
  variant = 'primary',
  icon = 'image',
  size = 'md',
  type = 'button',
  className,
  onClick,
  title,
  ariaLabel,
  'aria-label': nativeAriaLabel,
  rounded = true,
  emphasis,
  shadow = true,
  disabled = false,
  'aria-pressed': ariaPressed,
  ...props
}: IconButtonProps): UseIconButtonReturn => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useRipple(buttonRef);

  const buttonSize = getButtonSize(size);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
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
    icon,
    size: buttonSize,
    iconSize: getIconSize(size, buttonSize),
    title,
    disabled,
    ariaPressed,
    ariaLabel: getAriaLabel(ariaLabel, nativeAriaLabel, title),
    className: cn(
      iconButtonVariants({
        variant,
        rounded,
        emphasis: resolveEmphasis(emphasis, shadow),
        size: buttonSize
      }),
      className
    ),
    handleClick
  };
};

const getButtonSize = (size: NonNullable<IconButtonProps['size']>): IconButtonSize => {
  if (typeof size !== 'number') {
    return size;
  }

  if (size <= 16) {
    return 'sm';
  }

  if (size <= 20) {
    return 'md';
  }

  return 'lg';
};

const getIconSize = (size: NonNullable<IconButtonProps['size']>, buttonSize: IconButtonSize): number => {
  if (typeof size === 'number') {
    return size;
  }

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24
  } as const;

  return iconSizes[buttonSize];
};

const getAriaLabel = (
  ariaLabel: string | undefined,
  nativeAriaLabel: string | undefined,
  title: string | undefined
): string => ariaLabel ?? nativeAriaLabel ?? title ?? 'Icon button';

const resolveEmphasis = (
  emphasis: IconButtonProps['emphasis'],
  shadow: IconButtonProps['shadow']
): IconButtonEmphasis => emphasis ?? (shadow === false ? 'flat' : 'default');
