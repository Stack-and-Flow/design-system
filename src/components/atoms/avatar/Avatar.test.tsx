/**
 * Avatar.test.tsx — behavior coverage for Stack-and-Flow Design System
 *
 * STRATEGY:
 * - Hook (useAvatar): tested with renderHook → derived accessibility and fallback logic
 * - Component (Avatar): tested with render + screen + userEvent → observable DOM behavior
 *
 * WHAT we test: fallback text, image/fallback accessibility, interactive button semantics, click behavior
 * WHAT we do NOT test: specific CSS class strings or Radix internals
 */

import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Avatar } from './Avatar';
import { useAvatar } from './useAvatar';

// ─────────────────────────────────────────────
// HOOK TESTS — useAvatar
// ─────────────────────────────────────────────

describe('useAvatar — logic', () => {
  it('derives initials from the accessible name', () => {
    const { result } = renderHook(() => useAvatar({ alt: 'El Gentleman' }));
    expect(result.current.fallback).toBe('EG');
  });

  it('uses a stable fallback initial when alt is blank', () => {
    const { result } = renderHook(() => useAvatar({ alt: '   ' }));
    expect(result.current.alt).toBe('Avatar');
    expect(result.current.fallback).toBe('A');
  });

  it('marks the avatar as non-interactive by default', () => {
    const { result } = renderHook(() => useAvatar({ alt: 'User avatar' }));
    expect(result.current.interactive).toBe(false);
  });

  it('marks the avatar as interactive when onClick is provided', () => {
    const { result } = renderHook(() => useAvatar({ alt: 'Open profile', onClick: vi.fn() }));
    expect(result.current.interactive).toBe(true);
  });

  it('returns a computed className for visual variants', () => {
    const { result } = renderHook(() => useAvatar({ alt: 'User avatar', size: 'lg', rounded: 'full' }));
    expect(result.current.className).toEqual(expect.any(String));
  });
});

// ─────────────────────────────────────────────
// COMPONENT TESTS — Avatar
// ─────────────────────────────────────────────

describe('Avatar — component behavior', () => {
  it('renders a named image region when not interactive', () => {
    render(<Avatar alt='El Gentleman' />);
    expect(screen.getByRole('img', { name: 'El Gentleman' })).toBeInTheDocument();
  });

  it('shows initials fallback when no image source is provided', () => {
    render(<Avatar alt='El Gentleman' />);
    expect(screen.getByText('EG')).toBeInTheDocument();
  });

  it('renders a named image region when src is provided', () => {
    render(<Avatar src='/images/logo-only.svg' alt='EG Logo' />);
    expect(screen.getByRole('img', { name: 'EG Logo' })).toBeInTheDocument();
  });

  it('falls back to a default accessible name when alt is blank', () => {
    render(<Avatar alt='   ' />);
    expect(screen.getByRole('img', { name: 'Avatar' })).toBeInTheDocument();
  });

  it('renders a real button when onClick is provided', () => {
    render(<Avatar alt='Open profile' onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Open profile' })).toBeInTheDocument();
  });

  it('calls onClick when the interactive avatar is clicked', async () => {
    const handleClick = vi.fn();
    render(<Avatar alt='Open profile' onClick={handleClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Open profile' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when the interactive avatar is activated by keyboard', async () => {
    const handleClick = vi.fn();
    render(<Avatar alt='Open profile' onClick={handleClick} />);

    screen.getByRole('button', { name: 'Open profile' }).focus();
    await userEvent.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Avatar alt='Open profile' disabled={true} onClick={handleClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Open profile' }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
