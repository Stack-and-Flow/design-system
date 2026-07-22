import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';
import { useSkeleton } from './useSkeleton';

describe('useSkeleton — logic', () => {
  it('returns aria-hidden true by default', () => {
    const { result } = renderHook(() => useSkeleton({}));
    expect(result.current.ariaHidden).toBe(true);
  });

  it('allows aria-hidden to be disabled for parent-managed announcements', () => {
    const { result } = renderHook(() => useSkeleton({ ariaHidden: false }));
    expect(result.current.ariaHidden).toBe(false);
  });

  it('merges custom className for composition overrides', () => {
    const { result } = renderHook(() => useSkeleton({ className: 'custom-skeleton' }));
    expect(result.current.className).toContain('custom-skeleton');
  });

  it('preserves safe native div props', () => {
    const { result } = renderHook(() => useSkeleton({ id: 'loading-card' }));
    expect(result.current.id).toBe('loading-card');
  });
});

describe('Skeleton — component behavior', () => {
  it('renders a decorative skeleton by default', () => {
    render(<Skeleton data-testid='skeleton' />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'skeleton');
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('can be exposed when a parent deliberately provides semantics', () => {
    render(<Skeleton ariaHidden={false} role='status' aria-label='Loading profile' />);
    expect(screen.getByRole('status', { name: 'Loading profile' })).toHaveAttribute('aria-hidden', 'false');
  });

  it('forwards custom className for layout composition', () => {
    render(<Skeleton data-testid='skeleton' className='custom-skeleton' />);
    expect(screen.getByTestId('skeleton')).toHaveClass('custom-skeleton');
  });
});
