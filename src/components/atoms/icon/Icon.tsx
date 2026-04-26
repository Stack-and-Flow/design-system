import { DynamicIcon } from 'lucide-react/dynamic';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { IconProps } from './types';
import { useIcon } from './useIcon';

const Icon: FC<IconProps> = ({ ...props }) => {
  const { name, color, colorDark, className, size } = useIcon(props);
  return <DynamicIcon name={name} className={cn(color, colorDark, className)} size={size} />;
};

export default Icon;
