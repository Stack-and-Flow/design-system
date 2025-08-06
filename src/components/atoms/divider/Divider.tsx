import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

const Divider: FC<DividerProps> = ({ ...props }) => {
  const { orientation, widthSize, heightSize, horizontalColor, verticalColor } = useDivider(props);
  const widthVertical = 'w-px';
  return orientation === 'horizontal' ? (
    <div style={{ marginBlock: '1rem' }}>
      <hr className={cn(horizontalColor)} style={{ width: widthSize }} />
    </div>
  ) : (
    <div className={cn(widthVertical, verticalColor)} style={{ height: heightSize }} />
  );
};

export default Divider;

/* 


import { cn } from '@/lib/utils';


className={cn(color, `dark:${darkColor}`)}

<hr style={{width: widthClass, borderWidth: heightClass, borderRadius: cornerClass}} />


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

*/
