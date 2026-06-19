import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { SpinnerCircular } from 'spinners-react';
import { Icon } from '../icon';
import type { AutocompleteProps } from './types';
import { selectDescription, selectLoadingVariants, selectPlaceholder } from './types';
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
    hasHint,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    needsScopedDarkPortal,
    portalContainer,
    listboxAriaLabel,
    popoverRef
  } = useAutocomplete(props);

  const shouldShowEmptyState = !isLoading && filteredOptions.length === 0;
  const shouldShowList = !isLoading && filteredOptions.length > 0;

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
              {hasValue && selectedOption ? (
                selectedOption.label
              ) : (
                <span className={selectPlaceholder()}>{placeholder}</span>
              )}
            </span>
          </button>
        </div>

        <div className={actionGroupClassName}>
          {showClearButton && (
            <button
              type='button'
              aria-label={clearAriaLabel}
              className={clearButtonClassName}
              onClick={(event) => {
                handleClear(event);
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
            <div
              ref={popoverRef as React.RefObject<HTMLDivElement>}
              className={popoverClassName}
              style={popoverStyle}
              onMouseDown={(e) => e.preventDefault()}
            >
              {isLoading ? (
                <div className={selectLoadingVariants()} role='status' aria-live='polite'>
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
                    <div className={emptyMessageClassName} role='status' aria-live='polite'>
                      {emptyMessage}
                    </div>
                  )}

                  {shouldShowList && (
                    <div
                      role='listbox'
                      id={`${triggerProps.id}-listbox`}
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
