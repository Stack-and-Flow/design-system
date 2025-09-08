import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

const Divider: FC<DividerProps> = ({ ...props }) => {
  const { dividerClass, color } = useDivider(props);
  return (
    <div role='separator' className={cn(dividerClass, color)}>
      {' '}
    </div>
  );
};

export default Divider;
