import type { FC } from 'react';
import type { SwitchProps } from './types';
import { useSwitch } from './useSwitch';

export const Switch: FC<SwitchProps> = (props) => {
  const {
    label,
    thumbIcon,
    disabled,
    checked,
    ariaChecked,
    ariaLabel,
    inputRole,
    startContent,
    endContent,
    rootClassName,
    switchWrapper,
    switchStartContent,
    switchHiddenInput,
    switchTrack,
    switchThumb,
    switchThumbIcon,
    switchEndContent,
    switchLabel,
    handleInputChange,
    ...inputProps
  } = useSwitch(props);

  return (
    <label className={rootClassName}>
      <span className={switchWrapper}>
        <input
          {...inputProps}
          type='checkbox'
          checked={checked}
          disabled={disabled}
          className={switchHiddenInput}
          aria-checked={ariaChecked}
          role={inputRole}
          aria-label={ariaLabel}
          onChange={handleInputChange}
        />
        <span className={switchTrack}>
          {startContent && (
            <span className={switchStartContent} data-start-content={true}>
              {startContent}
            </span>
          )}
          <span className={switchThumb} data-thumb={true}>
            {thumbIcon && (
              <span className={switchThumbIcon} data-thumb-icon={true}>
                {thumbIcon}
              </span>
            )}
          </span>
          {endContent && (
            <span className={switchEndContent} data-end-content={true}>
              {endContent}
            </span>
          )}
        </span>
      </span>
      {label && <span className={switchLabel}>{label}</span>}
    </label>
  );
};
