import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { DynamicIcon } from 'lucide-react/dynamic';
import type { ComponentProps, FC } from 'react';
import { SpinnerCircular } from 'spinners-react';
import { type ButtonProps, buttonVariants } from './types';
import { useButton } from './useButton';
import '@/components/utils/styles/index.css';

const Button: FC<VariantProps<typeof buttonVariants> & ButtonProps & ComponentProps<'button'>> = ({ ...props }) => {
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
    icon
  } = useButton(props);
  return (
    <button
      {...props}
      ref={buttonRef}
      type={type}
      role={ariaPressed !== undefined ? 'switch' : 'button'}
      className={cn(
        isFullWidth ? 'w-full' : 'w-auto',
        buttonVariants({ variant, size, rounded, shadow, uppercase }),
        className
      )}
      aria-label={ariaLabel || text}
      aria-disabled={disabled || undefined}
      aria-pressed={ariaPressed}
      disabled={disabled || isLoading}
      onClick={(e) => !isLoading && onClick?.(e)}
    >
      <span className={cn('flex items-center justify-center z-0', size === 'lg' ? 'gap-4' : 'gap-2')}>
        {icon && <DynamicIcon className={iconSize()} name={icon} />}
        {text && <span className={size !== 'sm' ? 'pt-[0.2rem]' : 'pt-[0.1rem]'}>{text}</span>}
        {isLoading && (
          <div>
            <SpinnerCircular
              color={'currentColor'}
              secondaryColor={'rgba(45, 6, 9, 0.2)'}
              thickness={200}
              size={size !== 'sm' ? '1.5em' : '1.2em'}
            />
          </div>
        )}
      </span>
    </button>
  );
};

export default Button;
