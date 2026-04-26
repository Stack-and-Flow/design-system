/**
 * Chip.test.tsx — Behavior tests for Stack-and-Flow Design System
 *
 * STRATEGY:
 * - Hook (useChip): tested with renderHook → pure decision logic
 * - Component (Chip): tested with render + screen + userEvent → observable behavior
 *
 * WHAT we test: accessibility, keyboard interaction, controlled/uncontrolled selection,
 * closable/clickable behavior and disabled guards.
 * WHAT we do NOT test: internal class strings or implementation details.
 */

import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../icon/Icon', () => ({
  default: () => null
}));

import { Chip } from './Chip';
import { useChip } from './useChip';

describe('Chip — interactive and accessibility behavior', () => {
  it('renders as button when interactive and not closable', () => {
    const { container } = render(
      <Chip as='button' onClick={() => undefined}>
        Clickable
      </Chip>
    );

    expect(container.firstElementChild?.tagName).toBe('BUTTON');
  });

  it('returns defaults from useChip', () => {
    const { result } = renderHook(() => useChip({}));

    expect(result.current.componentTag).toBe('div');
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.interactive).toBe(false);
    expect(result.current.propsBase['aria-label']).toBe('Chip');
    expect(result.current.propsBase['data-interactive']).toBe('false');
  });

  it('handles disabled and isDisabled alias in useChip', () => {
    const { result: disabledResult } = renderHook(() => useChip({ disabled: true }));
    expect(disabledResult.current.isDisabled).toBe(true);

    const { result: aliasResult } = renderHook(() => useChip({ isDisabled: true }));
    expect(aliasResult.current.isDisabled).toBe(true);

    const { result: precedenceResult } = renderHook(() => useChip({ disabled: false, isDisabled: true }));
    expect(precedenceResult.current.isDisabled).toBe(false);
  });

  it('marks root as interactive and calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Chip onClick={onClick}>Interactive</Chip>);

    const root = screen.getByRole('button', { name: 'Interactive' });

    expect(root).toHaveAttribute('data-interactive', 'true');
    await user.click(root);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses split-actions group when closable + interactive is requested', () => {
    const { container } = render(
      <Chip as='button' closable={true} onClick={() => undefined}>
        Closable
      </Chip>
    );

    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).toHaveAttribute('role', 'group');
  });

  it('uses contextual close label when chip has readable text', () => {
    render(<Chip closable={true}>React</Chip>);

    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
  });

  it('uses fallback chip labels for non-textual content', () => {
    render(<Chip closable={true} startContent={<span aria-hidden={true}>•</span>} />);

    expect(screen.getByLabelText('Chip item (closable)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove chip' })).toBeInTheDocument();
  });

  it('calls onClose without triggering onClick when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();

    render(
      <Chip closable={true} onClick={onClick} onClose={onClose}>
        React
      </Chip>
    );

    await user.click(screen.getByRole('button', { name: 'Remove React' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
    expect(onClose.mock.calls[0][0]?.type).toBe('click');
  });

  it('calls both onClick (root) and onClose (close button) in closable + clickable mode', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();

    render(
      <Chip closable={true} onClick={onClick} onClose={onClose}>
        React
      </Chip>
    );

    const primary = screen.getByRole('button', { name: 'React' });
    await user.click(primary);
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not nest buttons in closable + clickable mode', () => {
    const { container } = render(
      <Chip closable={true} onClick={() => undefined} onClose={() => undefined}>
        React
      </Chip>
    );

    const primary = screen.getByRole('button', { name: 'React' });

    expect(primary).toBeInTheDocument();
    expect(primary.querySelector('button')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('role', 'group');
  });

  it('calls onClose on Delete key when closable and enabled', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Chip closable={true} onClose={onClose}>
        React
      </Chip>
    );

    fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: 'Delete' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][0]?.type).toBe('keydown');
  });

  it('calls onClose on Backspace key when closable and enabled', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Chip closable={true} onClose={onClose}>
        React
      </Chip>
    );

    fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: 'Backspace' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][0]?.type).toBe('keydown');
  });

  it('calls onClose on Delete key in split-actions mode (closable + interactive)', () => {
    const onClose = vi.fn();

    render(
      <Chip closable={true} onClick={() => undefined} onClose={onClose}>
        React
      </Chip>
    );

    const primaryAction = screen.getByRole('button', { name: 'React' });
    fireEvent.keyDown(primaryAction, { key: 'Delete' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][0]?.type).toBe('keydown');
  });

  it('calls onClose on Backspace key in split-actions mode (closable + interactive)', () => {
    const onClose = vi.fn();

    render(
      <Chip closable={true} onClick={() => undefined} onClose={onClose}>
        React
      </Chip>
    );

    const primaryAction = screen.getByRole('button', { name: 'React' });
    fireEvent.keyDown(primaryAction, { key: 'Backspace' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][0]?.type).toBe('keydown');
  });

  it('does not trigger onClick or onClose when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();

    render(
      <Chip disabled={true} closable={true} onClick={onClick} onClose={onClose}>
        React
      </Chip>
    );

    const root = screen.getByText('React').closest('div');

    expect(root).toBeInTheDocument();
    if (!root) {
      throw new Error('Chip root not found');
    }
    expect(root).toHaveAttribute('aria-disabled', 'true');
    expect(root).toHaveAttribute('data-disabled', 'true');
    expect(root).toHaveAttribute('data-interactive', 'false');

    const closeButton = screen.getByRole('button', { name: 'Remove React' });
    expect(closeButton).toBeDisabled();

    await user.click(root);
    await user.click(closeButton);

    expect(onClick).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('falls back to non-interactive root and disabled close action when disabled + closable + onClick', () => {
    render(
      <Chip disabled={true} closable={true} onClick={() => undefined} onClose={() => undefined}>
        React
      </Chip>
    );

    expect(screen.queryByRole('button', { name: 'React' })).not.toBeInTheDocument();

    const root = screen.getByText('React').closest('div');
    expect(root).toHaveAttribute('aria-disabled', 'true');
    expect(root).toHaveAttribute('data-interactive', 'false');

    const closeButton = screen.getByRole('button', { name: 'Remove React' });

    expect(closeButton).toBeDisabled();
  });

  it('supports uncontrolled selectable state', async () => {
    const user = userEvent.setup();

    render(
      <Chip selectable={true} defaultSelected={false}>
        Filter
      </Chip>
    );

    const chip = screen.getByRole('button', { name: 'Filter' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports controlled selectable mode through onSelectedChange', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();

    render(
      <Chip selectable={true} selected={false} onSelectedChange={onSelectedChange}>
        Controlled
      </Chip>
    );

    const chip = screen.getByRole('button', { name: 'Controlled' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    await user.click(chip);

    expect(onSelectedChange).toHaveBeenCalledTimes(1);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    // Controlled mode: visual pressed state only changes if parent updates `selected`.
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('activates interactive div with Enter and Space keyboard keys', () => {
    const onClick = vi.fn();
    render(
      <Chip as='div' onClick={onClick}>
        Keyboard
      </Chip>
    );

    const root = screen.getByRole('button', { name: 'Keyboard' });

    fireEvent.keyDown(root, { key: 'Enter' });
    fireEvent.keyDown(root, { key: ' ' });

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('prefers explicit ariaLabel when provided', () => {
    render(<Chip variant='dot' ariaLabel='Online status' />);

    expect(screen.getByLabelText('Online status')).toBeInTheDocument();
  });

  it('uses generic accessibility labels when chip has no readable text', () => {
    render(<Chip closable={true} startContent={<span aria-hidden={true}>•</span>} />);

    expect(screen.getByLabelText('Chip item (closable)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove chip' })).toBeInTheDocument();
  });
});
