import { useState } from 'react';
import type { SwitchProps } from './types';
import {
  switchBase,
  switchEndContent,
  switchHiddenInput,
  switchLabel,
  switchStartContent,
  switchThumb,
  switchThumbIcon,
  switchTrack,
  switchWrapper
} from './types';
export const useSwitch = ({
  label,
  className = '',
  size = 'md',
  color = 'default',
  labelPlacement = 'right',
  variant = 'default',
  rounded = true,
  checked: checkedProp,
  defaultChecked,
  onChange,
  disabled = false,
  thumbIcon = false,
  startContent = null,
  endContent = null,
  role,
  ariaChecked,
  ariaLabel
}: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : isChecked;

  const handleChange = (value: boolean) => {
    if (!isControlled) {
      setIsChecked(value);
    }
    onChange?.(value);
  };

  return {
    label,
    className,
    size,
    color,
    variant,
    rounded,
    labelPlacement,
    disabled,
    thumbIcon,
    startContent,
    endContent,
    checked,
    onChange: handleChange,
    switchBase: switchBase({ labelPlacement }),
    switchWrapper: switchWrapper({ size, disabled, rounded }),
    switchStartContent: switchStartContent({}),
    switchHiddenInput: switchHiddenInput({}),
    switchTrack: switchTrack({ size, color, rounded }),
    switchThumb: switchThumb({ size, variant }),
    switchThumbIcon: switchThumbIcon({}),
    switchEndContent: switchEndContent({}),
    switchLabel: switchLabel({ size, disabled }),
    role,
    ariaChecked,
    ariaLabel
  };
};
