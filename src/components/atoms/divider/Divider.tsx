import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

const Divider: FC<DividerProps> = ({ ...props }) => {
  const { name } = useDivider(props);
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default Divider;
