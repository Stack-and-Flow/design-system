import { cn } from '@/lib/utils';
import React from 'react';
import type { ToastProps } from './types';

type ToastItemProps = ToastProps & { id: string | string };

const colors = {
  default: '#333',
  success: '#3fb950',
  error: '#ff3b3b'
};

const ToastItem = ({ id, message, onClose, duration, type = 'default' }: ToastItemProps) => {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [id, duration, onClose]);

  return (
    <div
      className={cn('text-white px-6 py-3 flex items-center justify-between rounded-sm min-w-52')}
      style={{ backgroundColor: colors[type] }}
      role='alert'
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className='text-white cursor-pointer border-none font-bold'
        aria-label='Cerrar'
      >
        ×
      </button>
    </div>
  );
};

export default ToastItem;
