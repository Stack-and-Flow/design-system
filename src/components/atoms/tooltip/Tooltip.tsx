import type { FC } from 'react';
import type { TooltipProps } from './types';
import { useTooltip } from './useTooltip';

const Tooltip: FC<TooltipProps> = ({ ...props }) => {
  const { name } = useTooltip(props);
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default Tooltip;
