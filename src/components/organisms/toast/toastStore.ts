import { Children } from 'react';
import type {
  ToastApi,
  ToastCallInput,
  ToastCallOverrides,
  ToastMotionState,
  ToastOptions,
  ToastPlacement,
  ToastPromiseOptions,
  ToastProviderRuntimeConfig,
  ToastStatus,
  ToastStoreSnapshot,
  ToastSwipeDirection,
  ToastVisibleRecord
} from './types';

type ToastPauseReason = 'focus-within' | 'hover' | 'manual' | 'swipe' | 'window-blur';

type InternalToast = Omit<ToastVisibleRecord, 'progressScale' | 'paused'> & {
  closeTimeoutId: ReturnType<typeof setTimeout> | null;
  enterTimeoutId: ReturnType<typeof setTimeout> | null;
  motionState: ToastMotionState;
  pauseReasons: Set<ToastPauseReason>;
  startedAt: number | null;
  timeoutId: ReturnType<typeof setTimeout> | null;
  visible: boolean;
};

type ToastStoreState = {
  config: ToastProviderRuntimeConfig;
  queue: InternalToast[];
  visible: InternalToast[];
};

type ToastStoreListener = () => void;
type ToastNormalizerInput = ToastCallInput | Partial<ToastOptions>;

const DEFAULT_DURATION = 5000;
const MOTION_DURATION_MS = 200;
const DEFAULT_CONFIG: ToastProviderRuntimeConfig = {
  placement: 'bottom',
  offset: 16,
  gap: 12,
  maxVisible: 3,
  queueStrategy: 'fifo',
  portalContainer: null,
  safeAreas: true,
  pauseOnWindowBlur: true,
  defaultDuration: DEFAULT_DURATION,
  motion: 'default',
  swipeThreshold: 50
};

let toastOrder = 0;
let idSequence = 0;

const subscribers = new Set<ToastStoreListener>();
const state: ToastStoreState = {
  config: DEFAULT_CONFIG,
  queue: [],
  visible: []
};
const activePauseReasons = new Set<ToastPauseReason>();

const hasContent = (node: ToastOptions['title']) => {
  return Children.toArray(node).some((child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0;
    }

    return child !== null && child !== undefined;
  });
};

const getOptionsLikeInput = (input: ToastNormalizerInput): Partial<ToastOptions> | null => {
  if (typeof input !== 'object' || input === null || Array.isArray(input) || '$$typeof' in input) {
    return null;
  }

  return input as Partial<ToastOptions>;
};

const getGeneratedId = () => {
  idSequence += 1;
  return `toast-${idSequence}`;
};

const getDefaultSwipeDirection = (placement: ToastPlacement): ToastSwipeDirection => {
  if (placement.startsWith('top')) {
    return 'up';
  }

  return 'down';
};

const normalizeDuration = (duration: number | undefined, fallback: number) => {
  const resolved = duration ?? fallback;

  if (resolved === 0) {
    return 0;
  }

  if (resolved > 0 && resolved < DEFAULT_DURATION) {
    return DEFAULT_DURATION;
  }

  return resolved;
};

let cachedSnapshot: ToastStoreSnapshot;

const toRecord = (toastItem: InternalToast): ToastVisibleRecord => {
  const progressScale = toastItem.duration > 0 ? Math.max(0, Math.min(1, toastItem.remaining / toastItem.duration)) : 0;

  return {
    ...toastItem,
    progressScale,
    paused: toastItem.pauseReasons.size > 0
  };
};

const updateCachedSnapshot = () => {
  cachedSnapshot = {
    config: state.config,
    visibleToasts: state.visible.map(toRecord),
    queuedToasts: state.queue.map(toRecord)
  };
};

updateCachedSnapshot();

const notify = () => {
  updateCachedSnapshot();

  for (const subscriber of subscribers) {
    subscriber();
  }
};

