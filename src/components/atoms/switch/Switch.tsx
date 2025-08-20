import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { SwitchProps } from './types';
import { useSwitch } from './useSwitch';

const Switch: FC<SwitchProps> = ({ ...props }) => {
  const {
    label,
    className,
    thumbIcon,
    disabled,
    checked,
    onChange,
    startContent,
    endContent,
    switchBase,
    switchWrapper,
    switchStartContent,
    switchHiddenInput,
    switchTrack,
    switchThumb,
    switchThumbIcon,
    switchEndContent,
    switchLabel,
    role,
    ariaChecked,
    ariaLabel
  } = useSwitch(props);
  return (
    <div className={cn(switchBase, className)} role={role}>
      <label className={switchWrapper}>
        <input
          type='checkbox'
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className={switchHiddenInput}
          aria-checked={ariaChecked}
          role='switch'
          aria-label='switch'
        />

        <span className={switchTrack}>
          {startContent && <span className={switchStartContent}>{startContent}</span>}
          <span className={switchThumb}>{thumbIcon && <span className={switchThumbIcon}>{thumbIcon}</span>}</span>
          {endContent && <span className={switchEndContent}>{endContent}</span>}
        </span>
      </label>
      {label && (
        <span className={switchLabel} aria-label={ariaLabel}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Switch;
