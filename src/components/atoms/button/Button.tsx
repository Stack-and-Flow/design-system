import { DynamicIcon } from 'lucide-react/dynamic';
import type { FC } from 'react';
import { SpinnerCircular } from 'spinners-react';
import type { ButtonProps } from './types';
import { useButton } from './useButton';

export const Button: FC<ButtonProps> = (props) => {
  const {
    buttonRef,
    type,
    ariaPressed,
    ariaLabel,
    text,
    className,
    contentClassName,
    disabled,
    isLoading,
    handleClick,
    iconSize,
    icon,
    ...restProps
  } = useButton(props);

  return (
    <button
      {...restProps}
      ref={buttonRef}
      type={type}
      role='button'
      className={className}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-pressed={ariaPressed}
      disabled={disabled}
      onClick={handleClick}
    >
      <span className={contentClassName}>
        {icon && <DynamicIcon aria-hidden='true' className={iconSize} name={icon} />}
        {text && <span>{text}</span>}
        {isLoading && (
          <span className='inline-flex' aria-hidden='true'>
            <SpinnerCircular color='currentColor' thickness={200} size='1.5em' />
          </span>
        )}
      </span>
    </button>
  );
};
