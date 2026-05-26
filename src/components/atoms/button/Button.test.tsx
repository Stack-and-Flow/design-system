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
 * - lucide-react/dynamic.js → DynamicIcon causes dynamic import issues in jsdom
 * - spinners-react → SpinnerCircular uses CSS animations not available in jsdom
 *   but the import itself still resolves, so we mock the module to avoid CSS parse errors
 */

import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// --- Mocks (declared before component import) ---

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => <span data-testid='button-spinner' />
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
    const { result } = renderHook(() => useButton({ text: 'Button' }));
    expect(result.current.disabled).toBe(false);
  });

  it('returns isLoading: false by default', () => {
    const { result } = renderHook(() => useButton({ text: 'Button' }));
    expect(result.current.isLoading).toBe(false);
  });

  it('returns disabled: true when disabled prop is true', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', disabled: true }));
    expect(result.current.disabled).toBe(true);
  });

  it('returns a computed className for visual variants', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', variant: 'ghost' }));
    expect(result.current.className).toEqual(expect.any(String));
  });

  it('suppresses decorative glow classes when emphasis is flat', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', variant: 'secondary', emphasis: 'flat' }));
    expect(result.current.className).not.toContain('shadow-glow-btn-secondary');
  });

  it('keeps legacy shadow={false} as flat emphasis compatibility', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', variant: 'secondary', shadow: false }));
    expect(result.current.className).not.toContain('shadow-glow-btn-secondary');
  });

  it('prefers explicit emphasis over legacy shadow when both are provided', () => {
    const { result } = renderHook(() =>
      useButton({ text: 'Button', variant: 'secondary', emphasis: 'default', shadow: false })
    );

    expect(result.current.className).toContain('shadow-glow-btn-secondary-light');
  });

  it('returns correct icon class for size xs', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', size: 'xs' }));
    expect(result.current.iconSize).toBe('h-sm w-auto');
  });

  it('returns correct icon class for size sm', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', size: 'sm' }));
    expect(result.current.iconSize).toBe('h-md w-auto');
  });

  it('returns correct icon class for size lg', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', size: 'lg' }));
    expect(result.current.iconSize).toBe('h-xl w-auto');
  });

  it('returns default icon class for size md', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', size: 'md' }));
    expect(result.current.iconSize).toBe('h-lg w-auto');
  });

  it('passes ariaLabel correctly to return value', () => {
    const { result } = renderHook(() => useButton({ ariaLabel: 'Submit form' }));
    expect(result.current.ariaLabel).toBe('Submit form');
  });

  it('passes native aria-label correctly to return value', () => {
    const { result } = renderHook(() => useButton({ 'aria-label': 'Submit form' }));
    expect(result.current.ariaLabel).toBe('Submit form');
  });

  it('derives compact classes from size xs', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', size: 'xs' }));
    expect(result.current.className).toContain('h-9');
    expect(result.current.className).toContain('px-2');
    expect(result.current.contentClassName).toContain('gap-1');
  });

  it('derives content gap from the size prop', () => {
    const { result } = renderHook(() => useButton({ text: 'Button', size: 'lg' }));
    expect(result.current.contentClassName).toContain('gap-4');
  });
});

// ─────────────────────────────────────────────
// COMPONENT TESTS — Button
// ─────────────────────────────────────────────

describe('Button — component behavior', () => {
  it('renders a <button> element in the DOM', () => {
    render(<Button ariaLabel='Button' />);
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

  it('does not leak emphasis or shadow props to the DOM', () => {
    render(<Button text='Save' variant='secondary' emphasis='flat' shadow={false} />);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toHaveAttribute('emphasis');
    expect(button).not.toHaveAttribute('shadow');
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

    await userEvent.click(screen.getByRole('button', { name: 'Saving' }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('keeps the spinner visible for icon-only loading buttons', () => {
    render(<Button ariaLabel='Refresh' icon='refresh-cw' isLoading={true} />);
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
  });

  it('applies aria-pressed when the prop is provided', () => {
    render(<Button text='Toggle' aria-pressed={false} />);
    const btn = screen.getByRole('button', { name: 'Toggle' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps role="button" when aria-pressed prop is provided', () => {
    render(<Button text='Toggle' aria-pressed={true} />);
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
  });

  it('sets role="button" when aria-pressed prop is NOT provided', () => {
    render(<Button text='Action' />);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
