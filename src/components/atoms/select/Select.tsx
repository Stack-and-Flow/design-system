import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { SpinnerCircular } from 'spinners-react';
import { Icon } from '../icon';
import type { SelectProps } from './types';
import { selectDescription, selectLoadingVariants, selectPlaceholder } from './types';
import { useSelect } from './useSelect';

export const Select: FC<SelectProps> = (props) => {
  const {
    isOpen,
    selectedOption,
    showClearButton,
    isLoading,
    isRequired,
    clearAriaLabel,
    loadingLabel,
    label,
    description,
    options,
    placeholder,
    triggerClassName,
    popoverClassName,
    contentClassName,
    nativeTriggerClassName,
    valueClassName,
    actionGroupClassName,
    indicatorClassName,
    clearButtonClassName,
    labelClassName,
    baseClassName,
    getOptionClassName,
    getOptionProps,
    triggerProps,
    popoverProps,
    popoverStyle,
    labelProps,
    descriptionProps,
    hiddenInputProps,
    handleClear,
    containerProps,
    hasHint,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    needsScopedDarkPortal,
    portalContainer
  } = useSelect(props);

  return (
    <div className={baseClassName}>
      {description && (
        <div {...descriptionProps} className={selectDescription()}>
          {description}
        </div>
      )}
      <div {...containerProps} className={triggerClassName}>
        {label && (
          <label {...labelProps} className={labelClassName}>
            {label}
            {isRequired && (
              <span aria-hidden={true} className='text-brand-light dark:text-brand-dark'>
                {' *'}
              </span>
            )}
          </label>
        )}
        <div className={contentClassName}>
          <button {...triggerProps} className={nativeTriggerClassName}>
            <span className={valueClassName}>
              {selectedOption ? selectedOption.label : <span className={selectPlaceholder()}>{placeholder}</span>}
            </span>
          </button>
        </div>
        <div className={actionGroupClassName}>
          {showClearButton && (
            <button
              type='button'
              aria-label={clearAriaLabel}
              className={clearButtonClassName}
              onClick={(e) => {
                handleClear(e);
              }}
            >
              <Icon name='x' size={16} decorative={true} />
            </button>
          )}
          <span className={indicatorClassName}>
            <Icon name='chevron-down' size={20} decorative={true} />
          </span>
        </div>
      </div>
      <input {...hiddenInputProps} />
      {isOpen &&
        portalContainer &&
        createPortal(
          <div className={needsScopedDarkPortal ? 'dark' : undefined} style={{ display: 'contents' }}>
            <div {...popoverProps} className={popoverClassName} style={popoverStyle}>
              {isLoading ? (
                <div className={selectLoadingVariants()} role='status' aria-live='polite'>
                  <span aria-hidden='true' className='inline-flex text-brand-light dark:text-brand-dark'>
                    <SpinnerCircular color='currentColor' thickness={200} size='1.25em' />
                  </span>
                  <span>{loadingLabel}</span>
                </div>
              ) : (
                options.map((option, index) => (
                  <div
                    key={option.key}
                    className={getOptionClassName(option, index)}
                    {...getOptionProps(option, index)}
                  >
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
            </div>
          </div>,
          portalContainer
        )}
      {hasHint && (
        <div id={`${triggerProps.id}-hint`} className='flex items-center gap-2 py-0.5'>
          {hintIconProps && <Icon {...hintIconProps} decorative={true} />}
          <span className={hintMessageClassName}>{hintMessage}</span>
        </div>
      )}
    </div>
  );
};
