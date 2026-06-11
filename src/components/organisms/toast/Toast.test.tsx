import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let prefersReducedMotion = false;

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({ name, ...props }: { name: string }) => <svg data-testid={`icon-${name}`} {...props} />
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => <span data-testid='toast-spinner' />
}));

import { ToastProvider as RootToastProvider, toast as rootToast } from '@/index';
import { ToastProvider as BarrelToastProvider, toast } from './index';
import { ToastProvider } from './ToastProvider';
import type { ToastOptions } from './types';
import { useToast } from './useToast';

const setReducedMotion = (matches: boolean) => {
  prefersReducedMotion = matches;
};

const renderWithProvider = (props?: Partial<ComponentProps<typeof ToastProvider>>) => {
  return render(
    <ToastProvider motion='none' {...props}>
      <button type='button'>Before</button>
    </ToastProvider>
  );
};

const runInAct = <TValue,>(callback: () => TValue): TValue => {
  let result: TValue | undefined;

  act(() => {
    result = callback();
  });

  return result as TValue;
};

const swipeToast = ({
  element,
  endX,
  endY,
  pointerId = 1,
  startX,
  startY
}: {
  element: HTMLElement;
  endX: number;
  endY: number;
  pointerId?: number;
  startX: number;
  startY: number;
}) => {
  fireEvent.pointerDown(element, { button: 0, clientX: startX, clientY: startY, pointerId });
  fireEvent.pointerMove(element, { clientX: endX, clientY: endY, pointerId });
  fireEvent.pointerUp(element, { clientX: endX, clientY: endY, pointerId });
};

beforeEach(() => {
  prefersReducedMotion = false;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersReducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
});

afterEach(() => {
  toast.clear();
  vi.useRealTimers();
});

describe('useToast — logic', () => {
  it('returns the named notifications region and default portal target', () => {
    const { result } = renderHook(() => useToast({ children: null }));

    expect(result.current.viewportProps['aria-label']).toBe('Notifications');
    expect(result.current.viewportTarget).toBe(document.body);
    expect(result.current.inlineViewport).toBe(false);
  });
});

