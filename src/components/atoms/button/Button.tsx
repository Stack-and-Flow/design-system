import type { VariantProps } from 'class-variance-authority';
import { DynamicIcon } from 'lucide-react/dynamic';
import type { ComponentProps, FC } from 'react';
import { SpinnerCircular } from 'spinners-react';
import { cn } from '@/lib/utils';
import { type ButtonProps, buttonVariants } from './types';
import { useButton } from './useButton';

export const Button: FC<VariantProps<typeof buttonVariants> & ButtonProps & ComponentProps<'button'>> = ({
  ...props
}) => {
  const {
    buttonRef,
    type,
    ariaPressed,
    isFullWidth,
    variant,
    size,
    rounded,
    uppercase,
    ariaLabel,
    shadow,
    text,
    className,
    disabled,
    isLoading,
    onClick,
    iconSize,
    spinnerSize,
    icon,
    ...restProps
  } = useButton(props);
  return (
    <button
      {...restProps}
      ref={buttonRef}
      type={type}
      className={cn(
        isFullWidth ? 'w-full' : 'w-auto',
        buttonVariants({ variant, size, rounded, shadow, uppercase }),
        className
      )}
      aria-label={ariaLabel}
      aria-busy={isLoading || undefined}
      aria-disabled={disabled || undefined}
      aria-pressed={ariaPressed}
      disabled={disabled || isLoading}
      onClick={(e) => !isLoading && onClick?.(e)}
    >
      <span className={cn('flex items-center justify-center z-0', size === 'lg' ? 'gap-4' : 'gap-2')}>
        {icon && <DynamicIcon aria-hidden='true' className={iconSize()} name={icon} />}
        {text && <span>{text}</span>}
        {isLoading && (
          <div>
            <SpinnerCircular
              className={spinnerSize()}
              color='currentColor'
              secondaryColor='currentColor'
              thickness={200}
            />
          </div>
        )}
      </span>
    </button>
  );
};
