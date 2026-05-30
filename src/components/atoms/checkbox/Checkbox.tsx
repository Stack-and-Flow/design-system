import type { FC } from 'react';
import { Icon } from '../icon';
import { Text } from '../text';
import type { CheckboxProps } from './types';
import { useCheckbox } from './useCheckbox';

export const Checkbox: FC<CheckboxProps> = (props) => {
  const {
    description,
    descriptionClassName,
    descriptionId,
    errorClassName,
    errorId,
    errorMessage,
    hasDescription,
    hasErrorMessage,
    hitAreaClassName,
    controlClassName,
    controlState,
    indicatorClassName,
    inputProps,
    labelClassName,
    labelHtml,
    labelId,
    labelText,
    rootClassName
  } = useCheckbox(props);

  return (
    <div
      className='inline-flex flex-col gap-1'
      data-disabled={inputProps.disabled}
      data-invalid={inputProps['aria-invalid']}
    >
      <div className={rootClassName}>
        <span className={hitAreaClassName}>
          <input {...inputProps} />
          <span className={controlClassName} data-state={controlState}>
            {controlState === 'indeterminate' ? (
              <span className={`${indicatorClassName} h-0.5 rounded-full bg-current`} aria-hidden={true} />
            ) : (
              <svg
                viewBox='0 0 14 14'
                className={indicatorClassName}
                aria-hidden={true}
                style={{ opacity: controlState === 'checked' ? 1 : 0 }}
              >
                <path
                  d='M11.5 4.5L5.875 10.125L2.5 6.75'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                />
              </svg>
            )}
          </span>
        </span>

        <span className='flex min-w-0 -translate-y-0.5 flex-col gap-1'>
          {labelText && (
            <Text id={labelId} tag='span' className={labelClassName}>
              {labelText}
            </Text>
          )}
          {labelHtml && (
            <Text id={labelId} tag='span' className={labelClassName} isHtml={true}>
              {labelHtml}
            </Text>
          )}
          {hasDescription && (
            <Text id={descriptionId} tag='small' className={descriptionClassName}>
              {description}
            </Text>
          )}
        </span>
      </div>

      {hasErrorMessage && (
        <div id={errorId} className='flex translate-x-0.5 items-center gap-2 py-0.5'>
          <Icon name='circle-alert' tone='danger' size={16} decorative={true} />
          <Text tag='small' className={errorClassName}>
            {errorMessage}
          </Text>
        </div>
      )}
    </div>
  );
};