const getSnapshot = (): ToastStoreSnapshot => cachedSnapshot;

const clearTimer = (toastItem: InternalToast) => {
  if (toastItem.timeoutId) {
    clearTimeout(toastItem.timeoutId);
    toastItem.timeoutId = null;
  }
};

const clearMotionTimers = (toastItem: InternalToast) => {
  if (toastItem.enterTimeoutId) {
    clearTimeout(toastItem.enterTimeoutId);
    toastItem.enterTimeoutId = null;
  }

  if (toastItem.closeTimeoutId) {
    clearTimeout(toastItem.closeTimeoutId);
    toastItem.closeTimeoutId = null;
  }
};

const scheduleTimeout = (toastItem: InternalToast) => {
  if (!toastItem.visible || toastItem.duration === 0 || toastItem.pauseReasons.size > 0 || toastItem.timeoutId) {
    return;
  }

  toastItem.startedAt = Date.now();
  toastItem.timeoutId = setTimeout(() => {
    closeToast(toastItem.id);
  }, toastItem.remaining);
};

const pauseToast = (toastId: string, reason: ToastPauseReason) => {
  const toastItem = state.visible.find((item) => item.id === toastId);
  if (!toastItem || toastItem.duration === 0 || toastItem.pauseReasons.has(reason)) {
    return;
  }

  if (toastItem.pauseReasons.size === 0 && toastItem.startedAt) {
    toastItem.remaining = Math.max(0, toastItem.remaining - (Date.now() - toastItem.startedAt));
    toastItem.startedAt = null;
    clearTimer(toastItem);
    toastItem.onPause?.();
  }

  toastItem.pauseReasons.add(reason);
  notify();
};

const resumeToast = (toastId: string, reason: ToastPauseReason) => {
  const toastItem = state.visible.find((item) => item.id === toastId);
  if (!toastItem?.pauseReasons.has(reason)) {
    return;
  }

  toastItem.pauseReasons.delete(reason);

  if (toastItem.pauseReasons.size === 0 && toastItem.duration > 0) {
    toastItem.onResume?.();
    scheduleTimeout(toastItem);
  }

  notify();
};

const applyReasonToVisibleToasts = (reason: ToastPauseReason, paused: boolean) => {
  if (paused) {
    activePauseReasons.add(reason);
  } else {
    activePauseReasons.delete(reason);
  }

  for (const toastItem of state.visible) {
    if (reason === 'window-blur' && !toastItem.pauseOnWindowBlur) {
      continue;
    }

    if (paused) {
      pauseToast(toastItem.id, reason);
      continue;
    }

    resumeToast(toastItem.id, reason);
  }
};

const seedActivePauseReasons = (toastItem: InternalToast) => {
  if (toastItem.duration === 0) {
    return;
  }

  if (activePauseReasons.has('manual')) {
    toastItem.pauseReasons.add('manual');
  }

  if (activePauseReasons.has('window-blur') && toastItem.pauseOnWindowBlur) {
    toastItem.pauseReasons.add('window-blur');
  }
};

const startToast = (toastItem: InternalToast) => {
  toastItem.visible = true;
  toastItem.motionState = state.config.motion === 'none' ? 'visible' : 'entering';
  seedActivePauseReasons(toastItem);
  toastItem.onOpen?.();
  scheduleTimeout(toastItem);

  if (toastItem.motionState === 'entering') {
    toastItem.enterTimeoutId = setTimeout(() => {
      toastItem.motionState = 'visible';
      toastItem.enterTimeoutId = null;
      notify();
    }, MOTION_DURATION_MS);
  }
};

const promoteQueuedToast = () => {
  if (state.visible.length >= state.config.maxVisible || state.queue.length === 0) {
    return;
  }

  const nextToast =
    state.config.queueStrategy === 'lifo'
      ? state.queue.splice(state.queue.length - 1, 1)[0]
      : state.queue.splice(0, 1)[0];

  if (!nextToast) {
    return;
  }

  nextToast.visible = true;
  state.visible.push(nextToast);
  startToast(nextToast);
};

