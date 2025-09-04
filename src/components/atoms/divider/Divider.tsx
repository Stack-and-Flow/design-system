import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

const Divider: FC<DividerProps> = ({ ...props }) => {
  const { dividerClass, animation, orientation } = useDivider(props);
  return (
    <div role='separator' className={cn(dividerClass)} style={{ position: 'relative' }}>
      {animation === 'kitt' ? (
        <div
          className={`absolute top-0 left-0 ${orientation === 'horizontal' ? ' w-1/2 h-0.5 bg-gradient-to-r from-transparent from-20% via-red-100 via-50% to-transparent to-80% animate-[kitt-scanX_1.5s_ease-in_infinite]' : 'w-0.5 h-1/2 bg-gradient-to-t from-transparent via-neutral-200 to-transparent animate-[kitt-scanY_1.5s_ease-in_infinite]'}`}
        ></div>
      ) : null}
    </div>
  );
};

export default Divider;
