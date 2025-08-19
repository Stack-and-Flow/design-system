import type { FC } from 'react';
import type { ToastProps } from './types';
import { useToast } from './useToast';

const Toast: FC<ToastProps> = ({ ...props }) => {
  const { name } = useToast(props);
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default Toast;
