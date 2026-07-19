import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';
import { useDivider } from './useDivider';

describe('useDivider — logic', () => {
  it('returns semantic separator attributes and full width by default', () => {
    const { result } = renderHook(() => useDivider({}));

    expect(result.current.dividerProps.role).toBe('separator');
    expect(result.current.dividerProps['aria-orientation']).toBe('horizontal');
    expect(result.current.dividerProps['aria-hidden']).toBeUndefined();
    expect(result.current.className).toContain('w-full');
  });

  it('returns decorative aria attributes when decorative is true', () => {
    const { result } = renderHook(() => useDivider({ decorative: true }));

    expect(result.current.dividerProps.role).toBeUndefined();
    expect(result.current.dividerProps['aria-orientation']).toBeUndefined();
    expect(result.current.dividerProps['aria-hidden']).toBe(true);
  });

  it('returns token-backed classes for divider variants and color', () => {
    const { result } = renderHook(() => useDivider({ orientation: 'vertical', size: 'lg', thickness: 'md' }));

    expect(result.current.className).toContain('h-20');
    expect(result.current.className).toContain('w-0-75');
    expect(result.current.className).toContain('bg-primary');
  });

  it('maps full size to the available axis for each orientation', () => {
    const { result: horizontal } = renderHook(() => useDivider({ size: 'full' }));
    const { result: vertical } = renderHook(() => useDivider({ orientation: 'vertical', size: 'full' }));

    expect(horizontal.current.className).toContain('w-full');
    expect(vertical.current.className).toContain('h-full');
  });
});

describe('Divider — component behavior', () => {
  it('renders a semantic separator by default', () => {
    render(<Divider />);

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('applies the correct aria orientation for vertical separators', () => {
    render(<Divider orientation='vertical' />);

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders a decorative divider outside the accessibility tree when requested', () => {
    render(<Divider decorative={true} data-testid='decorative-divider' />);

    expect(screen.getByTestId('decorative-divider')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('forwards custom className and native div attributes', () => {
    render(<Divider className='custom-divider' data-testid='divider' id='section-divider' />);

    const divider = screen.getByTestId('divider');

    expect(divider).toHaveClass('custom-divider');
    expect(divider).toHaveAttribute('id', 'section-divider');
  });
});
