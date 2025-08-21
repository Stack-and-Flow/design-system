import React from 'react';
import ToastItem from './ToastItem';
import { setToastGlobalOptions, toastSubscribe } from './toast';
import type { ToasterProps } from './types';

export const Toaster: React.FC<ToasterProps> = ({ duration = 3000, position = 'bottom-right' }) => {
  const [toasts, setToasts] = React.useState<any[]>([]);

  React.useEffect(() => {
    setToastGlobalOptions({ duration });
  }, [duration]);

  React.useEffect(() => {
    const unsubscribe = toastSubscribe((toastItem) => {
      setToasts((prev) => [...prev, toastItem]);
    });
    return unsubscribe;
  }, []);

  const removeToast = React.useCallback((id: string | number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const positionStyle = position === 'top-right' ? { top: 24, right: 24 } : { bottom: 24, right: 24 };

  return (
    <div style={{ ...positionStyle }} className='fixed z-50'>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {toasts.map((toastItem) => (
          <li key={toastItem.id}>
            <ToastItem
              id={toastItem.id}
              message={toastItem.message}
              duration={toastItem.duration}
              type={toastItem.type}
              onClose={removeToast}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};
