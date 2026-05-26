import { DynamicIcon } from 'lucide-react/dynamic.js';
import type { FC } from 'react';
import type { IconProps } from './types';
import { useIcon } from './useIcon';

export const Icon: FC<IconProps> = (props) => {
  const { iconProps } = useIcon(props);

  return <DynamicIcon {...iconProps} />;
};
