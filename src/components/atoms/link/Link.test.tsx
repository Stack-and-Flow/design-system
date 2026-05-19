/**
 * Link.test.tsx — behavior tests for Stack-and-Flow Design System
 *
 * Strategy:
 * - Hook (useLink): tested with renderHook for derived attributes and state.
 * - Component (Link): tested with render/screen/userEvent for observable behavior.
 *
 * We test behavior, not internal CSS class strings.
 */

import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// --- Mocks (declared before component import) ---

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({ name }: { name: string }) => <span aria-hidden='true' data-icon={name} data-testid='link-icon' />
}));

// --- Imports after mocks ---

import { Link } from './Link';
import { useLink } from './useLink';

// ─────────────────────────────────────────────
// HOOK TESTS — useLink
// ─────────────────────────────────────────────

describe('useLink — logic', () => {
  it('returns target _blank by default', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs' }));
    expect(result.current.target).toBe('_blank');
  });

  it('marks _blank links as external', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs', target: '_blank' }));
    expect(result.current.isExternal).toBe(true);
  });

  it('does not mark _self links as external', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs', target: '_self' }));
    expect(result.current.isExternal).toBe(false);
  });

  it('uses title as accessible label when provided', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs', title: 'Open docs' }));
    expect(result.current.ariaLabel).toBe('Open docs');
  });

  it('falls back to string children as accessible label', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs' }));
    expect(result.current.ariaLabel).toBe('Docs');
  });

  it('returns disabled false by default', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs' }));
    expect(result.current.disabled).toBe(false);
  });

  it('keeps navigational visual variants exposed as links when href is present', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs', href: 'https://example.com', variant: 'button' }));
    expect(result.current.role).toBe('link');
  });

  it('exposes button role only when no href is present', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs', variant: 'button' }));
    expect(result.current.role).toBe('button');
  });

  it('makes action-style links keyboard-focusable by default', () => {
    const { result } = renderHook(() => useLink({ children: 'Docs', variant: 'button' }));
    expect(result.current.tabIndex).toBe(0);
  });
});

// ─────────────────────────────────────────────
// COMPONENT TESTS — Link
// ─────────────────────────────────────────────

describe('Link — component behavior', () => {
  it('renders an anchor with link role by default', () => {
    render(<Link href='https://example.com'>Docs</Link>);
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });

  it('sets rel for external links opened in a new tab', () => {
    render(
      <Link href='https://example.com' target='_blank'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not set rel for same-tab links when no rel is provided', () => {
    render(
      <Link href='https://example.com' target='_self'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('rel');
  });

  it('preserves caller rel for same-tab links', () => {
    render(
      <Link href='https://example.com' target='_self' rel='nofollow'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('rel', 'nofollow');
  });

  it('preserves caller rel tokens when securing new-tab links', () => {
    render(
      <Link href='https://example.com' target='_blank' rel='nofollow noopener'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('rel', 'nofollow noopener noreferrer');
  });

  it('preserves caller aria-label over derived labels', () => {
    render(
      <Link href='https://example.com' aria-label='Read migration guide' title='Open docs'>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Read migration guide' });
    expect(link).toHaveAttribute('title', 'Open docs');
  });

  it('uses title as aria-label and title attribute', () => {
    render(
      <Link href='https://example.com' title='Open docs'>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Open docs' });
    expect(link).toHaveAttribute('title', 'Open docs');
  });

  it('renders an icon when icon prop is provided', () => {
    render(
      <Link href='https://example.com' icon='image'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
    expect(screen.getByTestId('link-icon')).toHaveAttribute('data-icon', 'image');
  });

  it('uses caller aria-label for icon-only links', () => {
    render(
      <Link href='https://example.com' icon='image' aria-label='Open image gallery'>
        <span aria-hidden='true' />
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Open image gallery' })).toBeInTheDocument();
  });

  it('does not leak visual variant, size, or shadow props to the DOM', () => {
    render(
      <Link href='https://example.com' variant='button' size='lg' shadow={false}>
        Docs
      </Link>
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).not.toHaveAttribute('variant');
    expect(link).not.toHaveAttribute('size');
    expect(link).not.toHaveAttribute('shadow');
  });

  it('keeps button-styled links exposed as links when href is present', () => {
    render(
      <Link href='https://example.com' variant='button'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });

  it('uses button semantics only when no href is present', () => {
    render(<Link variant='button'>Action</Link>);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('keeps action-style links in the tab order when enabled', async () => {
    const user = userEvent.setup();
    render(<Link variant='button'>Action</Link>);

    const actionLink = screen.getByRole('button', { name: 'Action' });
    await user.tab();

    expect(actionLink).toHaveFocus();
  });

  it('calls onClick for action-style links when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Link variant='button' onClick={handleClick}>
        Action
      </Link>
    );

    await user.click(screen.getByRole('button', { name: 'Action' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('activates action-style links with Enter and Space', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Link variant='button' onClick={handleClick}>
        Action
      </Link>
    );

    const actionLink = screen.getByRole('button', { name: 'Action' });
    actionLink.focus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('calls onClick when clicked and enabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Link href='https://example.com' onClick={handleClick}>
        Docs
      </Link>
    );

    await user.click(screen.getByRole('link', { name: 'Docs' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('marks disabled links with aria-disabled and removes them from tab order', () => {
    render(
      <Link href='https://example.com' disabled={true}>
        Docs
      </Link>
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Link href='https://example.com' disabled={true} onClick={handleClick}>
        Docs
      </Link>
    );

    await user.click(screen.getByRole('link', { name: 'Docs' }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