const demoteOldestVisibleToast = () => {
  if (state.visible.length === 0) {
    return;
  }

  const oldestVisibleIndex = state.visible.reduce((oldestIndex, toastItem, index) => {
    return toastItem.order < state.visible[oldestIndex].order ? index : oldestIndex;
  }, 0);
  const [oldestVisibleToast] = state.visible.splice(oldestVisibleIndex, 1);

  if (!oldestVisibleToast) {
    return;
  }

  if (oldestVisibleToast.startedAt) {
    oldestVisibleToast.remaining = Math.max(
      0,
      oldestVisibleToast.remaining - (Date.now() - oldestVisibleToast.startedAt)
    );
  }

  clearTimer(oldestVisibleToast);
  clearMotionTimers(oldestVisibleToast);
  oldestVisibleToast.startedAt = null;
  oldestVisibleToast.visible = false;
  oldestVisibleToast.motionState = 'entering';
  oldestVisibleToast.pauseReasons.clear();
  state.queue.push(oldestVisibleToast);
};

const removeToastFromCollections = (toastId: string) => {
  const visibleIndex = state.visible.findIndex((item) => item.id === toastId);
  if (visibleIndex >= 0) {
    const [removed] = state.visible.splice(visibleIndex, 1);
    return removed;
  }

  const queueIndex = state.queue.findIndex((item) => item.id === toastId);
  if (queueIndex >= 0) {
    const [removed] = state.queue.splice(queueIndex, 1);
    return removed;
  }

  return null;
};

const finalizeToastClose = (toastId: string) => {
  const toastItem = removeToastFromCollections(toastId);
  if (!toastItem) {
    return;
  }

  clearTimer(toastItem);
  clearMotionTimers(toastItem);
  toastItem.startedAt = null;
  promoteQueuedToast();
  notify();
};

const closeToast = (toastId: string) => {
  const visibleToast = state.visible.find((item) => item.id === toastId);
  if (visibleToast) {
    if (visibleToast.motionState === 'closing') {
      return;
    }

    clearTimer(visibleToast);
    clearMotionTimers(visibleToast);
    visibleToast.startedAt = null;
    visibleToast.motionState = 'closing';
    visibleToast.onClose?.();
    visibleToast.onDismiss?.();

    if (state.config.motion === 'none') {
      finalizeToastClose(toastId);
      return;
    }

    visibleToast.closeTimeoutId = setTimeout(() => {
      finalizeToastClose(toastId);
    }, MOTION_DURATION_MS);
    notify();
    return;
  }

  const queuedToast = removeToastFromCollections(toastId);
  if (!queuedToast) {
    return;
  }

  clearTimer(queuedToast);
  clearMotionTimers(queuedToast);
  queuedToast.startedAt = null;
  queuedToast.onClose?.();
  queuedToast.onDismiss?.();
  notify();
};

