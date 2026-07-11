import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';
import { badgeVariants } from './types';
import { useBadge } from './useBadge';

describe('useBadge — logic', () => {
  it('returns accessible defaults for a standalone dot badge', () => {
    const { result } = renderHook(() => useBadge({}));

    expect(result.current.content).toBe('');
    expect(result.current.hasChildren).toBe(false);
    expect(result.current.isDot).toBe(true);
    expect(result.current.isSquare).toBe(true);
    expect(result.current.shouldRenderBadge).toBe(true);
    expect(result.current.badgeProps.role).toBe('status');
    expect(result.current.badgeProps['aria-live']).toBe('off');
  });

  it('ignores placement for standalone badges and keeps positioned badges wrapped with children', () => {
    const { result: standaloneResult } = renderHook(() => useBadge({ content: 'New', placement: 'bottom-left' }));
    const { result: positionedResult } = renderHook(() =>
      useBadge({
        content: '3',
        placement: 'bottom-left',
        children: <span>Inbox</span>
      })
    );

    expect(standaloneResult.current.hasChildren).toBe(false);
    expect(standaloneResult.current.resolvedPlacement).toBeUndefined();
    expect(positionedResult.current.hasChildren).toBe(true);
    expect(positionedResult.current.children).toBeTruthy();
    expect(positionedResult.current.resolvedPlacement).toBe('bottom-left');
  });

  it('defaults positioned badges to top-right without applying placement to standalone badges', () => {
    const { result: standaloneResult } = renderHook(() => useBadge({ content: 'New' }));
    const { result: positionedResult } = renderHook(() =>
      useBadge({
        content: '3',
        children: <span>Inbox</span>
      })
    );

    expect(standaloneResult.current.resolvedPlacement).toBeUndefined();
    expect(positionedResult.current.resolvedPlacement).toBe('top-right');
  });

  it('marks icon and dot content as square badges', () => {
    const { result: iconResult } = renderHook(() => useBadge({ content: <span aria-hidden='true'>✓</span> }));
    const { result: dotResult } = renderHook(() => useBadge({ content: '' }));

    expect(iconResult.current.isSquare).toBe(true);
    expect(dotResult.current.isSquare).toBe(true);
  });

  it('does not render hidden badges', () => {
    const { result } = renderHook(() => useBadge({ content: '5', visibility: false }));

    expect(result.current.shouldRenderBadge).toBe(false);
  });

  it('keeps entrance animation separate from decorative animation', () => {
    const { result: defaultResult } = renderHook(() => useBadge({ content: '5' }));
    const { result: pulseResult } = renderHook(() => useBadge({ content: '5', animation: 'pulse' }));

    expect(defaultResult.current.shouldAnimateIn).toBe(true);
    expect(pulseResult.current.shouldAnimateIn).toBe(false);
  });

  it.each([
    ['primary', 'bg-red-surface-light', 'dark:bg-red-surface-dark'],
    ['info', 'bg-info-surface-light', 'dark:bg-info-surface-dark'],
    ['success', 'bg-success-surface-light', 'dark:bg-success-surface-dark'],
    ['warning', 'bg-warning-surface-light', 'dark:bg-warning-surface-dark'],
    ['danger', 'bg-error-surface-light', 'dark:bg-error-surface-dark']
  ] as const)('uses opaque status surfaces for %s flat badges', (color, lightClass, darkClass) => {
    const className = badgeVariants({ color, variant: 'flat' });

    expect(className).toContain(lightClass);
    expect(className).toContain(darkClass);
  });
});

describe('Badge — component behavior', () => {
  it('renders standalone badges without a positioning wrapper', () => {
    const { container } = render(<Badge content='New' ariaLabel='New feature' />);

    expect(container.firstElementChild?.tagName).toBe('SPAN');
    const badge = screen.getByRole('status');

    expect(badge).toHaveTextContent('New');
    expect(badge).toHaveAttribute('aria-label', 'New feature');
  });

  it('renders positioned badges with their child content', () => {
    const { container } = render(
      <Badge content='4' ariaLabel='4 unread messages'>
        <button type='button'>Inbox</button>
      </Badge>
    );

    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByRole('button', { name: 'Inbox' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('4');
  });

  it('applies aria label, role, and live region attributes', () => {
    render(<Badge content='+99' ariaLabel='More than 99 notifications' ariaLive='assertive' role='status' />);

    const badge = screen.getByRole('status');

    expect(badge).toHaveAttribute('aria-label', 'More than 99 notifications');
    expect(badge).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders icon content with an accessible label', () => {
    render(
      <Badge content={<span aria-hidden='true'>✓</span>} ariaLabel='Verified account' color='success' size='sm' />
    );

    const badge = screen.getByRole('status');

    expect(badge).toHaveAttribute('aria-label', 'Verified account');
    expect(badge).toHaveTextContent('✓');
  });

  it('renders dot badges with an accessible label', () => {
    render(<Badge content='' ariaLabel='Online' color='success' size='sm' />);

    const badge = screen.getByRole('status');

    expect(badge).toHaveAttribute('aria-label', 'Online');
    expect(badge).toHaveTextContent('');
  });

  it('does not expose hidden standalone badges to assistive technology or layout', () => {
    const { container } = render(<Badge content='7' ariaLabel='7 notifications' visibility={false} />);

    expect(container.firstElementChild).toBeNull();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('keeps children visible but removes the hidden positioned badge', () => {
    render(
      <Badge content='7' ariaLabel='7 notifications' visibility={false}>
        <button type='button'>Notifications</button>
      </Badge>
    );

    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
