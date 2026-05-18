import { DynamicIcon } from 'lucide-react/dynamic';
import type { FC } from 'react';
import { SpinnerCircular } from 'spinners-react';
import { cn } from '@/lib/utils';
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
      <span className='flex items-center justify-center z-0 gap-2 lg:gap-4'>
        {icon && <DynamicIcon aria-hidden='true' className={iconSize} name={icon} />}
        {text && <span>{text}</span>}
        {isLoading && (
          <span className={cn('inline-flex', !text && 'sr-only')}>
            <SpinnerCircular color='currentColor' thickness={200} size='1.5em' />
          </span>
        )}
      </span>
    </button>
  );
};
