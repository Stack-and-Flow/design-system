import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const toastViewportVariants = cva('fixed z-toast flex w-full max-w-full pointer-events-none p-4', {
  variants: {
    placement: {
      'top-start': 'top-0 left-0 items-start justify-start flex-col',
      top: 'top-0 left-1/2 -translate-x-1/2 items-center justify-start flex-col',
      'top-end': 'top-0 right-0 items-end justify-start flex-col',
      'bottom-start': 'bottom-0 left-0 items-start justify-end flex-col-reverse',
      bottom: 'bottom-0 left-1/2 -translate-x-1/2 items-center justify-end flex-col-reverse',
      'bottom-end': 'bottom-0 right-0 items-end justify-end flex-col-reverse'
    }
  },
  defaultVariants: {
    placement: 'bottom'
  }
});

export const toastVariants = cva(
  [
    'pointer-events-auto w-full transform-gpu overflow-hidden rounded-lg border shadow-modal will-change-transform dark:shadow-modal-dark',
    'transition-[opacity,transform,top,bottom,left,right,box-shadow,background-color,border-color] duration-200 ease-out motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:shadow-toast-focus-light dark:focus-visible:shadow-toast-focus-dark',
    'bg-surface-light text-text-light dark:bg-surface-dark dark:text-text-dark'
  ],
  {
    variants: {
      status: {
        neutral: '',
        info: '',
        success: '',
        warning: '',
        error: '',
        loading: ''
      },
      variant: {
        solid: '',
        soft: '',
        outline: 'bg-background-light dark:bg-background-dark'
      },
      size: {
        sm: 'max-w-[20rem] p-3 text-sm',
        md: 'max-w-[24rem] p-4 text-sm',
        lg: 'max-w-[28rem] p-5 text-base'
      },
      motionState: {
        entering: 'opacity-100 motion-safe:animate-in motion-safe:fade-in-0',
        visible: 'opacity-100 translate-y-0',
        paused: 'opacity-100 translate-y-0',
        closing: 'pointer-events-none opacity-0',
        dismissed: 'pointer-events-none opacity-0'
      },
      placement: {
        'top-start': '',
        top: '',
        'top-end': '',
        'bottom-start': '',
        bottom: '',
        'bottom-end': ''
      }
    },
    compoundVariants: [
      {
        motionState: 'entering',
        placement: ['top-start', 'top', 'top-end'],
        class: 'motion-safe:slide-in-from-top-2'
      },
      {
        motionState: 'entering',
        placement: ['bottom-start', 'bottom', 'bottom-end'],
        class: 'motion-safe:slide-in-from-bottom-2'
      },
      {
        motionState: ['closing', 'dismissed'],
        placement: ['top-start', 'top', 'top-end'],
        class: '-translate-y-2'
      },
      {
        motionState: ['closing', 'dismissed'],
        placement: ['bottom-start', 'bottom', 'bottom-end'],
        class: 'translate-y-2'
      },
      {
        status: 'neutral',
        variant: 'solid',
        class:
          'border-border-strong-light bg-surface-raised-light dark:border-border-strong-dark dark:bg-surface-raised-dark'
      },
      {
        status: 'neutral',
        variant: 'soft',
        class: 'border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark'
      },
      {
        status: 'neutral',
        variant: 'outline',
        class: 'border-border-strong-light dark:border-border-strong-dark'
      },
      {
        status: 'info',
        variant: 'solid',
        class: 'border-info-light bg-info-surface-light dark:border-info dark:bg-info-surface-dark'
      },
      {
        status: 'info',
        variant: 'soft',
        class: 'border-info-light/40 bg-info-surface-light dark:border-info/40 dark:bg-info-surface-dark'
      },
      {
        status: 'info',
        variant: 'outline',
        class: 'border-info-light dark:border-info'
      },
      {
        status: 'success',
        variant: 'solid',
        class: 'border-success-light bg-success-surface-light dark:border-success dark:bg-success-surface-dark'
      },
      {
        status: 'success',
        variant: 'soft',
        class: 'border-success-light/40 bg-success-surface-light dark:border-success/40 dark:bg-success-surface-dark'
      },
      {
        status: 'success',
        variant: 'outline',
        class: 'border-success-light dark:border-success'
      },
      {
        status: 'warning',
        variant: 'solid',
        class: 'border-warning-light bg-warning-surface-light dark:border-warning dark:bg-warning-surface-dark'
      },
      {
        status: 'warning',
        variant: 'soft',
        class: 'border-warning-light/40 bg-warning-surface-light dark:border-warning/40 dark:bg-warning-surface-dark'
      },
      {
        status: 'warning',
        variant: 'outline',
        class: 'border-warning-light dark:border-warning'
      },
      {
        status: 'error',
        variant: 'solid',
        class: 'border-error-light bg-error-surface-light dark:border-error dark:bg-error-surface-dark'
      },
      {
        status: 'error',
        variant: 'soft',
        class: 'border-error-light/40 bg-error-surface-light dark:border-error/40 dark:bg-error-surface-dark'
      },
      {
        status: 'error',
        variant: 'outline',
        class: 'border-error-light dark:border-error'
      },
      {
        status: 'loading',
        variant: 'solid',
        class: 'border-brand-light bg-red-surface-light dark:border-brand-dark dark:bg-red-surface-dark'
      },
      {
        status: 'loading',
        variant: 'soft',
        class: 'border-brand-light/40 bg-red-surface-light dark:border-brand-dark/40 dark:bg-red-surface-dark'
      },
      {
        status: 'loading',
        variant: 'outline',
        class: 'border-brand-light/50 dark:border-brand-dark/50'
      }
    ],
    defaultVariants: {
      status: 'neutral',
      variant: 'soft',
      size: 'md',
      motionState: 'visible',
      placement: 'bottom'
    }
  }
);

