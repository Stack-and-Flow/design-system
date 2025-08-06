import type { FC } from 'react';
import type { SwitchProps } from './types';
import { useSwitch } from './useSwitch';

const Switch: FC<SwitchProps> = ({ ...props }) => {
  const { label, size } = useSwitch(props);
  return (
    <div>
      <h1>{label}</h1>
      <p>{size}</p>
    </div>
  );
};

export default Switch;
