import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import type React from 'react';
import type { FC } from 'react';
import Dropdown from '../dropdown';
import Icon from '../icon';
import type { TimeInputProps } from './types';
import { useTimeInput } from './useTime';
import '@/components/utils/styles/index.css';

// Input variants for TimeInput
const timeInputVariants = cva(
  ['relative overflow-hidden flex py-2 justify-between max-w-full', 'border-2 transition-all duration-200'],
  {
    variants: {
      variant: {
        regular: ['bg-gray-light-500', 'border-gray-light-500', 'dark:bg-gray-dark-600', 'dark:border-gray-dark-600'],
        underlined: ['bg-transparent', 'border-gray-light-500', 'dark:bg-transparent', 'dark:border-gray-dark-600'],
        line: [
          'bg-transparent',
          'border-t-transparent',
          'border-l-transparent',
          'border-r-transparent',
          '!rounded-none',
          'border-b-gray-light-500',
          'dark:border-b-gray-dark-600'
        ],
        bordered: ['bg-gray-light-500', 'border-gray-light-600', 'dark:bg-gray-dark-600', 'dark:border-gray-dark-500']
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md'
      },
      size: {
        sm: 'h-12 px-2 fs-small tablet:fs-small-tablet',
        md: 'h-14 px-4 fs-base tablet:fs-base-tablet',
        lg: 'h-16 px-4 fs-h6 tablet:fs-h6-tablet'
      },
      state: {
        default: '',
        focused: 'outline-offset-2 dark:outline-white outline-secondary outline-2',
        focusedRegular:
          'hover:bg-gray-light-600 hover:border-gray-light-600 dark:hover:bg-gray-dark-500 dark:hover:border-gray-dark-500',
        focusedUnderlined: 'hover:border-gray-light-600 dark:hover:border-gray-dark-500',
        focusedLine: 'hover:border-b-gray-light-600 dark:hover:border-b-gray-dark-500',
        focusedBordered: 'hover:bg-gray-light-600 dark:hover:border-gray-dark-500'
      },
      focused: {
        true: 'outline-offset-2 dark:outline-white outline-secondary outline-2',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'regular',
      rounded: false,
      size: 'md',
      state: 'default'
    }
  }
);

const labelVariants = cva(
  ['absolute w-auto line-clamp-1 transition-all duration-200 text-text-light dark:text-text-dark pt-[2px]'],
  {
    variants: {
      size: {
        sm: 'left-2 fs-small tablet:fs-small-tablet',
        md: 'left-4 fs-base tablet:fs-base-tablet',
        lg: 'left-4 fs-h6 tablet:fs-h6-tablet'
      },
      state: {
        default: 'top-[50%] translate-y-[-50%]',
        focusedSm: 'top-1 fs-small font-secondary-bold',
        focusedMd: 'top-1.5 fs-small font-secondary-bold',
        focusedLg: 'top-2 fs-small font-secondary-bold',
        hasValueSm: 'top-1 fs-small font-secondary-bold',
        hasValueMd: 'top-1.5 fs-small font-secondary-bold',
        hasValueLg: 'top-2 fs-small font-secondary-bold'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default'
    }
  }
);

const TimeInput: FC<TimeInputProps> = ({ ...props }) => {
  const {
    // State
    isFocused,
    hasValue,
    hasTimeValue,
    timeValue,
    selectedTimezone,

    // Refs
    containerRef,
    hoursRef,
    minutesRef,
    secondsRef,
    ampmRef,

    // Props
    id,
    label,
    labelPosition,
    variant,
    size,
    rounded,
    isRequired,
    disabled,
    readOnly,
    isFullWidth,
    className,
    hint,
    description,
    showClockIcon,
    format,
    showUnits,
    showTimezone,
    timezones,
    locale,

    // Methods
    updateTimeValue,
    setSelectedTimezone,
    formatTimeDisplay,
    validateTime,

    // Event handlers
    handleFocus,
    handleBlur,
    handleKeyDown,
    handleClockIconClick,

    // Rest props
    ...rest
  } = useTimeInput(props);

  const getIconByHintType = (type: string) => {
    switch (type) {
      case 'error':
        return <Icon name='circle-alert' color='text-red-500' colorDark='dark:text-red-500' size={16} />;
      case 'warning':
        return <Icon name='triangle-alert' color='text-yellow' colorDark='dark:text-yellow' size={16} />;
      case 'success':
        return <Icon name='circle-check' color='text-green' colorDark='dark:text-green' size={16} />;
      default:
        return <Icon name='info' color='text-gray-light-700' colorDark='dark:text-gray-dark-300' size={16} />;
    }
  };

  // Handle input changes
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxHours = format === '12h' ? 12 : 23;
    const minHours = format === '12h' ? 1 : 0;

    if (value >= minHours && value <= maxHours) {
      updateTimeValue({ hours: value });
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 59) {
      updateTimeValue({ minutes: value });
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 59) {
      updateTimeValue({ seconds: value });
    }
  };

  const handleAMPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value === 'A' || value === 'P') {
      updateTimeValue({ ampm: value === 'A' ? 'AM' : 'PM' });
    }
  };

  // Timezone dropdown items
  const timezoneItems = timezones.map((tz) => ({
    type: 'item' as const,
    label: tz,
    onClick: () => setSelectedTimezone(tz)
  }));

  // Render time input fields
  const renderTimeFields = () => {
    const fields = [];

    if (showUnits.includes('hours')) {
      const displayHours =
        format === '12h'
          ? timeValue.hours === 0
            ? 12
            : timeValue.hours > 12
              ? timeValue.hours - 12
              : timeValue.hours
          : timeValue.hours;

      fields.push(
        <input
          key='hours'
          ref={hoursRef}
          name='hours'
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={2}
          value={displayHours.toString().padStart(2, '0')}
          placeholder={format === '12h' ? '12' : '00'}
          onChange={handleHoursChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          data-next-field={
            showUnits.includes('minutes') ? 'minutes' : showUnits.includes('seconds') ? 'seconds' : 'ampm'
          }
          className={cn(
            'w-8 text-center outline-none bg-transparent text-text-light dark:text-text-dark placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-500',
            disabled && 'opacity-60',
            readOnly && 'cursor-default'
          )}
          aria-label='Hours'
        />
      );
    }

    if (showUnits.includes('minutes')) {
      fields.push(
        <input
          key='minutes'
          ref={minutesRef}
          name='minutes'
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={2}
          value={timeValue.minutes.toString().padStart(2, '0')}
          placeholder='00'
          onChange={handleMinutesChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          data-prev-field={showUnits.includes('hours') ? 'hours' : undefined}
          data-next-field={showUnits.includes('seconds') ? 'seconds' : format === '12h' ? 'ampm' : undefined}
          className={cn(
            'w-8 text-center outline-none bg-transparent text-text-light dark:text-text-dark placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-500',
            disabled && 'opacity-60',
            readOnly && 'cursor-default'
          )}
          aria-label='Minutes'
        />
      );
    }

    if (showUnits.includes('seconds')) {
      fields.push(
        <input
          key='seconds'
          ref={secondsRef}
          name='seconds'
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={2}
          value={timeValue.seconds.toString().padStart(2, '0')}
          placeholder='00'
          onChange={handleSecondsChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          data-prev-field={showUnits.includes('minutes') ? 'minutes' : 'hours'}
          data-next-field={format === '12h' ? 'ampm' : undefined}
          className={cn(
            'w-8 text-center outline-none bg-transparent text-text-light dark:text-text-dark placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-500',
            disabled && 'opacity-60',
            readOnly && 'cursor-default'
          )}
          aria-label='Seconds'
        />
      );
    }

    // Add separators between fields
    const result = [];
    for (let i = 0; i < fields.length; i++) {
      result.push(fields[i]);
      if (i < fields.length - 1) {
        result.push(
          <span key={`sep-${i}`} className='text-text-light dark:text-text-dark'>
            :
          </span>
        );
      }
    }

    // Add AM/PM if 12h format
    if (format === '12h') {
      result.push(
        <input
          key='ampm'
          ref={ampmRef}
          name='ampm'
          type='text'
          maxLength={2}
          value={timeValue.ampm || ''}
          placeholder='AM'
          onChange={handleAMPMChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          data-prev-field={
            showUnits.includes('seconds') ? 'seconds' : showUnits.includes('minutes') ? 'minutes' : 'hours'
          }
          className={cn(
            'w-8 text-center outline-none bg-transparent text-text-light dark:text-text-dark placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-500',
            disabled && 'opacity-60',
            readOnly && 'cursor-default'
          )}
          aria-label='AM/PM'
        />
      );
    }

    return result;
  };

  return (
    <div className={cn('flex flex-col gap-2', isFullWidth ? 'w-full' : 'w-auto')}>
      {/* Outside label */}
      {label && labelPosition === 'outside' && (
        <label htmlFor={id} className='text-text-light dark:text-text-dark font-medium'>
          {label}
          {isRequired && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      <div className='flex gap-2 items-center'>
        {/* Outside-left label */}
        {label && labelPosition === 'outside-left' && (
          <label htmlFor={id} className='text-text-light dark:text-text-dark font-medium whitespace-nowrap'>
            {label}
            {isRequired && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}

        {/* Main input container */}
        <div
          ref={containerRef}
          className={cn(
            timeInputVariants({
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
            label && labelPosition === 'inside' ? 'items-end' : 'items-center',
            hint?.type === 'error' && '!border-red-500 dark:!border-red-500',
            hint?.type === 'warning' && '!border-yellow dark:!border-yellow',
            hint?.type === 'success' && '!border-green dark:!border-green',
            disabled && 'pointer-events-none opacity-60',
            className
          )}
        >
          {/* Inside label - only show when focused or has time value */}
          {label && labelPosition === 'inside' && (isFocused || hasTimeValue) && (
            <label
              htmlFor={id}
              className={cn(
                labelVariants({
                  size,
                  state:
                    size === 'sm' ? 'focusedSm' : size === 'md' ? 'focusedMd' : size === 'lg' ? 'focusedLg' : 'default'
                })
              )}
            >
              {label}
              {isRequired && (
                <span className='text-accent' aria-hidden={true}>
                  *
                </span>
              )}
            </label>
          )}

          <div className='flex w-full justify-between items-center gap-2'>
            {/* Time input fields */}
            <div className='flex items-center gap-1'>{renderTimeFields()}</div>

            {/* Clock icon */}
            {showClockIcon && (
              <button
                type='button'
                onClick={handleClockIconClick}
                disabled={disabled || readOnly}
                className={cn(
                  'p-1 rounded transition-colors',
                  'hover:bg-gray-light-600 dark:hover:bg-gray-dark-500',
                  'focus:outline-none focus:ring-2 focus:ring-secondary',
                  (disabled || readOnly) && 'opacity-50 cursor-not-allowed'
                )}
                aria-label='Focus time input'
              >
                <Icon name='clock' size={16} color='text-gray-light-700' colorDark='dark:text-gray-dark-300' />
              </button>
            )}

            {/* Timezone dropdown */}
            {showTimezone && timezones.length > 0 && (
              <Dropdown items={timezoneItems} width='120px' position='bottom' align='end'>
                <button
                  type='button'
                  disabled={disabled || readOnly}
                  className={cn(
                    'px-2 py-1 text-sm border rounded transition-colors',
                    'bg-gray-light-400 border-gray-light-500 dark:bg-gray-dark-500 dark:border-gray-dark-400',
                    'text-text-light dark:text-text-dark',
                    'hover:bg-gray-light-500 dark:hover:bg-gray-dark-400',
                    'focus:outline-none focus:ring-2 focus:ring-secondary',
                    (disabled || readOnly) && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-label='Select timezone'
                >
                  {selectedTimezone}
                </button>
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && <p className='text-sm text-gray-light-700 dark:text-gray-dark-300'>{description}</p>}

      {/* Hint/Error message */}
      {hint?.message && (
        <div className='py-0.5 flex items-center gap-2'>
          {getIconByHintType(hint.type)}
          <span
            className={cn(
              'fs-small tablet:fs-small-tablet',
              hint.type === 'info'
                ? 'text-gray-light-700 dark:text-gray-dark-300'
                : hint.type === 'warning'
                  ? 'text-yellow dark:text-yellow-400'
                  : hint.type === 'error'
                    ? 'text-red-500 dark:text-red-500'
                    : hint.type === 'success'
                      ? 'text-green dark:text-green-400'
                      : 'text-gray-light-700 dark:text-gray-dark-300'
            )}
          >
            {hint.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default TimeInput;
