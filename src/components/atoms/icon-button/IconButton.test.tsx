import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({ name, size }: { name: string; size: number }) => (
    <svg data-name={name} data-size={String(size)} data-testid='icon-button-icon' />
  )
}));

import { IconButton } from './IconButton';
import { IconButton as IconButtonFromIndex } from './index';
import { useIconButton } from './useIconButton';

describe('useIconButton — logic', () => {
  it('returns button defaults for icon-only actions', () => {
    const { result } = renderHook(() => useIconButton({ icon: 'menu', title: 'Open menu' }));

    expect(result.current.type).toBe('button');
    expect(result.current.disabled).toBe(false);
    expect(result.current.ariaLabel).toBe('Open menu');
  });

  it('prefers ariaLabel over title for the accessible name', () => {
    const { result } = renderHook(() =>
      useIconButton({ icon: 'menu', title: 'Open menu', ariaLabel: 'Expand navigation' })
    );

    expect(result.current.ariaLabel).toBe('Expand navigation');
  });

  it('supports the native aria-label prop', () => {
    const { result } = renderHook(() => useIconButton({ icon: 'menu', 'aria-label': 'Expand navigation' }));

    expect(result.current.ariaLabel).toBe('Expand navigation');
  });

  it('returns a computed className and preserves custom classes', () => {
    const { result: primaryResult } = renderHook(() => useIconButton({ icon: 'menu', title: 'Open menu' }));
    const { result: ghostResult } = renderHook(() =>
      useIconButton({ icon: 'menu', title: 'Open menu', variant: 'ghost', className: 'custom-class' })
    );

    expect(primaryResult.current.className).toEqual(expect.any(String));
    expect(ghostResult.current.className).toContain('custom-class');
    expect(ghostResult.current.className).not.toBe(primaryResult.current.className);
  });

  it('derives icon size from the component size', () => {
    const { result: compactResult } = renderHook(() => useIconButton({ icon: 'menu', title: 'Open menu', size: 'xs' }));
    const { result: smallResult } = renderHook(() => useIconButton({ icon: 'menu', title: 'Open menu', size: 'sm' }));
    const { result: largeResult } = renderHook(() => useIconButton({ icon: 'menu', title: 'Open menu', size: 'lg' }));

    expect(compactResult.current.iconSize).toBe(14);
    expect(compactResult.current.size).toBe('xs');
    expect(smallResult.current.iconSize).toBe(16);
    expect(smallResult.current.size).toBe('sm');
    expect(largeResult.current.iconSize).toBe(24);
    expect(largeResult.current.size).toBe('lg');
    expect(compactResult.current.className).toContain('h-9');
    expect(compactResult.current.className).toContain('w-9');
    expect(compactResult.current.className).not.toBe(largeResult.current.className);
  });

  it('maps compact legacy numeric icon sizes to the xs button target', () => {
    const { result } = renderHook(() => useIconButton({ icon: 'menu', title: 'Open menu', size: 14 }));

    expect(result.current.iconSize).toBe(14);
    expect(result.current.size).toBe('xs');
  });

  it('keeps legacy numeric icon sizes while deriving the closest button size', () => {
    const { result } = renderHook(() => useIconButton({ icon: 'menu', title: 'Open menu', size: 18 }));

    expect(result.current.iconSize).toBe(18);
    expect(result.current.size).toBe('md');
  });

  it('omits glow classes when shadow is disabled', () => {
    const { result } = renderHook(() =>
      useIconButton({ icon: 'star', title: 'Favorite without glow', variant: 'secondary', shadow: false })
    );

    expect(result.current.className).not.toContain('shadow-glow');
  });

  it('re-exports the component as a named export from the barrel', () => {
    expect(IconButtonFromIndex).toBe(IconButton);
  });
});

describe('IconButton — component behavior', () => {
  it('renders a button with the title as its accessible name', () => {
    render(<IconButton icon='menu' title='Open menu' />);

    const button = screen.getByRole('button', { name: 'Open menu' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Open menu');
  });

  it('prefers ariaLabel over title for the rendered accessible name', () => {
    render(<IconButton icon='menu' title='Open menu' ariaLabel='Expand navigation' />);

    expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();
  });

  it('renders the requested icon with the derived component size', () => {
    render(<IconButton icon='menu' size='xs' title='Open menu' />);

    expect(screen.getByTestId('icon-button-icon')).toHaveAttribute('data-name', 'menu');
    expect(screen.getByTestId('icon-button-icon')).toHaveAttribute('data-size', '14');
  });

  it('calls onClick when the button is clicked', async () => {
    const handleClick = vi.fn();

    render(<IconButton icon='menu' title='Open menu' onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();

    render(<IconButton icon='menu' title='Open menu' disabled={true} onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const button = screen.getByRole('button', { name: 'Open menu' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('passes the native aria-label prop through as the rendered accessible name', () => {
    render(<IconButton icon='menu' aria-label='Expand navigation' />);

    expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();
  });

  it('applies aria-pressed when provided', () => {
    render(<IconButton icon='bookmark' title='Save item' aria-pressed={true} />);

    expect(screen.getByRole('button', { name: 'Save item' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses the provided button type', () => {
    render(<IconButton icon='search' title='Search' type='submit' />);

    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('type', 'submit');
  });
});