const normalizeToastInput = (
  input: ToastNormalizerInput,
  overrides?: ToastCallOverrides,
  forcedStatus?: ToastStatus
): InternalToast | null => {
  const generatedId =
    typeof input === 'object' && input !== null && 'id' in input && typeof input.id === 'string'
      ? input.id
      : getGeneratedId();

  const optionsLikeInput = getOptionsLikeInput(input);

  const inputOptions: ToastOptions = optionsLikeInput
    ? 'title' in optionsLikeInput
      ? (optionsLikeInput as ToastOptions)
      : {
          ...optionsLikeInput,
          id: typeof optionsLikeInput.id === 'string' ? optionsLikeInput.id : generatedId,
          title: undefined
        }
    : {
        id: generatedId,
        title: input as ToastOptions['title']
      };

  const merged: ToastOptions = {
    ...inputOptions,
    ...overrides,
    id: overrides?.id ?? inputOptions.id ?? generatedId,
    status: forcedStatus ?? overrides?.status ?? inputOptions.status
  };

  if (!hasContent(merged.title)) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.warn('Toast requires a non-empty title.');
    }

    return null;
  }

  const duration = normalizeDuration(merged.duration, state.config.defaultDuration);
  const status = merged.status ?? 'neutral';

  return {
    id: merged.id ?? generatedId,
    title: merged.title,
    description: merged.description,
    icon: merged.icon,
    status,
    variant: merged.variant ?? 'soft',
    size: merged.size ?? 'md',
    action: merged.action,
    dismissible: merged.dismissible ?? true,
    duration,
    progress: merged.progress ?? true,
    pauseOnHover: merged.pauseOnHover ?? true,
    pauseOnFocusWithin: merged.pauseOnFocusWithin ?? true,
    pauseOnWindowBlur: merged.pauseOnWindowBlur ?? state.config.pauseOnWindowBlur,
    swipeDirection:
      merged.swipeDirection ?? state.config.swipeDirection ?? getDefaultSwipeDirection(state.config.placement),
    swipeThreshold: merged.swipeThreshold ?? state.config.swipeThreshold,
    className: merged.className,
    onOpen: merged.onOpen,
    onClose: merged.onClose,
    onDismiss: merged.onDismiss,
    onPause: merged.onPause,
    onResume: merged.onResume,
    order: ++toastOrder,
    remaining: duration,
    closeTimeoutId: null,
    enterTimeoutId: null,
    motionState: 'entering',
    pauseReasons: new Set<ToastPauseReason>(),
    startedAt: null,
    timeoutId: null,
    visible: false
  };
};

const enqueueToast = (toastItem: InternalToast) => {
  if (state.config.maxVisible <= 0) {
    state.queue.push(toastItem);
    notify();
    return toastItem.id;
  }

  if (state.visible.length >= state.config.maxVisible) {
    demoteOldestVisibleToast();
  }

  state.visible.push(toastItem);
  startToast(toastItem);
  notify();
  return toastItem.id;
};

const resolvePromisePhase = <TValue>(
  phase: ToastCallInput | ((value: TValue) => ToastCallInput),
  value: TValue
): ToastCallInput => {
  if (typeof phase === 'function') {
    return phase(value);
  }

  return phase;
};

const updateToast = (
  toastId: string,
  input: ToastCallInput,
  overrides?: ToastCallOverrides,
  forcedStatus?: ToastStatus
): string => {
  const currentToast = [...state.visible, ...state.queue].find((item) => item.id === toastId);
  if (!currentToast) {
    return addToast(input, overrides, forcedStatus);
  }

  const optionsLikeInput = getOptionsLikeInput(input);
  const normalizedInput = optionsLikeInput
    ? { ...optionsLikeInput, id: toastId }
    : { ...overrides, id: toastId, title: input as ToastOptions['title'] };

  const normalized = normalizeToastInput(
    normalizedInput,
    optionsLikeInput && 'title' in optionsLikeInput ? overrides : undefined,
    forcedStatus
  );

  if (!normalized) {
    return toastId;
  }

  clearTimer(currentToast);
  clearMotionTimers(currentToast);
  const wasPaused = currentToast.pauseReasons;
  const wasVisible = currentToast.visible;
  const visibleIndex = state.visible.findIndex((item) => item.id === toastId);
  const queueIndex = state.queue.findIndex((item) => item.id === toastId);
  const nextToast = {
    ...normalized,
    motionState: wasVisible ? 'visible' : normalized.motionState,
    order: currentToast.order,
    pauseReasons: new Set(wasPaused),
    visible: wasVisible
  };

  if (visibleIndex >= 0) {
    state.visible.splice(visibleIndex, 1, nextToast);
    scheduleTimeout(nextToast);
  } else if (queueIndex >= 0) {
    state.queue.splice(queueIndex, 1, nextToast);
  }

  notify();
  return toastId;
};

