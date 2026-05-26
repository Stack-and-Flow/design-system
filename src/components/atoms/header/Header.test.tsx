import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';
import { useHeader } from './useHeader';

describe('useHeader — logic', () => {
  it('returns h1 semantics by default', () => {
    const { result } = renderHook(() => useHeader({ children: 'Heading' }));
    expect(result.current.tag).toBe('h1');
  });

  it('uses tag as visual size by default', () => {
    const { result } = renderHook(() => useHeader({ children: 'Heading', tag: 'h3' }));
    expect(result.current.className).toContain('fs-h3');
    expect(result.current.className).not.toContain('fs-h1');
  });

  it('allows visual size to differ from semantic tag', () => {
    const { result } = renderHook(() => useHeader({ children: 'Heading', tag: 'h2', size: 'h5' }));
    expect(result.current.tag).toBe('h2');
    expect(result.current.className).toContain('fs-h5');
  });

  it('keeps fontSize as a backwards-compatible visual size alias', () => {
    const { result } = renderHook(() => useHeader({ children: 'Heading', tag: 'h2', fontSize: 'h4' }));
    expect(result.current.className).toContain('fs-h4');
  });

  it('applies font weight presets', () => {
    const secondary = renderHook(() => useHeader({ children: 'Heading', font: 'secondary' }));
    const secondaryBold = renderHook(() => useHeader({ children: 'Heading', font: 'secondaryBold' }));

    expect(secondary.result.current.className).toContain('font-medium');
    expect(secondaryBold.result.current.className).toContain('font-bold');
  });

  it('prefers size over the backwards-compatible fontSize alias', () => {
    const { result } = renderHook(() => useHeader({ children: 'Heading', tag: 'h2', size: 'h3', fontSize: 'h4' }));
    expect(result.current.className).toContain('fs-h3');
    expect(result.current.className).not.toContain('fs-h4');
  });
});

describe('Header — component behavior', () => {
  it('renders an h1 by default', () => {
    render(<Header>Heading</Header>);
    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeInTheDocument();
  });

  it('renders the requested semantic heading level', () => {
    render(<Header tag='h3'>Section heading</Header>);
    expect(screen.getByRole('heading', { level: 3, name: 'Section heading' })).toBeInTheDocument();
  });

  it('applies id for accessible references', () => {
    render(<Header id='heading-id'>Referenced heading</Header>);
    expect(screen.getByRole('heading', { name: 'Referenced heading' })).toHaveAttribute('id', 'heading-id');
  });

  it('keeps screen-reader-only heading in the accessibility tree', () => {
    render(<Header srOnly={true}>Hidden heading</Header>);
    expect(screen.getByRole('heading', { name: 'Hidden heading' })).toBeInTheDocument();
  });
});
