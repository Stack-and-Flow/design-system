import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

const Divider: FC<DividerProps> = ({ ...props }) => {
  const { orientation, sizeFinal, finalColor, shadowDivider, dividerAnimation, thickness } = useDivider(props);
  if (orientation === 'horizontal') {
    return (
      <div
        role='separator'
        aria-orientation={orientation}
        className={cn(dividerAnimation)}
        style={{
          height: orientation === 'horizontal' ? thickness : sizeFinal,
          width: sizeFinal,
          background: finalColor,
          boxShadow: shadowDivider
        }}
      ></div>
    );
  }
};

export default Divider;