const addToast = (input: ToastCallInput, overrides?: ToastCallOverrides, forcedStatus?: ToastStatus): string => {
  const normalized = normalizeToastInput(input, overrides, forcedStatus);
  if (!normalized) {
    return typeof input === 'object' && input !== null && 'id' in input && typeof input.id === 'string'
      ? (input.id ?? getGeneratedId())
      : getGeneratedId();
  }

  const existingToast = [...state.visible, ...state.queue].find((toastItem) => toastItem.id === normalized.id);
  if (existingToast) {
    return updateToast(normalized.id, normalized, undefined, forcedStatus);
  }

  return enqueueToast(normalized);
};

const setConfig = (config: Partial<ToastProviderRuntimeConfig>) => {
  state.config = {
    ...state.config,
    ...config,
    defaultDuration: normalizeDuration(config.defaultDuration, state.config.defaultDuration)
  };

  while (state.visible.length < state.config.maxVisible && state.queue.length > 0) {
    promoteQueuedToast();
  }

  if (state.visible.length > state.config.maxVisible) {
    const overflow = state.visible.splice(state.config.maxVisible);
    state.queue = [...overflow, ...state.queue];
  }

  notify();
};

const subscribe = (listener: ToastStoreListener) => {
  subscribers.add(listener);

  return () => {
    subscribers.delete(listener);
  };
};

const clearAll = () => {
  const allToasts = [...state.visible, ...state.queue];

  state.visible = [];
  state.queue = [];

  for (const toastItem of allToasts) {
    clearTimer(toastItem);
    clearMotionTimers(toastItem);
    toastItem.onClose?.();
    toastItem.onDismiss?.();
  }

  notify();
};

export const toastStore = {
  subscribe,
  getSnapshot,
  setConfig,
  addToast,
  closeToast,
  clearAll,
  pauseToast,
  resumeToast,
  pauseAll: () => applyReasonToVisibleToasts('manual', true),
  resumeAll: () => applyReasonToVisibleToasts('manual', false),
  pauseForWindowBlur: () => applyReasonToVisibleToasts('window-blur', true),
  resumeFromWindowBlur: () => applyReasonToVisibleToasts('window-blur', false),
  updateToast
};

const toastCore = (input: ToastCallInput, overrides?: ToastCallOverrides) => {
  return addToast(input, overrides);
};

export const toast = Object.assign(toastCore, {
  success: (input: ToastCallInput, overrides?: ToastCallOverrides) => addToast(input, overrides, 'success'),
  info: (input: ToastCallInput, overrides?: ToastCallOverrides) => addToast(input, overrides, 'info'),
  warning: (input: ToastCallInput, overrides?: ToastCallOverrides) => addToast(input, overrides, 'warning'),
  error: (input: ToastCallInput, overrides?: ToastCallOverrides) => addToast(input, overrides, 'error'),
  loading: (input: ToastCallInput, overrides?: ToastCallOverrides) =>
    addToast(input, { ...overrides, duration: 0 }, 'loading'),
  promise: async <TValue = unknown, TError = Error>(
    promise: Promise<TValue>,
    phases: ToastPromiseOptions<TValue, TError>
  ) => {
    const loadingId = addToast(phases.loading, { duration: 0 }, 'loading');

    try {
      const result = await promise;
      updateToast(loadingId, resolvePromisePhase(phases.success, result), undefined, 'success');
      return result;
    } catch (error) {
      updateToast(loadingId, resolvePromisePhase(phases.error, error as TError), undefined, 'error');
      throw error;
    }
  },
  close: (id: string) => closeToast(id),
  clear: () => clearAll(),
  pauseAll: () => toastStore.pauseAll(),
  resumeAll: () => toastStore.resumeAll()
}) satisfies ToastApi;