export const toastProgressTrackVariants = cva(
  'mt-3 h-1 w-full overflow-hidden rounded-full bg-black-tint-low dark:bg-white-tint-low'
);

export const toastProgressIndicatorVariants = cva('h-full origin-left rounded-full bg-brand-light dark:bg-brand-dark');

type ToastViewportVariantProps = VariantProps<typeof toastViewportVariants>;
type ToastVariantProps = VariantProps<typeof toastVariants>;
type NativeProviderProps = Omit<ComponentProps<'div'>, 'children' | 'className'>;

export type ToastPlacement = NonNullable<ToastViewportVariantProps['placement']>;
export type ToastStatus = NonNullable<ToastVariantProps['status']>;
export type ToastVariant = NonNullable<ToastVariantProps['variant']>;
export type ToastSize = NonNullable<ToastVariantProps['size']>;
export type ToastMotionState = NonNullable<ToastVariantProps['motionState']>;
export type ToastQueueStrategy = 'fifo' | 'lifo';
export type ToastMotion = 'default' | 'none';
export type ToastSwipeDirection = 'right' | 'left' | 'up' | 'down';

type ToastTextActionLabel = string | number;

type ToastActionBase = {
  onAction: () => void;
  disabled?: boolean;
};

export type ToastAction = ToastActionBase &
  (
    | {
        label: ToastTextActionLabel;
        ariaLabel?: string;
      }
    | {
        label: Exclude<ReactNode, ToastTextActionLabel>;
        ariaLabel: string;
      }
  );

export type ToastOptions = {
  /** @control text */
  id?: string;
  /** @control object */
  title: ReactNode;
  /** @control object */
  description?: ReactNode;
  /** @control object */
  icon?: ReactNode | null;
  /**
   * @control select
   * @default neutral
   */
  status?: ToastStatus;
  /**
   * @control select
   * @default soft
   */
  variant?: ToastVariant;
  /**
   * @control select
   * @default md
   */
  size?: ToastSize;
  /** @control object */
  action?: ToastAction;
  /**
   * @control boolean
   * @default true
   */
  dismissible?: boolean;
  /**
   * @control number
   * @default provider defaultDuration
   */
  duration?: number;
  /**
   * @control boolean
   * @default true
   */
  progress?: boolean;
  /**
   * @control boolean
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * @control boolean
   * @default true
   */
  pauseOnFocusWithin?: boolean;
  /**
   * @control boolean
   * @default provider pauseOnWindowBlur
   */
  pauseOnWindowBlur?: boolean;
  /**
   * @control select
   * @default derived from placement
   */
  swipeDirection?: ToastSwipeDirection;
  /**
   * @control number
   * @default 50
   */
  swipeThreshold?: number;
  /** @control text */
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onDismiss?: () => void;
  onPause?: () => void;
  onResume?: () => void;
};

