import type { FC } from 'react';
import { Icon } from '../icon';
import type { InputProps } from './types';
import { useInput } from './useInput';

export const Input: FC<InputProps> = (props) => {
  const {
    adornmentClassName,
    containerProps,
    contentClassName,
    decrementButtonProps,
    endContent,
    hasHint,
    hasLabel,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    incrementButtonProps,
    inputProps,
    isRequired,
    label,
    labelProps,
    passwordButtonProps,
    passwordIconName,
    shouldRenderNumberControls,
    shouldRenderPasswordToggle,
    startContent,
    stepButtonGroupClassName,
    toggleButtonGroupClassName,
    wrapperClassName
  } = useInput(props);

  return (
    <div className={wrapperClassName}>
      <div {...containerProps}>
        {hasLabel && (
          <label {...labelProps}>
            {label}{' '}
            {isRequired && (
              <span className='text-brand-light dark:text-brand-dark' aria-hidden={true}>
                *
              </span>
            )}
          </label>
        )}
        <div className={contentClassName}>
          {startContent && <span className={adornmentClassName}>{startContent}</span>}
          <input {...inputProps} />
          {shouldRenderNumberControls && (
            <div className={stepButtonGroupClassName}>
              <button {...incrementButtonProps}>
                <Icon name='chevron-up' tone='default' size={16} decorative={true} />
              </button>
              <button {...decrementButtonProps}>
                <Icon name='chevron-down' tone='default' size={16} decorative={true} />
              </button>
            </div>
          )}
          {shouldRenderPasswordToggle && (
            <div className={toggleButtonGroupClassName}>
              <button {...passwordButtonProps}>
                <Icon name={passwordIconName} tone='default' size={20} decorative={true} />
              </button>
            </div>
          )}
          {endContent && <span className={adornmentClassName}>{endContent}</span>}
        </div>
      </div>
      {hasHint && (
        <div id={`${props.id}-hint`} className='flex items-center gap-2 py-0.5'>
          {hintIconProps && <Icon {...hintIconProps} decorative={true} />}
          <span className={hintMessageClassName}>{hintMessage}</span>
        </div>
      )}
    </div>
  );
};