describe('Toast — public API and rendering contract', () => {
  it('is exported from the toast barrel and package root', () => {
    expect(BarrelToastProvider).toBe(ToastProvider);
    expect(RootToastProvider).toBe(ToastProvider);
    expect(rootToast).toBe(toast);
  });

  it('renders children, a named notifications region, and a named alertdialog without stealing focus', () => {
    renderWithProvider();

    const beforeButton = screen.getByRole('button', { name: 'Before' });
    beforeButton.focus();

    const toastId = runInAct(() => toast('Changes saved'));

    expect(typeof toastId).toBe('string');
    expect(beforeButton).toHaveFocus();
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Changes saved' })).toBeInTheDocument();
  });

  it('fails safely when a public toast does not provide a non-empty title', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    renderWithProvider();
    runInAct(() => toast({ description: 'Description only', title: '   ' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalledWith('Toast requires a non-empty title.');

    warnSpy.mockRestore();
  });

  it('supports close and clear helpers', () => {
    renderWithProvider();

    const firstId = runInAct(() => toast('First toast'));
    runInAct(() => toast('Second toast'));

    act(() => {
      toast.close(firstId);
    });

    expect(screen.queryByRole('alertdialog', { name: 'First toast' })).not.toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Second toast' })).toBeInTheDocument();

    act(() => {
      toast.clear();
    });

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('replaces existing toasts when a stable id is reused', () => {
    renderWithProvider();

    runInAct(() => toast({ id: 'stable-toast', title: 'Original message' }));
    runInAct(() => toast({ id: 'stable-toast', title: 'Updated message' }));

    expect(screen.queryByRole('alertdialog', { name: 'Original message' })).not.toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Updated message' })).toBeInTheDocument();
    expect(screen.getAllByRole('alertdialog')).toHaveLength(1);
  });

  it('honors stable ids passed through helper overrides for renderable input', () => {
    renderWithProvider();

    runInAct(() => toast.success('Original helper message', { id: 'stable-helper-toast' }));
    runInAct(() => toast.success('Updated helper message', { id: 'stable-helper-toast' }));

    expect(screen.queryByRole('alertdialog', { name: 'Original helper message' })).not.toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Updated helper message' })).toHaveAttribute(
      'data-toast-id',
      'stable-helper-toast'
    );
    expect(screen.getAllByRole('alertdialog')).toHaveLength(1);
  });

  it('uses compact description line-height across sizes', () => {
    renderWithProvider({ maxVisible: 3 });

    runInAct(() =>
      toast({ id: 'small-line-height-toast', size: 'sm', title: 'Small', description: 'Small description' })
    );
    runInAct(() =>
      toast({ id: 'medium-line-height-toast', size: 'md', title: 'Medium', description: 'Medium description' })
    );
    runInAct(() =>
      toast({ id: 'large-line-height-toast', size: 'lg', title: 'Large', description: 'Large description' })
    );

    expect(screen.getByText('Small description')).toHaveClass('leading-4');
    expect(screen.getByText('Medium description')).toHaveClass('leading-5');
    expect(screen.getByText('Large description')).toHaveClass('leading-6');
  });

  it('uses opaque status surface tokens for status backgrounds', () => {
    renderWithProvider({ maxVisible: 5 });

    runInAct(() => toast.info('Info surface'));
    runInAct(() => toast.success('Success surface'));
    runInAct(() => toast.warning('Warning surface'));
    runInAct(() => toast.error('Error surface'));
    runInAct(() => toast.loading('Loading surface'));

    expect(screen.getByRole('alertdialog', { name: 'Info surface' })).toHaveClass('bg-info-surface-light');
    expect(screen.getByRole('alertdialog', { name: 'Success surface' })).toHaveClass('bg-success-surface-light');
    expect(screen.getByRole('alertdialog', { name: 'Warning surface' })).toHaveClass('bg-warning-surface-light');
    expect(screen.getByRole('alertdialog', { name: 'Error surface' })).toHaveClass('bg-error-surface-light');
    expect(screen.getByRole('alertdialog', { name: 'Loading surface' })).toHaveClass('bg-red-surface-light');
  });

  it('dismisses from the close button without starting a swipe gesture', () => {
    renderWithProvider();

    runInAct(() => toast({ title: 'Close me' }));

    const closeButton = screen.getByRole('button', { name: 'Dismiss notification' });

    act(() => {
      fireEvent.pointerDown(closeButton, { button: 0, clientX: 100, clientY: 40, pointerId: 11 });
      fireEvent.pointerUp(closeButton, { button: 0, clientX: 100, clientY: 40, pointerId: 11 });
      fireEvent.click(closeButton);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Close me' })).not.toBeInTheDocument();
  });

  it('keeps closing toasts present for the exit animation before removing them', () => {
    vi.useFakeTimers();
    renderWithProvider({ motion: 'default' });

    const toastId = runInAct(() => toast({ title: 'Animated close' }));

    act(() => {
      toast.close(toastId);
    });

    expect(screen.getByRole('alertdialog', { name: 'Animated close' })).toHaveClass('opacity-0');
    expect(screen.getByRole('alertdialog', { name: 'Animated close' })).not.toHaveClass('scale-[0.98]');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Animated close' })).not.toBeInTheDocument();
  });

  it('uses placement-aware enter and exit motion classes', () => {
    vi.useFakeTimers();
    renderWithProvider({ motion: 'default', placement: 'top-end' });

    const toastId = runInAct(() => toast({ title: 'Top motion' }));
    const toastElement = screen.getByRole('alertdialog', { name: 'Top motion' });

    expect(toastElement).toHaveClass('motion-safe:slide-in-from-top-2');

    act(() => {
      toast.close(toastId);
    });

    expect(toastElement).toHaveClass('-translate-y-2');
    expect(toastElement).not.toHaveClass('motion-safe:slide-in-from-bottom-2');
    expect(toastElement).not.toHaveClass('translate-y-2');
  });

  it('uses compact stacked overlap by default', () => {
    renderWithProvider({ maxVisible: 3 });

    runInAct(() => toast({ title: 'Stack first' }));
    runInAct(() => toast({ title: 'Stack second' }));
    runInAct(() => toast({ title: 'Stack third' }));

    const frontToast = screen.getByRole('alertdialog', { name: 'Stack third' });
    const secondToast = screen.getByRole('alertdialog', { name: 'Stack second' });
    const thirdToast = screen.getByRole('alertdialog', { name: 'Stack first' });

    expect(frontToast).toHaveClass(
      'transition-[opacity,transform,top,bottom,left,right,box-shadow,background-color,border-color]'
    );
    expect(frontToast.style.position).toBe('absolute');
    expect(frontToast.style.bottom).toBe('0px');
    expect(secondToast).toHaveClass('scale-95');
    expect(secondToast.style.bottom).toBe('12px');
    expect(thirdToast).toHaveClass('scale-90');
    expect(thirdToast.style.bottom).toBe('24px');
  });

  it('applies the loading helper defaults without auto-dismissing the toast', () => {
    vi.useFakeTimers();
    renderWithProvider();

    runInAct(() =>
      toast.loading({ title: 'Uploading assets', description: 'This stays visible until another event updates it.' })
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Uploading assets' })).toBeInTheDocument();
    expect(screen.getByTestId('toast-spinner')).toBeInTheDocument();
  });
});

describe('Toast — timers, queueing, and helper state', () => {
  it('clamps positive durations below 5000ms and auto-dismisses after the accessible minimum', () => {
    vi.useFakeTimers();
    renderWithProvider();

    runInAct(() => toast({ title: 'Clamped duration', duration: 1000 }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Clamped duration' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Clamped duration' })).not.toBeInTheDocument();
  });

  it('pauses and resumes all timed toasts through the global helper methods', () => {
    vi.useFakeTimers();
    renderWithProvider();

    runInAct(() => toast({ title: 'Global pause' }));

    act(() => {
      vi.advanceTimersByTime(2000);
      toast.pauseAll();
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Global pause' })).toBeInTheDocument();

    act(() => {
      toast.resumeAll();
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Global pause' })).not.toBeInTheDocument();
  });

  it('pauses on hover and resumes once the pointer leaves the toast', () => {
    vi.useFakeTimers();
    renderWithProvider();

    runInAct(() => toast({ title: 'Hover pause' }));
    const toastElement = screen.getByRole('alertdialog', { name: 'Hover pause' });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    fireEvent.mouseEnter(toastElement);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Hover pause' })).toBeInTheDocument();

    fireEvent.mouseLeave(toastElement);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Hover pause' })).not.toBeInTheDocument();
  });

  it('pauses on focus within and resumes after focus leaves the toast', () => {
    vi.useFakeTimers();
    renderWithProvider();

    runInAct(() =>
      toast({
        title: 'Focus pause',
        action: {
          label: 'Inspect',
          onAction: vi.fn()
        }
      })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const actionButton = screen.getByRole('button', { name: 'Inspect' });
    actionButton.focus();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Focus pause' })).toBeInTheDocument();

    fireEvent.blur(actionButton, { relatedTarget: screen.getByRole('button', { name: 'Before' }) });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Focus pause' })).not.toBeInTheDocument();
  });

  it('pauses on window blur and resumes on focus when the provider allows it', () => {
    vi.useFakeTimers();
    renderWithProvider();

    runInAct(() => toast({ title: 'Window blur pause' }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    fireEvent(window, new Event('blur'));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Window blur pause' })).toBeInTheDocument();

    fireEvent(window, new Event('focus'));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Window blur pause' })).not.toBeInTheDocument();
  });

  it('keeps toasts created while the window is blurred paused until focus returns', () => {
    vi.useFakeTimers();
    renderWithProvider();

    fireEvent(window, new Event('blur'));
    runInAct(() => toast({ title: 'Created in background' }));

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Created in background' })).toBeInTheDocument();

    fireEvent(window, new Event('focus'));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Created in background' })).not.toBeInTheDocument();
  });

  it('keeps the latest toasts visible while demoting older visible toasts into the queue', () => {
    renderWithProvider({ maxVisible: 3 });

    runInAct(() => toast('First queued'));
    runInAct(() => toast('Second visible'));
    runInAct(() => toast('Third visible'));
    const latestId = runInAct(() => toast('Fourth visible'));

    expect(screen.queryByRole('alertdialog', { name: 'First queued' })).not.toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Second visible' })).toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Third visible' })).toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Fourth visible' })).toBeInTheDocument();

    act(() => {
      toast.close(latestId);
    });

    expect(screen.getByRole('alertdialog', { name: 'First queued' })).toBeInTheDocument();
  });

  it('promotes queued toasts using FIFO ordering by default', () => {
    renderWithProvider({ maxVisible: 1 });

    runInAct(() => toast('First queued'));
    runInAct(() => toast('Second queued'));
    const thirdId = runInAct(() => toast('Third visible'));

    expect(screen.getByRole('alertdialog', { name: 'Third visible' })).toBeInTheDocument();
    expect(screen.queryByRole('alertdialog', { name: 'First queued' })).not.toBeInTheDocument();
    expect(screen.queryByRole('alertdialog', { name: 'Second queued' })).not.toBeInTheDocument();

    act(() => {
      toast.close(thirdId);
    });

    expect(screen.getByRole('alertdialog', { name: 'First queued' })).toBeInTheDocument();
    expect(screen.queryByRole('alertdialog', { name: 'Second queued' })).not.toBeInTheDocument();
  });

  it('keeps queued toasts paused when they are promoted while the window is blurred', () => {
    vi.useFakeTimers();
    renderWithProvider({ maxVisible: 1 });

    runInAct(() => toast({ title: 'Promoted in background' }));
    const blockingToastId = runInAct(() => toast({ title: 'Blocking toast', duration: 0 }));

    fireEvent(window, new Event('blur'));

    act(() => {
      toast.close(blockingToastId);
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByRole('alertdialog', { name: 'Promoted in background' })).toBeInTheDocument();

    fireEvent(window, new Event('focus'));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Promoted in background' })).not.toBeInTheDocument();
  });

  it('safely demotes overflow toasts when maxVisible shrinks at runtime', () => {
    vi.useFakeTimers();
    const { rerender } = renderWithProvider({ maxVisible: 2 });

    runInAct(() => toast({ title: 'Demoted timer toast', duration: 5000 }));
    const visibleToastId = runInAct(() => toast({ title: 'Still visible toast', duration: 0 }));

    rerender(
      <ToastProvider maxVisible={1} motion='none'>
        <button type='button'>Before</button>
      </ToastProvider>
    );

    expect(screen.queryByRole('alertdialog', { name: 'Demoted timer toast' })).not.toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Still visible toast' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(6000);
      toast.close(visibleToastId);
    });

    expect(screen.getByRole('alertdialog', { name: 'Demoted timer toast' })).toBeInTheDocument();
  });

  it('promotes queued toasts using LIFO ordering when configured', () => {
    renderWithProvider({ maxVisible: 1, queueStrategy: 'lifo' });

    runInAct(() => toast('First queued'));
    runInAct(() => toast('Second queued'));
    const thirdId = runInAct(() => toast('Third visible'));

    act(() => {
      toast.close(thirdId);
    });

    expect(screen.getByRole('alertdialog', { name: 'Second queued' })).toBeInTheDocument();
    expect(screen.queryByRole('alertdialog', { name: 'First queued' })).not.toBeInTheDocument();
  });
});

describe('Toast — swipe dismissal', () => {
  it('dismisses a bottom toast after a downward swipe that clears the threshold', () => {
    renderWithProvider({ placement: 'bottom' });
    runInAct(() => toast({ title: 'Swipe down', swipeThreshold: 40 }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Swipe down' });
    swipeToast({ element: toastElement, startX: 120, startY: 40, endX: 120, endY: 96 });

    expect(screen.queryByRole('alertdialog', { name: 'Swipe down' })).not.toBeInTheDocument();
  });

  it('respects the default top placement mapping by requiring an upward swipe', () => {
    renderWithProvider({ placement: 'top' });
    runInAct(() => toast({ title: 'Swipe up', swipeThreshold: 40 }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Swipe up' });

    swipeToast({ element: toastElement, startX: 120, startY: 80, endX: 120, endY: 120 });
    expect(screen.getByRole('alertdialog', { name: 'Swipe up' })).toBeInTheDocument();

    swipeToast({ element: toastElement, startX: 120, startY: 120, endX: 120, endY: 64, pointerId: 2 });
    expect(screen.queryByRole('alertdialog', { name: 'Swipe up' })).not.toBeInTheDocument();
  });

  it('respects the swipe threshold before dismissing', () => {
    renderWithProvider({ placement: 'bottom', swipeThreshold: 80 });
    runInAct(() => toast({ title: 'Threshold toast' }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Threshold toast' });

    swipeToast({ element: toastElement, startX: 100, startY: 40, endX: 100, endY: 108 });
    expect(screen.getByRole('alertdialog', { name: 'Threshold toast' })).toBeInTheDocument();

    swipeToast({ element: toastElement, startX: 100, startY: 40, endX: 100, endY: 124, pointerId: 2 });
    expect(screen.queryByRole('alertdialog', { name: 'Threshold toast' })).not.toBeInTheDocument();
  });

  it('cleans up swipe state and resumes the timer when pointer release happens outside the toast', async () => {
    vi.useFakeTimers();
    renderWithProvider({ motion: 'default', placement: 'bottom', swipeThreshold: 80 });
    runInAct(() => toast({ title: 'Released outside' }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Released outside' });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      fireEvent.pointerDown(toastElement, { button: 0, clientX: 100, clientY: 40, pointerId: 7 });
      await Promise.resolve();
    });

    act(() => {
      fireEvent.pointerMove(toastElement, { clientX: 100, clientY: 78, pointerId: 7 });
    });

    expect(toastElement).toHaveStyle({ transform: 'translate3d(0, 38px, 0)' });

    act(() => {
      fireEvent.pointerUp(document.body, { clientX: 100, clientY: 78, pointerId: 7 });
    });

    expect(toastElement).not.toHaveStyle({ transform: 'translate3d(0, 38px, 0)' });

    act(() => {
      vi.advanceTimersByTime(4200);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Released outside' })).not.toBeInTheDocument();
  });

  it('cleans up swipe state and resumes the timer when pointer capture is lost', async () => {
    vi.useFakeTimers();
    renderWithProvider({ motion: 'default', placement: 'bottom', swipeThreshold: 80 });
    runInAct(() => toast({ title: 'Lost capture' }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Lost capture' });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      fireEvent.pointerDown(toastElement, { button: 0, clientX: 100, clientY: 40, pointerId: 8 });
      await Promise.resolve();
    });

    act(() => {
      fireEvent.pointerMove(toastElement, { clientX: 100, clientY: 78, pointerId: 8 });
    });

    expect(toastElement).toHaveStyle({ transform: 'translate3d(0, 38px, 0)' });

    act(() => {
      fireEvent.lostPointerCapture(toastElement, { clientX: 100, clientY: 78, pointerId: 8 });
    });

    expect(toastElement).not.toHaveStyle({ transform: 'translate3d(0, 38px, 0)' });

    act(() => {
      vi.advanceTimersByTime(4200);
    });

    expect(screen.queryByRole('alertdialog', { name: 'Lost capture' })).not.toBeInTheDocument();
  });

  it('uses explicit swipeDirection overrides instead of the placement default', () => {
    renderWithProvider({ placement: 'top', swipeDirection: 'right', swipeThreshold: 40 });
    runInAct(() => toast({ title: 'Swipe right override' }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Swipe right override' });

    swipeToast({ element: toastElement, startX: 60, startY: 60, endX: 24, endY: 60 });
    expect(screen.getByRole('alertdialog', { name: 'Swipe right override' })).toBeInTheDocument();

    swipeToast({ element: toastElement, startX: 60, startY: 60, endX: 116, endY: 60, pointerId: 2 });
    expect(screen.queryByRole('alertdialog', { name: 'Swipe right override' })).not.toBeInTheDocument();
  });

  it('does not dismiss non-dismissible toasts from swipe gestures', () => {
    renderWithProvider({ placement: 'bottom' });
    runInAct(() => toast({ title: 'Pinned toast', dismissible: false, swipeThreshold: 20 }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Pinned toast' });
    swipeToast({ element: toastElement, startX: 80, startY: 40, endX: 80, endY: 88 });

    expect(screen.getByRole('alertdialog', { name: 'Pinned toast' })).toBeInTheDocument();
  });

  it('keeps swipe dismissal functional without drag motion feedback when reduced motion is active', async () => {
    setReducedMotion(true);
    renderWithProvider({ motion: 'default', placement: 'bottom' });
    runInAct(() => toast({ title: 'Reduced motion swipe', swipeThreshold: 30 }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Reduced motion swipe' });
    fireEvent.pointerDown(toastElement, { button: 0, clientX: 80, clientY: 30, pointerId: 5 });
    fireEvent.pointerMove(toastElement, { clientX: 80, clientY: 80, pointerId: 5 });

    await waitFor(() => {
      expect(toastElement).not.toHaveStyle({ transform: 'translate3d(0, 50px, 0)' });
      expect(toastElement.style.willChange).toBe('');
    });

    fireEvent.pointerUp(toastElement, { clientX: 80, clientY: 80, pointerId: 5 });

    expect(screen.queryByRole('alertdialog', { name: 'Reduced motion swipe' })).not.toBeInTheDocument();
  });
});

describe('Toast — accessibility and promise lifecycle', () => {
  it('uses F6 and Shift+F6 to move focus between the document and the notifications region', () => {
    renderWithProvider();

    const beforeButton = screen.getByRole('button', { name: 'Before' });
    beforeButton.focus();
    runInAct(() => toast('Keyboard landmark'));

    fireEvent.keyDown(document, { key: 'F6' });

    expect(screen.getByRole('alertdialog', { name: 'Keyboard landmark' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'F6', shiftKey: true });

    expect(beforeButton).toHaveFocus();
  });

  it('dismisses the focused toast with Escape, moves focus to the next toast, and restores focus after the last close', async () => {
    renderWithProvider();

    const beforeButton = screen.getByRole('button', { name: 'Before' });
    beforeButton.focus();

    runInAct(() => toast({ title: 'Older toast', dismissible: true }));
    runInAct(() => toast({ title: 'Newer toast', dismissible: true }));

    fireEvent.keyDown(document, { key: 'F6' });
    expect(screen.getByRole('alertdialog', { name: 'Newer toast' })).toHaveFocus();

    act(() => {
      fireEvent.keyDown(screen.getByRole('region', { name: 'Notifications' }), { key: 'Escape' });
    });

    expect(screen.queryByRole('alertdialog', { name: 'Newer toast' })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('alertdialog', { name: 'Older toast' })).toHaveFocus();
    });

    act(() => {
      fireEvent.keyDown(screen.getByRole('region', { name: 'Notifications' }), { key: 'Escape' });
    });

    await waitFor(() => {
      expect(beforeButton).toHaveFocus();
    });
  });

  it('keeps a non-dismissible actionless toast focusable and named without letting Escape remove it', () => {
    renderWithProvider();

    runInAct(() => toast({ title: 'Persistent landmark', dismissible: false, duration: 0 }));

    fireEvent.keyDown(document, { key: 'F6' });

    const toastElement = screen.getByRole('alertdialog', { name: 'Persistent landmark' });
    expect(toastElement).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('region', { name: 'Notifications' }), { key: 'Escape' });

    expect(screen.getByRole('alertdialog', { name: 'Persistent landmark' })).toBeInTheDocument();
  });

  it('renders a named JSX action when ariaLabel is provided', () => {
    const handleAction = vi.fn();
    renderWithProvider();

    runInAct(() =>
      toast({
        title: 'Custom action',
        action: {
          label: <span aria-hidden='true'>↗</span>,
          ariaLabel: 'Open details',
          onAction: handleAction
        }
      })
    );

    expect(screen.getByRole('button', { name: 'Open details' })).toBeInTheDocument();
  });

  it('supports ReactNode loading phases and string success phases while keeping toast ids stable', async () => {
    renderWithProvider();

    let resolvePromise: ((value: { filename: string }) => void) | undefined;
    const promise = new Promise<{ filename: string }>((resolve) => {
      resolvePromise = resolve;
    });

    const trackedPromise = runInAct(() =>
      toast.promise(promise, {
        loading: <span>Preparing upload...</span>,
        success: 'Upload complete',
        error: 'Upload failed'
      })
    );

    const loadingToast = screen.getByRole('alertdialog', { name: 'Preparing upload...' });
    const loadingId = loadingToast.getAttribute('data-toast-id');

    await act(async () => {
      resolvePromise?.({ filename: 'release-notes.pdf' });
      await trackedPromise;
    });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog', { name: 'Upload complete' })).toBeInTheDocument();
    });

    expect(screen.getByRole('alertdialog', { name: 'Upload complete' })).toHaveAttribute('data-toast-id', loadingId);
  });

  it('supports callbacks returning ReactNode and ToastOptions for promise phases', async () => {
    renderWithProvider();

    let resolvePromise: ((value: { filename: string }) => void) | undefined;
    const promise = new Promise<{ filename: string }>((resolve) => {
      resolvePromise = resolve;
    });

    const trackedPromise = runInAct(() =>
      toast.promise(promise, {
        loading: 'Uploading file...',
        success: (data) => ({ title: 'Upload complete', description: data.filename }),
        error: { title: 'Upload failed' }
      })
    );

    const loadingToast = screen.getByRole('alertdialog', { name: 'Uploading file...' });
    const loadingId = loadingToast.getAttribute('data-toast-id');

    await act(async () => {
      resolvePromise?.({ filename: 'release-notes.pdf' });
      await trackedPromise;
    });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog', { name: 'Upload complete' })).toBeInTheDocument();
    });

    expect(screen.getByText('release-notes.pdf')).toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Upload complete' })).toHaveAttribute('data-toast-id', loadingId);
  });

  it('passes the thrown error into the promise error callback and preserves id continuity', async () => {
    renderWithProvider();

    const failure = new Error('Disk quota exceeded');
    let rejectPromise: ((error: Error) => void) | undefined;
    const promise = new Promise<never>((_resolve, reject) => {
      rejectPromise = reject;
    });

    const trackedPromise = runInAct(() =>
      toast.promise(promise, {
        loading: { id: 'upload-toast', title: 'Uploading file...' },
        success: 'Upload complete',
        error: (error) => ({ title: 'Upload failed', description: error.message })
      })
    );

    const loadingToast = screen.getByRole('alertdialog', { name: 'Uploading file...' });
    const loadingId = loadingToast.getAttribute('data-toast-id');

    await act(async () => {
      rejectPromise?.(failure);
      try {
        await trackedPromise;
      } catch {
        // Promise rejection is expected for this test.
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog', { name: 'Upload failed' })).toBeInTheDocument();
    });

    expect(screen.getByText('Disk quota exceeded')).toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Upload failed' })).toHaveAttribute('data-toast-id', loadingId);
  });

  it('fails safely when a promise phase resolves to invalid toast options without a title', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderWithProvider();

    let resolvePromise: ((value: { filename: string }) => void) | undefined;
    const promise = new Promise<{ filename: string }>((resolve) => {
      resolvePromise = resolve;
    });

    const trackedPromise = runInAct(() =>
      toast.promise(promise, {
        loading: { id: 'invalid-promise-toast', title: 'Uploading file...' },
        success: () => ({ description: 'Missing title' }) as unknown as ToastOptions,
        error: { title: 'Upload failed' }
      })
    );

    await act(async () => {
      resolvePromise?.({ filename: 'release-notes.pdf' });
      await trackedPromise;
    });

    expect(screen.getByRole('alertdialog', { name: 'Uploading file...' })).toBeInTheDocument();
    expect(screen.queryByText('Missing title')).not.toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalledWith('Toast requires a non-empty title.');

    warnSpy.mockRestore();
  });

  it('keeps the component behavior stable without progress transforms when reduced motion is preferred', () => {
    setReducedMotion(true);
    renderWithProvider({ motion: 'default' });

    runInAct(() => toast('Reduced motion toast'));

    const toastElement = screen.getByRole('alertdialog', { name: 'Reduced motion toast' });
    const progress = screen.getByRole('progressbar', { name: 'Toast timeout remaining' });

    expect(toastElement).toBeInTheDocument();
    expect(progress).toBeInTheDocument();
    expect(Number(progress.getAttribute('aria-valuenow'))).toBeGreaterThan(95);
  });

  it('uses an info-colored progress bar for info toasts', () => {
    renderWithProvider();

    runInAct(() => toast.info('Info progress'));

    const progress = screen.getByRole('progressbar', { name: 'Toast timeout remaining' });
    const track = progress.querySelector('div');
    const indicator = track?.querySelector('div');

    expect(track).toHaveClass('bg-info-tint');
    expect(indicator).toHaveClass('bg-info-light');
  });

  it('updates progress every 100ms and pauses while hovered', () => {
    vi.useFakeTimers();
    renderWithProvider();

    runInAct(() => toast({ title: 'Progress ticker toast', duration: 5000 }));

    const toastElement = screen.getByRole('alertdialog', { name: 'Progress ticker toast' });
    const progress = screen.getByRole('progressbar', { name: 'Toast timeout remaining' });
    const initialValue = Number(progress.getAttribute('aria-valuenow'));

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const tickedValue = Number(progress.getAttribute('aria-valuenow'));
    expect(tickedValue).toBeLessThan(initialValue);

    act(() => {
      fireEvent.mouseEnter(toastElement);
    });

    const pausedValue = Number(progress.getAttribute('aria-valuenow'));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(Number(progress.getAttribute('aria-valuenow'))).toBe(pausedValue);
  });

  it('keeps each toast timer independent when hover moves between toasts', () => {
    vi.useFakeTimers();
    renderWithProvider({ maxVisible: 2 });

    runInAct(() => toast({ title: 'First timer', duration: 5000 }));
    runInAct(() => toast({ title: 'Second timer', duration: 5000 }));

    const firstToast = screen.getByRole('alertdialog', { name: 'First timer' });
    const secondToast = screen.getByRole('alertdialog', { name: 'Second timer' });
    const firstProgress = firstToast.querySelector('[role="progressbar"]');
    const secondProgress = secondToast.querySelector('[role="progressbar"]');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      fireEvent.mouseEnter(firstToast);
    });

    const firstPausedValue = Number(firstProgress?.getAttribute('aria-valuenow'));
    const secondBeforeHoverSwap = Number(secondProgress?.getAttribute('aria-valuenow'));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(Number(firstProgress?.getAttribute('aria-valuenow'))).toBe(firstPausedValue);
    expect(Number(secondProgress?.getAttribute('aria-valuenow'))).toBeLessThan(secondBeforeHoverSwap);

    act(() => {
      fireEvent.mouseLeave(firstToast);
      fireEvent.mouseEnter(secondToast);
    });

    const firstResumedValue = Number(firstProgress?.getAttribute('aria-valuenow'));
    const secondPausedValue = Number(secondProgress?.getAttribute('aria-valuenow'));

    expect(firstResumedValue).toBeCloseTo(firstPausedValue, 1);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(Number(firstProgress?.getAttribute('aria-valuenow'))).toBeLessThan(firstResumedValue);
    expect(Number(secondProgress?.getAttribute('aria-valuenow'))).toBe(secondPausedValue);
  });

  it('keeps progress and timeout behavior stable when reduced motion is preferred', async () => {
    vi.useFakeTimers();
    setReducedMotion(true);
    renderWithProvider({ motion: 'default' });

    runInAct(() => toast({ title: 'Reduced ticker toast', duration: 4000 }));

    expect(screen.getByRole('alertdialog', { name: 'Reduced ticker toast' })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(screen.queryByRole('alertdialog', { name: 'Reduced ticker toast' })).not.toBeInTheDocument();
  });
});
