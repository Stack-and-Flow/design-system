import { render, renderHook, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({
    name,
    size,
    className,
    ...props
  }: { name: string; size?: number; className?: string } & ComponentProps<'svg'>) => (
    <svg data-testid='icon' data-icon={name} data-size={size} className={className} {...props} />
  )
}));

import { Icon } from './Icon';
import { Icon as BarrelIcon } from './index';
import { useIcon } from './useIcon';

describe('useIcon — logic', () => {
  it('returns a decorative brand icon by default', () => {
    const { result } = renderHook(() => useIcon({ name: 'image' }));

    expect(result.current.iconProps.name).toBe('image');
    expect(result.current.iconProps.size).toBe(24);
    expect(result.current.iconProps.role).toBeUndefined();
    expect(result.current.iconProps['aria-hidden']).toBe(true);
    expect(result.current.iconProps.className).toContain('text-brand-light');
    expect(result.current.iconProps.className).toContain('dark:text-brand-dark');
  });

  it('returns semantic icon attributes when a label is available', () => {
    const { result } = renderHook(() => useIcon({ name: 'image', title: 'Gallery image' }));

    expect(result.current.iconProps.role).toBe('img');
    expect(result.current.iconProps['aria-hidden']).toBeUndefined();
    expect(result.current.iconProps['aria-label']).toBe('Gallery image');
    expect(result.current.iconProps.title).toBe('Gallery image');
  });

  it('returns semantic icon attributes when aria-labelledby is available', () => {
    const { result } = renderHook(() => useIcon({ name: 'image', 'aria-labelledby': 'icon-label' }));

    expect(result.current.iconProps.role).toBe('img');
    expect(result.current.iconProps['aria-hidden']).toBeUndefined();
    expect(result.current.iconProps['aria-label']).toBeUndefined();
    expect(result.current.iconProps['aria-labelledby']).toBe('icon-label');
  });

  it('keeps token overrides and custom className composed with the selected tone', () => {
    const { result } = renderHook(() =>
      useIcon({
        name: 'image',
        tone: 'success',
        color: 'text-color-orange',
        className: 'custom-icon'
      })
    );

    expect(result.current.iconProps.className).toContain('text-orange');
    expect(result.current.iconProps.className).toContain('dark:text-success');
    expect(result.current.iconProps.className).toContain('custom-icon');
  });
});

describe('Icon — component behavior', () => {
  it('is exported as a named component through the local barrel', () => {
    expect(BarrelIcon).toBe(Icon);
  });

  it('renders a decorative icon outside the accessibility tree by default', () => {
    render(<Icon name='image' />);

    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders a semantic icon when an accessible label is provided', () => {
    render(<Icon name='image' aria-label='Profile photo' />);

    expect(screen.getByRole('img', { name: 'Profile photo' })).toHaveAttribute('data-icon', 'image');
    expect(screen.getByRole('img', { name: 'Profile photo' })).not.toHaveAttribute('aria-hidden');
  });

  it('renders a semantic icon when aria-labelledby provides the accessible name', () => {
    render(
      <>
        <span id='profile-icon-label'>Profile photo</span>
        <Icon name='image' aria-labelledby='profile-icon-label' />
      </>
    );

    expect(screen.getByRole('img', { name: 'Profile photo' })).toHaveAttribute('data-icon', 'image');
    expect(screen.getByRole('img', { name: 'Profile photo' })).not.toHaveAttribute('aria-hidden');
  });

  it('forwards native svg attributes and custom className', () => {
    render(<Icon name='image' data-testid='custom-icon' id='hero-icon' className='custom-icon' strokeWidth={1.5} />);

    const icon = screen.getByTestId('custom-icon');

    expect(icon).toHaveAttribute('id', 'hero-icon');
    expect(icon).toHaveAttribute('stroke-width', '1.5');
    expect(icon).toHaveClass('custom-icon');
  });
});
