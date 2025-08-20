import type { Subscriber, ToastItem, ToastOptions } from './types';

const subscribers = new Set<Subscriber>();
let globalOptions: ToastOptions = {};

export const toast = (message: string, options?: ToastOptions) => {
  const toastItem: ToastItem = {
    id: crypto.randomUUID(),
    message,
    type: options?.type || 'default',
    duration: options?.duration ?? globalOptions.duration ?? 3000
  };
  subscribers.forEach((fn) => fn(toastItem));
};

toast.success = (message: string, options?: ToastOptions) => toast(message, { ...options, type: 'success' });

toast.error = (message: string, options?: ToastOptions) => toast(message, { ...options, type: 'error' });

export const toastSubscribe = (fn: Subscriber) => {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
};

export const setToastGlobalOptions = (opts: ToastOptions) => {
  globalOptions = opts;
};
