import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, FC, RefObject } from 'react';
import Icon from '../icon';
import { type InputProps, inputVariants, labelVariants } from './types';
import { useInput } from './useInput';
import '@/components/utils/styles/index.css';

const Input: FC<
  Omit<VariantProps<typeof inputVariants>, 'state' | 'focused'> &
    InputProps &
    Omit<ComponentProps<'input'>, 'size' | 'id'> & {
      ariaDescribedBy?: string | string[];
      ariaLabelledBy?: string | string[];
    }
> = ({ ...props }) => {
  const {
    containerRef,
    size,
    rounded,
    variant,
    isFocused,
    type,
    isFullWidth,
    label,
    hint,
    disabled,
    className,
    ref,
    id,
    hasValue,
    placeholder,
    startContent,
    endContent,
    isRequired,
    formatAriaIds,
    ariaDescribedBy,
    ariaLabelledBy,
    handleBlur,
    handleChange,
    handleFocus,
    handleKeyDown,
    showPassword,
    value,
    defaultValue,
    setHasValue,
    setShowPassword,
    ...rest
  } = useInput(props);
  const getIconByHintType = (type: string) => {
    switch (type) {
      case 'error':
        return <Icon name='circle-alert' color='text-color-error-light' colorDark='dark:text-color-error' size={16} />;
      case 'warning':
        return <Icon name='triangle-alert' color='text-color-warning-light' colorDark='dark:text-color-warning' size={16} />;
      case 'success':
        return <Icon name='circle-check' color='text-color-success-light' colorDark='dark:text-color-success' size={16} />;
      default:
        return <Icon name='info' color='text-color-text-tertiary-light' colorDark='dark:text-color-text-tertiary-dark' size={16} />;
    }
  };
  const IncrementDecrementButtons = ({
    ref,
    setHasValue
  }: { ref: RefObject<HTMLInputElement>; setHasValue: (value: boolean) => void }) => (
    <div className='absolute right-2 top-0 bottom-0 flex flex-col justify-center items-center gap-[2px] z-10'>
      <button
        role='button'
        aria-label='Increase value'
        className='bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-raised-light)] dark:bg-[var(--color-surface-dark)] dark:hover:bg-[var(--color-surface-raised-dark)] rounded-t-sm px-1 cursor-pointer outline-offset-0 focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-1'
        onClick={() => {
          if (ref.current) {
            const currentValue = parseFloat(ref.current.value !== '' ? ref.current.value : '0');
            ref.current.value = (currentValue + 1).toString();
            setHasValue(!!ref.current.value);
          }
        }}
      >
        <Icon name='chevron-up' color='text-color-text-light' colorDark='dark:text-color-text-dark' size={16} />
      </button>
      <button
        role='button'
        aria-label='Decrease value'
        className='bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-raised-light)] dark:bg-[var(--color-surface-dark)] dark:hover:bg-[var(--color-surface-raised-dark)] rounded-b-sm px-1 cursor-pointer outline-offset-0 focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-1'
        onClick={() => {
          if (ref.current) {
            const currentValue = parseFloat(ref.current.value !== '' ? ref.current.value : '0');
            ref.current.value = (currentValue - 1).toString();
            setHasValue(!!ref.current.value);
          }
        }}
      >
        <Icon name='chevron-down' color='text-color-text-light' colorDark='dark:text-color-text-dark' size={16} />
      </button>
    </div>
  );

  const PasswordToggleButton = ({
    showPassword,
    setShowPassword
  }: { showPassword: boolean; setShowPassword: (value: boolean) => void }) => (
    <div className='absolute right-2 top-0 bottom-0 flex flex-col justify-center items-center gap-[2px] z-10'>
      <button
        role='button'
        aria-label={!showPassword ? 'Show password' : 'Hide password'}
        className='cursor-pointer outline-offset-0 focus-visible:outline-[var(--color-brand-light)] dark:focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-1'
        onClick={() => setShowPassword(!showPassword)}
      >
        <Icon
          name={!showPassword ? 'eye' : 'eye-off'}
          color='text-color-text-light'
          colorDark='dark:text-color-text-dark'
          className='hover:opacity-70'
          size={20}
        />
      </button>
    </div>
  );
  return (
    <div className={`flex flex-col gap-2${type === 'hidden' ? ' hidden' : ''}`}>
      <div
        ref={containerRef}
        className={cn(
          inputVariants({
            size,
            rounded,
            variant,
            state: !isFocused
              ? variant === 'regular'
                ? 'focusedRegular'
                : variant === 'underlined'
                  ? 'focusedUnderlined'
                  : variant === 'line'
                    ? 'focusedLine'
                    : variant === 'bordered'
                      ? 'focusedBordered'
                      : 'default'
              : 'default',
            focused: isFocused
          }),
          isFullWidth ? 'w-full' : 'w-auto',
          label ? 'items-end' : 'items-center',
          hint?.type === 'error' && '!border-red-500 dark:!border-red-500',
          hint?.type === 'warning' && '!border-yellow dark:!border-yellow',
          hint?.type === 'success' && '!border-green dark:!border-green',
          disabled && 'pointer-events-none opacity-60',
          className
        )}
        onClick={() =>
          ref &&
          'current' in ref &&
          document.activeElement !== ref.current &&
          type !== 'number' &&
          type !== 'password' &&
          ref.current?.focus()
        }
      >
        <label
          id={`${id}-label`}
          htmlFor={id}
          className={cn(
            labelVariants({
              size,
              state:
                isFocused || hasValue || placeholder
                  ? size === 'sm'
                    ? 'focusedSm'
                    : size === 'md'
                      ? 'focusedMd'
                      : size === 'lg'
                        ? 'focusedLg'
                        : 'default'
                  : 'default'
            }),
            startContent || (endContent && 'sr-only')
          )}
        >
          {label}{' '}
          {isRequired && (
            <span className='text-color-brand-light' aria-hidden={true}>
              *
            </span>
          )}
        </label>
        <div className='flex w-full justify-between gap-4'>
          {startContent && startContent}
          <input
            {...rest}
            ref={ref}
            id={id}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-disabled={disabled}
            aria-invalid={hint?.type === 'error' ? 'true' : 'false'}
            aria-describedby={formatAriaIds(ariaDescribedBy || (hint?.message ? `${id}-hint` : undefined))}
            aria-labelledby={formatAriaIds(ariaLabelledBy || (label ? `${id}-label` : undefined))}
            className={cn(
              'flex-1 outline-none text-text-light dark:text-text-dark placeholder:text-secondary-light dark:placeholder:text-secondary-dark border-none',
              (type === 'number' || type === 'password') && 'pr-6'
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            required={isRequired}
            aria-required={isRequired}
            value={value}
            defaultValue={defaultValue}
          />
          {type === 'number' && (
            <IncrementDecrementButtons ref={ref as RefObject<HTMLInputElement>} setHasValue={setHasValue} />
          )}
          {type === 'password' && (
            <PasswordToggleButton showPassword={showPassword} setShowPassword={setShowPassword} />
          )}
          {endContent && endContent}
        </div>
      </div>
      {hint?.message && (
        <div id={`${id}-hint`} className='py-0.5 flex items-center gap-2'>
          {getIconByHintType(hint?.type)}
          <span
            className={cn(
              'fs-small tablet:fs-small-tablet',
              hint?.type === 'info'
                ? 'text-color-text-secondary-light dark:text-color-text-secondary-dark'
                : hint?.type === 'warning'
                  ? 'text-yellow dark:text-yellow-400'
                  : hint?.type === 'error'
                    ? 'text-red-500 dark:text-red-500'
                    : hint?.type === 'success'
                      ? 'text-green dark:text-green-400'
                      : 'text-color-text-secondary-light dark:text-color-text-secondary-dark'
            )}
          >
            {hint.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;
