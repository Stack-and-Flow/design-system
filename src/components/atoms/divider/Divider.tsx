import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

const Divider: FC<DividerProps> = ({ ...props }) => {
  const { orientation, widthHorizontalSize, heightVerticalSize, colorDivider } = useDivider(props);
  return orientation === 'horizontal' ? (
    <div
      style={{
        height: '1px',
        boxShadow: `0px 1px 7px 2px ${colorDivider}`,
        backgroundColor: colorDivider,
        width: widthHorizontalSize
      }}
    ></div>
  ) : (
    <div
      style={{
        width: '1px',
        boxShadow: `0px 1px 7px 2px ${colorDivider}`,
        backgroundColor: colorDivider,
        height: heightVerticalSize
      }}
    />
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
