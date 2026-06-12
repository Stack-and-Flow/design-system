import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({ name, size }: { name: string; size: number }) => (
    <svg data-name={name} data-size={String(size)} data-testid='snippet-icon' />
  )
}));

import { Snippet as SnippetFromIndex } from './index';
import { Snippet } from './Snippet';
import { snippetBase } from './types';
import { useSnippet } from './useSnippet';

const createClipboardMock = (writeText = vi.fn().mockResolvedValue(undefined)) => {
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: { writeText }
  });

  return writeText;
};

describe('useSnippet — logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('returns default copy-button semantics and barrel re-export compatibility', () => {
    const { result } = renderHook(() => useSnippet({ children: 'pnpm install' }));

    expect(result.current.showCopyButton).toBe(true);
    expect(result.current.copyButtonProps['aria-label']).toBe('Copy snippet');
    expect(result.current.copyButtonProps.title).toBe('Copy snippet');
    expect(result.current.copyButtonProps.size).toBe('xs');
    expect(result.current.preProps.id).toBe(result.current.copyButtonProps['aria-controls']);
    expect(SnippetFromIndex).toBe(Snippet);
  });

  it('coordinates text, padding, and copy button size across snippet sizes', () => {
    const { result: smallResult } = renderHook(() => useSnippet({ children: 'pnpm install', size: 'sm' }));
    const { result: mediumResult } = renderHook(() => useSnippet({ children: 'pnpm install', size: 'md' }));
    const { result: largeResult } = renderHook(() => useSnippet({ children: 'pnpm install', size: 'lg' }));

    expect(smallResult.current.rootProps.className).toContain('text-xs');
    expect(smallResult.current.rootProps.className).toContain('pl-3');
    expect(smallResult.current.copyButtonProps.size).toBe('xs');
    expect(mediumResult.current.rootProps.className).toContain('text-sm');
    expect(mediumResult.current.rootProps.className).toContain('pl-3');
    expect(mediumResult.current.copyButtonProps.size).toBe('xs');
    expect(largeResult.current.rootProps.className).toContain('text-base');
    expect(largeResult.current.rootProps.className).toContain('pl-4');
    expect(largeResult.current.copyButtonProps.size).toBe('sm');
  });

  it('keeps the shadow variant visually distinct from solid', () => {
    expect(snippetBase({ variant: 'solid' })).not.toContain('shadow-glow-chip-secondary');
    expect(snippetBase({ variant: 'shadow' })).toContain('shadow-glow-chip-secondary-light');
    expect(snippetBase({ variant: 'shadow' })).toContain('border-border-strong-light');
  });

  it.each([
    ['primary', 'bg-red-surface-light', 'dark:bg-red-surface-dark'],
    ['success', 'bg-success-surface-light', 'dark:bg-success-surface-dark'],
    ['warning', 'bg-warning-surface-light', 'dark:bg-warning-surface-dark'],
    ['danger', 'bg-error-surface-light', 'dark:bg-error-surface-dark'],
    ['info', 'bg-info-surface-light', 'dark:bg-info-surface-dark']
  ] as const)('uses opaque status surfaces for %s solid snippets', (color, lightClass, darkClass) => {
    const className = snippetBase({ color, variant: 'solid' });

    expect(className).toContain(lightClass);
    expect(className).toContain(darkClass);
  });

  it('maps provided aria props to the copy button and preserves the root id', () => {
    const { result } = renderHook(() =>
      useSnippet({
        children: 'pnpm install',
        id: 'install-snippet',
        'aria-controls': 'install-snippet-code',
        'aria-label': 'Copy installation command'
      })
    );

    expect(result.current.rootProps.id).toBe('install-snippet');
    expect(result.current.preProps.id).toBe('install-snippet-code');
    expect(result.current.copyButtonProps['aria-controls']).toBe('install-snippet-code');
    expect(result.current.copyButtonProps['aria-label']).toBe('Copy installation command');
  });

  it('copies the snippet text, calls onCopy, and clears copied state after the timeout', async () => {
    const writeText = createClipboardMock();
    const handleCopy = vi.fn();
    const { result } = renderHook(() => useSnippet({ children: 'pnpm install', onCopy: handleCopy }));
    const pre = document.createElement('pre');

    pre.textContent = 'pnpm install';
    result.current.preRef.current = pre;

    await act(async () => {
      await result.current.copyButtonProps.onClick?.(new MouseEvent('click') as never);
    });

    expect(writeText).toHaveBeenCalledWith('pnpm install');
    expect(handleCopy).toHaveBeenCalledTimes(1);
    expect(result.current.copied).toBe(true);
    expect(result.current.copyAnnouncement).toBe('Snippet copied to clipboard');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.copyAnnouncement).toBeUndefined();
  });

  it('announces clipboard failures without calling onCopy', async () => {
    const writeText = createClipboardMock(vi.fn().mockRejectedValue(new Error('Clipboard denied')));
    const handleCopy = vi.fn();
    const { result } = renderHook(() => useSnippet({ children: 'pnpm install', onCopy: handleCopy }));
    const pre = document.createElement('pre');

    pre.textContent = 'pnpm install';
    result.current.preRef.current = pre;

    await act(async () => {
      await result.current.copyButtonProps.onClick?.(new MouseEvent('click') as never);
    });

    expect(writeText).toHaveBeenCalledWith('pnpm install');
    expect(handleCopy).not.toHaveBeenCalled();
    expect(result.current.copied).toBe(false);
    expect(result.current.copyAnnouncement).toBe('Unable to copy snippet');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copyAnnouncement).toBeUndefined();
  });

  it('announces unsupported clipboard access', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined
    });
    const handleCopy = vi.fn();
    const { result } = renderHook(() => useSnippet({ children: 'pnpm install', onCopy: handleCopy }));
    const pre = document.createElement('pre');

    pre.textContent = 'pnpm install';
    result.current.preRef.current = pre;

    await act(async () => {
      await result.current.copyButtonProps.onClick?.(new MouseEvent('click') as never);
    });

    expect(handleCopy).not.toHaveBeenCalled();
    expect(result.current.copied).toBe(false);
    expect(result.current.copyAnnouncement).toBe('Unable to copy snippet');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copyAnnouncement).toBeUndefined();
  });

  it('does not copy when the action is disabled', async () => {
    const writeText = createClipboardMock();
    const handleCopy = vi.fn();
    const { result } = renderHook(() =>
      useSnippet({ children: 'pnpm install', disableCopy: true, onCopy: handleCopy })
    );
    const pre = document.createElement('pre');

    pre.textContent = 'pnpm install';
    result.current.preRef.current = pre;

    await act(async () => {
      await result.current.copyButtonProps.onClick?.(new MouseEvent('click') as never);
    });

    expect(writeText).not.toHaveBeenCalled();
    expect(handleCopy).not.toHaveBeenCalled();
    expect(result.current.copied).toBe(false);
  });
});