export type ToastObjectInput = ToastOptions;
export type ToastRenderable = ReactNode;
export type ToastCallInput = ToastRenderable | ToastObjectInput;
export type ToastCallOverrides = Omit<Partial<ToastOptions>, 'title'>;
export type ToastPromiseValue<TValue> =
  | ToastRenderable
  | ToastObjectInput
  | ((value: TValue) => ToastRenderable | ToastObjectInput);
export type ToastPromiseOptions<TValue = unknown, TError = Error> = {
  loading: ToastCallInput;
  success: ToastPromiseValue<TValue>;
  error: ToastPromiseValue<TError>;
};

export type ToastVisibleRecord = Omit<
  ToastOptions,
  | 'dismissible'
  | 'duration'
  | 'pauseOnFocusWithin'
  | 'pauseOnHover'
  | 'pauseOnWindowBlur'
  | 'progress'
  | 'size'
  | 'status'
  | 'swipeDirection'
  | 'swipeThreshold'
  | 'title'
  | 'variant'
> & {
  dismissible: boolean;
  duration: number;
  motionState: ToastMotionState;
  order: number;
  pauseOnFocusWithin: boolean;
  pauseOnHover: boolean;
  pauseOnWindowBlur: boolean;
  paused: boolean;
  progress: boolean;
  progressScale: number;
  remaining: number;
  size: ToastSize;
  startedAt: number | null;
  status: ToastStatus;
  swipeDirection: ToastSwipeDirection;
  swipeThreshold: number;
  title: ReactNode;
  variant: ToastVariant;
  id: string;
};

export type ToastStoreSnapshot = {
  config: ToastProviderRuntimeConfig;
  visibleToasts: ToastVisibleRecord[];
  queuedToasts: ToastVisibleRecord[];
};

export type ToastProviderRuntimeConfig = {
  placement: ToastPlacement;
  offset: number;
  gap: number;
  maxVisible: number;
  queueStrategy: ToastQueueStrategy;
  portalContainer: HTMLElement | null;
  safeAreas: boolean;
  pauseOnWindowBlur: boolean;
  defaultDuration: number;
  motion: ToastMotion;
  swipeDirection?: ToastSwipeDirection;
  swipeThreshold: number;
  className?: string;
};

export type ToastProviderProps = NativeProviderProps & {
  /** @control object */
  children?: ReactNode;
  /**
   * @control select
   * @default bottom
   */
  placement?: ToastPlacement;
  /**
   * @control number
   * @default 16
   */
  offset?: number;
  /**
   * Visible offset between compact stacked toasts.
   * @control number
   * @default 12
   */
  gap?: number;
  /**
   * @control number
   * @default 3
   */
  maxVisible?: number;
  /**
   * @control select
   * @default fifo
   */
  queueStrategy?: ToastQueueStrategy;
  /** @control object */
  portalContainer?: HTMLElement | null;
  /**
   * @control boolean
   * @default true
   */
  safeAreas?: boolean;
  /**
   * @control boolean
   * @default true
   */
  pauseOnWindowBlur?: boolean;
  /**
   * @control number
   * @default 5000
   */
  defaultDuration?: number;
  /**
   * @control select
   * @default default
   */
  motion?: ToastMotion;
  /** @control select */
  swipeDirection?: ToastSwipeDirection;
  /**
   * @control number
   * @default 50
   */
  swipeThreshold?: number;
  /** @control text */
  className?: string;
};

export type ToastApi = {
  (input: ToastCallInput, overrides?: ToastCallOverrides): string;
  success: (input: ToastCallInput, overrides?: ToastCallOverrides) => string;
  info: (input: ToastCallInput, overrides?: ToastCallOverrides) => string;
  warning: (input: ToastCallInput, overrides?: ToastCallOverrides) => string;
  error: (input: ToastCallInput, overrides?: ToastCallOverrides) => string;
  loading: (input: ToastCallInput, overrides?: ToastCallOverrides) => string;
  promise: <TValue = unknown, TError = Error>(
    promise: Promise<TValue>,
    phases: ToastPromiseOptions<TValue, TError>
  ) => Promise<TValue>;
  close: (id: string) => void;
  clear: () => void;
  pauseAll: () => void;
  resumeAll: () => void;
};
