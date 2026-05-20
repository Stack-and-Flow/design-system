import { type ChangeEvent, useState } from 'react';
import { cn } from '@/lib/utils';
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

type UseSwitchReturn = Omit<
  SwitchProps,
  | 'aria-label'
  | 'ariaChecked'
  | 'ariaLabel'
  | 'checked'
  | 'className'
  | 'color'
  | 'defaultChecked'
  | 'disabled'
  | 'endContent'
  | 'label'
  | 'labelPlacement'
  | 'onChange'
  | 'role'
  | 'rounded'
  | 'size'
  | 'startContent'
  | 'thumbIcon'
  | 'variant'
> & {
  ariaChecked: boolean;
  ariaLabel?: string;
  checked: boolean;
  disabled: boolean;
  endContent: SwitchProps['endContent'];
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputRole: 'switch';
  label: SwitchProps['label'];
  rootClassName: string;
  startContent: SwitchProps['startContent'];
  switchEndContent: string;
  switchHiddenInput: string;
  switchLabel: string;
  switchStartContent: string;
  switchThumb: string;
  switchThumbIcon: string;
  switchTrack: string;
  switchWrapper: string;
  thumbIcon: SwitchProps['thumbIcon'];
};

export const useSwitch = ({
  label,
  className,
  size = 'md',
  color = 'default',
  labelPlacement = 'right',
  variant = 'default',
  rounded = true,
  checked: checkedProp,
  defaultChecked = false,
  onChange,
  disabled = false,
  thumbIcon,
  startContent,
  endContent,
  role,
  ariaChecked,
  ariaLabel,
  'aria-label': nativeAriaLabel,
  ...inputProps
}: SwitchProps): UseSwitchReturn => {
  void role;
  void ariaChecked;

  const actualDisabled = disabled || color === 'disabled';
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = checkedProp ?? internalChecked;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (actualDisabled) {
      return;
    }

    const nextChecked = event.target.checked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onChange?.(nextChecked);
  };

  return {
    ...inputProps,
    label,
    disabled: actualDisabled,
    thumbIcon,
    startContent,
    endContent,
    checked,
    ariaChecked: checked,
    ariaLabel: getAriaLabel(ariaLabel, nativeAriaLabel, label),
    inputRole: 'switch',
    handleInputChange,
    rootClassName: cn(switchBase({ labelPlacement, disabled: actualDisabled }), className),
    switchWrapper: switchWrapper({ disabled: actualDisabled }),
    switchStartContent: switchStartContent({}),
    switchHiddenInput: switchHiddenInput({}),
    switchTrack: switchTrack({ size, color, variant, rounded }),
    switchThumb: switchThumb({ size, color }),
    switchThumbIcon: switchThumbIcon({}),
    switchEndContent: switchEndContent({}),
    switchLabel: switchLabel({ size, disabled: actualDisabled })
  };
};

const getAriaLabel = (
  ariaLabel: string | undefined,
  nativeAriaLabel: string | undefined,
  label: string | undefined
): string => {
  const accessibleName = ariaLabel ?? nativeAriaLabel ?? label;

  if (!accessibleName) {
    throw new Error('Switch requires an accessible name. Provide label, ariaLabel, or aria-label.');
  }

  return accessibleName;
};
