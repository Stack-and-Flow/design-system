import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

export const Divider: FC<DividerProps> = (props) => {
  const { className, dividerProps } = useDivider(props);

  return <div {...dividerProps} className={className} />;
};
