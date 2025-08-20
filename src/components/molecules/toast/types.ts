export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export type ToastType = 'default' | 'success' | 'error';

export type ToastOptions = {
  duration?: number;
  type?: ToastType;
};

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

// A subscriber function that will be called when a new toast is created
export type Subscriber = (toast: ToastItem) => void;

// Props for the <Toast /> component
export type ToastProps = {
  message: string;
  onClose: () => void;
  duration: number;
  type?: ToastType;
};

// Props for the <Toaster /> component
export type ToasterProps = {
  duration?: number;
  position?: Position;
};
