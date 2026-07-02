import type { FC } from 'react';
import { Calendar } from '../../atoms/calendar';
import { Popover } from '../../atoms/popover';
import type { DatePickerProps } from './types';
import { useDatePicker } from './useDatePicker';

export const DatePicker: FC<DatePickerProps> = (props) => {
  const datePicker = useDatePicker(props);

  return (
    <div {...datePicker.rootProps} className={datePicker.wrapperClassName} data-slot='date-picker'>
      {datePicker.hiddenInputProps && <input {...datePicker.hiddenInputProps} />}

      {datePicker.label && (
        <label
          className='fs-small font-semibold text-text-light dark:text-text-dark'
          htmlFor={props.id}
          id={datePicker.labelId}
        >
          {datePicker.label}{' '}
          {datePicker.isRequired && (
            <span className='text-brand-light dark:text-brand-dark' aria-hidden={true}>
              *
            </span>
          )}
        </label>
      )}

      <div className={datePicker.fieldClassName} data-slot='date-picker-field'>
        <Popover open={datePicker.effectiveOpen} onOpenChange={(open) => datePicker.requestOpenChange(open, 'trigger')}>
          <Popover.Trigger disabled={props.disabled ?? false}>
            <button
              {...datePicker.triggerButtonProps}
              className={datePicker.triggerClassName}
              data-slot='date-picker-trigger'
            >
              <span className={datePicker.valueClassName} id={datePicker.triggerValueId}>
                {datePicker.displayValue}
              </span>
              <svg
                aria-hidden={true}
                className={datePicker.indicatorClassName}
                data-slot='date-picker-indicator'
                fill='none'
                focusable='false'
                height='20'
                stroke='currentColor'
                viewBox='0 0 24 24'
                width='20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8 2v4M16 2v4M3.5 9.5h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 5 5Z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                />
              </svg>
            </button>
          </Popover.Trigger>

          <Popover.Content
            ariaLabel={datePicker.popoverAriaLabel}
            className={datePicker.popoverClassName}
            placement='bottom-start'
            size='lg'
          >
            <Popover.Body>
              <Calendar {...datePicker.calendarProps} />
            </Popover.Body>
          </Popover.Content>
        </Popover>

        {datePicker.shouldRenderClearButton && (
          <button {...datePicker.clearButtonProps} data-slot='date-picker-clear'>
            <svg
              aria-hidden={true}
              fill='none'
              focusable='false'
              height='18'
              stroke='currentColor'
              viewBox='0 0 24 24'
              width='18'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M6 6l12 12M18 6 6 18' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
            </svg>
          </button>
        )}
      </div>

      {datePicker.description && (
        <p className='fs-small text-text-secondary-light dark:text-text-secondary-dark' id={datePicker.descriptionId}>
          {datePicker.description}
        </p>
      )}

      {datePicker.requiredDescriptionId && (
        <p className='sr-only' id={datePicker.requiredDescriptionId}>
          Required field.
        </p>
      )}

      {datePicker.readOnlyDescriptionId && (
        <p className='sr-only' id={datePicker.readOnlyDescriptionId}>
          Read-only field.
        </p>
      )}

      {datePicker.validationMessage && (
        <p className={datePicker.messageClassName} id={datePicker.validationMessageId}>
          {datePicker.validationMessage}
        </p>
      )}
    </div>
  );
};