describe('Snippet — component behavior', () => {
  it('renders the snippet content and keeps aria props on the copy button instead of the container', () => {
    render(
      <Snippet id='install-snippet' aria-label='Copy installation command'>
        pnpm install
      </Snippet>
    );

    const button = screen.getByRole('button', { name: 'Copy installation command' });
    const code = screen.getByText('pnpm install');

    expect(button).toHaveAttribute('aria-controls', 'install-snippet-content');
    expect(button).toHaveClass('h-9', 'w-9');
    expect(screen.getByTestId('snippet-icon')).toHaveAttribute('data-size', '14');
    expect(code.closest('pre')).toHaveAttribute('id', 'install-snippet-content');
    expect(screen.getByText('pnpm install').parentElement?.parentElement).not.toHaveAttribute(
      'aria-label',
      'Copy installation command'
    );
  });

  it('hides the copy action when disableCopy is true', () => {
    render(<Snippet disableCopy={true}>Read-only snippet</Snippet>);

    expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
  });

  it('writes to the clipboard and calls onCopy when the button is clicked', async () => {
    const writeText = createClipboardMock();
    const handleCopy = vi.fn();

    render(<Snippet onCopy={handleCopy}>pnpm add @stack-and-flow/design-system</Snippet>);

    await userEvent.click(screen.getByRole('button', { name: 'Copy snippet' }));

    expect(writeText).toHaveBeenCalledWith('pnpm add @stack-and-flow/design-system');
    expect(handleCopy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Snippet copied to clipboard');
  });
});
