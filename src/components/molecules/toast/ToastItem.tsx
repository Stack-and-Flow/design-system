import { cn } from '@/lib/utils';
import React from 'react';
import type { ToastProps } from './types.ts';

const ToastItem = ({ message, onClose, duration, type = 'default' }: ToastProps) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, []);

  const colors = {
    default: '#333',
    success: '#3fb950',
    error: '#ff3b3b'
  };

  return (
    <div
      className={cn('text-white px-6 py-3 flex items-center justify-between rounded-sm min-w-52')}
      style={{
        backgroundColor: colors[type]
      }}
      role='alert'
    >
      <span>{message}</span>
      <button onClick={onClose} className='text-white cursor-pointer border-none font-bold' aria-label='Cerrar'>
        ×
      </button>
    </div>
  );
};

export default ToastItem;
