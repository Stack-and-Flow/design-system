import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../icon';
import type { SelectProps } from './types';
import { selectDescription, selectLoadingVariants, selectPlaceholder, selectSpinnerVariants } from './types';
import { useSelect } from './useSelect';

export const Select: FC<SelectProps> = (props) => {
  const {
    isOpen,
    selectedOption,
    showClearButton,
    isLoading,
    isRequired,
    label,
    description,
    errorMessage,
    options,
    placeholder,
    triggerClassName,
    popoverClassName,
    valueClassName,
    indicatorClassName,
    clearButtonClassName,
    labelClassName,
    errorMessageClassName,
    baseClassName,
    getOptionClassName,
    getOptionProps,
    triggerProps,
    popoverProps,
    popoverStyle,
    labelProps,
    descriptionProps,
    errorMessageProps,
    hiddenInputProps,
    handleClear
  } = useSelect(props);

  return (
    <div className={baseClassName}>
      {description && (
        <div {...descriptionProps} className={selectDescription()}>
          {description}
        </div>
      )}
      <button {...triggerProps} className={triggerClassName}>
        {label ? (
          <div className='flex flex-col w-full gap-0.5'>
            <div className='flex items-center justify-between gap-1'>
              <label {...labelProps} className={labelClassName}>
                {label}
                {isRequired && (
                  <span aria-hidden={true} className='text-brand-light dark:text-brand-dark'>
                    {' *'}
                  </span>
                )}
              </label>
              <div className='flex items-center gap-1 shrink-0'>
                {showClearButton && (
                  <span
                    role='button'
                    tabIndex={-1}
                    aria-label='Clear selection'
                    className={clearButtonClassName}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear(e);
                    }}
                  >
                    <Icon name='x' size={16} decorative={true} />
                  </span>
                )}
                <span className={indicatorClassName}>
                  <Icon name='chevron-down' size={16} decorative={true} />
                </span>
              </div>
            </div>
            <span className={valueClassName}>
              {selectedOption ? selectedOption.label : <span className={selectPlaceholder()}>{placeholder}</span>}
            </span>
          </div>
        ) : (
          <>
            <span className={valueClassName}>
              {selectedOption ? selectedOption.label : <span className={selectPlaceholder()}>{placeholder}</span>}
            </span>
            <div className='flex items-center gap-1 shrink-0'>
              {showClearButton && (
                <span
                  role='button'
                  tabIndex={-1}
                  aria-label='Clear selection'
                  className={clearButtonClassName}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                >
                  <Icon name='x' size={16} decorative={true} />
                </span>
              )}
              <span className={indicatorClassName}>
                <Icon name='chevron-down' size={16} decorative={true} />
              </span>
            </div>
          </>
        )}
      </button>
      <input {...hiddenInputProps} />
      {isOpen &&
        createPortal(
          <div {...popoverProps} className={popoverClassName} style={popoverStyle}>
            {isLoading ? (
              <div className={selectLoadingVariants()} role='status' aria-live='polite'>
                <span aria-hidden='true' className={selectSpinnerVariants()} />
                <span>Loading options...</span>
              </div>
            ) : (
              options.map((option, index) => (
                <div key={option.key} className={getOptionClassName(option, index)} {...getOptionProps(option, index)}>
                  {option.startContent}
                  <span className='flex-1 truncate'>{option.label}</span>
                  {option.description && (
                    <span className='text-xs text-text-muted-light dark:text-text-muted-dark'>
                      {option.description}
                    </span>
                  )}
                  {option.endContent}
                </div>
              ))
            )}
          </div>,
          document.body
        )}
      {errorMessage && (
        <div {...errorMessageProps} className={errorMessageClassName}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};
