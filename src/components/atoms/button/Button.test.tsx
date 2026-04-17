/**
 * Button.test.tsx — Reference tests for Stack-and-Flow Design System
 *
 * STRATEGY:
 * - Hook (useButton): tested with renderHook → pure logic, no DOM rendering
 * - Component (Button): tested with render + screen + userEvent → observable behavior from outside
 *
 * WHAT we test: behavior (disabled state, loading, aria attrs, click handling)
 * WHAT we do NOT test: specific CSS class strings, internal refs, ripple implementation
 *
 * MOCKS:
 * - lucide-react/dynamic → DynamicIcon causes dynamic import issues in jsdom
 * - spinners-react → SpinnerCircular uses CSS animations not available in jsdom
 * - @/components/utils/styles/index.css → already ignored via css: false in vite.config.ts test block,
 *   but the import itself still resolves, so we mock the module to avoid CSS parse errors
 */

import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// --- Mocks (declared before component import) ---

vi.mock('lucide-react/dynamic', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => null
}));

// CSS import in Button.tsx — mock to prevent parse errors in jsdom
vi.mock('@/components/utils/styles/index.css', () => ({}));

// --- Imports after mocks ---

import { Button } from './Button';
import { useButton } from './useButton';

// ─────────────────────────────────────────────
// HOOK TESTS — useButton
// ─────────────────────────────────────────────

describe('useButton — logic', () => {
  it('returns disabled: false by default', () => {
    const { result } = renderHook(() => useButton({}));
    expect(result.current.disabled).toBe(false);
  });

  it('returns isLoading: false by default', () => {
    const { result } = renderHook(() => useButton({}));
    expect(result.current.isLoading).toBe(false);
  });

  it('returns disabled: true when disabled prop is true', () => {
    const { result } = renderHook(() => useButton({ disabled: true }));
    expect(result.current.disabled).toBe(true);
  });

  it('returns the correct variant when variant: ghost is passed', () => {
    const { result } = renderHook(() => useButton({ variant: 'ghost' }));
    expect(result.current.variant).toBe('ghost');
  });

  it('iconSize() returns correct class for size sm', () => {
    const { result } = renderHook(() => useButton({ size: 'sm' }));
    expect(result.current.iconSize()).toBe('h-md w-auto');
  });

  it('iconSize() returns correct class for size lg', () => {
    const { result } = renderHook(() => useButton({ size: 'lg' }));
    expect(result.current.iconSize()).toBe('h-xl w-auto');
  });

  it('iconSize() returns default class for size md', () => {
    const { result } = renderHook(() => useButton({ size: 'md' }));
    expect(result.current.iconSize()).toBe('h-lg w-auto');
  });

  it('passes ariaLabel correctly to return value', () => {
    const { result } = renderHook(() => useButton({ ariaLabel: 'Submit form' }));
    expect(result.current.ariaLabel).toBe('Submit form');
  });
});

// ─────────────────────────────────────────────
// COMPONENT TESTS — Button
// ─────────────────────────────────────────────

describe('Button — component behavior', () => {
  it('renders a <button> element in the DOM', () => {
    render(<Button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays the text prop as content', () => {
    render(<Button text='Click me' />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies aria-label when the prop is provided', () => {
    render(<Button ariaLabel='Submit form' />);
    expect(screen.getByRole('button', { name: 'Submit form' })).toBeInTheDocument();
  });

  it('uses text as aria-label when ariaLabel prop is not provided', () => {
    render(<Button text='Save' />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button text='Disabled' disabled={true} />);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('is disabled when isLoading is true (even if disabled is false)', () => {
    render(<Button text='Loading' isLoading={true} disabled={false} />);
    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled();
  });

  it('calls onClick when the button is clicked and not loading', async () => {
    const handleClick = vi.fn();
    render(<Button text='Submit' onClick={handleClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClick when isLoading is true', async () => {
    const handleClick = vi.fn();
    render(<Button text='Saving' isLoading={true} onClick={handleClick} />);

    // The button is disabled when loading — userEvent click on disabled button
    // does not fire the event handler, which is the correct behavior
    await userEvent.click(screen.getByRole('button', { name: 'Saving' }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies aria-pressed when the prop is provided', () => {
    render(<Button text='Toggle' aria-pressed={false} />);
    const btn = screen.getByRole('switch', { name: 'Toggle' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('sets role="switch" when aria-pressed prop is provided', () => {
    render(<Button text='Toggle' aria-pressed={true} />);
    expect(screen.getByRole('switch', { name: 'Toggle' })).toBeInTheDocument();
  });

  it('sets role="button" when aria-pressed prop is NOT provided', () => {
    render(<Button text='Action' />);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
