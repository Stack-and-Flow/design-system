import React from 'react';
import ToastItem from './ToastItem';
import { setToastGlobalOptions, toastSubscribe } from './toast';
import type { ToasterProps } from './types';

export const Toaster: React.FC<ToasterProps> = ({ duration = 3000, position = 'bottom-right' }) => {
  const [toasts, setToasts] = React.useState<any[]>([]);

  // Set global options for duration
  React.useEffect(() => {
    setToastGlobalOptions({ duration });
  }, [duration]);

  // Subscribe to new toasts
  React.useEffect(() => {
    const unsubscribe = toastSubscribe((toastItem) => {
      setToasts((prev) => [...prev, toastItem]);
    });
    return unsubscribe;
  }, []);

  // Remove toast by id
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const positionStyle = position === 'top-right' ? { top: 24, right: 24 } : { bottom: 24, right: 24 };

  return (
    <div style={{ ...positionStyle }} className='fixed z-50'>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {toasts.map((toastItem) => (
          <li key={toastItem.id}>
            <ToastItem
              message={toastItem.message}
              onClose={() => removeToast(toastItem.id)}
              duration={toastItem.duration}
              type={toastItem.type}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};
