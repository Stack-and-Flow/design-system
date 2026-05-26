import { render, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spacer } from './Spacer';
import { useSpacer } from './useSpacer';

describe('useSpacer — logic', () => {
  it('returns aria-hidden true by default', () => {
    const { result } = renderHook(() => useSpacer({}));
    expect(result.current.ariaHidden).toBe(true);
  });

  it('allows aria-hidden to be disabled for exceptional semantic layouts', () => {
    const { result } = renderHook(() => useSpacer({ ariaHidden: false }));
    expect(result.current.ariaHidden).toBe(false);
  });

  it('returns a className for horizontal spacing', () => {
    const { result } = renderHook(() => useSpacer({ axis: 'horizontal', size: 8 }));
    expect(result.current.className).toContain('w-8');
  });

  it('keeps legacy spaceX and spaceY overrides supported', () => {
    const { result } = renderHook(() => useSpacer({ spaceX: 10, spaceY: 6 }));
    expect(result.current.className).toContain('w-10');
    expect(result.current.className).toContain('h-6');
  });
});

describe('Spacer — component behavior', () => {
  it('renders a decorative spacer element', () => {
    const { container } = render(<Spacer />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards custom className for layout composition', () => {
    const { container } = render(<Spacer className='custom-spacer' />);
    expect(container.firstElementChild).toHaveClass('custom-spacer');
  });
});
