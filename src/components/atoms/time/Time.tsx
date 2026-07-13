import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../icon';
import type { TimeComponentProps } from './types';
import { useTime } from './useTime';

export const Time: FC<TimeComponentProps> = (props) => {
  const {
    containerRef,
    containerClassName,
    wrapperClassName,
    labelClassName,
    adornmentClassName,
    contentClassName,
    stepButtonGroupClassName,
    hasLabel,
    label,
    id,
    size,
    disabled,
    isRequired,
    startContent,
    endContent,
    granularity,
    hourCycle,
    name,
    segments,
    hourRef,
    minuteRef,
    secondRef,
    dayPeriodRef,
    describedBy,
    labelledBy,
    isInvalid,
    hasHint,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    handleContainerClick,
    handleSegmentFocus,
    handleSegmentBlur,
    handleSegmentKeyDown,
    handleSegmentInput,
    getPlaceholder,
    getLabelForSegment,
    getSegmentDisplayValue,
    getSegmentAriaValueNow,
    getMinValue,
    getMaxValue,
    incrementButtonProps,
    decrementButtonProps,
    showSteppers,
    showClockIcon,
    ...rest
  } = useTime(props);

  const renderSegment = (segmentName: string) => {
    const ref =
      segmentName === 'hour'
        ? hourRef
        : segmentName === 'minute'
          ? minuteRef
          : segmentName === 'second'
            ? secondRef
            : dayPeriodRef;

    return (
      <input
        id={segmentName === 'hour' ? `${id}-hour` : `${id}-${segmentName}`}
        ref={ref}
        type='text'
        inputMode={segmentName === 'dayPeriod' ? 'text' : 'numeric'}
        value={getSegmentDisplayValue(segmentName)}
        placeholder={getPlaceholder(segmentName)}
        disabled={disabled}
        name={name ? `${name}-${segmentName}` : undefined}
        aria-label={getLabelForSegment(segmentName)}
        aria-valuemin={segmentName === 'dayPeriod' ? 0 : getMinValue(segmentName)}
        aria-valuemax={segmentName === 'dayPeriod' ? 1 : getMaxValue(segmentName)}
        aria-valuenow={getSegmentAriaValueNow(segmentName)}
        aria-valuetext={segmentName === 'dayPeriod' ? getSegmentDisplayValue(segmentName) : undefined}
        aria-invalid={isInvalid ? 'true' : 'false'}
        aria-describedby={describedBy}
        aria-required={isRequired}
        role='spinbutton'
        className={cn(
          'text-center bg-transparent outline-none border-none font-medium',
          'text-text-light dark:text-text-dark',
          'placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark',
          segmentName === 'dayPeriod' ? 'w-10' : 'w-8',
          size === 'sm' && 'fs-small',
          size === 'md' && 'fs-base',
          size === 'lg' && 'fs-h6',
          disabled && 'cursor-not-allowed'
        )}
        maxLength={2}
        onChange={(e) => handleSegmentInput(segmentName, e.target.value)}
        onFocus={(e) => handleSegmentFocus(segmentName, e)}
        onBlur={handleSegmentBlur}
        onKeyDown={(e) => handleSegmentKeyDown(segmentName, e)}
      />
    );
  };

  return (
    <div className={wrapperClassName}>
      <div
        ref={containerRef}
        data-time-wrapper={true}
        className={containerClassName}
        onClick={handleContainerClick}
        {...rest}
      >
        {hasLabel && (
          <label id={`${id}-label`} htmlFor={`${id}-hour`} className={labelClassName}>
            {label}{' '}
            {isRequired && (
              <span className='text-brand-light dark:text-brand-dark' aria-hidden={true}>
                *
              </span>
            )}
          </label>
        )}
        <div className={contentClassName}>
          {(showClockIcon || startContent) && (
            <span className={adornmentClassName}>
              {showClockIcon ? (
                <Icon name='clock' tone='muted' size={size === 'lg' ? 20 : 18} decorative={true} />
              ) : (
                startContent
              )}
            </span>
          )}
          <div
            className='flex items-center gap-0.5'
            role='group'
            aria-labelledby={[hasLabel ? `${id}-label` : undefined, labelledBy].filter(Boolean).join(' ') || undefined}
            aria-label={hasLabel || labelledBy ? undefined : 'Time'}
          >
            {renderSegment('hour')}
            <span className='select-none text-text-muted-light dark:text-text-muted-dark font-medium'>:</span>
            {renderSegment('minute')}
            {granularity === 'second' && (
              <>
                <span className='select-none text-text-muted-light dark:text-text-muted-dark font-medium'>:</span>
                {renderSegment('second')}
              </>
            )}
            {hourCycle === 12 && (
              <>
                <span className='w-1.5' aria-hidden={true} />
                {renderSegment('dayPeriod')}
              </>
            )}
          </div>
          {showSteppers && (
            <div className={stepButtonGroupClassName}>
              <button {...incrementButtonProps}>
                <Icon name='chevron-up' tone='default' size={16} decorative={true} />
              </button>
              <button {...decrementButtonProps}>
                <Icon name='chevron-down' tone='default' size={16} decorative={true} />
              </button>
            </div>
          )}
          {endContent && <span className={adornmentClassName}>{endContent}</span>}
        </div>
      </div>
      {hasHint && (
        <div id={`${id}-hint`} className='flex items-center gap-2 py-0.5'>
          {hintIconProps && <Icon {...hintIconProps} decorative={true} />}
          <span className={hintMessageClassName}>{hintMessage}</span>
        </div>
      )}
    </div>
  );
};
