import { DynamicIcon } from 'lucide-react/dynamic.js';
import type { FC } from 'react';
import type { IconButtonProps } from './types';
import { useIconButton } from './useIconButton';

export const IconButton: FC<IconButtonProps> = (props) => {
  const {
    buttonRef,
    type,
    ariaPressed,
    ariaLabel,
    className,
    disabled,
    handleClick,
    icon,
    iconSize,
    size: _size,
    title,
    ...restProps
  } = useIconButton(props);

  return (
    <button
      {...restProps}
      ref={buttonRef}
      type={type}
      className={className}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-pressed={ariaPressed}
      disabled={disabled}
      title={title}
      onClick={handleClick}
    >
      <DynamicIcon aria-hidden='true' color='currentColor' name={icon} size={iconSize} />
    </button>
  );
};
