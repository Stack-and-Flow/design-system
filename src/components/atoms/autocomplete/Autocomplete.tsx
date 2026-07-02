import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { SpinnerCircular } from 'spinners-react';
import { Icon } from '../icon';
import type { AutocompleteProps } from './types';
import { useAutocomplete } from './useAutocomplete';

export const Autocomplete: FC<AutocompleteProps> = (props) => {
  const {
    isOpen,
    filteredOptions,
    selectedOption,
    hasValue,
    showClearButton,
    isLoading,
    isRequired,
    clearAriaLabel,
    loadingLabel,
    emptyMessage,
    label,
    description,
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
    searchInputClassName,
    emptyMessageClassName,
    filterContainerClassName,
    descriptionClassName,
    placeholderClassName,
    loadingClassName,
    portalScopeClassName,
    shouldShowEmptyState,
    shouldShowList,
    listboxId,
    getOptionClassName,
    popoverStyle,
    triggerProps,
    searchInputProps,
    getOptionProps,
    labelProps,
    descriptionProps,
    hiddenInputProps,
    containerProps,
    handleClear,
    handlePopoverMouseDown,
    hasHint,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    portalContainer,
    listboxAriaLabel,
    popoverRef
  } = useAutocomplete(props);

  return (
    <div className={baseClassName}>
      {description && (
        <div {...descriptionProps} className={descriptionClassName}>
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
              {hasValue && selectedOption ? (
                selectedOption.label
              ) : (
                <span className={placeholderClassName}>{placeholder}</span>
              )}
            </span>
          </button>
        </div>

        <div className={actionGroupClassName}>
          {showClearButton && (
            <button type='button' aria-label={clearAriaLabel} className={clearButtonClassName} onClick={handleClear}>
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
          <div className={portalScopeClassName} style={{ display: 'contents' }}>
            <div
              ref={popoverRef}
              className={popoverClassName}
              style={popoverStyle}
              onMouseDown={handlePopoverMouseDown}
            >
              {isLoading ? (
                <div className={loadingClassName} role='status' aria-live='polite'>
                  <span aria-hidden='true' className='inline-flex text-brand-light dark:text-brand-dark'>
                    <SpinnerCircular color='currentColor' thickness={200} size='1.25em' />
                  </span>
                  <span>{loadingLabel}</span>
                </div>
              ) : (
                <>
                  <div className='shrink-0 px-2 py-1.5'>
                    <input {...searchInputProps} className={searchInputClassName} />
                  </div>

                  {shouldShowEmptyState && (
                    <>
                      <div
                        role='listbox'
                        id={listboxId}
                        aria-label={label ?? listboxAriaLabel}
                        className={filterContainerClassName}
                      />
                      <div className={emptyMessageClassName} role='status' aria-live='polite'>
                        {emptyMessage}
                      </div>
                    </>
                  )}

                  {shouldShowList && (
                    <div
                      role='listbox'
                      id={listboxId}
                      aria-label={label ?? listboxAriaLabel}
                      className={filterContainerClassName}
                    >
                      {filteredOptions.map((option) => (
                        <div key={option.key} className={getOptionClassName(option)} {...getOptionProps(option)}>
                          {option.startContent}
                          <div className='flex-1 min-w-0'>
                            <span className='block truncate'>{option.label}</span>
                            {option.description && (
                              <span className='block text-xs text-text-muted-light dark:text-text-muted-dark truncate'>
                                {option.description}
                              </span>
                            )}
                          </div>
                          {option.endContent}
                        </div>
                      ))}
                    </div>
                  )}
                </>
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
